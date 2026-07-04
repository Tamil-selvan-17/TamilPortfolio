import type { ReactNode, CSSProperties } from 'react'
import { cn } from '@/lib/utils'

interface GradientTextProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function GradientText({ children, className, style }: GradientTextProps) {
  return (
    <span
      className={cn('gradient-text', className)}
      style={style}
    >
      {children}
    </span>
  )
}
