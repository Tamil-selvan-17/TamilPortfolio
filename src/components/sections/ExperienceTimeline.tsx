'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { RevealOnScroll } from '@/components/shared/RevealOnScroll'
import { GradientText } from '@/components/shared/GradientText'
import { formatDateRange } from '@/lib/date-utils'
import type { ExperienceEntry } from '@/types/content'
import { Building2, MapPin, TrendingUp, CheckCircle } from 'lucide-react'

interface Props {
  experience: ExperienceEntry[]
}

function TimelineNode({ entry, index }: { entry: ExperienceEntry; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <div ref={ref} className="relative pl-8 md:pl-12">
      {/* Timeline dot */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: index * 0.1 + 0.2, type: 'spring', bounce: 0.5 }}
        className="absolute left-0 top-6 w-4 h-4 rounded-full gradient-bg
                   shadow-lg shadow-indigo-500/40 z-10"
      />

      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: index * 0.1 + 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass rounded-2xl p-6 mb-6 card-glow"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-bold">{entry.role}</h3>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="flex items-center gap-1.5 text-sm font-medium text-indigo-400">
                <Building2 size={13} />
                {entry.company}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin size={12} />
                {entry.location}
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatDateRange(entry.startDate, entry.endDate)}
            </span>
            {!entry.endDate && (
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400 font-medium">Current</span>
              </div>
            )}
          </div>
        </div>

        {/* Progression */}
        {entry.progression && entry.progression.length > 0 && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <TrendingUp size={13} className="text-muted-foreground shrink-0" />
            {entry.progression.map((level, i) => (
              <span key={level} className="flex items-center gap-1.5">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border ${
                    i === entry.progression!.length - 1
                      ? 'gradient-bg text-white border-transparent'
                      : 'bg-white/5 border-white/10 text-muted-foreground'
                  }`}
                >
                  {level}
                </span>
                {i < entry.progression!.length - 1 && (
                  <span className="text-muted-foreground">→</span>
                )}
              </span>
            ))}
          </div>
        )}

        {/* Highlights */}
        <ul className="space-y-2.5 mb-4">
          {entry.highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-2.5 group">
              <CheckCircle
                size={14}
                className="text-indigo-400 mt-0.5 shrink-0"
              />
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {h.text}
                {h.metric && (
                  <span className="ml-1.5 inline-flex items-center">
                    <span className="tech-badge active text-xs">
                      {h.metric.value}{h.metric.suffix} {h.metric.label}
                    </span>
                  </span>
                )}
              </p>
            </li>
          ))}
        </ul>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5">
          {entry.techStack.map((tech) => (
            <span key={tech} className="tech-badge">{tech}</span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export function ExperienceTimeline({ experience }: Props) {
  const lineRef = useRef<SVGPathElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const lineInView = useInView(containerRef, { once: true, amount: 0.05 })

  return (
    <section id="experience" className="py-20 px-6 md:px-8">
      <div className="max-w-3xl mx-auto">
        <SectionHeader
          label="Experience"
          headline={
            <>
              Where I&apos;ve been{' '}
              <GradientText>building</GradientText>
            </>
          }
          subtext="4+ years of shipping production software — here's the full story."
          className="mb-14"
        />

        <div ref={containerRef} className="relative">
          {/* Animated vertical line */}
          <div className="absolute left-1.5 md:left-5 top-6 bottom-6 w-px overflow-hidden">
            <motion.div
              initial={{ scaleY: 0 }}
              animate={lineInView ? { scaleY: 1 } : {}}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              style={{ originY: 0 }}
              className="w-full h-full gradient-bg opacity-40"
            />
          </div>

          {/* Entries */}
          {experience.map((entry, i) => (
            <TimelineNode key={entry.id} entry={entry} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
