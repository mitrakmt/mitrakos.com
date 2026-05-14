export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.mitrakos.com'
).replace(/\/$/, '')

export const siteName = 'Michael Mitrakos'

export const siteDescription =
  'I’m Michael, a full-stack senior software engineer and tech lead from the US. For the past 10 years I’ve been leading teams to build high-quality web applications.'

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
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@Mike_Mitrakos',
    },
  }
}
