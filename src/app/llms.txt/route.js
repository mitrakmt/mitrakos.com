import { NextResponse } from 'next/server'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.mitrakos.com'

const content = `# Michael Mitrakos

> Official website and portfolio for Michael Mitrakos.

## About
Michael Mitrakos is a US-based senior software engineer and tech lead. The site includes his background, selected projects, technical writing, and contact information.

## Primary sections
- Homepage: ${siteUrl}/
- About: ${siteUrl}/about
- Projects: ${siteUrl}/projects
- Articles index: ${siteUrl}/articles
- Technology: ${siteUrl}/technology
- InitJS: ${siteUrl}/initjs
- Ebook: ${siteUrl}/ebook

## Feeds and discovery
- RSS feed: ${siteUrl}/feed.xml
- XML sitemap: ${siteUrl}/sitemap.xml
`

export async function GET() {
  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
