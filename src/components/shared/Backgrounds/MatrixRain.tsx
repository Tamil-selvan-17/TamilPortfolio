'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (shouldReduceMotion) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const initCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    initCanvas()

    const chars = '01ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ'
    const fontSize = 14
    const columns = canvas.width / fontSize
    const drops: number[] = Array(Math.floor(columns)).fill(1)

    const draw = () => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = 'rgba(1, 23, 13, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#00ff9d'
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        // Make the leading character white sometimes for the authentic matrix look
        if (Math.random() > 0.95) {
          ctx.fillStyle = '#ffffff'
        } else {
          ctx.fillStyle = '#00ff9d'
        }

        ctx.globalAlpha = 0.5
        ctx.fillText(text, x, y)
        ctx.globalAlpha = 1.0

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }

      animationFrameId = requestAnimationFrame(() => {
        setTimeout(draw, 50) // Control speed
      })
    }

    draw()

    window.addEventListener('resize', initCanvas)

    return () => {
      window.removeEventListener('resize', initCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [shouldReduceMotion])

  if (shouldReduceMotion) return null

  return (
    <div className="absolute inset-0 pointer-events-none -z-10 bg-[#01170d]">
      <canvas 
        ref={canvasRef}
        className="w-full h-full opacity-30 mix-blend-screen"
      />
      {/* Gradient mask so the rain fades at the bottom/top */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#01170d] via-transparent to-[#01170d] pointer-events-none" />
    </div>
  )
}
