#!/usr/bin/env node
/**
 * Regenerates src/data/stats-snapshot.json from Google Analytics.
 *
 *   GA_SERVICE_ACCOUNT_KEY=... node scripts/refresh-stats.mjs
 *   npm run stats:refresh
 *
 * The snapshot is what the site renders when no GA credentials are present at
 * build time, so committing a fresh one keeps the public numbers current even
 * without wiring credentials into the deploy.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { fetchStatsFromGa } from '../src/lib/stats/ga.mjs'
import { trackedProjects } from '../src/lib/stats/projects.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const snapshotPath = resolve(root, 'src/data/stats-snapshot.json')

/** Loads .env / .env.local without adding a dotenv dependency. */
async function loadEnvFiles() {
  for (const file of ['.env', '.env.local']) {
    let contents
    try {
      contents = await readFile(resolve(root, file), 'utf8')
    } catch {
      continue
    }

    for (const line of contents.split('\n')) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)$/)
      if (!match) continue
      const [, key, rawValue] = match
      if (process.env[key]) continue
      process.env[key] = rawValue.trim().replace(/^["']|["']$/g, '')
    }
  }
}

async function main() {
  await loadEnvFiles()

  if (!process.env.GA_SERVICE_ACCOUNT_KEY) {
    console.error(
      'GA_SERVICE_ACCOUNT_KEY is not set.\n\n' +
        'Create a Google Cloud service account, grant it Viewer on the GA4\n' +
        'properties, then set the key JSON (raw or base64) as\n' +
        'GA_SERVICE_ACCOUNT_KEY in .env.local.',
    )
    process.exit(1)
  }

  const propertyIds = trackedProjects.map((project) => project.propertyId)
  console.log(`Fetching ${propertyIds.length} GA properties…`)

  const report = await fetchStatsFromGa(propertyIds)

  const previous = JSON.parse(await readFile(snapshotPath, 'utf8'))
  const snapshot = {
    $comment: previous.$comment,
    ...report,
  }

  await writeFile(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`)

  const lifetime = report.projects.reduce((n, p) => n + p.lifetime.users, 0)
  const latest = report.projects.reduce((n, p) => n + (p.monthly.at(-1) ?? 0), 0)

  console.log(
    `\nWrote ${report.projects.length} projects to src/data/stats-snapshot.json\n` +
      `  Lifetime users: ${lifetime.toLocaleString('en-US')}\n` +
      `  ${report.months.at(-1)} visitors: ${latest.toLocaleString('en-US')}`,
  )

  const missing = propertyIds.filter(
    (id) => !report.projects.some((project) => project.propertyId === id),
  )
  if (missing.length) {
    console.warn(`\nWarning: no data returned for ${missing.join(', ')}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
