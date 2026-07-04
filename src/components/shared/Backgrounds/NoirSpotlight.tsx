'use client'

import { useCursorSpotlight } from '@/hooks/useCursorSpotlight'

export function NoirSpotlight() {
  const spotlight = useCursorSpotlight()

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-black">
      {/* 
        Interactive flashlight effect that follows the cursor.
        Reveals a subtle texture or gradient underneath.
      */}
      <div 
        ref={spotlight.containerRef}
        onMouseMove={spotlight.onMouseMove}
        onMouseLeave={spotlight.onMouseLeave}
        className="absolute inset-0 z-0 pointer-events-auto"
      >
        <div 
          className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none"
          style={{
            opacity: 1, // Always show the spotlight gradient
            background: 'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.06), transparent 40%)'
          }}
        />
      </div>

      {/* Static noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.04] mix-blend-screen pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
