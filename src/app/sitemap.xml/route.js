import { NextResponse } from 'next/server'

import { getAllArticles } from '@/lib/articles'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.mitrakos.com'

export async function GET() {
  const staticPages = [
    '/',
    '/about',
    '/articles',
    '/ebook',
    '/initjs',
    '/projects',
    '/technology',
  ]

  const articles = await getAllArticles()
  const dynamicPages = articles.map((article) => ({
    path: `/articles/${article.slug}`,
    lastmod: new Date(article.date).toISOString(),
    changefreq: 'monthly',
    priority: '0.8',
  }))

  const staticEntries = staticPages.map((path) => ({
    path,
    lastmod: new Date().toISOString(),
    changefreq: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? '1.0' : '0.7',
  }))

  const urls = [...staticEntries, ...dynamicPages]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ path, lastmod, changefreq, priority }) => `  <url>
    <loc>${siteUrl}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
