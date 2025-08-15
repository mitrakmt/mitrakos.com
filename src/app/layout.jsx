import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'
import Script from 'next/script'

import '@/styles/tailwind.css'

export const metadata = {
  title: {
    template: '%s - Michael Mitrakos',
    default:
      'Michael Mitrakos - Software designer, founder, and world traveler',
  },
  description:
    'I’m Michael, a full-stack senior software engineer and tech lead from the US, now based in Egypt. For the past 10 years I’ve been leading teams to build high-quality web applications.',
  alternates: {
    types: {
      'application/rss+xml': `${process.env.NEXT_PUBLIC_SITE_URL}/feed.xml`,
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex h-full bg-zinc-50 dark:bg-black">
      <Script 
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        />
      <Script 
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
            `,
          }}
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
