'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from './useReducedMotion'

/**
 * Initialises a Lenis smooth-scroll instance and integrates it
 * with requestAnimationFrame. Returns the Lenis instance ref.
 * Should be used once in the root layout.
 */
export function useLenis() {
  const lenisRef = useRef<InstanceType<typeof import('lenis')['default']> | null>(null)
  const reduced = useReducedMotion()
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (reduced) return

    let Lenis: typeof import('lenis')['default']

    async function init() {
      const mod = await import('lenis')
      Lenis = mod.default

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
      })

      lenisRef.current = lenis

      function raf(time: number) {
        lenis.raf(time)
        rafRef.current = requestAnimationFrame(raf)
      }

      rafRef.current = requestAnimationFrame(raf)
    }

    init()

    return () => {
      cancelAnimationFrame(rafRef.current)
      lenisRef.current?.destroy()
    }
  }, [reduced])

  return lenisRef
}
