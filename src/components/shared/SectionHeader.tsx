import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { RevealOnScroll } from './RevealOnScroll'

interface SectionHeaderProps {
  label?: string
  headline: string | ReactNode
  subtext?: string
  className?: string
  align?: 'left' | 'center'
}

export function SectionHeader({
  label,
  headline,
  subtext,
  className,
  align = 'left',
}: SectionHeaderProps) {
  return (
    <div className={cn(align === 'center' && 'text-center', className)}>
      {label && (
        <RevealOnScroll delay={0}>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-indigo-400 mb-3">
            {label}
          </p>
        </RevealOnScroll>
      )}
      <RevealOnScroll delay={0.05}>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{headline}</h2>
      </RevealOnScroll>
      {subtext && (
        <RevealOnScroll delay={0.1}>
          <p className="mt-3 text-muted-foreground max-w-xl leading-relaxed">
            {subtext}
          </p>
        </RevealOnScroll>
      )}
    </div>
  )
}
