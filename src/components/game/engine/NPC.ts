import { TILE } from '../data/gameConfig'
import { NPCConfig } from '../data/gameConfig'

export class NPC {
  x: number
  y: number
  w = TILE - 10
  h = TILE - 6
  config: NPCConfig
  dialogIndex = 0
  private wanderTimer = 0
  private wanderDx = 0
  private wanderDy = 0
  private wanderInterval = 2000 + Math.random() * 2000
  talkCount = 0

  private targetX?: number
  private targetY?: number

  constructor(config: NPCConfig) {
    this.config = config
    this.x = config.tileX * TILE + 4
    this.y = config.tileY * TILE + 4
  }

  update(dt: number) {
    this.wanderTimer += dt
    if (this.wanderTimer >= this.wanderInterval) {
      this.wanderTimer = 0
      this.wanderInterval = 500 + Math.random() * 1500 // Move more frequently
      const angle = Math.random() * Math.PI * 2
      const dist  = Math.random() * TILE * this.config.wanderRadius
      this.targetX = this.config.tileX * TILE + Math.cos(angle) * dist
      this.targetY = this.config.tileY * TILE + Math.sin(angle) * dist
    }

    if (this.targetX !== undefined && this.targetY !== undefined) {
      const dx = this.targetX - this.x
      const dy = this.targetY - this.y
      const dist = Math.hypot(dx, dy)
      
      if (dist > 1) {
        // 3.5 pixels per frame matches PLAYER_SPEED
        const speed = 3.5 * (dt / 16.66)
        const moveDist = Math.min(speed, dist)
        this.wanderDx = (dx / dist) * moveDist
        this.wanderDy = (dy / dist) * moveDist
        this.x += this.wanderDx
        this.y += this.wanderDy
      } else {
        this.wanderDx = 0
        this.wanderDy = 0
      }
    }
  }

  isNearPlayer(px: number, py: number, pw: number, ph: number): boolean {
    const dist = 70
    const cx = this.x + this.w / 2
    const cy = this.y + this.h / 2
    const pcx = px + pw / 2
    const pcy = py + ph / 2
    return Math.hypot(cx - pcx, cy - pcy) < dist
  }

  getCurrentDialog(): string {
    return this.config.dialog[this.dialogIndex % this.config.dialog.length]
  }

  nextDialog() {
    this.dialogIndex = (this.dialogIndex + 1) % this.config.dialog.length
  }

  draw(ctx: CanvasRenderingContext2D, ts: number, isNear: boolean) {
    const px = this.x
    const py = this.y
    const w  = this.w
    const h  = this.h
    const cx = px + w / 2

    const isMoving = Math.abs(this.wanderDx) > 0.1 || Math.abs(this.wanderDy) > 0.1
    const bob = isMoving ? Math.sin(ts * 0.015) * 1.5 : Math.sin(ts * 0.004 + this.config.tileX) * 0.5
    const legPhase = isMoving ? ts * 0.01 : 0
    const armPhase = -legPhase

    ctx.save()

    // 1. Soft Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.beginPath()
    ctx.ellipse(cx, py + h, w / 2 + 1, 5, 0, 0, Math.PI * 2)
    ctx.fill()

    // Colors
    const skin = '#fcd34d'
    const jacketBody = this.config.color
    const jacketSleeve = '#334155'
    const pants = '#0f172a'
    const shoes = '#94a3b8'
    const hair = '#1e293b'

    // 2. Legs & Shoes
    const drawLeg = (lx: number, ly: number, lWidth: number, lHeight: number, swing: number) => {
      // Pant leg
      ctx.fillStyle = pants
      ctx.beginPath()
      ctx.roundRect(lx, ly, lWidth, lHeight + swing, 2)
      ctx.fill()
      
      // Shoe
      ctx.fillStyle = shoes
      ctx.beginPath()
      ctx.roundRect(lx - 1, ly + lHeight + swing - 3, lWidth + 2, 4, 2)
      ctx.fill()
    }

    const legY = py + h * 0.55 + bob
    const legH = h * 0.35
    if (isMoving) {
      drawLeg(px + 4, legY, w / 2 - 4, legH, Math.sin(legPhase) * 3)
      drawLeg(cx + 1, legY, w / 2 - 4, legH, -Math.sin(legPhase) * 3)
    } else {
      drawLeg(px + 4, legY, w / 2 - 4, legH, 0)
      drawLeg(cx + 1, legY, w / 2 - 4, legH, 0)
    }

    // 3. Body (Jacket)
    ctx.fillStyle = jacketBody
    ctx.beginPath()
    ctx.roundRect(px + 3, py + h * 0.22 + bob, w - 6, h * 0.45, 5)
    ctx.fill()

    // 4. Arms & Hands
    const drawArm = (ax: number, ay: number, aWidth: number, aHeight: number, swing: number) => {
      ctx.fillStyle = jacketSleeve
      ctx.beginPath()
      ctx.roundRect(ax, ay + swing, aWidth, aHeight, 3)
      ctx.fill()
      ctx.fillStyle = skin
      ctx.beginPath()
      ctx.arc(ax + aWidth/2, ay + aHeight + swing + 2, 3, 0, Math.PI * 2)
      ctx.fill()
    }

    const armSwing = isMoving ? Math.sin(armPhase) * 4 : 0
    const armY = py + h * 0.28 + bob
    drawArm(px - 1, armY, 5, h * 0.3, armSwing)
    drawArm(px + w - 4, armY, 5, h * 0.3, -armSwing)

    // 5. Head & Face
    ctx.fillStyle = skin
    ctx.beginPath()
    ctx.arc(cx, py + h * 0.15 + bob, w * 0.32, 0, Math.PI * 2)
    ctx.fill()

    // Hair
    ctx.fillStyle = hair
    ctx.beginPath()
    ctx.arc(cx, py + h * 0.12 + bob, w * 0.34, Math.PI, 0)
    ctx.fill()

    // Generic Visor / Glasses for NPCs
    ctx.fillStyle = '#0f172a'
    ctx.beginPath()
    ctx.roundRect(cx - 7, py + h * 0.12 + bob, 14, 4, 2)
    ctx.fill()

    // 6. Name tag
    if (isNear) {
      ctx.font = 'bold 10px "Courier New"'
      ctx.fillStyle = 'white'
      ctx.textAlign = 'center'
      ctx.shadowColor = 'black'
      ctx.shadowBlur = 6
      ctx.fillText(this.config.name, cx, py - 10 + bob)
      ctx.shadowBlur = 0
      
      // Interaction indicator
      const pulse = Math.sin(ts * 0.006) * 0.3 + 0.7
      ctx.globalAlpha = pulse
      ctx.fillStyle = '#fbbf24'
      ctx.font = '12px serif'
      ctx.fillText('💬', cx, py - 22 + bob)
      ctx.globalAlpha = 1
    }

    ctx.restore()
    void ts
  }
}
