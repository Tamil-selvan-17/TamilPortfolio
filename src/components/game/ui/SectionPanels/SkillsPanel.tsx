'use client'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import skillsData from '@/content/skills.json'

const CATEGORY_THEMES: Record<string, { icon: string, color: string }> = {
  'Frontend': { icon: '🎨', color: '#60a5fa' },
  'Backend': { icon: '⚙️', color: '#4ade80' },
  'Database & Infra': { icon: '🗄️', color: '#f59e0b' },
  'Tools & AI': { icon: '🤖', color: '#a855f7' }
}

const SKILLS = skillsData.map(cat => ({
  category: cat.category,
  icon: CATEGORY_THEMES[cat.category]?.icon || '💻',
  color: CATEGORY_THEMES[cat.category]?.color || '#ffffff',
  skills: cat.skills
}))

const LEVEL_LABELS = ['', 'Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert']
const STARS = 5

export function SkillsPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {SKILLS.map((group, gi) => (
        <motion.div
          key={group.category}
          className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: gi * 0.08 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{group.icon}</span>
            <h3 className="font-bold text-white text-sm">{group.category}</h3>
          </div>
          <div className="space-y-3">
            {group.skills.map((skill, si) => (
              <div key={skill.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-300 font-medium">{skill.name}</span>
                  <span className="flex items-center gap-0.5" style={{ color: group.color }}>
                    {Array.from({ length: STARS }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < skill.level ? 'currentColor' : 'transparent'}
                        strokeWidth={i < skill.level ? 0 : 2}
                      />
                    ))}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: group.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(skill.level / STARS) * 100}%` }}
                    transition={{ delay: gi * 0.08 + si * 0.05, duration: 0.7, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-right text-[10px] mt-0.5" style={{ color: group.color + '90' }}>
                  {LEVEL_LABELS[skill.level]}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
