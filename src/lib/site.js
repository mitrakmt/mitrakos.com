export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.mitrakos.com'
).replace(/\/$/, '')

export const siteName = 'Michael Mitrakos'

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

export function pageMetadata({ title, description, path, type = 'website' }) {
  return {
    title,
    description,
    alternates: {
      canonical: path,
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
