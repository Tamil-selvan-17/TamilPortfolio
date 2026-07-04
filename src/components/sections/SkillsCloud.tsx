'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { GradientText } from '@/components/shared/GradientText'
import { RevealOnScroll } from '@/components/shared/RevealOnScroll'
import type { SkillGroup } from '@/types/content'
import { Monitor, Server, Database, Cloud, Wrench } from 'lucide-react'

const ICON_MAP: Record<string, typeof Monitor> = {
  Monitor, Server, Database, Cloud, Wrench,
}

interface Props {
  skills: SkillGroup[]
}

function SkillBar({ name, level, yearsUsed }: { name: string; level: number; yearsUsed?: number }) {
  return (
    <div className="group relative">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium">{name}</span>
        {yearsUsed && (
          <span className="text-xs text-muted-foreground">{yearsUsed}yr{yearsUsed !== 1 ? 's' : ''}</span>
        )}
      </div>
      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full gradient-bg"
          initial={{ width: 0 }}
          whileInView={{ width: `${(level / 5) * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  )
}

export function SkillsCloud({ skills }: Props) {
  const [activeCategory, setActiveCategory] = useState(skills[0]?.category ?? '')
  const current = skills.find((g) => g.category === activeCategory)

  return (
    <section id="skills" className="py-20 px-6 md:px-8">
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          label="Skills"
          headline={
            <>
              The{' '}
              <GradientText>tech</GradientText>{' '}
              I live in
            </>
          }
          subtext="Tools and technologies I've used in production — not just tutorials."
          className="mb-12"
        />

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {skills.map((group) => {
            const Icon = ICON_MAP[group.icon] ?? Monitor
            const isActive = group.category === activeCategory
            return (
              <button
                key={group.category}
                onClick={() => setActiveCategory(group.category)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                            border transition-all duration-200 ${
                  isActive
                    ? 'gradient-bg text-white border-transparent shadow-lg shadow-indigo-500/20'
                    : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/8 hover:text-foreground'
                }`}
              >
                <Icon size={14} />
                {group.category}
              </button>
            )
          })}
        </div>

        {/* Skill bars */}
        <AnimatePresence mode="wait">
          {current && (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="glass rounded-2xl p-6 md:p-8"
            >
              <div className="grid md:grid-cols-2 gap-5">
                {current.skills.map((skill, i) => (
                  <RevealOnScroll key={skill.name} direction="none" delay={i * 0.04}>
                    <SkillBar {...skill} />
                  </RevealOnScroll>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
