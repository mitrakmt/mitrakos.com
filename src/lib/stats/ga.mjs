import { createSign } from 'node:crypto'

const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const DATA_API = 'https://analyticsdata.googleapis.com/v1beta'
const SCOPE = 'https://www.googleapis.com/auth/analytics.readonly'

/**
 * Reads the service-account key from the environment.
 *
 * `GA_SERVICE_ACCOUNT_KEY` holds the full JSON key, either raw or base64
 * encoded — Vercel's env UI mangles multi-line values, so base64 is the
 * practical choice there. Returns null when unset so callers can fall back to
 * the committed snapshot instead of failing the build.
 */
export function getServiceAccount() {
  const raw = process.env.GA_SERVICE_ACCOUNT_KEY
  if (!raw) return null

  try {
    const json = raw.trim().startsWith('{')
      ? raw
      : Buffer.from(raw, 'base64').toString('utf8')
    const parsed = JSON.parse(json)
    if (!parsed.client_email || !parsed.private_key) return null
    return parsed
  } catch {
    return null
  }
}

function base64url(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

async function getAccessToken(serviceAccount) {
  const now = Math.floor(Date.now() / 1000)
  const claims = {
    iss: serviceAccount.client_email,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now,
    exp: now + 3600,
  }

  const unsigned = `${base64url(
    JSON.stringify({ alg: 'RS256', typ: 'JWT' }),
  )}.${base64url(JSON.stringify(claims))}`

  const signature = createSign('RSA-SHA256')
    .update(unsigned)
    .sign(serviceAccount.private_key.replace(/\\n/g, '\n'), 'base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${signature}`,
    }),
  })

  if (!response.ok) {
    throw new Error(
      `GA token exchange failed (${response.status}): ${await response.text()}`,
    )
  }

  return (await response.json()).access_token
}

async function runReport(propertyId, token, body) {
  const response = await fetch(
    `${DATA_API}/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  )

  if (!response.ok) {
    throw new Error(
      `GA report for ${propertyId} failed (${response.status}): ${await response.text()}`,
    )
  }

  return response.json()
}

/**
 * The trailing `count` complete months, oldest first, as `YYYY-MM`.
 * The current month is excluded — a partial month reads as a collapse in
 * traffic, which is exactly the wrong story for a public tracker.
 */
export function completeMonths(count = 12, now = new Date()) {
  const months = []
  const cursor = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
  for (let i = 0; i < count; i += 1) {
    cursor.setUTCMonth(cursor.getUTCMonth() - 1)
    months.unshift(cursor.toISOString().slice(0, 7))
  }
  return months
}

async function fetchProperty(propertyId, token, months) {
  const [lifetime, monthly] = await Promise.all([
    runReport(propertyId, token, {
      dateRanges: [{ startDate: '2015-08-14', endDate: 'today' }],
      metrics: [
        { name: 'totalUsers' },
        { name: 'screenPageViews' },
        { name: 'sessions' },
      ],
    }),
    runReport(propertyId, token, {
      dateRanges: [
        { startDate: `${months[0]}-01`, endDate: lastDayOf(months.at(-1)) },
      ],
      dimensions: [{ name: 'yearMonth' }],
      metrics: [{ name: 'activeUsers' }],
      orderBys: [{ dimension: { dimensionName: 'yearMonth' } }],
    }),
  ])

  const lifetimeRow = lifetime.rows?.[0]?.metricValues ?? []
  const byMonth = new Map(
    (monthly.rows ?? []).map((row) => {
      const value = row.dimensionValues[0].value // "YYYYMM"
      return [
        `${value.slice(0, 4)}-${value.slice(4)}`,
        Number(row.metricValues[0].value),
      ]
    }),
  )

  return {
    propertyId,
    lifetime: {
      users: Number(lifetimeRow[0]?.value ?? 0),
      pageViews: Number(lifetimeRow[1]?.value ?? 0),
      sessions: Number(lifetimeRow[2]?.value ?? 0),
    },
    // Months a property reported nothing for are absent from the response, not
    // zero — backfill so every project's series lines up with `months`.
    monthly: months.map((month) => byMonth.get(month) ?? 0),
  }
}

function lastDayOf(month) {
  const [year, monthIndex] = month.split('-').map(Number)
  return new Date(Date.UTC(year, monthIndex, 0)).toISOString().slice(0, 10)
}

/**
 * Fetches lifetime totals and a monthly active-user series for each property.
 * A property that errors (deleted, permissions revoked) is dropped rather than
 * failing the whole report.
 */
export async function fetchStatsFromGa(propertyIds, { monthCount = 12 } = {}) {
  const serviceAccount = getServiceAccount()
  if (!serviceAccount) throw new Error('GA_SERVICE_ACCOUNT_KEY is not set')

  const token = await getAccessToken(serviceAccount)
  const months = completeMonths(monthCount)

  const results = await Promise.allSettled(
    propertyIds.map((id) => fetchProperty(id, token, months)),
  )

  const projects = []
  for (const [index, result] of results.entries()) {
    if (result.status === 'fulfilled') {
      projects.push(result.value)
    } else {
      console.error(
        `[stats] skipping property ${propertyIds[index]}:`,
        result.reason?.message ?? result.reason,
      )
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    source: 'Google Analytics 4',
    months,
    projects,
  }
}
