'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'

export function CyberGrid() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Glow aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-[#ff00ff]/10 blur-[100px]" />
      
      {/* Perspective Grid */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(transparent 0%, #ff00ff 2%, transparent 3%),
            linear-gradient(90deg, transparent 0%, #ff00ff 2%, transparent 3%)
          `,
          backgroundSize: '60px 60px',
          backgroundPosition: 'center',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'bottom',
          opacity: 0.15,
          maskImage: 'linear-gradient(to bottom, transparent 10%, black 80%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 10%, black 80%)',
        }}
      >
        {/* Animated overlay to simulate forward movement */}
        {!shouldReduceMotion && (
          <div 
            className="absolute inset-0 animate-[grid-move_2s_linear_infinite]"
            style={{
              backgroundImage: 'linear-gradient(transparent 0%, #ff00ff 2%, transparent 3%)',
              backgroundSize: '100% 60px',
            }}
          />
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes grid-move {
          0% { transform: translateY(0); }
          100% { transform: translateY(60px); }
        }
      `}} />
    </div>
  )
}
