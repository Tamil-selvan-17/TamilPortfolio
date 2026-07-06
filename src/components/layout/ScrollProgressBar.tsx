'use client'

import { useEffect, useRef } from 'react'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { usePathname } from 'next/navigation'
import { siteConfig } from '@/config/site.config'

export function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null)
  const { progress } = useScrollProgress(Object.values(siteConfig.sections))

  const pathname = usePathname()

  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.width = `${progress * 100}%`
    }
  }, [progress])

  if (pathname === '/game') return null

  return (
    <div
      ref={barRef}
      className="scroll-progress pointer-events-none"
      style={{ width: '0%' }}
      aria-hidden="true"
    />
  )
}
