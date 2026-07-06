'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Download, Gamepad2 } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { usePathname } from 'next/navigation'
import { siteConfig } from '@/config/site.config'

const NAV_ITEMS = [
  { label: 'About', href: '/about' },
  { label: 'Skills', href: '/skills' },
  { label: 'Experience', href: '/experience' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/contact' },
]

const SECTION_IDS = ['hero', 'about', 'experience', 'projects', 'skills', 'certifications', 'contact']

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close mobile menu on escape
  useEffect(() => {
    const down = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false) }
    window.addEventListener('keydown', down)
    return () => window.removeEventListener('keydown', down)
  }, [])

  const isActive = (href: string) => {
    return pathname === href
  }

  if (pathname === '/game') return null

  return (
    <>
      <header
        className={`fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 rounded-full w-[95%] max-w-5xl border ${
          scrolled
            ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-lg shadow-stone-200/50 dark:shadow-black/50 border-stone-200 dark:border-slate-800'
            : 'bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-white/20 dark:border-slate-800/50'
        }`}
      >
        <nav className="flex items-center justify-between h-14 px-6">
          {/* Logo */}
          <Link
            href="/"
            className="font-bold text-lg tracking-tight flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-500 dark:border-blue-400 flex items-center justify-center bg-stone-200 dark:bg-slate-800 shrink-0">
              <img src="/images/logo1.jpg" alt="Logo" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
            </div>
            <span className="text-stone-900 dark:text-white hover:text-emerald-600 dark:hover:text-blue-400 transition-colors">Tamilselvan</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-1.5 text-sm rounded-lg transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {isActive(item.href) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg bg-white/8"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">

            {/* Game icon */}
            <Link
              href="/game"
              aria-label="Play Portfolio Quest"
              title="Portfolio Quest — Play the Game!"
              className="w-9 h-9 flex items-center justify-center rounded-xl
                         bg-gradient-to-br from-violet-500/20 to-indigo-500/20
                         border border-violet-500/30 hover:border-violet-400/60
                         text-violet-400 hover:text-violet-300
                         transition-all duration-200 hover:scale-105 group"
            >
              <Gamepad2 size={16} className="group-hover:rotate-6 transition-transform duration-200" />
            </Link>

            <ThemeToggle />

            {/* Download resume */}
            <a
              href={'/resume/Tamilselvan_G_Resume.pdf'}
              download
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-xl
                         gradient-bg text-white font-medium
                         hover:opacity-90 transition-opacity duration-200"
            >
              <Download size={13} />
              Resume
            </a>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen((p) => !p)}
              aria-label="Toggle menu"
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl
                         bg-white/5 border border-white/10"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-24 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-stone-200 dark:border-slate-800 rounded-3xl p-4 shadow-2xl shadow-black/20 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm transition-colors ${
                    isActive(item.href)
                      ? 'bg-white/8 text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-white/8 mt-2 pt-2 flex flex-col gap-1">
                <Link
                  href="/game"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm
                             bg-gradient-to-r from-violet-600/80 to-indigo-600/80 text-white font-medium"
                >
                  <Gamepad2 size={14} />
                  Portfolio Quest 🎮
                </Link>
                <a
                  href="/resume/Tamilselvan_G_Resume.pdf"
                  download
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm
                             gradient-bg text-white font-medium"
                >
                  <Download size={14} />
                  Download Resume
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
