import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'
import Script from 'next/script'

import '@/styles/tailwind.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.mitrakos.com'
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s - Michael Mitrakos',
    default:
      'Michael Mitrakos - Software designer, founder, and world traveler',
  },
  description:
    'I’m Michael, a full-stack senior software engineer and tech lead from the US. For the past 10 years I’ve been leading teams to build high-quality web applications.',
  keywords: [
    'Michael Mitrakos',
    'software engineer',
    'tech lead',
    'frontend engineering',
    'web development',
  ],
  authors: [{ name: 'Michael Mitrakos', url: siteUrl }],
  creator: 'Michael Mitrakos',
  publisher: 'Michael Mitrakos',
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': `${siteUrl}/feed.xml`,
    },
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'Michael Mitrakos - Software designer, founder, and world traveler',
    description:
      'I’m Michael, a full-stack senior software engineer and tech lead from the US. For the past 10 years I’ve been leading teams to build high-quality web applications.',
    siteName: 'Michael Mitrakos',
    images: [{ url: '/cover.avif', width: 1200, height: 630, alt: 'Michael Mitrakos' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Michael Mitrakos - Software designer, founder, and world traveler',
    description:
      'I’m Michael, a full-stack senior software engineer and tech lead from the US. For the past 10 years I’ve been leading teams to build high-quality web applications.',
    images: ['/cover.avif'],
    creator: '@Mike_Mitrakos',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Michael Mitrakos',
  jobTitle: 'Senior Software Engineer and Tech Lead',
  url: siteUrl,
  sameAs: [
    'https://x.com/Mike_Mitrakos',
    'https://www.instagram.com/mike_mitrakos/',
    'https://github.com/mitrakmt',
    'https://www.linkedin.com/in/mitrakos',
  ],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Michael Mitrakos',
  url: siteUrl,
  inLanguage: 'en-US',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex h-full bg-zinc-50 dark:bg-black">
        {gaMeasurementId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaMeasurementId}');
                `,
              }}
            />
          </>
        )}
        <Script
          id="person-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Providers>
          <div className="flex w-full">
            <Layout>{children}</Layout>
          </div>
        </Providers>
      </body>
    </html>
  )
}
