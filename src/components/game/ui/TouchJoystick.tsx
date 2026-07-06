'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

interface Props {
  onMove: (dx: number, dy: number) => void
}

export function TouchJoystick({ onMove }: Props) {
  const baseRef   = useRef<HTMLDivElement>(null)
  const [knob, setKnob] = useState({ x: 0, y: 0 })
  const touchId   = useRef<number | null>(null)
  const MAX_DIST  = 44

  const handleStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.changedTouches[0]
    touchId.current = touch.identifier
  }, [])

  const handleMove = useCallback((e: TouchEvent) => {
    if (touchId.current === null || !baseRef.current) return
    e.preventDefault()
    let t: Touch | null = null
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchId.current) {
        t = e.changedTouches[i]
        break
      }
    }
    if (!t) return
    const rect = baseRef.current.getBoundingClientRect()
    const cx   = rect.left + rect.width / 2
    const cy   = rect.top  + rect.height / 2
    const dx   = t.clientX - cx
    const dy   = t.clientY - cy
    const dist = Math.hypot(dx, dy)
    const clamp = Math.min(dist, MAX_DIST)
    const nx    = (dx / dist) * clamp
    const ny    = (dy / dist) * clamp
    setKnob({ x: nx, y: ny })
    onMove(nx / MAX_DIST, ny / MAX_DIST)
  }, [onMove])

  const handleEnd = useCallback(() => {
    touchId.current = null
    setKnob({ x: 0, y: 0 })
    onMove(0, 0)
  }, [onMove])

  useEffect(() => {
    window.addEventListener('touchmove', handleMove, { passive: false })
    window.addEventListener('touchend', handleEnd)
    return () => {
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', handleEnd)
    }
  }, [handleMove, handleEnd])

  return (
    <div
      ref={baseRef}
      onTouchStart={handleStart}
      className="absolute bottom-12 left-6 w-24 h-24 md:bottom-8 md:left-8 rounded-full
                 bg-white/10 border-2 border-white/30 backdrop-blur-sm
                 flex items-center justify-center touch-none select-none"
      style={{ zIndex: 150 }}
    >
      <div
        className="w-10 h-10 rounded-full bg-white/60 border-2 border-white/80 shadow-lg"
        style={{ transform: `translate(${knob.x}px, ${knob.y}px)`, transition: 'transform 0.02s' }}
      />
    </div>
  )
}
