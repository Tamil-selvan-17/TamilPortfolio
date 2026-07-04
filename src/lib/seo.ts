import type { Metadata } from 'next'
import { getSiteConfig } from './content'

const site = getSiteConfig()

export function generatePageMetadata(
  title: string,
  description?: string,
  path?: string
): Metadata {
  const url = path ? `${site.seo.siteUrl}${path}` : site.seo.siteUrl
  const desc = description ?? site.seo.description

  return {
    title,
    description: desc,
    metadataBase: new URL(site.seo.siteUrl),
    alternates: { canonical: url },
    openGraph: {
      title,
      description: desc,
      url,
      siteName: site.seo.title,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      ...(site.seo.twitterHandle && { creator: site.seo.twitterHandle }),
    },
    keywords: site.seo.keywords,
  }
}
