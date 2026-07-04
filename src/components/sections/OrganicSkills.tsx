'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { SkillGroup } from '@/types/content'

export function OrganicSkills({ skillsGroups }: { skillsGroups: SkillGroup[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  return (
    <section id="skills" ref={containerRef} className="relative py-32 bg-transparent overflow-hidden">
      
      <div className="max-w-6xl mx-auto px-6 mb-20">
        <motion.h2 
          className="text-3xl md:text-5xl font-bold text-emerald-700 dark:text-blue-400 tracking-widest font-[family-name:var(--font-space-grotesk)] opacity-80"
        >
          SKILL_TREE
        </motion.h2>
      </div>

      <div className="flex flex-col gap-12 md:gap-24">
        {skillsGroups.map((group, idx) => {
          // Alternate direction based on index
          const isEven = idx % 2 === 0
          const xTransform = useTransform(
            scrollYProgress, 
            [0, 1], 
            isEven ? ['-20%', '20%'] : ['20%', '-20%']
          )

          return (
            <div key={idx} className="relative w-full overflow-hidden flex flex-col justify-center min-h-[150px]">
              
              {/* Background massive category text */}
              <motion.div 
                style={{ x: xTransform }}
                className="absolute inset-0 flex items-center whitespace-nowrap pointer-events-none opacity-10 dark:opacity-5 select-none"
              >
                <h3 className="text-[12vw] font-bold text-emerald-700 dark:text-blue-400 leading-none">
                  {group.category.toUpperCase()} • {group.category.toUpperCase()} • {group.category.toUpperCase()}
                </h3>
              </motion.div>

              {/* Foreground floating skills */}
              <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
                <div className="flex flex-wrap gap-4 md:gap-8 justify-center">
                  {group.skills.map((skill, sIdx) => (
                    <motion.div
                      key={sIdx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.5, delay: sIdx * 0.1 }}
                      className="group flex flex-col items-center"
                    >
                      <span className="text-2xl md:text-4xl font-bold text-stone-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-blue-400 transition-colors font-[family-name:var(--font-space-grotesk)]">
                        {skill.name}
                      </span>
                      {/* Skill level indicator */}
                      <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`w-1.5 h-1.5 rounded-full ${i < skill.level ? 'bg-emerald-700 dark:bg-blue-400' : 'bg-stone-300 dark:bg-slate-700'}`}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>
          )
        })}
      </div>
      
    </section>
  )
}
