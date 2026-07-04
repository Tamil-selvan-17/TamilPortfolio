'use client'

import { useRef } from 'react'
import { useScroll, useTransform, MotionValue } from 'framer-motion'
import { useReducedMotion } from './useReducedMotion'

interface ParallaxResult {
  ref: React.RefObject<HTMLDivElement | null>
  y: MotionValue<string>
}

/**
 * Returns a scroll-linked vertical offset for parallax transforms.
 * `speed` of 0.2 = gentle, 0.5 = noticeable, 1 = full.
 */
export function useParallax(speed = 0.2): ParallaxResult {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const factor = reduced ? 0 : speed * 100

  const y = useTransform(scrollYProgress, [0, 1], [`-${factor}px`, `${factor}px`])

  return { ref, y }
}
