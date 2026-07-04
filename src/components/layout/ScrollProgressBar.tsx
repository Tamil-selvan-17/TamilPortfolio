'use client'

import { useEffect, useRef } from 'react'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { siteConfig } from '@/config/site.config'

export function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null)
  const { progress } = useScrollProgress(Object.values(siteConfig.sections))

  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.width = `${progress * 100}%`
    }
  }, [progress])

  return (
    <div
      ref={barRef}
      className="scroll-progress pointer-events-none"
      style={{ width: '0%' }}
      aria-hidden="true"
    />
  )
}
