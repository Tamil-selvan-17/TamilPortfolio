import type { Metadata } from 'next'
import { Inter, Geist_Mono, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { Navbar } from '@/components/layout/Navbar'
import { GalaxyFooter } from '@/components/sections/GalaxyFooter'
import { ScrollProgressBar } from '@/components/layout/ScrollProgressBar'
import { CommandPalette } from '@/components/layout/CommandPalette'
import { LenisProvider } from '@/components/layout/LenisProvider'
import { SVGFollower } from '@/components/ui/svg-follower'
import { IntroGate } from '@/components/intro/IntroGate'
import { getProfile, getSiteConfig } from '@/lib/content'

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  display: 'swap',
})

const site = getSiteConfig()
const profile = getProfile()

export const metadata: Metadata = {
  title: {
    default: site.seo.title,
    template: site.seo.titleTemplate,
  },
  description: site.seo.description,
  metadataBase: new URL(site.seo.siteUrl),
  keywords: site.seo.keywords,
  authors: [{ name: profile.name, url: site.seo.siteUrl }],
  creator: profile.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: site.seo.siteUrl,
    siteName: site.seo.title,
    title: site.seo.title,
    description: site.seo.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: site.seo.title,
    description: site.seo.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className={`${spaceGrotesk.variable} min-h-full flex flex-col bg-stone-100 dark:bg-[#030712] text-stone-900 dark:text-white antialiased selection:bg-emerald-500/20 selection:text-emerald-900 dark:selection:text-emerald-200`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
          <SVGFollower colors={["#94e6fb", "#ff00ff", "#00ff9d", "#ff8c00", "#ffffff"]} />
          <IntroGate />
          <LenisProvider />
          <ScrollProgressBar />
          <Navbar />
          <main className="flex flex-col flex-1 relative z-10">{children}</main>
          <GalaxyFooter />
          <CommandPalette />
        </ThemeProvider>
      </body>
    </html>
  )
}
