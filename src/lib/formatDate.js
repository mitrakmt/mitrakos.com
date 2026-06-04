export function formatDate(dateString) {
  // Handle "Dec 26, 2022" style dates (from articles.json)
  // and "2022-12-26" ISO style dates (from MDX frontmatter)
  let date
  if (/^[A-Z][a-z]{2}\s+\d{1,2},\s+\d{4}$/.test(dateString)) {
    // Parse "Dec 26, 2022" as local time, then treat as UTC to avoid off-by-one
    const parsed = new Date(dateString)
    const year = parsed.getFullYear()
    const month = parsed.getMonth()
    const day = parsed.getDate()
    date = new Date(Date.UTC(year, month, day))
  } else {
    date = new Date(`${dateString}T00:00:00Z`)
  }

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
