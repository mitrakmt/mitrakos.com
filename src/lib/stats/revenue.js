import { cache } from 'react'

import snapshot from '@/data/revenue-snapshot.json'
import { trackedProjects } from '@/lib/stats/projects.mjs'
import { fetchRevenueFromStripe, getStripeKeys } from '@/lib/stats/stripe.mjs'

/**
 * Returns the raw revenue report — live from Stripe when keys are configured,
 * otherwise the committed snapshot.
 *
 * Same contract as the analytics side: the snapshot is real data, so the page
 * publishes correct figures before credentials are wired up and stays correct
 * if Stripe is briefly unreachable at build time.
 */
async function loadReport() {
  if (!getStripeKeys()) return { ...snapshot, live: false }

  const expected = trackedProjects.filter((project) => project.stripe).length

  try {
    const live = await fetchRevenueFromStripe(trackedProjects)

    // An account can fail on its own — a revoked key, a permission removed —
    // without failing the batch. Publishing the remainder would understate
    // total revenue while still presenting it as the total, so partial
    // coverage is treated as a failed fetch.
    if (live.projects.length < expected) {
      console.error(
        `[revenue] only ${live.projects.length}/${expected} Stripe accounts ` +
          'returned data — falling back to snapshot. Check every key in ' +
          'STRIPE_RESTRICTED_KEYS is valid and read-enabled.',
      )
      return { ...snapshot, live: false }
    }

    return { ...live, live: true }
  } catch (error) {
    console.error('[revenue] falling back to snapshot:', error.message)
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

const emptyTotals = () => ({ gross: 0, refunded: 0, fees: 0, net: 0 })

function addInto(target, source) {
  for (const field of ['gross', 'refunded', 'fees', 'net']) {
    target[field] += source[field] ?? 0
  }
  return target
}

/**
 * Joins Stripe's numbers with the project registry and derives everything the
 * revenue UI needs. Cached per request so repeated reads share one fetch.
 *
 * Every figure is in the minor unit (cents) all the way to the formatter —
 * money is never carried as a float.
 */
export const getRevenue = cache(async function getRevenue() {
  const report = await loadReport()
  const { months } = report

  const byProjectId = new Map(
    report.projects.map((row) => [row.projectId, row]),
  )

  // The dominant settlement currency across connected accounts. Totals are
  // only ever summed within one currency — adding EUR to USD would produce a
  // number that means nothing.
  const currencyCounts = new Map()
  for (const row of report.projects) {
    currencyCounts.set(row.currency, (currencyCounts.get(row.currency) ?? 0) + 1)
  }
  const currency =
    [...currencyCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'usd'

  const projects = trackedProjects
    .map((project) => {
      const row = byProjectId.get(project.id)

      // No configured account: the honest reading is "not published", which is
      // a different claim from "$0" and must never be rendered as one.
      if (!row) {
        return {
          ...project,
          connected: false,
          published: Boolean(project.stripe),
        }
      }

      const monthlyNet = row.monthly.map((month) => month.net)
      const mismatched = row.currency !== currency
      const latest = monthlyNet.at(-1) ?? 0
      const previous = monthlyNet.at(-2) ?? 0

      return {
        ...project,
        connected: true,
        published: true,
        currency: row.currency,
        currencyMismatch: mismatched,
        lifetime: row.lifetime,
        monthly: row.monthly,
        monthlyNet,
        latest,
        previous,
        change: percentChange(latest, previous),
        mrr: row.mrr,
        activeSubscriptions: row.activeSubscriptions,
        discountedSubscriptions: row.discountedSubscriptions ?? 0,
        meteredItems: row.meteredItems ?? 0,
        otherCurrency: row.otherCurrency ?? 0,
        lifetimeComplete: row.lifetimeComplete !== false,
        monthlyComplete: row.monthlyComplete !== false,
        // Distinguishes an account that has genuinely never earned from one
        // that simply has no recent activity.
        everEarned: row.lifetime.gross > 0,
      }
    })
    .sort((a, b) => {
      // Connected projects first, then by lifetime net.
      if (a.connected !== b.connected) return a.connected ? -1 : 1
      if (!a.connected) return 0
      return b.lifetime.net - a.lifetime.net
    })

  const counted = projects.filter(
    (project) => project.connected && !project.currencyMismatch,
  )

  const monthlySeries = months.map((month, index) => {
    const totals = counted.reduce(
      (acc, project) => addInto(acc, project.monthly[index] ?? {}),
      emptyTotals(),
    )
    return { month, ...totals }
  })

  const latestMonthNet = monthlySeries.at(-1)?.net ?? 0
  const previousMonthNet = monthlySeries.at(-2)?.net ?? 0

  const lifetime = counted.reduce(
    (acc, project) => addInto(acc, project.lifetime),
    emptyTotals(),
  )

  return {
    live: report.live,
    generatedAt: report.generatedAt,
    source: report.source,
    currency,
    months,
    latestMonth: months.at(-1),
    projects,
    monthlySeries,
    // Everything the page has to disclose about the revenue figures.
    caveats: {
      // Any account whose history was too long to read in full understates its
      // lifetime total, so the headline has to be presented as a floor.
      lifetimeIsFloor: counted.some((project) => !project.lifetimeComplete),
      incompleteMonths: counted.filter((project) => !project.monthlyComplete),
      mismatchedCurrency: projects.filter((project) => project.currencyMismatch),
      metered: counted.filter((project) => project.meteredItems > 0),
      // A roster of comped accounts is a real subscriber count and a near-zero
      // recurring figure at the same time. Saying so is the only way the two
      // numbers read as consistent rather than as one of them being wrong.
      discounted: counted.filter(
        (project) => project.discountedSubscriptions > 0,
      ),
      unpublished: projects.filter((project) => !project.connected),
    },
    totals: {
      lifetime,
      monthlyNet: latestMonthNet,
      monthlyChange: percentChange(latestMonthNet, previousMonthNet),
      trailingYearNet: sum(monthlySeries.map((point) => point.net)),
      trailingYearGross: sum(monthlySeries.map((point) => point.gross)),
      mrr: sum(counted.map((project) => project.mrr)),
      activeSubscriptions: sum(
        counted.map((project) => project.activeSubscriptions),
      ),
      publishedProjectCount: counted.length,
      projectCount: projects.length,
    },
  }
})

/**
 * Money formatter.
 *
 * Cents are shown below $1,000 and dropped above it: on a page where a project
 * earns $18.94 a month, rounding to $19 would be a visible distortion, while
 * cents on a five-figure total are noise.
 */
export function formatMoney(minorUnits, currency = 'usd', { cents } = {}) {
  const value = minorUnits / 100
  const showCents = cents ?? Math.abs(value) < 1000

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  }).format(value)
}

/** Compact form for axis ticks: $1.2K, $18.94. */
export function formatMoneyCompact(minorUnits, currency = 'usd') {
  const value = minorUnits / 100
  if (Math.abs(value) < 1000) return formatMoney(minorUnits, currency)

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}
