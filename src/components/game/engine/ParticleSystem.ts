export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
  type: 'sparkle' | 'leaf' | 'dust' | 'star'
}

export class ParticleSystem {
  private particles: Particle[] = []

  update(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]
      p.x    += p.vx * dt * 0.06
      p.y    += p.vy * dt * 0.06
      p.life -= dt
      p.vy   += 0.02 * dt  // gravity
      if (p.life <= 0) this.particles.splice(i, 1)
    }
  }

  emit(x: number, y: number, type: Particle['type'], count = 8, color = '#fbbf24') {
    for (let i = 0; i < count; i++) {
      const angle  = (Math.PI * 2 * i) / count + Math.random() * 0.5
      const speed  = 1.5 + Math.random() * 2
      this.particles.push({
        x, y,
        vx:      Math.cos(angle) * speed,
        vy:      Math.sin(angle) * speed - 2,
        life:    600 + Math.random() * 400,
        maxLife: 1000,
        color,
        size:    type === 'star' ? 5 : 3 + Math.random() * 3,
        type,
      })
    }
  }

  emitCoin(x: number, y: number)  { this.emit(x, y, 'sparkle', 10, '#fbbf24') }
  emitStar(x: number, y: number)  { this.emit(x, y, 'star',    12, '#a78bfa') }
  emitKey(x: number, y: number)   { this.emit(x, y, 'sparkle', 14, '#34d399') }
  emitAchievement(x: number, y: number) { this.emit(x, y, 'star', 20, '#f472b6') }

  draw(ctx: CanvasRenderingContext2D) {
    for (const p of this.particles) {
      const alpha = Math.max(0, p.life / p.maxLife)
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.fillStyle   = p.color
      if (p.type === 'star') {
        this.drawStar(ctx, p.x, p.y, p.size)
      } else {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.restore()
    }
  }

  private drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
    ctx.beginPath()
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2
      const ir    = r * 0.4
      if (i === 0) ctx.moveTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r)
      else ctx.lineTo(x + Math.cos(angle) * r, y + Math.sin(angle) * r)
      const ia = angle + Math.PI / 5
      ctx.lineTo(x + Math.cos(ia) * ir, y + Math.sin(ia) * ir)
    }
    ctx.closePath()
    ctx.fill()
  }

  get count() { return this.particles.length }
}
