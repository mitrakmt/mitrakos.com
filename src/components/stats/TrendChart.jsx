import clsx from 'clsx'

import {
  formatCompact,
  formatMonth,
  formatNumber,
  monthProgress,
} from '@/lib/stats'

/** Rounds up to a readable axis maximum (12,170 -> 15,000). */
function niceMax(value) {
  if (value <= 0) return 1
  const magnitude = 10 ** Math.floor(Math.log10(value))
  const steps = [1, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10]
  return (
    magnitude *
    (steps.find((step) => step * magnitude >= value) ?? steps.at(-1))
  )
}

function Tooltip({ value, caption, className }) {
  return (
    <div
      className={clsx(
        'pointer-events-none absolute bottom-full z-10 mb-2 scale-95 rounded-lg bg-zinc-900 px-2.5 py-1.5 text-center opacity-0 shadow-lg transition-all duration-150 group-hover:scale-100 group-hover:opacity-100 dark:bg-zinc-100',
        className ?? 'left-1/2 -translate-x-1/2',
      )}
    >
      <span className="block text-sm font-semibold whitespace-nowrap text-white tabular-nums dark:text-zinc-900">
        {value}
      </span>
      <span className="block text-xs whitespace-nowrap text-zinc-400 dark:text-zinc-500">
        {caption}
      </span>
    </div>
  )
}

/**
 * The month under way: a hollow bar that fills as the month goes on, where a
 * complete month is solid. The two must never be confusable — a partial month
 * drawn like a finished one reads as a collapse.
 */
const inProgress =
  'border-teal-500/60 bg-teal-500/10 dark:border-teal-400/60 dark:bg-teal-400/15'

/**
 * A monthly series across every tracked project.
 *
 * CSS-sized bars rather than an SVG plot: the labels stay crisp text, the
 * layout reflows without recomputing geometry, and hover states are ordinary
 * CSS. Four gridlines carry the scale.
 *
 * Defaults render monthly visitors; `valueKey` and the two formatters let the
 * revenue series reuse it rather than fork a second chart that would drift.
 *
 * `monthToDate`, when given, is the month under way — same shape as a series
 * point plus `asOf` — and is drawn after the series as an unfinished bar.
 */
export function TrendChart({
  series,
  monthToDate = null,
  valueKey = 'users',
  formatValue = formatNumber,
  formatAxis = formatCompact,
  label = 'Monthly visitors',
}) {
  const max = niceMax(
    Math.max(
      ...series.map((point) => point[valueKey]),
      monthToDate?.[valueKey] ?? 0,
    ),
  )
  const gridlines = [1, 0.75, 0.5, 0.25, 0]
  // A month can go negative once refunds outweigh charges. It bottoms out as a
  // sliver rather than inverting the bar; the tooltip still reports the real
  // figure.
  const heightOf = (point) => `${Math.max((point[valueKey] / max) * 100, 0.75)}%`
  const progress =
    monthToDate && monthProgress(monthToDate.month, monthToDate.asOf)

  // Centred over an outermost column, a tooltip hangs off the side of the page
  // on a phone, so those two pin to their outer edge instead.
  const columns = series.length + (monthToDate ? 1 : 0)
  const tooltipEdge = (index) =>
    index === 0 ? 'left-0' : index === columns - 1 ? 'right-0' : undefined

  return (
    <div className="mt-8">
      <div className="flex gap-3">
        {/* Y axis */}
        <div className="relative hidden h-56 w-10 flex-none sm:block">
          {gridlines.slice(0, 4).map((fraction) => (
            <span
              key={fraction}
              style={{ top: `${(1 - fraction) * 100}%` }}
              className="absolute right-0 -translate-y-1/2 text-xs tabular-nums text-zinc-400 dark:text-zinc-500"
            >
              {formatAxis(Math.round(max * fraction))}
            </span>
          ))}
          <span className="absolute right-0 bottom-0 translate-y-1/2 text-xs tabular-nums text-zinc-400 dark:text-zinc-500">
            0
          </span>
        </div>

        <div className="relative min-w-0 flex-auto">
          {/* Gridlines sit behind the bars. */}
          <div aria-hidden="true" className="absolute inset-0 h-56">
            {gridlines.map((fraction) => (
              <div
                key={fraction}
                style={{ top: `${(1 - fraction) * 100}%` }}
                className="absolute inset-x-0 border-t border-zinc-100 dark:border-zinc-800"
              />
            ))}
          </div>

          <div className="relative flex h-56 items-end gap-1 sm:gap-2">
            {series.map((point, index) => (
              <div
                key={point.month}
                className="group relative flex h-full flex-1 items-end"
              >
                <div
                  style={{ height: heightOf(point) }}
                  className="w-full rounded-t-[3px] bg-gradient-to-t from-teal-500/40 to-teal-500 transition-all duration-200 group-hover:from-teal-500/60 group-hover:to-teal-400 dark:from-teal-400/30 dark:to-teal-400 dark:group-hover:to-teal-300"
                />
                <Tooltip
                  value={formatValue(point[valueKey])}
                  caption={formatMonth(point.month)}
                  className={tooltipEdge(index)}
                />
              </div>
            ))}

            {monthToDate && (
              <div className="group relative flex h-full flex-1 items-end">
                <div
                  style={{ height: heightOf(monthToDate) }}
                  className={clsx(
                    inProgress,
                    'relative w-full rounded-t-[3px] border border-b-0 transition-colors duration-200 group-hover:bg-teal-500/20 dark:group-hover:bg-teal-400/25',
                  )}
                >
                  {/* Still counting: a live marker riding the top of the bar. */}
                  <span
                    aria-hidden="true"
                    className="absolute top-0 left-1/2 flex h-2 w-2 -translate-x-1/2 -translate-y-1/2"
                  >
                    <span className="absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-60 motion-safe:animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-500 ring-2 ring-white dark:bg-teal-400 dark:ring-zinc-900" />
                  </span>
                </div>
                <Tooltip
                  value={formatValue(monthToDate[valueKey])}
                  caption={`${progress.label}, so far`}
                  className={tooltipEdge(series.length)}
                />
              </div>
            )}
          </div>

          <div className="mt-3 flex gap-1 sm:gap-2">
            {series.map((point, index) => (
              <div
                key={point.month}
                className="flex-1 text-center text-xs text-zinc-400 dark:text-zinc-500"
              >
                {/* Every other label on narrow screens — 12 never fit. */}
                <span className={index % 2 === 1 ? 'hidden sm:inline' : ''}>
                  {formatMonth(point.month, { short: true })}
                </span>
              </div>
            ))}
            {monthToDate && (
              <div className="flex-1 text-center text-xs font-medium text-zinc-600 dark:text-zinc-300">
                {formatMonth(monthToDate.month, { short: true })}
              </div>
            )}
          </div>

          {monthToDate && (
            <p className="mt-4 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span
                aria-hidden="true"
                className={clsx(
                  inProgress,
                  'h-3 w-2.5 flex-none rounded-[2px] border',
                )}
              />
              {formatMonth(monthToDate.month)} so far — day {progress.day} of{' '}
              {progress.days}, and still counting.
            </p>
          )}
        </div>
      </div>

      <p className="sr-only">
        {label}:{' '}
        {series
          .map(
            (point) =>
              `${formatMonth(point.month)}: ${formatValue(point[valueKey])}`,
          )
          .join('; ')}
        .
        {monthToDate &&
          ` ${formatMonth(monthToDate.month)} so far, through day ${
            progress.day
          } of ${progress.days}: ${formatValue(monthToDate[valueKey])}.`}
      </p>
    </div>
  )
}
