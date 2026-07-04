'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { GradientText } from '@/components/shared/GradientText'
import { ProjectCard } from '@/components/project/ProjectCard'
import type { Project } from '@/types/content'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface Props {
  projects: Project[]
}

export function ProjectsGrid({ projects }: Props) {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  // Collect all unique tags
  const allTags = Array.from(new Set(projects.flatMap((p) => p.stack))).sort()

  const filtered = activeTag
    ? projects.filter((p) => p.stack.includes(activeTag))
    : projects

  return (
    <section id="projects" className="py-20 px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <SectionHeader
            label="Projects"
            headline={
              <>
                Things I&apos;ve{' '}
                <GradientText>shipped</GradientText>
              </>
            }
            subtext="Enterprise-grade applications built with Angular, .NET Core, and modern cloud infrastructure."
          />
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300
                       transition-colors shrink-0"
          >
            View all projects
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Tech filter bar */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveTag(null)}
            className={`tech-badge ${activeTag === null ? 'active' : ''}`}
          >
            All
          </button>
          {allTags.slice(0, 12).map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`tech-badge ${activeTag === tag ? 'active' : ''}`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <ProjectCard project={project} activeFilter={activeTag} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm">
            No projects match &quot;{activeTag}&quot; — try a different filter.
          </div>
        )}
      </div>
    </section>
  )
}
