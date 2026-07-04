'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

/**
 * Cycles through an array of strings with a type → pause → delete → next animation.
 */
export function useTypewriter(
  texts: string[],
  typeSpeed = 75,
  deleteSpeed = 40,
  pauseMs = 2200
): string {
  const [displayText, setDisplayText] = useState('')
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting'>('typing')
  const [currentIdx, setCurrentIdx] = useState(0)
  const reduced = useReducedMotion()

  const tick = useCallback(() => {
    const current = texts[currentIdx]

    if (phase === 'typing') {
      setDisplayText((prev) => {
        const next = current.slice(0, prev.length + 1)
        if (next === current) setPhase('pausing')
        return next
      })
    } else if (phase === 'deleting') {
      setDisplayText((prev) => {
        const next = prev.slice(0, prev.length - 1)
        if (next === '') {
          setCurrentIdx((i) => (i + 1) % texts.length)
          setPhase('typing')
        }
        return next
      })
    }
  }, [phase, currentIdx, texts])

  useEffect(() => {
    if (reduced) {
      setDisplayText(texts[currentIdx])
      return
    }

    if (phase === 'pausing') {
      const timeout = setTimeout(() => setPhase('deleting'), pauseMs)
      return () => clearTimeout(timeout)
    }

    const speed = phase === 'deleting' ? deleteSpeed : typeSpeed
    const timeout = setTimeout(tick, speed)
    return () => clearTimeout(timeout)
  }, [phase, tick, typeSpeed, deleteSpeed, pauseMs, reduced, texts, currentIdx])

  return displayText
}
