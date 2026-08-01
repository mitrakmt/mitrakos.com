import clsx from 'clsx'

import { Sparkline } from '@/components/stats/Sparkline'
import { ChangeBadge } from '@/components/stats/StatTile'
import { formatDay, formatMonth, formatNumber } from '@/lib/stats'

/** Superscript marker tying a row to the footnotes under the table. */
function FootnoteMark({ number }) {
  if (!number) return null
  return (
    <sup className="ml-0.5 text-[0.65rem] font-medium text-teal-600 dark:text-teal-400">
      <a href={`#stats-note-${number}`} className="hover:underline">
        {number}
      </a>
    </sup>
  )
}

function CategoryBadge({ category }) {
  return (
    <span className="inline-flex flex-none items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
      {category}
    </span>
  )
}

function ProjectName({ project, footnote }) {
  const label = (
    <>
      {project.name}
      <FootnoteMark number={footnote} />
    </>
  )

  if (!project.url) {
    return (
      <span className="font-semibold text-zinc-800 dark:text-zinc-100">
        {label}
      </span>
    )
  }
  return (
    <span className="font-semibold text-zinc-800 dark:text-zinc-100">
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-colors duration-200 hover:text-teal-500 dark:hover:text-teal-400"
      >
        {project.name}
      </a>
      <FootnoteMark number={footnote} />
    </span>
  )
}

/**
 * "—" rather than a number in the two cases where a figure would mislead: a
 * project that has genuinely gone quiet, and one whose tag broke.
 */
function LatestCell({ project, className }) {
  if (project.gapped) {
    return (
      <span
        className={clsx('text-zinc-400 dark:text-zinc-500', className)}
        title={`Not measured — ${project.trackingGap.reason} on ${formatDay(
          project.trackingGap.since,
        )}`}
      >
        —
      </span>
    )
  }
  if (project.dormant) {
    return (
      <span
        className={clsx('text-zinc-400 dark:text-zinc-500', className)}
        title="No traffic recorded in the last three months"
      >
        —
      </span>
    )
  }
  return (
    <span className={clsx('tabular-nums', className)}>
      {formatNumber(project.latest)}
    </span>
  )
}

export function ProjectStatsList({
  projects,
  latestMonth,
  footnoteNumbers = new Map(),
}) {
  return (
    <>
      {/* Desktop: a real table — press tends to read and cite these. */}
      <table className="hidden w-full border-collapse text-sm md:table">
        <caption className="sr-only">
          Visitors by project for {formatMonth(latestMonth)}, with lifetime
          totals since each project launched.
        </caption>
        <thead>
          <tr className="border-b border-zinc-100 dark:border-zinc-700/40">
            <th scope="col" className="py-3 pr-4 text-left font-medium text-zinc-500 dark:text-zinc-400">
              Project
            </th>
            <th scope="col" className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">
              12-month trend
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">
              {formatMonth(latestMonth)}
            </th>
            <th scope="col" className="px-4 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">
              Lifetime visitors
            </th>
            <th scope="col" className="py-3 pl-4 text-right font-medium text-zinc-500 dark:text-zinc-400">
              Lifetime views
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr
              key={project.id}
              className="border-b border-zinc-100 transition-colors duration-200 hover:bg-zinc-50/70 dark:border-zinc-700/40 dark:hover:bg-zinc-800/30"
            >
              <th scope="row" className="max-w-xs py-4 pr-4 text-left font-normal">
                <div className="flex items-center gap-2">
                  <ProjectName
                    project={project}
                    footnote={footnoteNumbers.get(project.id)}
                  />
                  <CategoryBadge category={project.category} />
                </div>
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  {project.description}
                </p>
              </th>
              {project.isExternal ? (
                // The GA columns mean specific things — a 12-month trend, a
                // month's visitors, a lifetime total. None of them are what a
                // weekly headcount is, so the figure is stated in its own
                // words across the row instead of being dropped into a column
                // whose header would mislabel it.
                <td colSpan={4} className="px-4 py-4 text-left">
                  <span className="font-medium text-zinc-800 tabular-nums dark:text-zinc-100">
                    {formatNumber(project.external.users)}
                  </span>{' '}
                  <span className="text-zinc-500 dark:text-zinc-400">
                    {project.external.metric} · {project.external.source}
                  </span>
                </td>
              ) : (
                <>
                  <td className="px-4 py-4">
                    <Sparkline
                      id={project.id}
                      data={project.reliable}
                      dormant={project.dormant || project.gapped}
                      className="h-7 w-24"
                    />
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <LatestCell
                        project={project}
                        className="font-medium text-zinc-800 dark:text-zinc-100"
                      />
                      {!project.dormant && (
                        <ChangeBadge change={project.change} />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right font-medium text-zinc-800 tabular-nums dark:text-zinc-100">
                    {formatNumber(project.lifetime.users)}
                  </td>
                  <td className="py-4 pl-4 text-right text-zinc-500 tabular-nums dark:text-zinc-400">
                    {formatNumber(project.lifetime.pageViews)}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile: the same rows as cards, so nothing scrolls sideways. */}
      <ul role="list" className="space-y-4 md:hidden">
        {projects.map((project) => (
          <li
            key={project.id}
            className="rounded-2xl border border-zinc-100 p-4 dark:border-zinc-700/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <ProjectName
                  project={project}
                  footnote={footnoteNumbers.get(project.id)}
                />
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  {project.description}
                </p>
              </div>
              <CategoryBadge category={project.category} />
            </div>

            {project.isExternal ? (
              <dl className="mt-4 border-t border-zinc-100 pt-3 text-sm dark:border-zinc-700/40">
                <dt className="text-xs text-zinc-500 dark:text-zinc-400">
                  {project.external.metric} · {project.external.source}
                </dt>
                <dd className="mt-0.5 font-medium text-zinc-800 tabular-nums dark:text-zinc-100">
                  {formatNumber(project.external.users)}
                </dd>
              </dl>
            ) : (
              <>
                <Sparkline
                  id={`m-${project.id}`}
                  data={project.reliable}
                  dormant={project.dormant || project.gapped}
                  className="mt-4 h-8 w-full"
                />

                <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-zinc-100 pt-3 text-sm dark:border-zinc-700/40">
                  <div>
                    <dt className="text-xs text-zinc-500 dark:text-zinc-400">
                      {formatMonth(latestMonth, { short: true })}
                    </dt>
                    <dd className="mt-0.5 flex items-center gap-1.5">
                      <LatestCell
                        project={project}
                        className="font-medium text-zinc-800 dark:text-zinc-100"
                      />
                      {!project.dormant && (
                        <ChangeBadge change={project.change} />
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-zinc-500 dark:text-zinc-400">
                      Visitors
                    </dt>
                    <dd className="mt-0.5 font-medium text-zinc-800 tabular-nums dark:text-zinc-100">
                      {formatNumber(project.lifetime.users)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-zinc-500 dark:text-zinc-400">
                      Views
                    </dt>
                    <dd className="mt-0.5 font-medium text-zinc-800 tabular-nums dark:text-zinc-100">
                      {formatNumber(project.lifetime.pageViews)}
                    </dd>
                  </div>
                </dl>
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}
