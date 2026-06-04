import { NextResponse } from 'next/server'

import { getAllArticles } from '@/lib/articles'
import { siteUrl } from '@/lib/site'

const staticPages = [
  {
    path: '/',
    changefreq: 'weekly',
    priority: '1.0',
  },
  {
    path: '/about',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    path: '/articles',
    changefreq: 'weekly',
    priority: '0.8',
  },

  {
    path: '/initjs',
    changefreq: 'weekly',
    priority: '0.7',
  },
  {
    path: '/projects',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    path: '/technology',
    changefreq: 'monthly',
    priority: '0.6',
  },
]

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function renderTag(name, value) {
  if (!value) {
    return ''
  }

  return `    <${name}>${escapeXml(value)}</${name}>\n`
}

function renderUrl({ path, lastmod, changefreq, priority }) {
  return `  <url>
    <loc>${escapeXml(new URL(path, siteUrl).toString())}</loc>
${renderTag('lastmod', lastmod)}${renderTag('changefreq', changefreq)}${renderTag('priority', priority)}  </url>`
}

export async function GET() {
  const articles = await getAllArticles()
  const dynamicPages = articles.map((article) => ({
    path: `/articles/${article.slug}`,
    lastmod: article.date,
    changefreq: 'monthly',
    priority: '0.8',
  }))

  const urls = [...staticPages, ...dynamicPages]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(renderUrl).join('\n')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
