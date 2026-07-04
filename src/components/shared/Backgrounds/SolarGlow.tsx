'use client'

import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function SolarGlow() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-[#240a08]">
      {/* Sun/Core glow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(255,140,0,0.3) 0%, rgba(220,38,38,0.1) 40%, transparent 70%)',
        }}
      />
      
      {/* Orbiting particles */}
      {!shouldReduceMotion && (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]"
          >
            <div className="absolute top-0 left-1/2 w-4 h-4 rounded-full bg-[#fbbf24] blur-[2px]" />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 35, ease: 'linear' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px]"
          >
            <div className="absolute top-1/4 right-0 w-6 h-6 rounded-full bg-[#ff8c00] blur-[4px]" />
          </motion.div>
        </>
      )}

      {/* Subtle scanlines */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: 'linear-gradient(transparent 50%, #000 50%)',
          backgroundSize: '100% 4px'
        }}
      />
    </div>
  )
}
