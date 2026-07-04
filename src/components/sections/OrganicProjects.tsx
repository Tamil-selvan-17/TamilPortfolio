'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Project } from '@/types/content'
import { Code, ExternalLink } from 'lucide-react'

export function OrganicProjects({ projects }: { projects: Project[] }) {
  const targetRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end']
  })

  // Translate horizontally based on scroll progress
  const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${100 * (projects.length - 1)}vw`])

  return (
    <section ref={targetRef} id="projects" className="relative h-[300vh] bg-transparent">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        
        <motion.div style={{ x }} className="flex w-full">
          {projects.map((project, index) => (
            <div key={index} className="w-screen h-screen flex-shrink-0 flex flex-col md:flex-row items-center justify-center p-8 relative">
              
              {/* Massive background text */}
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-10 dark:opacity-5 select-none">
                <h2 className="text-[20vw] font-bold whitespace-nowrap text-emerald-700 dark:text-blue-400">
                  {project.title.toUpperCase()}
                </h2>
              </div>

              {/* Foreground content floating */}
              <div className="z-10 w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
                
                {/* Floating Image */}
                  <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                  className="w-full md:w-1/2 relative min-h-[300px] h-auto md:aspect-video p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-emerald-800/50 dark:border-blue-400/20 rounded-xl overflow-hidden bg-emerald-950 dark:bg-slate-900/50 backdrop-blur-sm flex flex-col justify-center mt-12 md:mt-0"
                >
                  <div className="space-y-4 md:space-y-6 z-10 relative">
                    <div>
                      <h4 className="text-emerald-300 dark:text-blue-400 font-bold mb-2 uppercase tracking-widest text-xs">The Problem</h4>
                      <p className="text-stone-100 dark:text-slate-300 text-sm leading-relaxed">{project.problem}</p>
                    </div>
                    <div>
                      <h4 className="text-amber-400 dark:text-cyan-400 font-bold mb-2 uppercase tracking-widest text-xs">The Solution</h4>
                      <p className="text-stone-100 dark:text-slate-300 text-sm leading-relaxed">{project.solution}</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-emerald-600/10 dark:bg-blue-400/5 mix-blend-overlay pointer-events-none" />
                </motion.div>

                {/* Text Content */}
                <div className="w-full md:w-1/2 flex flex-col items-start text-stone-900 dark:text-white">
                  <div className="terminal-text text-emerald-700 dark:text-blue-400 mb-4 text-sm">PROJECT_{index + 1}</div>
                  <h3 className="text-4xl md:text-5xl font-bold mb-2 font-[family-name:var(--font-space-grotesk)]">{project.title}</h3>
                  <h4 className="text-xl text-emerald-700 dark:text-blue-400 mb-6 italic">{project.subtitle}</h4>
                  <p className="text-stone-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
                    {project.summary}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.stack?.map(tag => (
                      <span key={tag} className="text-xs bg-stone-200 text-emerald-800 dark:bg-blue-400/10 dark:text-blue-400 px-3 py-1 rounded font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-6">
                    {project.links?.github && (
                      <a href={project.links.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-stone-500 dark:text-slate-300 hover:text-emerald-700 dark:text-blue-400 transition-colors group">
                        <Code size={20} />
                        <span className="terminal-text text-xs uppercase group-hover:tracking-widest transition-all">Source</span>
                      </a>
                    )}
                    {project.links?.live && (
                      <a href={project.links.live} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-stone-500 dark:text-slate-300 hover:text-emerald-700 dark:text-blue-400 transition-colors group">
                        <ExternalLink size={20} />
                        <span className="terminal-text text-xs uppercase group-hover:tracking-widest transition-all">Live</span>
                      </a>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </motion.div>
        
        {/* Scroll indicator overlay */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-50">
          <span className="terminal-text text-[10px] text-emerald-700 dark:text-blue-400 mb-2 tracking-widest">SCROLL_X</span>
          <div className="w-24 h-px bg-stone-300 dark:bg-white/20 relative">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-emerald-700 dark:bg-blue-400"
              style={{ width: useTransform(scrollYProgress, [0, 1], ['0%', '100%']) }}
            />
          </div>
        </div>

      </div>
    </section>
  )
}
