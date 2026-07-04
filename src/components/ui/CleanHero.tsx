'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { getProfile } from '@/lib/content'
import { useTypewriter } from '@/hooks/useTypewriter'
import { ChevronDown, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const earthSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
  <path fill="#10b981" d="M100,50 C180,10 250,50 250,100 C250,150 180,180 120,150 C80,130 50,80 100,50 Z"/>
  <path fill="#10b981" d="M200,150 C250,160 280,220 250,300 C220,350 180,300 180,250 C180,200 170,160 200,150 Z"/>
  <path fill="#10b981" d="M380,30 C500,10 700,30 720,100 C740,180 650,180 550,150 C450,120 380,120 380,30 Z"/>
  <path fill="#10b981" d="M400,130 C480,130 500,200 460,280 C420,350 380,250 360,200 C340,150 360,130 400,130 Z"/>
  <path fill="#10b981" d="M600,220 C680,200 700,280 650,320 C600,350 550,300 600,220 Z"/>
  <path fill="#10b981" d="M500,60 C530,50 550,70 520,90 C490,100 480,80 500,60 Z"/>
</svg>`

let earthImage: HTMLImageElement | null = null
if (typeof window !== 'undefined') {
  earthImage = new Image()
  earthImage.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(earthSvg)}`
}

// --- The Cosmic Zoom Engine ---
export const CosmicZoomEngine = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let isDark = document.documentElement.classList.contains('dark')
    let previousTheme = isDark
    let themeTransitionTimer = 0

    const observer = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains('dark')
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    // --- Engine Config ---
    const FOCAL_LENGTH = 800
    let globalZ = -4000 // Start way behind the galaxy
    let currentSpeed = 50
    
    // --- Cinematic State ---
    let loopState: 'journey' | 'parked' | 'explosion' = 'journey'
    let stateTimer = 0
    let asteroid = { x: -6000, y: -3000, z: 6000, active: false }
    let particles: { x: number, y: number, z: number, vx: number, vy: number, vz: number, life: number, decay: number, color: string, type: 'spark' | 'fireball', size: number }[] = []

    // Helper: Gaussian random
    const gaussianRandom = (mean = 0, stdev = 1) => {
      const u = 1 - Math.random()
      const v = Math.random()
      const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
      return z * stdev + mean
    }

    // --- Entity System ---
    type Entity = {
      type: 'star' | 'blackhole' | 'sun' | 'planet' | 'orbitRing'
      x: number
      y: number
      baseZ: number
      size: number
      r: number
      g: number
      b: number
      alphaMultiplier: number
      
      // Orbiting properties
      orbitRadius?: number
      orbitSpeed?: number
      orbitAngle?: number
      orbitCenterZ?: number
    }

    let universe: Entity[] = []

    const initUniverse = () => {
      universe = []

      // --- PHASE 1: THE GALAXY (Centered at Z = 0) ---
      const GALAXY_Z = 0
      const NUM_GALAXY_STARS = window.innerWidth > 768 ? 2000 : 800
      const DISK_RADIUS_MAX = 2000
      const CORE_RADIUS = 300
      
      // Galactic Core (replaces the black hole donut)
      universe.push({
        type: 'blackhole', x: 0, y: 0, baseZ: GALAXY_Z, size: 80,
        r: 255, g: 255, b: 255, alphaMultiplier: 1
      })

      // Galaxy Stars
      for (let i = 0; i < NUM_GALAXY_STARS; i++) {
        const isCore = Math.random() < 0.2
        let x, y, z, r, g, b, size
        
        if (isCore) {
          const radius = Math.abs(gaussianRandom(0, CORE_RADIUS * 0.5))
          const angle = Math.random() * Math.PI * 2
          x = Math.cos(angle) * radius
          y = gaussianRandom(0, CORE_RADIUS * 0.3 * (1 - radius/CORE_RADIUS))
          z = GALAXY_Z + Math.sin(angle) * radius + gaussianRandom(0, 100)
          
          r = 255; g = 200 + Math.random() * 55; b = 100 + Math.random() * 100
          size = Math.random() * 2.5 + 1
        } else {
          // Natural logarithmic spiral distribution
          const radius = CORE_RADIUS + Math.pow(Math.random(), 1.5) * (DISK_RADIUS_MAX - CORE_RADIUS)
          const armAngle = (Math.PI * 2) / 5 // 5 arms for a denser look
          const armIndex = Math.floor(Math.random() * 5)
          
          // Sweeping curved arms
          const tightness = 4.0
          const baseAngle = (Math.pow(radius / DISK_RADIUS_MAX, 0.5) * tightness) + (armIndex * armAngle)
          
          const scatter = gaussianRandom(0, 0.15 + (radius / DISK_RADIUS_MAX) * 0.2) // Tighter scatter for defined arms
          const finalAngle = baseAngle + scatter
          
          x = Math.cos(finalAngle) * radius
          y = gaussianRandom(0, 20 + (radius / DISK_RADIUS_MAX) * 30)
          z = GALAXY_Z + Math.sin(finalAngle) * radius + gaussianRandom(0, 100)
          
          if (Math.random() > 0.5) {
            r = 16; g = 185; b = 129 // Emerald
          } else {
            r = 14; g = 165; b = 233 // Cyan
          }
          size = Math.random() * 1.5 + 0.5
        }
        
        universe.push({
          type: 'star', x, y, baseZ: z, size, r, g, b, alphaMultiplier: Math.random() * 0.5 + 0.5
        })
      }

      // --- PHASE 2: LOCAL SOLAR SYSTEM (Centered at Z = 6000) ---
      const SOLAR_Z = 6000
      
      // The Sun
      universe.push({
        type: 'sun', x: 0, y: 0, baseZ: SOLAR_Z, size: 250,
        r: 255, g: 220, b: 150, alphaMultiplier: 1
      })

      // Planets
      const planets = [
        { radius: 600, speed: 0.01, size: 15, r: 200, g: 100, b: 50 },    // Mars-like
        { radius: 1000, speed: 0.007, size: 25, r: 50, g: 150, b: 255 },  // Blue-gas giant
        { radius: 1600, speed: 0.004, size: 40, r: 255, g: 200, b: 100 }  // Saturn-like
      ]

      planets.forEach(p => {
        // Orbit Ring
        universe.push({
          type: 'orbitRing', x: 0, y: 0, baseZ: SOLAR_Z, size: p.radius,
          r: 255, g: 255, b: 255, alphaMultiplier: 0.1
        })
        // Planet
        universe.push({
          type: 'planet', x: 0, y: 0, baseZ: SOLAR_Z, size: p.size,
          r: p.r, g: p.g, b: p.b, alphaMultiplier: 1,
          orbitRadius: p.radius, orbitSpeed: p.speed, orbitAngle: Math.random() * Math.PI * 2, orbitCenterZ: SOLAR_Z
        })
      })

      // Background local stars (just to fill the void between phases)
      for(let i=0; i<500; i++) {
        universe.push({
          type: 'star',
          x: gaussianRandom(0, 3000),
          y: gaussianRandom(0, 3000),
          baseZ: SOLAR_Z + gaussianRandom(0, 2000),
          size: Math.random() * 1.5,
          r: 255, g: 255, b: 255, alphaMultiplier: Math.random() * 0.5
        })
      }

      // --- PHASE 3: THE TARGET PLANET (Centered at Z = 13000) ---
      const PLANET_Z = 13000
      
      // Massive Emerald/Earth Planet
      universe.push({
        type: 'planet', x: 0, y: 0, baseZ: PLANET_Z, size: 800, // Scaled down to fit on screen
        r: 14, g: 165, b: 233, alphaMultiplier: 1,
        isTargetPlanet: true
      } as any)
      
      // Background stars behind planet
      for(let i=0; i<300; i++) {
        universe.push({
          type: 'star',
          x: gaussianRandom(0, 4000),
          y: gaussianRandom(0, 4000),
          baseZ: PLANET_Z + 2000 + Math.random() * 2000,
          size: Math.random() * 2,
          r: 255, g: 255, b: 255, alphaMultiplier: Math.random() * 0.5
        })
      }
    }

    const animate = (time: number) => {
      const PLANET_Z = 13000
      const CAMERA_STOP_Z = PLANET_Z - 800 // Stop in front of the planet
      
      if (loopState === 'journey') {
        const targets = [0, 6000, CAMERA_STOP_Z]
        let minDistance = Infinity
        for (const t of targets) {
          const dist = Math.abs(t - globalZ)
          if (dist < minDistance) minDistance = dist
        }
        
        // Speed curve: fast in deep space, slow near targets
        const targetSpeed = Math.max(5, minDistance * 0.01) 
        
        // Smoothly interpolate current speed for buttery acceleration/deceleration
        currentSpeed += (targetSpeed - currentSpeed) * 0.05 
        globalZ += currentSpeed

        // Park at the planet and watch
        if (globalZ >= CAMERA_STOP_Z - 5) {
          globalZ = CAMERA_STOP_Z
          loopState = 'parked'
          stateTimer = 0
        }
      }

      // --- PARKED & ASTEROID PHYSICS ENGINE ---
      if (loopState === 'parked') {
         stateTimer++
         
         // At frame 160 (near the end of the 360 spin), spawn the killer star behind the camera
         if (stateTimer === 160) {
            asteroid = { x: -3000, y: -1000, z: CAMERA_STOP_Z - 1000, active: true }
         }
         
         if (asteroid.active) {
            const dx = 0 - asteroid.x
            const dy = 0 - asteroid.y
            const dz = PLANET_Z - asteroid.z
            const dist = Math.sqrt(dx*dx + dy*dy + dz*dz)
            
            const starSpeed = 80 // Extremely fast!
            if (dist > starSpeed) {
               asteroid.x += (dx/dist) * starSpeed
               asteroid.y += (dy/dist) * starSpeed
               asteroid.z += (dz/dist) * starSpeed
               
               // Emit massive volumetric 3D particle fire trail!
               for(let i=0; i<6; i++) {
                   particles.push({
                       x: asteroid.x + gaussianRandom(0, 10),
                       y: asteroid.y + gaussianRandom(0, 10),
                       z: asteroid.z + gaussianRandom(0, 10),
                       vx: (dx/dist) * starSpeed * 0.15 + gaussianRandom(0, 5), 
                       vy: (dy/dist) * starSpeed * 0.15 + gaussianRandom(0, 5),
                       vz: (dz/dist) * starSpeed * 0.15 + gaussianRandom(0, 5),
                       life: 1.0,
                       decay: 0.02 + Math.random() * 0.04, 
                       color: ['#ffffff', '#fbbf24', '#f97316', '#ef4444'][Math.floor(Math.random() * 4)],
                       type: 'fireball',
                       size: Math.random() * 20 + 10 
                   })
               }
            } else {
               // Impact!
               loopState = 'explosion'
               stateTimer = 0
               // Generate Realistic Splash (Sparks + Fireballs)
               for(let i=0; i<1200; i++) {
                 const isSpark = Math.random() > 0.6
                 particles.push({
                   x: 0, y: 0, z: PLANET_Z,
                   vx: gaussianRandom(0, isSpark ? 180 : 70), // Sparks fly super fast
                   vy: gaussianRandom(0, isSpark ? 180 : 70),
                   vz: gaussianRandom(0, isSpark ? 180 : 70),
                   life: 1.0,
                   decay: isSpark ? (0.015 + Math.random() * 0.02) : (0.003 + Math.random() * 0.01),
                   color: isSpark 
                          ? ['#ffffff', '#fef08a', '#f59e0b'][Math.floor(Math.random() * 3)] // Sparks are white/yellow
                          : ['#fb923c', '#ef4444', '#991b1b', '#10b981', '#0ea5e9'][Math.floor(Math.random() * 5)], // Debris has deeper colors
                   type: isSpark ? 'spark' : 'fireball',
                   size: Math.random() * 20 + 10
                 })
               }
            }
         }
      }

      // --- THEME TOGGLE HANDLER ---
      if (isDark !== previousTheme) {
         themeTransitionTimer = 60
         previousTheme = isDark
      }
      if (themeTransitionTimer > 0) {
         themeTransitionTimer--
      }

      // 2. Clear Canvas with trail
      // Equal opacity (0.25) ensures both themes share the exact same buttery motion blur animation flow!
      ctx.fillStyle = isDark ? 'rgba(3, 7, 18, 0.25)' : 'rgba(250, 250, 249, 0.25)' 
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const cx = canvas.width / 2
      const cy = canvas.height / 2
      let currentFocalLength = 800 // Allow dynamic FOV changes
      
      // Add slight camera wobble
      let wobbleX = Math.sin(time * 0.0005) * 50
      let wobbleY = Math.cos(time * 0.0007) * 30
      
      // 4. Visceral Camera Screen Shake on Impact!
      if (loopState === 'explosion') {
         // Heavy harmonic oscillator shake (Smooth, realistic, physical mass shake)
         const shakeDecay = Math.max(0, 1 - stateTimer / 120)
         const shakeIntensity = Math.pow(shakeDecay, 2) * 150 // Quadratic falloff feels impactful
         
         if (shakeIntensity > 0) {
            // Complex sine wave mixing for unpredictable but smooth shaking
            wobbleX += Math.sin(time * 0.05) * Math.cos(time * 0.02) * shakeIntensity
            wobbleY += Math.cos(time * 0.06) * Math.sin(time * 0.03) * shakeIntensity
            
            // Optical Z-punch (FOV distorts wildly on impact shockwave)
            currentFocalLength -= Math.sin(time * 0.08) * shakeIntensity * 1.5
         }
      }

      // 3. Update & Sort Entities
      const renderList = []
      
      for (const entity of universe) {
        // Update planetary orbits
        if (entity.orbitAngle !== undefined && entity.orbitSpeed !== undefined && entity.orbitRadius !== undefined && entity.orbitCenterZ !== undefined) {
          entity.orbitAngle += entity.orbitSpeed
          
          // 3D Orbital Tilt (approx 25 degrees)
          const tilt = 0.4
          const flatZ = Math.sin(entity.orbitAngle) * entity.orbitRadius
          
          entity.x = Math.cos(entity.orbitAngle) * entity.orbitRadius
          entity.y = -flatZ * tilt // Y shifts based on Z to create the tilt perspective
          entity.baseZ = entity.orbitCenterZ + flatZ
        }

        const currentZ = entity.baseZ - globalZ

        if (currentZ > -FOCAL_LENGTH + 10) { // Frustum Culling
          renderList.push({ ...entity, currentZ })
        }
      }

      renderList.sort((a, b) => b.currentZ - a.currentZ)

      // 4. Render Phase
      for (const item of renderList) {
        const scale = currentFocalLength / (currentFocalLength + item.currentZ)
        const projectedX = cx + (item.x + wobbleX) * scale
        const projectedY = cy + (item.y + wobbleY) * scale
        const projectedSize = Math.max(0, item.size * scale)
        
        // Skip tiny sub-pixel artifacts
        if (projectedSize < 0.1 && item.type !== 'orbitRing') continue

        // Depth fog (fade out in far distance)
        const fogOpacity = Math.max(0, Math.min(1, 1 - (item.currentZ / 6000)))
        let alpha = fogOpacity * item.alphaMultiplier
        
        if (!isDark) alpha = Math.min(1, alpha * 1.5 + 0.1) // Substantially boost alpha visibility in light mode

        if (alpha <= 0) continue

        // Contrast adjustment for light mode (darken the actual RGB values so they pop against white)
        const r = isDark ? item.r : Math.floor(item.r * 0.7)
        const g = isDark ? item.g : Math.floor(item.g * 0.7)
        const b = isDark ? item.b : Math.floor(item.b * 0.7)

        if (item.type === 'blackhole') {
          // Realistic Galactic Core Glow
          const coreYellow = isDark ? '255, 240, 200' : '255, 200, 50'
          const coreOrange = isDark ? '255, 180, 50' : '200, 80, 0' // Deeper orange for light mode
          
          const gradient = ctx.createRadialGradient(projectedX, projectedY, 0, projectedX, projectedY, projectedSize * 12)
          gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`)
          gradient.addColorStop(0.1, `rgba(${coreYellow}, ${alpha * (isDark ? 0.9 : 1.0)})`)
          gradient.addColorStop(0.4, `rgba(${coreOrange}, ${alpha * (isDark ? 0.4 : 0.8)})`)
          gradient.addColorStop(1, `rgba(0, 0, 0, 0)`)
          
          ctx.beginPath()
          ctx.arc(projectedX, projectedY, projectedSize * 12, 0, Math.PI * 2)
          ctx.fillStyle = gradient
          ctx.fill()
        } 
        else if (item.type === 'sun') {
          // Sun Glow
          const gradient = ctx.createRadialGradient(projectedX, projectedY, projectedSize * 0.5, projectedX, projectedY, projectedSize * 3)
          gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`)
          gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${alpha * (isDark ? 0.3 : 0.6)})`)
          gradient.addColorStop(1, 'rgba(0,0,0,0)')
          
          ctx.beginPath()
          ctx.arc(projectedX, projectedY, projectedSize * 3, 0, Math.PI * 2)
          ctx.fillStyle = gradient
          ctx.fill()

          // Sun Core
          ctx.beginPath()
          ctx.arc(projectedX, projectedY, projectedSize, 0, Math.PI * 2)
          ctx.fillStyle = isDark ? '#ffffff' : '#f59e0b' // Use amber core in light mode instead of invisible white
          ctx.fill()
        }
        else if (item.type === 'planet' || item.type === 'star') {
          if ((item as any).isTargetPlanet) {
            // If the massive star has hit and we are in the explosion state, the Earth is DESTROYED. Do not render it!
            if (loopState === 'explosion') continue

            // --- 3D ROTATING EARTH ILLUSION ---
            
            // 1. Base Ocean
            ctx.beginPath()
            ctx.arc(projectedX, projectedY, projectedSize, 0, Math.PI * 2)
            ctx.fillStyle = isDark ? `rgba(14, 165, 233, ${alpha})` : `rgba(2, 132, 199, ${alpha})` // Deeper ocean in light mode
            ctx.fill()
            
            // 2. Moving Continents (Clipped)
            ctx.save()
            ctx.beginPath()
            ctx.arc(projectedX, projectedY, projectedSize, 0, Math.PI * 2)
            ctx.clip()
            
            if (earthImage && earthImage.complete) {
              const mapWidth = projectedSize * 2
              const mapHeight = projectedSize * 2
              
              // Base slow rotation during journey
              let currentOffset = (time * 0.03) % mapWidth
              
              // Fast cinematic 360 spin when parked
              if (loopState === 'parked' || loopState === 'explosion') {
                 // It will rotate exactly 1 full mapWidth over 200 frames
                 const spinProgress = Math.min(1, stateTimer / 200)
                 
                 // Easing function for smooth spin (Ease In Out Cubic)
                 const easeInOut = spinProgress < 0.5 ? 4 * spinProgress * spinProgress * spinProgress : 1 - Math.pow(-2 * spinProgress + 2, 3) / 2
                 
                 currentOffset = (currentOffset + easeInOut * mapWidth) % mapWidth
              }
              
              ctx.globalAlpha = alpha
              ctx.drawImage(earthImage, projectedX - projectedSize - currentOffset, projectedY - projectedSize, mapWidth, mapHeight)
              ctx.drawImage(earthImage, projectedX - projectedSize - currentOffset + mapWidth, projectedY - projectedSize, mapWidth, mapHeight)
              ctx.globalAlpha = 1.0
            }
            
            // 3. Inner Shadow for 3D Volume
            const shadowGradient = ctx.createRadialGradient(
              projectedX - projectedSize * 0.3, projectedY - projectedSize * 0.3, 0,
              projectedX, projectedY, projectedSize
            )
            shadowGradient.addColorStop(0, 'rgba(0,0,0,0)')
            shadowGradient.addColorStop(1, `rgba(0,0,0,${0.6 * alpha})`)
            
            ctx.beginPath()
            ctx.arc(projectedX, projectedY, projectedSize, 0, Math.PI * 2)
            ctx.fillStyle = shadowGradient
            ctx.fill()
            
            // 4. Atmospheric Scattering Halo (Cinematic glowing edge)
            const haloGradient = ctx.createRadialGradient(
               projectedX, projectedY, projectedSize * 0.8, 
               projectedX, projectedY, projectedSize * 1.3
            )
            haloGradient.addColorStop(0, `rgba(56, 189, 248, 0)`)
            haloGradient.addColorStop(0.5, `rgba(56, 189, 248, ${alpha * (isDark ? 0.6 : 0.8)})`)
            haloGradient.addColorStop(1, `rgba(56, 189, 248, 0)`)
            
            ctx.beginPath()
            ctx.arc(projectedX, projectedY, projectedSize * 1.3, 0, Math.PI * 2)
            ctx.fillStyle = haloGradient
            ctx.fill()
            
            ctx.restore()

          } else {
            // Standard static planet/star
            ctx.beginPath()
            ctx.arc(projectedX, projectedY, projectedSize, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
            ctx.fill()
            
            if (item.type === 'planet') {
              ctx.beginPath()
              ctx.arc(projectedX, projectedY, projectedSize * 1.5, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.2})`
              ctx.fill()
            }
          }
        }
        else if (item.type === 'orbitRing') {
          // Genuine 3D ellipse to match the tilted orbital plane
          ctx.beginPath()
          ctx.ellipse(
            projectedX, 
            projectedY, 
            projectedSize, 
            projectedSize * 0.4, // Matches the 3D orbital tilt ratio
            0, 0, Math.PI * 2
          )
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      // --- MASSIVE COMET/STAR RENDER ---
      if (asteroid.active && loopState !== 'explosion') {
        const currentZ = asteroid.z - globalZ
        
        if (currentZ > -currentFocalLength + 10) { // If in front of camera
          const scale = currentFocalLength / (currentFocalLength + currentZ)
          const px = cx + (asteroid.x + wobbleX) * scale
          const py = cy + (asteroid.y + wobbleY) * scale
          
          // 3D Perspective Fire Trail Line
          const trailLength = 8 // Frames of trail history
          // Back-calculate velocity for trail
          const dx = 0 - asteroid.x
          const dy = 0 - asteroid.y
          const dz = PLANET_Z - asteroid.z
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz)
          const vx = (dx/dist) * 80
          const vy = (dy/dist) * 80
          const vz = (dz/dist) * 80
          
          const backX = asteroid.x - vx * trailLength
          const backY = asteroid.y - vy * trailLength
          const backZ = asteroid.z - vz * trailLength
          
          const backCurrentZ = backZ - globalZ
          
          if (backCurrentZ > -currentFocalLength + 10) {
             const backScale = currentFocalLength / (currentFocalLength + backCurrentZ)
             const bpx = cx + (backX + wobbleX) * backScale
             const bpy = cy + (backY + wobbleY) * backScale
             
             ctx.beginPath()
             ctx.moveTo(px, py)
             ctx.lineTo(bpx, bpy)
             ctx.strokeStyle = 'rgba(255, 100, 0, 0.8)'
             ctx.lineWidth = 100 * scale 
             ctx.lineCap = 'round'
             ctx.stroke()
          }

          // Layered Massive Star Head
          ctx.beginPath()
          ctx.arc(px, py, 120 * scale, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(255, 80, 0, 0.8)'
          ctx.fill()
          
          ctx.beginPath()
          ctx.arc(px, py, 70 * scale, 0, Math.PI * 2)
          ctx.fillStyle = '#fbbf24' // Yellow
          ctx.fill()
          
          ctx.beginPath()
          ctx.arc(px, py, 30 * scale, 0, Math.PI * 2)
          ctx.fillStyle = '#ffffff' // White hot core
          ctx.fill()
        }
      }

      // --- 3D PARTICLE ENGINE (Runs every frame) ---
      
      // Using 'source-over' for both themes ensures identical animation flow and physical particle rendering
      ctx.globalCompositeOperation = 'source-over'
      
      // Render Splash Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        
        // Realistic Friction/Drag (particles slow down rapidly, creating a shockwave sphere)
        p.vx *= 0.92
        p.vy *= 0.92
        p.vz *= 0.92
        
        p.x += p.vx
        p.y += p.vy
        p.z += p.vz
        p.life -= p.decay
        
        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }
        
        const pZ = p.z - globalZ
        if (pZ < -currentFocalLength) continue
        
        const scale = currentFocalLength / (currentFocalLength + pZ)
        const px = cx + (p.x + wobbleX) * scale
        const py = cy + (p.y + wobbleY) * scale
        
        ctx.globalAlpha = Math.max(0, p.life)
        
        if (p.type === 'spark') {
           // Sparks are fast, stretching lines
           ctx.beginPath()
           ctx.moveTo(px, py)
           ctx.lineTo(px - p.vx * scale * 2, py - p.vy * scale * 2)
           ctx.strokeStyle = p.color
           ctx.lineWidth = 4 * scale
           ctx.stroke()
        } else {
           // Fireballs expand slightly as they cool/die
           ctx.beginPath()
           ctx.arc(px, py, p.size * scale * (2 - p.life), 0, Math.PI * 2) 
           ctx.fillStyle = p.color
           ctx.fill()
        }
      }
        
      if (loopState === 'explosion') {
        stateTimer++
        
        // Realistic Expanding Shockwave Ring
        if (stateTimer < 80) {
           const shockZ = PLANET_Z - globalZ
           if (shockZ > -currentFocalLength) {
              const scale = currentFocalLength / (currentFocalLength + shockZ)
              const px = cx + wobbleX * scale
              const py = cy + wobbleY * scale
              
              ctx.beginPath()
              ctx.arc(px, py, stateTimer * 80 * scale, 0, Math.PI * 2) // Ring expands super fast
              ctx.strokeStyle = `rgba(255, 200, 100, ${1 - stateTimer/80})`
              ctx.lineWidth = 20 * scale
              ctx.stroke()
           }
        }
        
        ctx.globalCompositeOperation = 'source-over' // Reset blend mode!
        ctx.globalAlpha = 1.0
        
        // Blinding Impact Flash
        if (stateTimer < 50) {
          ctx.fillStyle = `rgba(255, 255, 255, ${1 - stateTimer/50})`
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
        
        // Seamlessly Reset Loop (Waits longer to watch the dust settle)
        if (stateTimer > 250) { 
           loopState = 'journey'
           globalZ = -4000
           currentSpeed = 50
           particles = []
           asteroid = { x: -6000, y: -3000, z: 6000, active: false } // Reset asteroid for next loop
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initUniverse()
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Initialize sizes and universe
    requestAnimationFrame(animate)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-stone-50 dark:bg-[#030712] transition-colors duration-700">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  )
}

// --- Main Hero Component ---
export default function CleanHero() {
  const profile = getProfile()
  const typingText = useTypewriter(['Building the Future.', 'Crafting Premium UX.', 'Engineering Scale.', 'Transforming Vision.'], 75, 40, 2500)

  return (
    <section className="relative w-full min-h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-stone-50 dark:bg-[#030712]">
      
      {/* Local Realtime 3D Cosmic Zoom Simulation */}
      <CosmicZoomEngine />

      {/* Main Content Container */}
      <div className="w-full max-w-5xl mx-auto px-6 relative z-10 flex flex-col items-center text-center mt-[-5vh] pointer-events-none">
        
        {/* Subtle Frosted Backing to guarantee perfect readability over the realtime physics */}
        <div className="absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-[100px] pointer-events-none -z-10 scale-150 mask-image-[radial-gradient(ellipse_at_center,black_0%,transparent_70%)]" style={{ WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, transparent 60%)' }} />

        {/* Availability Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-stone-200/50 dark:border-slate-700/50 shadow-2xl mb-10 pointer-events-auto hover:scale-105 transition-transform cursor-default"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)] animate-pulse" />
          <span className="text-xs font-bold tracking-[0.2em] text-stone-700 dark:text-slate-300 uppercase">
            {profile.availability?.label || "Available for impact"}
          </span>
        </motion.div>

        {/* The Copywriting Hook */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="relative pointer-events-auto w-full"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[90px] font-black tracking-tight leading-[1.05] font-[family-name:var(--font-space-grotesk)] text-stone-900 dark:text-white drop-shadow-xl">
            <span className="block opacity-95">ARCHITECTING</span>
            <span className="block opacity-95">THE IMPOSSIBLE.</span>
          </h1>
          
          <div className="mt-6 min-h-[1.5em] flex justify-center items-center">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-cyan-400 dark:to-blue-500">
              {typingText}<span className="text-stone-900 dark:text-white animate-[pulse_1s_ease-in-out_infinite] font-light">|</span>
            </span>
          </div>
        </motion.div>

        {/* Inspiring Subtext */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
          className="mt-8 text-lg sm:text-xl md:text-2xl text-stone-600 dark:text-slate-300 max-w-3xl text-center font-light leading-relaxed px-4"
        >
          Pushing the boundaries of what's possible on the web. I am <strong className="font-semibold text-stone-900 dark:text-white">{profile.name}</strong>, a visionary Full Stack Engineer crafting digital masterpieces that redefine user experience and scale infinitely.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center gap-6 mt-14 w-full sm:w-auto pointer-events-auto"
        >
          <Link 
            href="#projects" 
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-2 group"
          >
            <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
            Explore Experiences
          </Link>
          <Link 
            href="#contact" 
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl text-stone-900 dark:text-white font-semibold hover:bg-white dark:hover:bg-slate-700 transition-all border border-stone-200 dark:border-slate-700 shadow-lg flex items-center justify-center gap-2 group"
          >
            Start a Conversation
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </div>

      {/* Scroll Hint */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-stone-400 dark:text-slate-500 z-10 pointer-events-none"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Discover</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }} 
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </motion.div>

    </section>
  )
}
