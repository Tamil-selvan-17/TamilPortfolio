'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ExperienceEntry } from '@/types/content'
import { formatDateRange } from '@/lib/date-utils'

export function OrganicExperience({ experience }: { experience: ExperienceEntry[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  })

  // The glowing "vine" height
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section id="experience" className="relative pt-40 pb-20 min-h-screen" ref={containerRef}>
      
      {/* Background Matrix Rain for the deep forest transition */}
      <div className="absolute inset-0 pointer-events-none -z-10 bg-gradient-to-b from-transparent via-white to-white dark:via-slate-950 dark:to-slate-950 opacity-90" />
      
      {/* Background massive scrolling text */}
      <div className="absolute inset-0 flex flex-col justify-around overflow-hidden pointer-events-none opacity-10 dark:opacity-5 select-none -z-20">
        <motion.h2 
          initial={{ x: "-20%" }}
          whileInView={{ x: "10%" }}
          transition={{ duration: 25, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
          className="text-[20vw] font-bold whitespace-nowrap text-emerald-700 dark:text-blue-400"
        >
          EXPERIENCE • CAREER •
        </motion.h2>
        <motion.h2 
          initial={{ x: "10%" }}
          whileInView={{ x: "-20%" }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
          className="text-[20vw] font-bold whitespace-nowrap text-emerald-700 dark:text-blue-400"
        >
          JOURNEY • ROLES •
        </motion.h2>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative">
        <motion.h2 
          className="text-5xl md:text-7xl font-bold mb-32 text-center text-emerald-700 dark:text-blue-400 tracking-widest font-[family-name:var(--font-space-grotesk)] opacity-80"
        >
          EXPERIENCE
        </motion.h2>

        <div className="relative">
          {/* The glowing central root/vine */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-emerald-700 dark:bg-blue-400/20 -translate-x-1/2" />
          <motion.div 
            className="absolute left-8 md:left-1/2 top-0 w-[2px] bg-emerald-700 dark:bg-blue-400 -translate-x-1/2 shadow-emerald-700/50 dark:shadow-blue-600/50"
            style={{ height: lineHeight }}
          />

          {experience.map((job, idx) => {
            const isEven = idx % 2 === 0
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, ease: 'easeOut', staggerChildren: 0.2 }}
                className={`relative flex items-center ${idx === experience.length - 1 ? 'mb-0' : 'mb-32 md:mb-48'} ${isEven ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Node on the vine */}
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-stone-900 dark:bg-slate-950 border-2 border-emerald-700 dark:border-blue-400 -translate-x-1/2 shadow-[0_0_15px_rgba(4,120,87,0.5)] dark:shadow-[0_0_15px_rgba(37,99,235,0.5)] z-10" 
                />

                <div className={`ml-16 md:ml-0 md:w-1/2 ${isEven ? 'md:pl-16' : 'md:pr-16 text-left md:text-right'}`}>
                  <div className="terminal-text text-xs text-emerald-700 dark:text-blue-400/70 mb-4 tracking-[0.2em]">{formatDateRange(job.startDate, job.endDate)}</div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-2 text-stone-900 dark:text-white font-[family-name:var(--font-space-grotesk)]">{job.role}</h3>
                  <div className="text-xl text-emerald-700 dark:text-blue-400 mb-6 italic">{job.company} <span className="text-sm text-stone-500 dark:text-slate-500 not-italic ml-2">{job.location}</span></div>
                  
                  <div className="space-y-4">
                    {job.highlights?.map((highlight, hIdx) => (
                      <motion.p 
                        key={hIdx} 
                        initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 + (hIdx * 0.1) }}
                        className="text-stone-600 dark:text-slate-400 text-sm md:text-base leading-relaxed"
                      >
                        {highlight.text}
                        {highlight.metric && (
                          <span className="ml-2 text-emerald-700 dark:text-blue-400 font-bold inline-block">
                            [{highlight.metric.value}{highlight.metric.suffix} {highlight.metric.label}]
                          </span>
                        )}
                      </motion.p>
                    ))}
                  </div>

                  <div className={`flex flex-wrap gap-3 mt-8 ${isEven ? 'md:justify-start' : 'md:justify-end'}`}>
                    {job.techStack?.map((skill) => (
                      <span key={skill} className="text-emerald-700 dark:text-blue-400 text-xs uppercase tracking-widest border border-emerald-700 dark:border-blue-400/30 px-3 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
