#!/usr/bin/env node
/**
 * Refuses a snapshot that lost projects.
 *
 * Both refresh scripts overwrite their snapshot with whatever the upstream API
 * returned, and a project whose fetch failed is absent rather than zero. They
 * warn and exit 0, which is right for a human at a terminal — you read the
 * warning and re-run. Unattended, nobody reads it, and a transient Stripe or GA
 * failure would publish a project as "revenue not published" or drop its
 * traffic entirely.
 *
 * Compares each snapshot against the committed one and reports any project that
 * has gone missing. Regressed file paths go to stdout, one per line, so a caller
 * can discard exactly those and keep the rest; the detail goes to stderr.
 *
 *   node scripts/check-snapshot-coverage.mjs
 */
import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const SNAPSHOTS = [
  { path: 'src/data/stats-snapshot.json', key: 'propertyId', label: 'traffic' },
  { path: 'src/data/revenue-snapshot.json', key: 'projectId', label: 'revenue' },
]

/** The committed version of a file, or null when it is not in HEAD yet. */
function committed(path) {
  try {
    return JSON.parse(
      execFileSync('git', ['show', `HEAD:${path}`], {
        cwd: root,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }),
    )
  } catch {
    return null
  }
}

function ids(snapshot, key) {
  return new Set((snapshot?.projects ?? []).map((project) => project[key]))
}

async function main() {
  const regressed = []

  for (const { path, key, label } of SNAPSHOTS) {
    const before = committed(path)
    if (!before) {
      console.error(`${label}: not committed yet — nothing to compare against.`)
      continue
    }

    let after
    try {
      after = JSON.parse(await readFile(resolve(root, path), 'utf8'))
    } catch (error) {
      console.error(`${label}: could not read ${path} — ${error.message}`)
      regressed.push(path)
      continue
    }

    const now = ids(after, key)
    const lost = [...ids(before, key)].filter((id) => !now.has(id))

    if (lost.length) {
      console.error(
        `${label}: ${lost.length} project(s) missing from the new snapshot — ` +
          `${lost.join(', ')}. Keeping the committed version.`,
      )
      regressed.push(path)
    } else {
      console.error(`${label}: ${now.size} project(s), none lost.`)
    }
  }

  for (const path of regressed) console.log(path)
  if (regressed.length) process.exit(1)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
