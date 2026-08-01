import Link from 'next/link'

import { Container } from '@/components/Container'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animations'
import { Sparkline } from '@/components/stats/Sparkline'
import { ChangeBadge, StatTile } from '@/components/stats/StatTile'
import {
  formatCompact,
  formatMonth,
  formatNumber,
  getStats,
} from '@/lib/stats'

function ChartIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M3.75 3.75v14.5a2 2 0 0 0 2 2h14.5"
        className="stroke-zinc-400 dark:stroke-zinc-500"
      />
      <path
        d="m7 15.5 3.75-4.5 3 2.75L19 7"
        className="stroke-teal-500 dark:stroke-teal-400"
      />
    </svg>
  )
}

function ArrowRightIcon(props) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6.75 5.75 9.25 8l-2.5 2.25"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
    </svg>
  )
}

function TopProject({ project }) {
  const Wrapper = project.url ? 'a' : 'div'
  const linkProps = project.url
    ? { href: project.url, target: '_blank', rel: 'noopener noreferrer' }
    : {}

  return (
    <Wrapper
      {...linkProps}
      className="group flex items-center gap-4 rounded-xl px-3 py-2.5 transition-colors duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
    >
      <div className="min-w-0 flex-auto">
        <p className="truncate text-sm font-medium text-zinc-800 transition-colors duration-200 group-hover:text-teal-500 dark:text-zinc-100 dark:group-hover:text-teal-400">
          {project.name}
        </p>
        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
          {formatNumber(project.lifetime.users)} lifetime visitors
        </p>
      </div>

      <Sparkline
        id={`home-${project.id}`}
        data={project.reliable}
        dormant={project.dormant || project.gapped}
        className="hidden h-7 w-20 flex-none sm:block"
      />

      <div className="flex w-24 flex-none items-center justify-end gap-1.5">
        {project.dormant || project.gapped ? (
          <span
            className="text-sm text-zinc-400 dark:text-zinc-500"
            title={
              project.gapped
                ? `Not measured — ${project.trackingGap.reason}`
                : 'No traffic recorded in the last three months'
            }
          >
            —
          </span>
        ) : (
          <>
            <span className="text-sm font-medium text-zinc-800 tabular-nums dark:text-zinc-100">
              {formatNumber(project.latest)}
            </span>
            <ChangeBadge change={project.change} />
          </>
        )}
      </div>
    </Wrapper>
  )
}

export async function TractionSection() {
  const stats = await getStats()
  const { totals } = stats
  const topProjects = stats.projects.slice(0, 6)

  return (
    <Container className="mt-24 md:mt-28">
      <FadeIn direction="fade-up">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="flex items-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              <ChartIcon className="h-6 w-6 flex-none" />
              <span className="ml-3">Traction</span>
            </h2>
            <p className="mt-3 max-w-2xl text-base text-zinc-600 dark:text-zinc-400">
              Every project I&apos;ve built, with the real numbers behind it —
              pulled from Google Analytics, updated automatically, and public
              whether the chart goes up or down.
            </p>
          </div>
          <Link
            href="/stats"
            className="group inline-flex flex-none items-center gap-1 text-sm font-medium text-teal-500 transition-colors duration-200 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300"
          >
            Full dashboard
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </FadeIn>

      <StaggerContainer
        className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4"
        staggerDelay={0.08}
      >
        <StaggerItem>
          <StatTile
            label="Lifetime visitors"
            value={formatCompact(totals.lifetimeUsers)}
            sublabel={`${formatNumber(totals.lifetimeUsers)} unique people`}
          />
        </StaggerItem>
        <StaggerItem>
          <StatTile
            label={`Visitors in ${formatMonth(stats.latestMonth)}`}
            value={formatCompact(totals.monthlyUsers)}
            change={totals.monthlyChange}
            sublabel="vs. the month before"
          />
        </StaggerItem>
        <StaggerItem>
          <StatTile
            label="Page views"
            value={formatCompact(totals.lifetimePageViews)}
            sublabel={`Across ${formatNumber(totals.lifetimeSessions)} sessions`}
          />
        </StaggerItem>
        <StaggerItem>
          <StatTile
            label="Projects tracked"
            value={formatNumber(totals.projectCount)}
            sublabel={`${totals.measuredProjectCount} with traffic this quarter`}
          />
        </StaggerItem>
      </StaggerContainer>

      <FadeIn direction="fade-up" delay={0.15}>
        <div className="mt-10 rounded-2xl border border-zinc-100 p-4 sm:p-6 dark:border-zinc-700/40">
          <div className="flex items-baseline justify-between px-3">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Biggest projects
            </h3>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {formatMonth(stats.latestMonth)}
            </span>
          </div>
          <div className="mt-2 divide-y divide-zinc-100 dark:divide-zinc-700/40">
            {topProjects.map((project) => (
              <TopProject key={project.id} project={project} />
            ))}
          </div>
          <Link
            href="/stats"
            className="group mt-4 flex items-center justify-center gap-1 rounded-xl border border-zinc-100 py-2.5 text-sm font-medium text-zinc-600 transition-colors duration-200 hover:border-zinc-200 hover:text-teal-500 dark:border-zinc-700/40 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-teal-400"
          >
            View all {totals.projectCount} projects and 12-month history
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>

          {/* The summary carries the same caveated figures as /stats, so it has
              to carry the same disclosure rather than only the flattering half. */}
          {stats.footnotes.length > 0 && (
            <p className="mt-3 px-3 text-xs text-zinc-500 dark:text-zinc-500">
              {stats.footnotes.length === 1
                ? 'One project carries a data-quality note'
                : `${stats.footnotes.length} projects carry data-quality notes`}{' '}
              — unverified traffic and a tracking gap.{' '}
              <Link
                href="/stats"
                className="font-medium text-teal-600 hover:underline dark:text-teal-400"
              >
                Read the notes
              </Link>
              .
            </p>
          )}
        </div>
      </FadeIn>
    </Container>
  )
}
