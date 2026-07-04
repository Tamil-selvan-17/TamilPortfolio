import Link from 'next/link'
import { ArrowLeft, ExternalLink, TrendingUp } from 'lucide-react'
import { GithubIcon } from '@/components/shared/BrandIcons'
import { GradientText } from '@/components/shared/GradientText'
import { RevealOnScroll } from '@/components/shared/RevealOnScroll'
import type { Project } from '@/types/content'

interface Props {
  project: Project
}

export function ProjectCaseStudy({ project }: Props) {
  return (
    <article className="max-w-3xl mx-auto px-6 md:px-8 py-20">
      {/* Back link */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground
                   hover:text-foreground transition-colors mb-10"
      >
        <ArrowLeft size={15} />
        All Projects
      </Link>

      {/* Hero */}
      <RevealOnScroll>
        <header className="mb-14">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-indigo-400 mb-3">
            Case Study
          </p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
            {project.title}
          </h1>
          <p className="text-xl text-muted-foreground">{project.subtitle}</p>

          {/* Links */}
          <div className="flex gap-3 mt-6">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl glass text-sm hover:bg-white/10 transition-colors"
              >
                <GithubIcon style={{ width: 14, height: 14 }} />
                Source Code
              </a>
            )}
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl gradient-bg text-white text-sm"
              >
                <ExternalLink size={14} />
                Live Demo
              </a>
            )}
            {!project.links.github && !project.links.live && (
              <span className="text-xs text-muted-foreground italic">
                Internal project — source not publicly available
              </span>
            )}
          </div>
        </header>
      </RevealOnScroll>

      {/* Impact metrics */}
      {project.impact.length > 0 && (
        <RevealOnScroll delay={0.05}>
          <div className="grid grid-cols-3 gap-4 mb-14">
            {project.impact.map((imp) => (
              <div key={imp.label} className="glass rounded-2xl p-4 text-center">
                <p className="text-2xl font-bold gradient-text mb-0.5">
                  {imp.value}{imp.suffix}
                </p>
                <p className="text-xs text-muted-foreground leading-tight">{imp.label}</p>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      )}

      {/* Tech stack */}
      <RevealOnScroll delay={0.08}>
        <div className="mb-12">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Tech Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span key={tech} className="tech-badge">{tech}</span>
            ))}
          </div>
        </div>
      </RevealOnScroll>

      <div className="section-divider mb-12" />

      {/* Problem */}
      <RevealOnScroll delay={0.05}>
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg gradient-bg flex items-center justify-center text-white text-xs font-bold shrink-0">
              1
            </span>
            The Problem
          </h2>
          <p className="text-muted-foreground leading-relaxed">{project.problem}</p>
        </section>
      </RevealOnScroll>

      {/* Solution */}
      <RevealOnScroll delay={0.05}>
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg gradient-bg flex items-center justify-center text-white text-xs font-bold shrink-0">
              2
            </span>
            The Solution
          </h2>
          <p className="text-muted-foreground leading-relaxed">{project.solution}</p>
        </section>
      </RevealOnScroll>

      {/* Summary / impact recap */}
      <RevealOnScroll delay={0.05}>
        <div className="glass rounded-2xl p-6 flex items-start gap-4">
          <TrendingUp size={20} className="text-indigo-400 mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold mb-1">Result</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{project.summary}</p>
          </div>
        </div>
      </RevealOnScroll>
    </article>
  )
}
