import { TILE, MAP_W, MAP_H, PLAYER_SPEED, PLAYER_SPRINT_SPEED } from '../data/gameConfig'
import { InputState } from './InputManager'
import { World } from './World'

export type PlayerAnim = 'idle' | 'walk' | 'run'
export type FacingDir = 'down' | 'up' | 'left' | 'right'

export class Player {
  x: number
  y: number
  w = TILE - 8
  h = TILE - 4
  vx = 0
  vy = 0
  anim: PlayerAnim = 'idle'
  facing: FacingDir = 'down'
  animFrame = 0
  animTimer = 0
  sprintTime = 0   // total sprint ms for achievement
  isMoving = false

  private readonly ANIM_FPS_WALK = 150  // ms per frame
  private readonly ANIM_FPS_RUN  = 90
  private readonly FRAMES = 4

  constructor(tileX: number, tileY: number) {
    this.x = tileX * TILE + TILE / 2 - this.w / 2
    this.y = tileY * TILE + TILE / 2 - this.h / 2
  }

  update(dt: number, input: InputState, world: World) {
    const speed = input.sprint ? PLAYER_SPRINT_SPEED : PLAYER_SPEED
    let dx = 0, dy = 0

    if (input.left)  { dx -= 1; this.facing = 'left'  }
    if (input.right) { dx += 1; this.facing = 'right' }
    if (input.up)    { dy -= 1; this.facing = 'up'    }
    if (input.down)  { dy += 1; this.facing = 'down'  }

    // Normalize diagonal
    if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707 }

    this.isMoving = dx !== 0 || dy !== 0
    this.anim = !this.isMoving ? 'idle' : input.sprint ? 'run' : 'walk'
    if (input.sprint && this.isMoving) this.sprintTime += dt

    const nx = this.x + dx * speed
    const ny = this.y + dy * speed

    // Horizontal move
    if (!world.isBlocked(nx, this.y, this.w, this.h)) this.x = nx
    // Vertical move
    if (!world.isBlocked(this.x, ny, this.w, this.h)) this.y = ny

    // World bounds
    this.x = Math.max(0, Math.min(this.x, MAP_W - this.w))
    this.y = Math.max(0, Math.min(this.y, MAP_H - this.h))

    // Animate frames
    const fpms = this.anim === 'run' ? this.ANIM_FPS_RUN : this.ANIM_FPS_WALK
    this.animTimer += dt
    if (this.animTimer >= fpms) {
      this.animTimer = 0
      if (this.isMoving) this.animFrame = (this.animFrame + 1) % this.FRAMES
      else this.animFrame = 0
    }
  }

  get centerX() { return this.x + this.w / 2 }
  get centerY() { return this.y + this.h / 2 }
  get tileX()   { return Math.floor(this.centerX / TILE) }
  get tileY()   { return Math.floor(this.centerY / TILE) }

  draw(ctx: CanvasRenderingContext2D, ts: number) {
    const px = this.x
    const py = this.y
    const w  = this.w
    const h  = this.h
    const cx = px + w / 2

    ctx.save()

    // 1. Soft Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)'
    ctx.beginPath()
    ctx.ellipse(cx, py + h, w / 2 + 2, 6, 0, 0, Math.PI * 2)
    ctx.fill()

    const bob = this.isMoving ? Math.sin(ts * (this.anim === 'run' ? 0.025 : 0.015)) * 2 : 0
    const legPhase = (this.animFrame / this.FRAMES) * Math.PI * 2
    const armPhase = -legPhase

    // Colors
    const skin = '#fcd34d'
    const jacketBody = '#1e1b4b'
    const jacketSleeve = '#4f46e5'
    const jacketTrim = '#06b6d4'
    const pants = '#0f172a'
    const shoes = '#e2e8f0'
    const hair = '#1e293b'

    // 2. Backpack (drawn behind if facing away/side)
    if (this.facing !== 'down') {
      ctx.fillStyle = '#334155'
      const bpX = this.facing === 'left' ? cx : this.facing === 'right' ? cx - 12 : cx - 10
      const bpW = this.facing === 'up' ? 20 : 12
      ctx.beginPath()
      ctx.roundRect(bpX, py + h * 0.25 + bob, bpW, h * 0.35, 4)
      ctx.fill()
    }

    // 3. Legs & Shoes
    const drawLeg = (lx: number, ly: number, lWidth: number, lHeight: number, swing: number) => {
      // Pant leg
      ctx.fillStyle = pants
      ctx.beginPath()
      ctx.roundRect(lx, ly, lWidth, lHeight + swing, 3)
      ctx.fill()
      
      // Shoe (white sneakers)
      ctx.fillStyle = shoes
      ctx.beginPath()
      // Shoes point forward if down/up, or to the side if left/right
      const shoeW = this.facing === 'left' || this.facing === 'right' ? lWidth + 4 : lWidth + 2
      const shoeX = this.facing === 'left' ? lx - 3 : lx - 1
      ctx.roundRect(shoeX, ly + lHeight + swing - 4, shoeW, 5, 2)
      ctx.fill()
    }

    const legY = py + h * 0.55 + bob
    const legH = h * 0.35
    if (this.isMoving) {
      drawLeg(px + 6, legY, w / 2 - 5, legH, Math.sin(legPhase) * 4)
      drawLeg(cx + 1, legY, w / 2 - 5, legH, -Math.sin(legPhase) * 4)
    } else {
      drawLeg(px + 6, legY, w / 2 - 5, legH, 0)
      drawLeg(cx + 1, legY, w / 2 - 5, legH, 0)
    }

    // 4. Body (Jacket)
    ctx.fillStyle = jacketBody
    ctx.beginPath()
    ctx.roundRect(px + 4, py + h * 0.2 + bob, w - 8, h * 0.45, 6)
    ctx.fill()
    
    // Jacket neon trim / zipper
    if (this.facing !== 'up') {
      ctx.fillStyle = jacketTrim
      const zipX = this.facing === 'left' ? px + 6 : this.facing === 'right' ? px + w - 8 : cx - 1
      ctx.fillRect(zipX, py + h * 0.22 + bob, 2, h * 0.4)
    }

    // 5. Arms & Hands
    const drawArm = (ax: number, ay: number, aWidth: number, aHeight: number, swing: number) => {
      // Sleeve
      ctx.fillStyle = jacketSleeve
      ctx.beginPath()
      ctx.roundRect(ax, ay + swing, aWidth, aHeight, 4)
      ctx.fill()
      // Hand
      ctx.fillStyle = skin
      ctx.beginPath()
      ctx.arc(ax + aWidth/2, ay + aHeight + swing + 2, 4, 0, Math.PI * 2)
      ctx.fill()
    }

    const armSwing = this.isMoving ? Math.sin(armPhase) * 6 : 0
    const armY = py + h * 0.25 + bob
    
    // Draw arms depending on facing
    if (this.facing === 'left' || this.facing === 'up' || this.facing === 'down') {
      drawArm(px - 1, armY, 7, h * 0.3, armSwing)
    }
    if (this.facing === 'right' || this.facing === 'up' || this.facing === 'down') {
      drawArm(px + w - 6, armY, 7, h * 0.3, -armSwing)
    }

    // 6. Head & Face
    ctx.fillStyle = skin
    ctx.beginPath()
    ctx.arc(cx, py + h * 0.15 + bob, w * 0.32, 0, Math.PI * 2)
    ctx.fill()

    // Hair
    ctx.fillStyle = hair
    ctx.beginPath()
    if (this.facing === 'up') {
      // Back of head covered
      ctx.arc(cx, py + h * 0.15 + bob, w * 0.34, 0, Math.PI * 2)
    } else {
      // Top hair
      ctx.arc(cx, py + h * 0.12 + bob, w * 0.34, Math.PI, 0)
    }
    ctx.fill()
    
    // Cyberpunk Visor (Glowing Cyan)
    if (this.facing !== 'up') {
      const faceOffX = this.facing === 'left' ? -4 : this.facing === 'right' ? 4 : 0
      
      ctx.fillStyle = '#22d3ee' // bright cyan
      ctx.shadowColor = '#06b6d4'
      ctx.shadowBlur = 8
      ctx.beginPath()
      // Visor shape
      ctx.roundRect(cx - 9 + faceOffX, py + h * 0.11 + bob, 18, 6, 3)
      ctx.fill()
      ctx.shadowBlur = 0
      
      // Visor frame detail
      ctx.strokeStyle = '#0f172a'
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Backpack straps if facing down
    if (this.facing === 'down') {
      ctx.fillStyle = '#334155'
      ctx.fillRect(cx - 7, py + h * 0.2 + bob, 3, h * 0.3)
      ctx.fillRect(cx + 4, py + h * 0.2 + bob, 3, h * 0.3)
    }

    // 7. Sprinting Dust Particles
    if (this.anim === 'run' && this.isMoving) {
      ctx.globalAlpha = 0.5
      ctx.fillStyle = '#cbd5e1'
      ctx.beginPath()
      ctx.arc(cx + (Math.random() - 0.5) * 16, py + h + Math.random() * 6, 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1
    }

    ctx.restore()
    void ts
  }
}
