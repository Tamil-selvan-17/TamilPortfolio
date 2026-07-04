'use client'

import { useInView, Variants } from 'framer-motion'
import { useRef } from 'react'

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none'

interface ScrollRevealOptions {
  direction?: RevealDirection
  delay?: number
  duration?: number
  once?: boolean
  amount?: number
}

interface ScrollRevealResult {
  ref: React.RefObject<HTMLDivElement | null>
  inView: boolean
  variants: Variants
}

const OFFSET: Record<RevealDirection, { x?: number; y?: number }> = {
  up:    { y: 32 },
  down:  { y: -32 },
  left:  { x: 32 },
  right: { x: -32 },
  none:  {},
}

/**
 * Provides ref, inView status, and Framer Motion variants for scroll-reveal animations.
 */
export function useScrollReveal({
  direction = 'up',
  delay = 0,
  duration = 0.6,
  once = true,
  amount = 0.2,
}: ScrollRevealOptions = {}): ScrollRevealResult {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, amount })

  const offset = OFFSET[direction]

  const variants: Variants = {
    hidden: { opacity: 0, ...offset },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return { ref, inView, variants }
}
