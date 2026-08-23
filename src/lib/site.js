export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.mitrakos.com'
).replace(/\/$/, '')

// The homepage's canonical URL. Next's metadata resolver collapses any root
// path to the bare origin (`resolveAbsoluteUrlWithPathname` returns
// `result.origin` when the pathname is "/"), so a canonical declared through
// the metadata API renders without the trailing slash while crawlers request
// `/`. SEO auditors compare those two strings and report the homepage as
// "Not indexable". `homeUrl` is the form we render by hand instead — keep the
// slash, and keep it off `siteUrl`, which prefixes every other route.
export const homeUrl = `${siteUrl}/`

export const siteName = 'Michael Mitrakos'

// The homepage's <title>. Kept here because the root layout uses it as
// `title.default` and src/app/page.jsx sets it explicitly — the root page
// shares a route segment with the root layout, so `title.template` never
// applies to it and the page must state the brand itself.
export const siteTitle =
  'Michael Mitrakos - Senior Software Engineer & Tech Lead'

export const siteDescription =
  'I’m Michael, a full-stack senior software engineer and tech lead from the US. For the past 10 years I’ve been leading teams to build high-quality web applications.'

// Served by the file-based conventions in src/app/opengraph-image.jsx and
// src/app/twitter-image.jsx. Referenced explicitly so pages that define their
// own `openGraph`/`twitter` metadata still surface a social preview image.
export const ogImagePath = '/opengraph-image'
export const twitterImagePath = '/twitter-image'

export const ogImage = {
  url: ogImagePath,
  width: 1200,
  height: 630,
  alt: `${siteName} — Senior Software Engineer & Tech Lead`,
}

export function absoluteUrl(path = '/') {
  return new URL(path, siteUrl).toString()
}

// The feed and llms.txt links every indexable page advertises. Stated once
// here because Next's metadata merge replaces `alternates` wholesale rather
// than deep-merging it (`case "alternates"` in `mergeMetadata` assigns
// `target.alternates` outright), so a page declaring its own canonical drops
// whatever the root layout put in `types`. Every page has to restate them.
export const alternateTypes = {
  'application/rss+xml': `${siteUrl}/feed.xml`,
  'text/plain': `${siteUrl}/llms.txt`,
}

export function pageMetadata({ title, description, path, type = 'website' }) {
  return {
    title,
    description,
    alternates: {
      canonical: path,
      types: alternateTypes,
    },
    openGraph: {
      type,
      url: absoluteUrl(path),
      title,
      description,
      siteName,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@Mike_Mitrakos',
      creator: '@Mike_Mitrakos',
      images: [twitterImagePath],
    },
  }
}
