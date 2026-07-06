'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Mail, Heart } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/shared/BrandIcons'
import { siteConfig } from '@/config/site.config'

const Starfield = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let stars: Star[] = []
    
    // Virtual 3D space size
    const zDepth = 1500

    const resize = () => {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
      initStars()
    }

    class Star {
      x: number
      y: number
      z: number
      size: number

      constructor() {
        this.x = (Math.random() - 0.5) * 2 * canvas!.width
        this.y = (Math.random() - 0.5) * 2 * canvas!.height
        this.z = Math.random() * zDepth
        this.size = Math.random() * 1.5 + 0.5
      }

      update(speed: number) {
        this.z -= speed
        if (this.z <= 0) {
          this.z = zDepth
          this.x = (Math.random() - 0.5) * 2 * canvas!.width
          this.y = (Math.random() - 0.5) * 2 * canvas!.height
        }
      }

      draw(mouseX: number, mouseY: number) {
        if (!ctx) return
        
        // Perspective projection
        const focalLength = 400
        const scale = focalLength / (focalLength + this.z)
        
        // Add parallax based on mouse
        const xProj = (this.x - mouseX) * scale + canvas!.width / 2
        const yProj = (this.y - mouseY) * scale + canvas!.height / 2

        // Fade stars as they go deeper into Z
        const opacity = (1 - this.z / zDepth) * 0.9
        
        ctx.beginPath()
        ctx.arc(xProj, yProj, this.size * scale * 2, 0, Math.PI * 2)
        
        // Mix of white and slightly purple/cyan stars for galaxy feel
        const isCyan = Math.random() > 0.8
        const r = isCyan ? 148 : 255
        const g = isCyan ? 230 : 255
        const b = isCyan ? 251 : 255
        
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`
        ctx.fill()
      }
    }

    const initStars = () => {
      stars = []
      const numberOfStars = Math.floor((canvas!.width * canvas!.height) / 1000)
      for (let i = 0; i < numberOfStars; i++) {
        stars.push(new Star())
      }
    }

    let mouseX = 0
    let mouseY = 0
    let targetMouseX = 0
    let targetMouseY = 0

    const animate = () => {
      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.05
      mouseY += (targetMouseY - mouseY) * 0.05

      // Trail effect to simulate hyperspace speed
      ctx.fillStyle = 'rgba(2, 6, 23, 0.4)' // Very deep slate/black
      ctx.fillRect(0, 0, canvas!.width, canvas!.height)
      
      const speed = 2.5
      
      for (let i = 0; i < stars.length; i++) {
        stars[i].update(speed)
        stars[i].draw(mouseX * 1.5, mouseY * 1.5) // Parallax multiplier
      }
      
      animationFrameId = requestAnimationFrame(animate)
    }

    window.addEventListener('resize', resize)
    
    // Track mouse for parallax center
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      // Mouse relative to center of canvas
      targetMouseX = e.clientX - rect.left - canvas!.width / 2
      targetMouseY = e.clientY - rect.top - canvas!.height / 2
    }
    
    window.addEventListener('mousemove', handleMouseMove)

    resize()
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  )
}

import { usePathname } from 'next/navigation'

export function GalaxyFooter() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const pathname = usePathname()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Very subtle tilt mapping
      const x = (e.clientX / window.innerWidth - 0.5) * 8
      const y = (e.clientY / window.innerHeight - 0.5) * 8
      setMousePos({ x, y })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  if (pathname === '/game') return null

  return (
    <footer className="relative w-full overflow-hidden bg-[#020617] text-white">
      {/* 3D Starfield Background */}
      <Starfield />

      {/* Cosmic Nebula Gradients */}
      <div className="absolute top-[20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-indigo-600/20 blur-[120px] mix-blend-screen pointer-events-none animate-pulse duration-10000" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-fuchsia-600/10 blur-[120px] mix-blend-screen pointer-events-none animate-pulse duration-7000" />
      
      {/* Content wrapper with perspective */}
      <div className="relative z-10 w-full pt-12 md:pt-20 pb-12">
        
        {/* 3D Tilting Container */}
        <motion.div
          animate={{
            rotateX: -mousePos.y,
            rotateY: mousePos.x,
          }}
          transition={{ type: 'spring', stiffness: 75, damping: 20 }}
          className="w-full"
        >
          {/* The ContactCTA is now rendered outside in its own section */}

          <div className="max-w-6xl mx-auto px-6 mt-2 md:mt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 w-full pt-8 md:pt-16 pb-8">
              
              {/* Brand */}
              <div className="text-center md:text-left">
                <p className="font-bold text-white text-lg tracking-wide uppercase">{siteConfig.name}</p>
                <p className="text-xs text-indigo-300 mt-1 uppercase tracking-widest">
                  Full Stack Engineer · Chennai, India
                </p>
              </div>

              {/* Nav */}
              <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-slate-400">
                {siteConfig.nav.map((item: { label: string, href: string }) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Social and Top */}
              <div className="flex items-center gap-6">
                {siteConfig.social.github && (
                  <a
                    href={siteConfig.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white hover:scale-125 transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
                  >
                    <GithubIcon style={{ width: 18, height: 18 }} />
                  </a>
                )}
                {siteConfig.social.linkedin && (
                  <a
                    href={siteConfig.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white hover:scale-125 transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
                  >
                    <LinkedinIcon style={{ width: 18, height: 18 }} />
                  </a>
                )}
                <a
                  href={`mailto:${siteConfig.social.email}`}
                  className="text-slate-400 hover:text-white hover:scale-125 transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
                >
                  <Mail size={20} />
                </a>
              </div>

            </div>
          </div>
        </motion.div>
        
      </div>
    </footer>
  )
}
