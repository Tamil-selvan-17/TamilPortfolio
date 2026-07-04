'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

interface CountUpOptions {
  end: number
  duration?: number
  decimals?: number
}

interface CountUpResult {
  count: number
  ref: React.RefObject<HTMLDivElement | null>
}

/**
 * Animates a number from 0 to `end` when it scrolls into view.
 * Uses IntersectionObserver + RAF for smooth easing.
 */
export function useCountUp({ end, duration = 2, decimals = 0 }: CountUpOptions): CountUpResult {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (reduced) {
      setCount(end)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        const startTime = performance.now()
        const durationMs = duration * 1000

        function frame(now: number) {
          const elapsed = now - startTime
          const progress = Math.min(elapsed / durationMs, 1)
          // Ease out quart
          const eased = 1 - Math.pow(1 - progress, 4)
          const value = eased * end
          setCount(parseFloat(value.toFixed(decimals)))
          if (progress < 1) requestAnimationFrame(frame)
        }

        requestAnimationFrame(frame)
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration, decimals, reduced])

  return { count, ref }
}
