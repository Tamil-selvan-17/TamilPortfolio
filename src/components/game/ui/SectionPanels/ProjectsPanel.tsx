'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import projectData from '@/content/projects.json'

const PROJECT_THEMES: Record<string, { icon: string, color: string }> = {
  'vms-platform': { icon: '🏗️', color: '#4ade80' },
  'nedit-platform': { icon: '📝', color: '#60a5fa' },
  'employee-dashboard': { icon: '📊', color: '#f59e0b' }
}

const PROJECTS = projectData.map(p => ({
  slug: p.slug,
  title: p.title,
  subtitle: p.subtitle,
  icon: PROJECT_THEMES[p.slug]?.icon || '💻',
  color: PROJECT_THEMES[p.slug]?.color || '#a855f7',
  stack: p.stack,
  summary: p.summary,
  impact: p.impact.map(i => ({ value: `${i.value}${i.suffix || ''}`, label: i.label })),
  highlights: [p.problem, p.solution].filter(Boolean),
  live: p.links?.live,
  github: p.links?.github,
}))

export function ProjectsPanel() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <div className="space-y-4">
      {PROJECTS.map((project, i) => (
        <motion.div
          key={project.slug}
          className="border rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          style={{ borderColor: project.color + '40', background: `${project.color}08` }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          onClick={() => setActive(active === i ? null : i)}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{project.icon}</span>
              <div>
                <h3 className="text-sm font-bold text-white">{project.title}</h3>
                <p className="text-xs" style={{ color: project.color }}>{project.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Impact badges */}
              {project.impact.map(imp => (
                <div key={imp.label}
                     className="text-center px-2 py-1 rounded-lg bg-black/20"
                     style={{ borderLeft: `2px solid ${project.color}` }}>
                  <p className="text-xs font-black" style={{ color: project.color }}>{imp.value}</p>
                  <p className="text-[9px] text-slate-400">{imp.label}</p>
                </div>
              ))}
              <motion.span
                animate={{ rotate: active === i ? 90 : 0 }}
                className="text-slate-400 ml-1"
              >▶</motion.span>
            </div>
          </div>

          {/* Expanded */}
          <AnimatePresence>
            {active === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-3">
                  <p className="text-xs text-slate-300 leading-relaxed">{project.summary}</p>
                  <ul className="space-y-1">
                    {project.highlights.map(h => (
                      <li key={h} className="text-xs text-slate-400 flex gap-2">
                        <span style={{ color: project.color }}>▸</span> {h}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.map(s => (
                      <span key={s}
                            className="px-2 py-0.5 rounded-md text-[10px] font-mono"
                            style={{ background: project.color + '20', color: project.color }}>
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-1">
                    {project.live
                      ? <a href={project.live} target="_blank" rel="noopener noreferrer"
                           className="px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                           style={{ background: project.color }}>
                          🌐 Live Demo
                        </a>
                      : <span className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 bg-slate-800 border border-slate-700 cursor-not-allowed">
                          🔒 Private
                        </span>
                    }
                    {project.github
                      ? <a href={project.github} target="_blank" rel="noopener noreferrer"
                           className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-700 hover:bg-slate-600 transition-colors">
                          🐙 GitHub
                        </a>
                      : <span className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 bg-slate-800 border border-slate-700 cursor-not-allowed">
                          🔒 Private Repo
                        </span>
                    }
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}
