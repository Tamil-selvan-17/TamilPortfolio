import { getSiteConfig } from '@/lib/content'

const site = getSiteConfig()

export const siteConfig = {
  name: 'Tamilselvan G',
  title: site.seo.title,
  description: site.seo.description,
  url: site.seo.siteUrl,

  nav: site.nav,

  social: {
    github: 'https://github.com/Tamil-selvan-17/Tamil-selvan-17',
    linkedin: 'http://www.linkedin.com/in/tamil-selvan-7200206323-full-stack-developer/',
    twitter: null as string | null,
    email: 'tamilselvang0002@gmail.com',
  },

  features: site.features,

  music: site.music,

  /** Section IDs — keep in sync with Navbar hrefs */
  sections: {
    hero: 'hero',
    about: 'about',
    experience: 'experience',
    projects: 'projects',
    skills: 'skills',
    certifications: 'certifications',
    contact: 'contact',
  },
} as const

export type SiteConfig = typeof siteConfig
