// Relative rather than aliased: scripts/refresh-revenue.mjs imports this file
// directly under plain Node, which does not resolve the "@/" alias.
import { completeMonths } from './ga.mjs'

const API = 'https://api.stripe.com/v1'

/**
 * Pinned so a future change to the account's default API version can never
 * silently reshape the fields a page of published financials is built on.
 */
const API_VERSION = '2024-06-20'

/** Stop paginating an account after this many pages of 100 transactions. */
const MAX_PAGES = 50

/**
 * Balance-transaction reporting categories that represent money the business
 * earned or gave back. Deliberately an allow-list rather than a deny-list:
 * payouts, transfers, top-ups and Stripe Capital advances all move money
 * without earning it, and a deny-list would start counting any category Stripe
 * adds in future as revenue.
 *
 * Grouped by how each one enters the arithmetic.
 */
const INFLOW = new Set(['charge', 'partial_capture_reversal', 'dispute_reversal'])
const GIVEN_BACK = new Set(['refund', 'dispute'])
const CHARGED_BY_STRIPE = new Set(['fee', 'tax'])

const REVENUE_CATEGORIES = new Set([
  ...INFLOW,
  ...GIVEN_BACK,
  ...CHARGED_BY_STRIPE,
])

/** Months of a billing interval, used to normalise every price to monthly. */
const MONTHS_PER_INTERVAL = {
  day: 1 / 30.4375,
  week: 7 / 30.4375,
  month: 1,
  year: 12,
}

/**
 * Reads the per-project Stripe keys from the environment.
 *
 * `STRIPE_RESTRICTED_KEYS` holds a JSON object mapping project id to that
 * project's key — raw or base64 encoded, matching how GA_SERVICE_ACCOUNT_KEY
 * works, because Vercel's env UI mangles multi-line values.
 *
 *   {"wanderlust": "rk_live_...", "verdacert": "rk_live_..."}
 *
 * These are separate Stripe accounts rather than one Connect platform, so each
 * needs its own key. Returns null when unset so callers fall back to the
 * committed snapshot instead of failing the build.
 */
export function getStripeKeys() {
  const raw = process.env.STRIPE_RESTRICTED_KEYS
  if (!raw) return null

  try {
    const json = raw.trim().startsWith('{')
      ? raw
      : Buffer.from(raw, 'base64').toString('utf8')
    const parsed = JSON.parse(json)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null

    const keys = new Map()
    for (const [projectId, key] of Object.entries(parsed)) {
      if (typeof key !== 'string' || !/^(rk|sk)_(live|test)_/.test(key)) {
        console.warn(`[revenue] ignoring malformed key for "${projectId}"`)
        continue
      }
      keys.set(projectId, key)
    }

    return keys.size ? keys : null
  } catch {
    return null
  }
}

/**
 * Default transport: a direct authenticated GET against the Stripe REST API.
 *
 * Injectable via `fetchRevenueFromStripe(..., { request })` so a caller can
 * supply credentials another way — the seed snapshot is generated through the
 * Stripe CLI — without duplicating any of the aggregation below. There is only
 * ever one implementation of what counts as revenue.
 */
async function httpRequest(key, path, params = {}) {
  const url = new URL(`${API}${path}`)
  for (const [name, value] of Object.entries(params)) {
    url.searchParams.set(name, String(value))
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${key}`,
      'Stripe-Version': API_VERSION,
    },
  })

  if (!response.ok) {
    // Stripe echoes the key prefix in some errors; the body is logged by
    // callers, so keep it to the message rather than the whole payload.
    const body = await response.json().catch(() => null)
    throw new Error(
      `Stripe ${path} failed (${response.status}): ` +
        (body?.error?.message ?? 'unknown error'),
    )
  }

  return response.json()
}

/**
 * Walks every page of a Stripe list endpoint, newest first.
 *
 * Returns `truncated` when the cap was hit rather than pretending the list was
 * exhausted — the caller decides what is still safe to publish from a partial
 * history.
 */
async function paginate(request, key, path, params = {}) {
  const items = []
  let startingAfter

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const body = await request(key, path, {
      ...params,
      limit: 100,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    })

    items.push(...body.data)
    if (!body.has_more || body.data.length === 0) {
      return { items, truncated: false }
    }
    startingAfter = body.data.at(-1).id
  }

  return { items, truncated: true }
}

function monthOf(unixSeconds) {
  return new Date(unixSeconds * 1000).toISOString().slice(0, 7)
}

/**
 * Normalises one subscription to a monthly amount in minor units.
 *
 * Metered and tiered prices carry no `unit_amount` — there is no recurring
 * figure to state, so they are reported as excluded rather than counted as
 * zero.
 */
function monthlyValueOf(subscription) {
  let amount = 0
  let excluded = 0

  for (const item of subscription.items?.data ?? []) {
    const price = item.price
    const recurring = price?.recurring
    if (!recurring || price.unit_amount == null) {
      excluded += 1
      continue
    }

    const months =
      (MONTHS_PER_INTERVAL[recurring.interval] ?? 1) *
      (recurring.interval_count || 1)
    amount += (price.unit_amount * (item.quantity ?? 1)) / months
  }

  return { amount, excluded }
}

/**
 * Lifetime and monthly revenue for a single Stripe account.
 *
 * One pass over the account's balance transactions feeds both: they arrive
 * newest first, so a truncated history still yields a complete recent series
 * as long as it reaches back past the window — which is checked, not assumed.
 */
/**
 * The currency most of an account's revenue settles in.
 *
 * Only used when the account itself could not be read; picking the most common
 * rather than the first avoids letting one stray foreign charge decide which
 * currency the whole project is reported in.
 */
function dominantCurrency(transactions) {
  const counts = new Map()
  for (const txn of transactions) {
    if (!REVENUE_CATEGORIES.has(txn.reporting_category)) continue
    const code = txn.currency?.toLowerCase()
    if (code) counts.set(code, (counts.get(code) ?? 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
}

async function fetchAccount({ id: projectId, stripe }, key, months, request) {
  const [accountResult, balance, subscriptions] = await Promise.all([
    // Reading the account is a nicety, not a requirement: it supplies the
    // settlement currency and lets the key be checked against the registry.
    // Whether a restricted key can read it depends on how its permissions were
    // set, so a refusal here degrades rather than losing the whole account's
    // revenue — both facts are recoverable from the transactions themselves.
    request(key, '/account').then(
      (value) => ({ ok: true, value }),
      (error) => ({ ok: false, error }),
    ),
    paginate(request, key, '/balance_transactions'),
    paginate(request, key, '/subscriptions', { status: 'active' }),
  ])

  const account = accountResult.ok ? accountResult.value : null

  // A key pasted against the wrong project would publish one business's
  // revenue under another's name. The registry records which account each
  // project's numbers must come from, so that mistake fails loudly here
  // instead of quietly shipping.
  if (account && stripe.accountId && account.id !== stripe.accountId) {
    throw new Error(
      `key resolves to ${account.id}, but the registry expects ${stripe.accountId}`,
    )
  }

  if (!account) {
    console.warn(
      `[revenue] ${projectId}: could not read /v1/account ` +
        `(${accountResult.error?.message ?? 'unknown error'}). The key is ` +
        'therefore NOT verified against the registry accountId, and the ' +
        'settlement currency is inferred from the transactions. Grant this ' +
        'key read access to the account to restore both checks.',
    )
  }

  const currency =
    account?.default_currency?.toLowerCase() ??
    dominantCurrency(balance.items) ??
    'usd'
  const windowStart = `${months[0]}-01`.slice(0, 7)

  const empty = () => ({ gross: 0, refunded: 0, fees: 0, net: 0 })
  const lifetime = empty()
  const byMonth = new Map(months.map((month) => [month, empty()]))

  let oldestSeen = null
  let otherCurrency = 0

  for (const txn of balance.items) {
    if (!REVENUE_CATEGORIES.has(txn.reporting_category)) continue

    // Multi-currency accounts settle in several currencies; summing across
    // them would be meaningless, so anything outside the account's default is
    // excluded and disclosed rather than silently added.
    if (txn.currency?.toLowerCase() !== currency) {
      otherCurrency += 1
      continue
    }

    const month = monthOf(txn.created)
    if (oldestSeen === null || month < oldestSeen) oldestSeen = month

    for (const bucket of [lifetime, byMonth.get(month)].filter(Boolean)) {
      if (INFLOW.has(txn.reporting_category)) bucket.gross += txn.amount
      if (GIVEN_BACK.has(txn.reporting_category)) bucket.refunded -= txn.amount
      if (CHARGED_BY_STRIPE.has(txn.reporting_category)) bucket.fees -= txn.amount
      bucket.fees += txn.fee
      bucket.net += txn.net
    }
  }

  let mrr = 0
  let meteredItems = 0
  for (const subscription of subscriptions.items) {
    const { amount, excluded } = monthlyValueOf(subscription)
    mrr += amount
    meteredItems += excluded
  }

  return {
    projectId,
    accountId: account?.id ?? stripe.accountId ?? null,
    // False when the account could not be read, so the published figures were
    // never confirmed to come from the account the registry names.
    verified: Boolean(account),
    currency,
    lifetime,
    // `monthly` is parallel to `months` so the series lines up with GA's.
    monthly: months.map((month) => byMonth.get(month)),
    mrr: Math.round(mrr),
    activeSubscriptions: subscriptions.items.length,
    meteredItems,
    otherCurrency,
    // Lifetime is only a true lifetime if we reached the start of the account.
    lifetimeComplete: !balance.truncated,
    // The recent series is complete whenever the history read goes back past
    // the start of the window, truncated or not.
    monthlyComplete:
      !balance.truncated || (oldestSeen !== null && oldestSeen < windowStart),
  }
}

/**
 * Fetches revenue for every project with a configured key. An account that
 * errors (key revoked, insufficient permissions) is dropped rather than
 * failing the whole report.
 */
export async function fetchRevenueFromStripe(
  projects_,
  { monthCount = 12, request = httpRequest, keys = getStripeKeys() } = {},
) {
  if (!keys) throw new Error('STRIPE_RESTRICTED_KEYS is not set')

  const months = completeMonths(monthCount)
  const configured = projects_.filter(
    (project) => project.stripe && keys.has(project.id),
  )

  const results = await Promise.allSettled(
    configured.map((project) =>
      fetchAccount(project, keys.get(project.id), months, request),
    ),
  )

  const projects = []
  for (const [index, result] of results.entries()) {
    if (result.status === 'fulfilled') {
      projects.push(result.value)
    } else {
      console.error(
        `[revenue] skipping ${configured[index].id}:`,
        result.reason?.message ?? result.reason,
      )
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    source: 'Stripe',
    months,
    projects,
  }
}

export { REVENUE_CATEGORIES }
