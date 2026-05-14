import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'

import { siteDescription, siteName, siteUrl } from '@/lib/site'

import '@/styles/tailwind.css'

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s - Michael Mitrakos',
    default:
      'Michael Mitrakos - Software designer, founder, and world traveler',
  },
  description: siteDescription,
  keywords: [
    'Michael Mitrakos',
    'software engineer',
    'tech lead',
    'frontend engineering',
    'web development',
  ],
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': `${siteUrl}/feed.xml`,
      'text/plain': `${siteUrl}/llms.txt`,
    },
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'Michael Mitrakos - Software designer, founder, and world traveler',
    description: siteDescription,
    siteName,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Michael Mitrakos - Software designer, founder, and world traveler',
    description: siteDescription,
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
  name: siteName,
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
  name: siteName,
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
        <Analytics />
      </body>
    </html>
  )
}
