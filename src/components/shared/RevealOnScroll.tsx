'use client'

import { motion } from 'framer-motion'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { ReactNode } from 'react'

interface RevealOnScrollProps {
  children: ReactNode
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  delay?: number
  duration?: number
  className?: string
}

export function RevealOnScroll({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  className,
}: RevealOnScrollProps) {
  const reduced = useReducedMotion()
  const { ref, inView, variants } = useScrollReveal({ direction, delay, duration })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduced ? false : 'hidden'}
      animate={reduced ? 'visible' : inView ? 'visible' : 'hidden'}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}
