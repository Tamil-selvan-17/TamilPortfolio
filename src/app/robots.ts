import { MetadataRoute } from 'next'
import { getSiteConfig } from '@/lib/content'

const site = getSiteConfig()

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${site.seo.siteUrl}/sitemap.xml`,
  }
}
