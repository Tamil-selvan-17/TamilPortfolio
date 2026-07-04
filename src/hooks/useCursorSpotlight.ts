'use client'

import { useCallback, useRef } from 'react'
import { useReducedMotion } from './useReducedMotion'

interface SpotlightResult {
  containerRef: React.RefObject<HTMLDivElement | null>
  onMouseMove: (e: React.MouseEvent) => void
  onMouseLeave: () => void
}

/**
 * Tracks cursor position within a card, exposing it as CSS custom properties
 * `--mouse-x` and `--mouse-y` (as percentages) for a radial gradient spotlight.
 * Usage in CSS: background: radial-gradient(circle at var(--mouse-x) var(--mouse-y), ...)
 */
export function useCursorSpotlight(): SpotlightResult {
  const containerRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduced || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      containerRef.current.style.setProperty('--mouse-x', `${x}%`)
      containerRef.current.style.setProperty('--mouse-y', `${y}%`)
      containerRef.current.style.setProperty('--spotlight-opacity', '1')
    },
    [reduced]
  )

  const onMouseLeave = useCallback(() => {
    if (!containerRef.current) return
    containerRef.current.style.setProperty('--spotlight-opacity', '0')
  }, [])

  return { containerRef, onMouseMove, onMouseLeave }
}
