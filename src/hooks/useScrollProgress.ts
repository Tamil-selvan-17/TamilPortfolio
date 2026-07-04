'use client'

import { useCallback, useEffect, useState } from 'react'

interface ScrollProgressResult {
  /** 0–1 scroll progress for the progress bar */
  progress: number
  /** The section id that is currently in the viewport */
  activeSection: string | null
}

/**
 * Tracks scroll progress (0–1) and which section is currently active.
 * Active section is determined by which section's top is closest to 20% from the viewport top.
 */
export function useScrollProgress(sectionIds: string[]): ScrollProgressResult {
  const [progress, setProgress] = useState(0)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const updateProgress = useCallback(() => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    setProgress(docHeight > 0 ? scrollTop / docHeight : 0)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()
    return () => window.removeEventListener('scroll', updateProgress)
  }, [updateProgress])

  useEffect(() => {
    const observers = sectionIds.map((id) => {
      const el = document.getElementById(id)
      if (!el) return null

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
      )
      observer.observe(el)
      return observer
    })

    return () => observers.forEach((o) => o?.disconnect())
  }, [sectionIds])

  return { progress, activeSection }
}
