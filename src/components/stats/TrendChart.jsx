import { formatCompact, formatMonth, formatNumber } from '@/lib/stats'

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

/**
 * Monthly visitors across every tracked project.
 *
 * CSS-sized bars rather than an SVG plot: the labels stay crisp text, the
 * layout reflows without recomputing geometry, and hover states are ordinary
 * CSS. Four gridlines carry the scale.
 */
export function TrendChart({ series }) {
  const max = niceMax(Math.max(...series.map((point) => point.users)))
  const gridlines = [1, 0.75, 0.5, 0.25, 0]

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
              {formatCompact(Math.round(max * fraction))}
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
            {series.map((point) => {
              const height = (point.users / max) * 100
              return (
                <div
                  key={point.month}
                  className="group relative flex h-full flex-1 items-end"
                >
                  <div
                    style={{ height: `${Math.max(height, 0.75)}%` }}
                    className="w-full rounded-t-[3px] bg-gradient-to-t from-teal-500/40 to-teal-500 transition-all duration-200 group-hover:from-teal-500/60 group-hover:to-teal-400 dark:from-teal-400/30 dark:to-teal-400 dark:group-hover:to-teal-300"
                  />
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 scale-95 rounded-lg bg-zinc-900 px-2.5 py-1.5 text-center opacity-0 shadow-lg transition-all duration-150 group-hover:scale-100 group-hover:opacity-100 dark:bg-zinc-100">
                    <span className="block text-sm font-semibold whitespace-nowrap text-white tabular-nums dark:text-zinc-900">
                      {formatNumber(point.users)}
                    </span>
                    <span className="block text-xs whitespace-nowrap text-zinc-400 dark:text-zinc-500">
                      {formatMonth(point.month)}
                    </span>
                  </div>
                </div>
              )
            })}
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
          </div>
        </div>
      </div>

      <p className="sr-only">
        Monthly visitors:{' '}
        {series
          .map((point) => `${formatMonth(point.month)}: ${formatNumber(point.users)}`)
          .join('; ')}
        .
      </p>
    </div>
  )
}
