import { siteUrl } from '@/lib/site'

const siteHost = new URL(siteUrl).host

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteHost,
  }
}
