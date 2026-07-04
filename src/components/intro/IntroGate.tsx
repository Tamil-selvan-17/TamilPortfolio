'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getProfile } from '@/lib/content'
import MountainVistaParallax from '@/components/ui/mountain-vista-bg'

// Status messages that type out like a terminal
const INITIALIZATION_STEPS = [
  { label: 'System', value: 'Booting', duration: 600 },
  { label: 'Vision', value: 'Loading', resolveTo: 'Architecting the Impossible', duration: 1000 },
  { label: 'Focus', value: 'Analyzing', resolveTo: 'Next-Gen Web Experiences', duration: 1000 },
  { label: 'Status', value: 'Checking', resolveTo: 'Available for Impact', duration: 800 },
]

export function IntroGate() {
  const profile = getProfile()
  const firstName = profile.name.split(' ')[0] || ''
  const lastName = profile.name.split(' ')[1] || 'Portfolio'
  
  const [isVisible, setIsVisible] = useState(false)
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isReady, setIsReady] = useState(false)
  
  // To avoid hydration mismatch and only show once per session
  useEffect(() => {
    const hasSeen = sessionStorage.getItem('hasSeenIntro')
    if (!hasSeen) {
      setIsVisible(true)
      document.body.style.overflow = 'hidden'
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let currentStep = 0
    let totalTime = 0

    // Sequence the terminal steps
    const timers = INITIALIZATION_STEPS.map((s, i) => {
      totalTime += s.duration
      return setTimeout(() => {
        setStep(i + 1)
      }, totalTime)
    })

    // Start progress ring after terminal steps
    const progressTimer = setTimeout(() => {
      let p = 0
      const pInterval = setInterval(() => {
        p += 2
        setProgress(p)
        if (p >= 100) {
          clearInterval(pInterval)
          setTimeout(() => setIsReady(true), 400)
        }
      }, 20)
      return () => clearInterval(pInterval)
    }, totalTime + 500)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(progressTimer)
    }
  }, [isVisible])

  const handleEnter = () => {
    setIsVisible(false)
    sessionStorage.setItem('hasSeenIntro', 'true')
    document.body.style.overflow = ''
    window.dispatchEvent(new Event('introFinished'))
  }

  if (!isVisible) return null

  const circleRadius = 170
  const circumference = 2 * Math.PI * circleRadius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          onClick={() => { if (isReady) handleEnter() }}
          className={`fixed inset-0 z-[100] flex items-center justify-center bg-stone-50 text-stone-900 overflow-hidden ${isReady ? 'cursor-pointer' : ''}`}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: '-100%' }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Animated Parallax Background */}
          <div className="absolute inset-0 opacity-40 z-0">
            <MountainVistaParallax />
          </div>

          {/* Corner brackets */}
          <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-emerald-600/30" />
          <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-emerald-600/30" />
          <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-emerald-600/30" />
          <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-emerald-600/30" />

          {/* Top Left Terminal HUD */}
          <div className="absolute top-12 left-12 terminal-text text-[10px] sm:text-xs text-emerald-800 flex flex-col gap-2 tracking-widest">
            {INITIALIZATION_STEPS.map((s, i) => (
              <motion.div 
                key={s.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: step > i ? 1 : 0 }}
                className="flex items-center gap-2"
              >
                <span className="text-emerald-600">&gt;</span>
                <span>{s.label}:</span>
                <span className="text-stone-900">
                  {step > i + 1 && s.resolveTo ? s.resolveTo : s.value}
                  {step === i + 1 && !s.resolveTo && <span className="animate-pulse">_</span>}
                  {step === i + 1 && s.resolveTo && <span className="animate-pulse">...</span>}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Bottom Right Copyright HUD */}
          <div className="absolute bottom-12 right-12 terminal-text text-[10px] text-right text-emerald-800 tracking-widest opacity-60">
            <div>{profile.name}</div>
            <div>All Rights Reserved</div>
            <div>Copyright {new Date().getFullYear()}</div>
          </div>

          {/* Main Loader / Gate */}
          <div className="relative flex items-center justify-center">
            
            {/* The circular SVG mask & progress */}
            <motion.div 
              animate={{ opacity: isReady ? 0 : 1, scale: isReady ? 1.1 : 1 }}
              transition={{ duration: 0.8 }}
              className="absolute pointer-events-none flex items-center justify-center"
            >
              <svg width="400" height="400" viewBox="0 0 400 400" className="rotate-[-90deg]">
                {/* Track */}
                <circle 
                  cx="200" cy="200" r={circleRadius} 
                  fill="none" 
                  stroke="currentColor" 
                  className="text-emerald-600/10"
                  strokeWidth="2" 
                  strokeDasharray="4 8" 
                />
                {/* Progress */}
                <circle 
                  cx="200" cy="200" r={circleRadius} 
                  fill="none" 
                  stroke="currentColor"
                  className="text-emerald-600 transition-all duration-75"
                  strokeWidth="2" 
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              {/* Progress Text */}
              <div className="absolute text-center terminal-text tracking-widest text-emerald-700">
                <div className="text-3xl font-light mb-1">{progress}</div>
                <div className="text-[10px] uppercase opacity-70">
                  {progress < 100 ? 'Loading' : 'Connection Established'}
                </div>
              </div>
            </motion.div>

            {/* The "Let's Begin" Gate */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: isReady ? 1 : 0, scale: isReady ? 1 : 0.9 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={`flex flex-col items-center justify-center ${isReady ? 'pointer-events-auto' : 'pointer-events-none'}`}
            >
              <div className="font-[family-name:var(--font-space-grotesk)] text-center uppercase tracking-widest leading-[0.9] mb-12 select-none">
                <div className="text-outline-light text-4xl sm:text-6xl md:text-8xl opacity-80 flex justify-center">
                  {firstName.split('').map((char, i) => (
                    <motion.span
                      key={`f-${i}`}
                      initial={{ opacity: 0, y: 40, scale: 1.2, filter: "blur(10px)" }}
                      animate={isReady ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
                      transition={{ 
                        duration: 1.2, 
                        delay: 0.1 + (i * 0.04), 
                        ease: [0.16, 1, 0.3, 1] 
                      }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
                <div className="text-4xl sm:text-6xl md:text-8xl text-emerald-700 font-bold flex items-center justify-center mt-2">
                  {lastName.split('').map((char, i) => (
                    <motion.span
                      key={`l-${i}`}
                      initial={{ opacity: 0, y: 40, scale: 1.2, filter: "blur(10px)" }}
                      animate={isReady ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
                      transition={{ 
                        duration: 1.2, 
                        delay: 0.1 + (firstName.length * 0.04) + (i * 0.04), 
                        ease: [0.16, 1, 0.3, 1] 
                      }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Corner Button CTA */}
              <button 
                onClick={(e) => { e.stopPropagation(); handleEnter(); }}
                className="group relative px-8 py-4 terminal-text tracking-widest text-sm text-stone-900 hover:text-emerald-700 transition-colors overflow-hidden"
              >
                <div className="relative z-10">Let's Begin <span className="opacity-50 text-[10px] block mt-1">(Or click anywhere)</span></div>
                
                {/* Background glow on hover */}
                <div className="absolute inset-0 bg-emerald-600/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
                
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-emerald-600 transition-all duration-300 group-hover:w-full group-hover:h-full group-hover:opacity-50" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-emerald-600 transition-all duration-300 group-hover:w-full group-hover:h-full group-hover:opacity-50" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-emerald-600 transition-all duration-300 group-hover:w-full group-hover:h-full group-hover:opacity-50" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-emerald-600 transition-all duration-300 group-hover:w-full group-hover:h-full group-hover:opacity-50" />
              </button>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
