'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCursorSpotlight } from '@/hooks/useCursorSpotlight'
import { ExternalLink, ArrowUpRight, Star } from 'lucide-react'
import { GithubIcon } from '@/components/shared/BrandIcons'
import type { Project } from '@/types/content'

interface Props {
  project: Project
  activeFilter?: string | null
}

export function ProjectCard({ project, activeFilter }: Props) {
  const { containerRef, onMouseMove, onMouseLeave } = useCursorSpotlight()
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  function handleMouseMove(e: React.MouseEvent) {
    onMouseMove(e)

    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const cx = rect.width / 2
    const cy = rect.height / 2
    const x = ((e.clientX - rect.left - cx) / cx) * 6
    const y = -((e.clientY - rect.top - cy) / cy) * 4
    setTilt({ x, y })
  }

  function handleMouseLeave() {
    onMouseLeave()
    setTilt({ x: 0, y: 0 })
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-full"
      style={
        {
          '--spotlight-opacity': '0',
          '--mouse-x': '50%',
          '--mouse-y': '50%',
        } as React.CSSProperties
      }
    >
      {/* Spotlight layer */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none z-10 transition-opacity duration-300"
        style={{
          opacity: 'var(--spotlight-opacity)',
          background:
            'radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), rgba(129,140,248,0.08), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <motion.div
        ref={cardRef}
        animate={{ rotateX: tilt.y, rotateY: tilt.x }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ transformStyle: 'preserve-3d', perspective: 800 }}
        className="glass rounded-2xl p-5 h-full flex flex-col card-glow"
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            {project.featured && (
              <span className="inline-flex items-center gap-1 text-xs text-amber-400 mb-1.5">
                <Star size={10} className="fill-amber-400" />
                Featured
              </span>
            )}
            <h3 className="font-bold text-base leading-snug">{project.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{project.subtitle}</p>
          </div>

          {/* Link icons */}
          <div className="flex gap-1.5 shrink-0">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 rounded-lg flex items-center justify-center
                           bg-white/5 border border-white/8 text-muted-foreground
                           hover:text-foreground hover:bg-white/10 transition-all"
                aria-label={`${project.title} GitHub`}
              >
                <GithubIcon style={{ width: 13, height: 13 }} />
              </a>
            )}
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-7 h-7 rounded-lg flex items-center justify-center
                           bg-white/5 border border-white/8 text-muted-foreground
                           hover:text-foreground hover:bg-white/10 transition-all"
                aria-label={`${project.title} live demo`}
              >
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>

        {/* Summary */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
          {project.summary}
        </p>

        {/* Impact pills */}
        {project.impact.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.impact.slice(0, 2).map((imp) => (
              <span
                key={imp.label}
                className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400"
              >
                {imp.value}{imp.suffix} {imp.label}
              </span>
            ))}
          </div>
        )}

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.stack.slice(0, 5).map((tech) => (
            <span
              key={tech}
              className={`tech-badge text-xs ${activeFilter === tech ? 'active' : ''}`}
            >
              {tech}
            </span>
          ))}
          {project.stack.length > 5 && (
            <span className="tech-badge text-xs">+{project.stack.length - 5}</span>
          )}
        </div>

        {/* Case study link */}
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-indigo-400
                     hover:text-indigo-300 transition-colors font-medium"
        >
          Read case study
          <ArrowUpRight size={14} />
        </Link>
      </motion.div>
    </div>
  )
}
