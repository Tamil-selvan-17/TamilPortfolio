'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  Search, ArrowRight, Download, Monitor, Briefcase,
  FolderOpen, Wrench, Mail, Moon, Sun, X
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCommandPalette } from '@/hooks/useCommandPalette'
import { useTheme } from 'next-themes'
import { getProjects } from '@/lib/content'
import { useMemo } from 'react'

const projects = getProjects()

const STATIC_COMMANDS = [
  { id: 'home',          label: 'Go Home',               icon: Monitor,    action: '/', type: 'nav' },
  { id: 'experience',    label: 'Experience',             icon: Briefcase,  action: '/#experience', type: 'nav' },
  { id: 'projects-list', label: 'All Projects',           icon: FolderOpen, action: '/projects', type: 'nav' },
  { id: 'skills',        label: 'Skills',                 icon: Wrench,     action: '/#skills', type: 'nav' },
  { id: 'contact',       label: 'Contact Me',             icon: Mail,       action: '/#contact', type: 'nav' },
  { id: 'resume',        label: 'Download Resume',        icon: Download,   action: 'resume', type: 'action' },
  { id: 'theme-dark',    label: 'Switch to Dark Mode',    icon: Moon,       action: 'dark', type: 'theme' },
  { id: 'theme-light',   label: 'Switch to Light Mode',  icon: Sun,        action: 'light', type: 'theme' },
]

export function CommandPalette() {
  const { open, setOpen, query, setQuery } = useCommandPalette()
  const router = useRouter()
  const { setTheme } = useTheme()

  const projectCommands = useMemo(
    () =>
      projects.map((p) => ({
        id: `project-${p.slug}`,
        label: p.title,
        icon: FolderOpen,
        action: `/projects/${p.slug}`,
        type: 'nav' as const,
        subtitle: p.subtitle,
      })),
    []
  )

  const allCommands = [...STATIC_COMMANDS, ...projectCommands]

  const filtered = useMemo(() => {
    if (!query) return allCommands
    const q = query.toLowerCase()
    return allCommands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        ('subtitle' in c && (c as { subtitle?: string }).subtitle?.toLowerCase().includes(q))
    )
  }, [query, allCommands])

  function runCommand(cmd: (typeof allCommands)[0]) {
    setOpen(false)
    if (cmd.type === 'theme') {
      setTheme(cmd.action)
    } else if (cmd.action === 'resume') {
      const a = document.createElement('a')
      a.href = '/resume/Tamilselvan_G_Resume.pdf'
      a.download = ''
      a.click()
    } else {
      router.push(cmd.action)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.95, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -16 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="fixed left-1/2 top-[20vh] z-[101] w-full max-w-lg -translate-x-1/2
                       glass rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
          >
            {/* Search bar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8">
              <Search size={16} className="text-muted-foreground shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands, projects, sections…"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={14} />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                  No results for &ldquo;{query}&rdquo;
                </p>
              ) : (
                filtered.map((cmd) => {
                  const Icon = cmd.icon
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => runCommand(cmd)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left
                                 hover:bg-white/6 transition-colors duration-100 group"
                    >
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center
                                      bg-white/5 border border-white/8 shrink-0 group-hover:border-white/15">
                        <Icon size={13} className="text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{cmd.label}</p>
                        {'subtitle' in cmd && (cmd as { subtitle?: string }).subtitle && (
                          <p className="text-xs text-muted-foreground truncate">
                            {(cmd as { subtitle?: string }).subtitle}
                          </p>
                        )}
                      </div>
                      <ArrowRight size={12} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  )
                })
              )}
            </div>

            {/* Footer hint */}
            <div className="border-t border-white/8 px-4 py-2 flex gap-3 text-xs text-muted-foreground">
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span>Esc close</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
