import clsx from 'clsx'

import { Sparkline } from '@/components/stats/Sparkline'
import { ChangeBadge, StatTile } from '@/components/stats/StatTile'
import { TrendChart } from '@/components/stats/TrendChart'
import { formatMonth } from '@/lib/stats'
import { formatMoney, formatMoneyCompact, getRevenue } from '@/lib/stats/revenue'

function CategoryBadge({ category }) {
  return (
    <span className="inline-flex flex-none items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
      {category}
    </span>
  )
}

/**
 * "Not published" rather than "$0" for a project with no connected account.
 *
 * The two are entirely different claims — one is an absence of disclosure, the
 * other is a statement that the project earned nothing — and only one of them
 * is true here.
 */
function NotPublished({ className }) {
  return (
    <span
      className={clsx('text-zinc-400 dark:text-zinc-500', className)}
      title="No Stripe account is connected for this project, so no revenue is published for it."
    >
      Not published
    </span>
  )
}

function ProjectName({ project }) {
  const label = project.name
  if (!project.url) {
    return (
      <span className="font-semibold text-zinc-800 dark:text-zinc-100">
        {label}
      </span>
    )
  }
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-zinc-800 transition-colors duration-200 hover:text-teal-500 dark:text-zinc-100 dark:hover:text-teal-400"
    >
      {label}
    </a>
  )
}

/** Gross → net, shown as arithmetic so the headline figure can be checked. */
function NetDerivation({ lifetime, currency }) {
  const parts = [
    { label: 'Gross charged', value: lifetime.gross, sign: '' },
    { label: 'Refunds & disputes', value: -lifetime.refunded, sign: '−' },
    { label: 'Stripe fees', value: -lifetime.fees, sign: '−' },
  ]

  return (
    <div className="mt-6 rounded-2xl border border-zinc-100 p-5 dark:border-zinc-700/40">
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        How the net figure is reached
      </h3>
      <dl className="mt-4 flex flex-wrap items-end gap-x-8 gap-y-4">
        {parts.map((part) => (
          <div key={part.label}>
            <dt className="text-xs text-zinc-500 dark:text-zinc-400">
              {part.label}
            </dt>
            <dd className="mt-0.5 text-lg font-medium text-zinc-700 tabular-nums dark:text-zinc-300">
              {part.sign}
              {formatMoney(Math.abs(part.value), currency)}
            </dd>
          </div>
        ))}
        <div className="border-l border-zinc-100 pl-8 dark:border-zinc-700/40">
          <dt className="text-xs text-zinc-500 dark:text-zinc-400">
            Net, lifetime
          </dt>
          <dd className="mt-0.5 text-lg font-bold text-zinc-900 tabular-nums dark:text-zinc-100">
            {formatMoney(lifetime.net, currency)}
          </dd>
        </div>
      </dl>
    </div>
  )
}

export async function RevenueSection() {
  const revenue = await getRevenue()
  const { totals, caveats, currency } = revenue

  const monthLabel = formatMonth(revenue.latestMonth)
  const axis = (value) => formatMoneyCompact(value, currency)
  const value = (amount) => formatMoney(amount, currency)

  return (
    <>
      <p className="mt-2 mb-6 text-sm text-zinc-600 dark:text-zinc-400">
        Read from Stripe, net of fees and refunds. Revenue is published for{' '}
        {totals.publishedProjectCount} of {totals.projectCount} projects — the
        rest have no connected Stripe account, and are shown as{' '}
        <span className="text-zinc-500 dark:text-zinc-500">not published</span>{' '}
        rather than as zero.
      </p>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          label="Net revenue, last 12 months"
          value={value(totals.trailingYearNet)}
          sublabel={`${value(totals.trailingYearGross)} gross before fees`}
        />
        <StatTile
          label={`Net in ${monthLabel}`}
          value={value(totals.monthlyNet)}
          change={totals.monthlyChange}
          sublabel="vs. the month before"
        />
        <StatTile
          label="Net revenue, lifetime"
          value={value(totals.lifetime.net)}
          sublabel={
            caveats.lifetimeIsFloor
              ? 'At least — history longer than could be read in full'
              : `Since the first payment${
                  totals.lifetime.gross
                    ? `, on ${value(totals.lifetime.gross)} charged`
                    : ''
                }`
          }
        />
        <StatTile
          label="Recurring revenue"
          value={value(totals.mrr)}
          sublabel={`${totals.activeSubscriptions} active subscription${
            totals.activeSubscriptions === 1 ? '' : 's'
          } a month`}
        />
      </div>

      <div className="mt-10">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Monthly net revenue
        </h3>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {formatMonth(revenue.months[0])} – {monthLabel}. Complete months only,
          after Stripe fees and refunds.
        </p>
        <TrendChart
          series={revenue.monthlySeries}
          valueKey="net"
          formatValue={value}
          formatAxis={axis}
          label="Monthly net revenue"
        />
      </div>

      <NetDerivation lifetime={totals.lifetime} currency={currency} />

      {/* Desktop: a real table — press tends to read and cite these. */}
      <table className="mt-10 hidden w-full border-collapse text-sm md:table">
        <caption className="sr-only">
          Net revenue by project for {monthLabel}, with lifetime totals and
          current recurring revenue.
        </caption>
        <thead>
          <tr className="border-b border-zinc-100 dark:border-zinc-700/40">
            <th
              scope="col"
              className="py-3 pr-4 text-left font-medium text-zinc-500 dark:text-zinc-400"
            >
              Project
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400"
            >
              12-month trend
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400"
            >
              {monthLabel} net
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400"
            >
              Lifetime net
            </th>
            <th
              scope="col"
              className="py-3 pl-4 text-right font-medium text-zinc-500 dark:text-zinc-400"
            >
              Recurring
            </th>
          </tr>
        </thead>
        <tbody>
          {revenue.projects.map((project) => (
            <tr
              key={project.id}
              className="border-b border-zinc-100 transition-colors duration-200 hover:bg-zinc-50/70 dark:border-zinc-700/40 dark:hover:bg-zinc-800/30"
            >
              <th
                scope="row"
                className="max-w-xs py-4 pr-4 text-left font-normal"
              >
                <div className="flex items-center gap-2">
                  <ProjectName project={project} />
                  <CategoryBadge category={project.category} />
                </div>
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  {project.description}
                </p>
              </th>

              {project.connected ? (
                <>
                  <td className="px-4 py-4">
                    <Sparkline
                      id={`rev-${project.id}`}
                      data={project.monthlyNet}
                      dormant={!project.everEarned}
                      className="h-7 w-24"
                    />
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-medium text-zinc-800 tabular-nums dark:text-zinc-100">
                        {formatMoney(project.latest, project.currency)}
                      </span>
                      <ChangeBadge change={project.change} />
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right font-medium text-zinc-800 tabular-nums dark:text-zinc-100">
                    {formatMoney(project.lifetime.net, project.currency)}
                  </td>
                  <td className="py-4 pl-4 text-right text-zinc-500 tabular-nums dark:text-zinc-400">
                    {project.mrr > 0 ? (
                      <>
                        {formatMoney(project.mrr, project.currency)}
                        <span className="ml-1 text-xs">/mo</span>
                      </>
                    ) : (
                      '—'
                    )}
                  </td>
                </>
              ) : (
                // Left-aligned across the spanned columns so it reads as a
                // statement about the row, not as the value of the last one.
                <td colSpan={4} className="px-4 py-4 text-left">
                  <NotPublished />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile: the same rows as cards, so nothing scrolls sideways. */}
      <ul role="list" className="mt-8 space-y-4 md:hidden">
        {revenue.projects.map((project) => (
          <li
            key={project.id}
            className="rounded-2xl border border-zinc-100 p-4 dark:border-zinc-700/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <ProjectName project={project} />
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  {project.description}
                </p>
              </div>
              <CategoryBadge category={project.category} />
            </div>

            {project.connected ? (
              <>
                <Sparkline
                  id={`m-rev-${project.id}`}
                  data={project.monthlyNet}
                  dormant={!project.everEarned}
                  className="mt-4 h-8 w-full"
                />
                <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-zinc-100 pt-3 text-sm dark:border-zinc-700/40">
                  <div>
                    <dt className="text-xs text-zinc-500 dark:text-zinc-400">
                      {formatMonth(revenue.latestMonth, { short: true })} net
                    </dt>
                    <dd className="mt-0.5 flex items-center gap-1.5">
                      <span className="font-medium text-zinc-800 tabular-nums dark:text-zinc-100">
                        {formatMoney(project.latest, project.currency)}
                      </span>
                      <ChangeBadge change={project.change} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-zinc-500 dark:text-zinc-400">
                      Lifetime
                    </dt>
                    <dd className="mt-0.5 font-medium text-zinc-800 tabular-nums dark:text-zinc-100">
                      {formatMoney(project.lifetime.net, project.currency)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-zinc-500 dark:text-zinc-400">
                      Recurring
                    </dt>
                    <dd className="mt-0.5 font-medium text-zinc-800 tabular-nums dark:text-zinc-100">
                      {project.mrr > 0
                        ? formatMoney(project.mrr, project.currency)
                        : '—'}
                    </dd>
                  </div>
                </dl>
              </>
            ) : (
              <p className="mt-4 border-t border-zinc-100 pt-3 text-sm dark:border-zinc-700/40">
                <NotPublished />
              </p>
            )}
          </li>
        ))}
      </ul>

      {/* Anything that would make a figure above misleading if left unsaid. */}
      {(caveats.lifetimeIsFloor ||
        caveats.incompleteMonths.length > 0 ||
        caveats.mismatchedCurrency.length > 0 ||
        caveats.discounted.length > 0 ||
        caveats.metered.length > 0) && (
        <ul className="mt-6 space-y-2 border-t border-zinc-100 pt-4 text-xs text-zinc-500 dark:border-zinc-700/40 dark:text-zinc-400">
          {caveats.lifetimeIsFloor && (
            <li>
              One or more accounts have a longer payment history than could be
              read in a single pass, so lifetime totals are a lower bound rather
              than an exact figure.
            </li>
          )}
          {caveats.incompleteMonths.length > 0 && (
            <li>
              The 12-month series is incomplete for{' '}
              {caveats.incompleteMonths.map((p) => p.name).join(', ')} — the
              history read did not reach the start of the window.
            </li>
          )}
          {caveats.mismatchedCurrency.length > 0 && (
            <li>
              {caveats.mismatchedCurrency.map((p) => p.name).join(', ')} settles
              in a different currency and is listed separately rather than
              converted, so it is excluded from the totals above.
            </li>
          )}
          {caveats.discounted.length > 0 && (
            <li>
              {caveats.discounted
                .map(
                  (p) =>
                    `${p.name} (${p.discountedSubscriptions} of ${p.activeSubscriptions})`,
                )
                .join(', ')}{' '}
              — some active subscriptions carry a discount or are fully comped.
              They are counted as subscribers, but recurring revenue is stated
              after the discount, so a comped account adds a subscriber without
              adding revenue.
            </li>
          )}
          {caveats.metered.length > 0 && (
            <li>
              {caveats.metered.map((p) => p.name).join(', ')} has usage-based
              pricing with no fixed monthly amount; that portion is excluded
              from recurring revenue but still counted in net revenue once
              billed.
            </li>
          )}
        </ul>
      )}
    </>
  )
}
