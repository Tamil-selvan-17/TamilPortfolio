'use client'

import { useCallback, useRef } from 'react'
import { useReducedMotion } from './useReducedMotion'

interface MagneticOptions {
  strength?: number   // 0.3 = subtle, 1 = full magnetic
  radius?: number     // activation radius in px
}

interface MagneticResult {
  ref: React.RefObject<HTMLButtonElement | null>
  onMouseMove: (e: React.MouseEvent) => void
  onMouseLeave: () => void
}

/**
 * Applies a subtle magnetic pull effect — button follows the cursor
 * within a given radius. High-end agency-site feel for CTAs.
 */
export function useMagneticButton({ strength = 0.4, radius = 80 }: MagneticOptions = {}): MagneticResult {
  const ref = useRef<HTMLButtonElement>(null)
  const reduced = useReducedMotion()

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduced || !ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance < radius) {
        const factor = (1 - distance / radius) * strength
        ref.current.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`
      }
    },
    [reduced, strength, radius]
  )

  const onMouseLeave = useCallback(() => {
    if (!ref.current) return
    ref.current.style.transform = 'translate(0, 0)'
    ref.current.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
    const reset = () => {
      if (ref.current) ref.current.style.transition = ''
    }
    setTimeout(reset, 500)
  }, [])

  return { ref, onMouseMove, onMouseLeave }
}
