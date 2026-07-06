'use client'
import { motion } from 'framer-motion'

import expData from '@/content/experience.json'

const EXP_ICONS = ['🚀', '⚡', '🗄️', '🔐', '🔴', '🐳', '☁️', '🤖', '⚙️', '👥']

export function ExperiencePanel() {
  return (
    <div className="space-y-6">
      {expData.map((exp, expIndex) => {
        const start = new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        const end = exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'
        
        return (
          <div key={exp.id || expIndex} className="space-y-6">
            {/* Header */}
            <motion.div
              className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-5"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black text-white">{exp.role}</h3>
                  <p className="text-amber-400 font-semibold">{exp.company}</p>
                  <p className="text-slate-400 text-sm flex items-center gap-1.5 mt-1">
                    <span>📍 {exp.location}</span>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-500/10 border border-green-500/30">
                    {!exp.endDate && <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />}
                    <span className="text-green-400 text-xs font-bold">{start} — {end}</span>
                  </div>
                  <p className="text-slate-500 text-xs mt-1">{exp.progression.join(' → ')}</p>
                </div>
              </div>
            </motion.div>

            {/* Timeline */}
            <div className="relative pl-6 border-l-2 border-slate-700 space-y-4">
              {exp.highlights.map((h, i) => {
                const icon = EXP_ICONS[i % EXP_ICONS.length]
                return (
                  <motion.div
                    key={i}
                    className="relative"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <div className="absolute -left-[25px] top-1 w-3.5 h-3.5 rounded-full border-2 border-amber-500 bg-slate-900" />
                    <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-3">
                      <p className="text-sm text-slate-300 leading-relaxed">
                        <span className="mr-2">{icon}</span>{h.text}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Stack */}
            <div className="flex flex-wrap gap-2 pt-2">
              {exp.techStack.map(s => (
                <span key={s} className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 font-mono">
                  {s}
                </span>
              ))}
            </div>
            
            {/* Divider if not last item */}
            {expIndex < expData.length - 1 && <hr className="border-slate-800 my-8" />}
          </div>
        )
      })}
    </div>
  )
}
