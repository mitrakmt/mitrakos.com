import { cache } from 'react'

import snapshot from '@/data/stats-snapshot.json'
import { fetchStatsFromGa, getServiceAccount } from '@/lib/stats/ga.mjs'
import { projectsByPropertyId, trackedProjects } from '@/lib/stats/projects.mjs'

/**
 * How many complete months without traffic before a project is treated as
 * dormant. Dormant projects still show their lifetime reach, but are called out
 * rather than quietly reported as "0 visitors this month".
 */
const DORMANT_AFTER_MONTHS = 3

/**
 * Returns the raw report — live from Google Analytics when a service account is
 * configured, otherwise the committed snapshot.
 *
 * The snapshot is real data, not a placeholder, so the page renders correct
 * numbers before credentials are wired up and stays correct if GA is briefly
 * unreachable at build time.
 */
async function loadReport() {
  if (!getServiceAccount()) return { ...snapshot, live: false }

  try {
    const live = await fetchStatsFromGa(
      trackedProjects.map((project) => project.propertyId),
    )

    // A per-property read can fail on its own (access not granted, property
    // deleted) without failing the batch, so a valid key with missing GA
    // permissions would otherwise publish a page with most projects silently
    // gone and the totals quietly wrong. Partial coverage is treated as a
    // failed fetch: better a slightly stale snapshot than understated numbers
    // on a page the press is reading.
    const expected = trackedProjects.length
    if (live.projects.length < Math.ceil(expected / 2)) {
      console.error(
        `[stats] only ${live.projects.length}/${expected} properties returned data — ` +
          'falling back to snapshot. Check the service account has Viewer ' +
          'access on every property in projects.mjs.',
      )
      return { ...snapshot, live: false }
    }

    if (live.projects.length < expected) {
      console.warn(
        `[stats] ${expected - live.projects.length} of ${expected} properties ` +
          'returned no data; publishing the rest live.',
      )
    }

    return { ...live, live: true }
  } catch (error) {
    console.error('[stats] falling back to snapshot:', error.message)
    return { ...snapshot, live: false }
  }
}

function sum(values) {
  return values.reduce((total, value) => total + value, 0)
}

function percentChange(current, previous) {
  if (!previous) return null
  return ((current - previous) / previous) * 100
}

/**
 * Joins the numbers with the project registry and derives everything the UI
 * needs. Cached per request so the home page and /stats page share one fetch.
 */
export const getStats = cache(async function getStats() {
  const report = await loadReport()
  const { months } = report

  const projects = report.projects
    .map((row) => {
      const project = projectsByPropertyId.get(row.propertyId)
      if (!project) return null

      const monthly = row.monthly

      // A project whose tag broke reports near-zero rather than nothing, so
      // every month from the break onward is untrustworthy. `gapFrom` is the
      // first such index; -1 means the whole series is good.
      const gapFrom = project.trackingGap
        ? months.findIndex(
            (month) => month >= project.trackingGap.since.slice(0, 7),
          )
        : -1
      const gapped = gapFrom !== -1

      // Only the months we still trust feed the trend line and the deltas.
      const reliable = gapped ? monthly.slice(0, gapFrom) : monthly
      const latest = gapped ? null : (monthly.at(-1) ?? 0)
      const previous = gapped ? null : (monthly.at(-2) ?? 0)
      const trailing = monthly.slice(-DORMANT_AFTER_MONTHS)

      return {
        ...project,
        lifetime: row.lifetime,
        monthly,
        reliable,
        gapped,
        gapFrom,
        latest,
        previous,
        change: gapped ? null : percentChange(latest, previous),
        // A gapped project is not dormant — it is unmeasured.
        dormant: !gapped && sum(trailing) === 0,
        peak: Math.max(...reliable, 0),
      }
    })
    .filter(Boolean)
    .sort((a, b) => b.lifetime.users - a.lifetime.users)

  // Site-wide monthly totals: index i is the sum across every project for
  // months[i]. Projects contribute nothing once their tracking gap starts, so
  // a broken tag never reads as an audience decline.
  const monthlySeries = months.map((month, index) => ({
    month,
    users: sum(
      projects.map((project) =>
        project.gapped && index >= project.gapFrom
          ? 0
          : (project.monthly[index] ?? 0),
      ),
    ),
  }))

  const latestMonthUsers = monthlySeries.at(-1)?.users ?? 0
  const previousMonthUsers = monthlySeries.at(-2)?.users ?? 0

  return {
    live: report.live,
    generatedAt: report.generatedAt,
    source: report.source,
    months,
    latestMonth: months.at(-1),
    projects,
    monthlySeries,
    // Everything the page has to disclose, in the order it should be read.
    footnotes: projects
      .filter((project) => project.note || project.gapped)
      .map((project) => ({
        id: project.id,
        name: project.name,
        gap: project.gapped ? project.trackingGap : null,
        note: project.note ?? null,
      })),
    totals: {
      lifetimeUsers: sum(projects.map((p) => p.lifetime.users)),
      lifetimePageViews: sum(projects.map((p) => p.lifetime.pageViews)),
      lifetimeSessions: sum(projects.map((p) => p.lifetime.sessions)),
      monthlyUsers: latestMonthUsers,
      monthlyChange: percentChange(latestMonthUsers, previousMonthUsers),
      trailingYearUsers: sum(monthlySeries.map((point) => point.users)),
      projectCount: projects.length,
      measuredProjectCount: projects.filter(
        (project) => !project.dormant && !project.gapped,
      ).length,
      gappedProjectCount: projects.filter((project) => project.gapped).length,
    },
  }
})

const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function formatCompact(value) {
  return compactFormatter.format(value)
}

export function formatNumber(value) {
  return value.toLocaleString('en-US')
}

export function formatChange(change) {
  if (change === null || !Number.isFinite(change)) return null
  const rounded = Math.round(change)
  return `${rounded >= 0 ? '+' : ''}${rounded}%`
}

/** "2026-06-08" -> "8 June 2026" */
export function formatDay(iso) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** "2026-07" -> "Jul 2026" */
export function formatMonth(month, { short = false } = {}) {
  const [year, monthIndex] = month.split('-').map(Number)
  const date = new Date(Date.UTC(year, monthIndex - 1, 1))
  const label = date.toLocaleString('en-US', {
    month: 'short',
    timeZone: 'UTC',
  })
  return short ? label : `${label} ${year}`
}
