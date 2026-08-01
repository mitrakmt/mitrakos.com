import clsx from 'clsx'

import { formatChange } from '@/lib/stats'

function ArrowIcon({ direction, ...props }) {
  return (
    <svg viewBox="0 0 10 10" fill="none" aria-hidden="true" {...props}>
      <path
        d={direction === 'up' ? 'M5 8V2m0 0L2.5 4.5M5 2l2.5 2.5' : 'M5 2v6m0 0 2.5-2.5M5 8 2.5 5.5'}
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ChangeBadge({ change, className }) {
  const label = formatChange(change)
  if (!label) return null

  const up = change >= 0
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium tabular-nums',
        up
          ? 'bg-teal-50 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300'
          : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400',
        className,
      )}
    >
      <ArrowIcon direction={up ? 'up' : 'down'} className="h-2.5 w-2.5" />
      {/* Keep the sign — an arrow alone reads as growth at a glance. */}
      {label.replace('-', '−')}
    </span>
  )
}

export function StatTile({ label, value, sublabel, change }) {
  return (
    <div className="rounded-2xl border border-zinc-100 p-5 transition-shadow duration-300 hover:shadow-lg hover:shadow-zinc-800/5 dark:border-zinc-700/40 dark:hover:shadow-white/5">
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <p className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-3xl font-bold tracking-tight text-zinc-800 tabular-nums dark:text-zinc-100">
          {value}
        </span>
        {change !== undefined && <ChangeBadge change={change} />}
      </p>
      {sublabel && (
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">{sublabel}</p>
      )}
    </div>
  )
}
