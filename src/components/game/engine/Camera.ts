import { MAP_W, MAP_H } from '../data/gameConfig'

export class Camera {
  x = 0
  y = 0
  zoom = 1
  targetZoom = 1
  private vx = 0
  private vy = 0

  constructor(public viewW: number, public viewH: number) {}

  resize(w: number, h: number) {
    this.viewW = w
    this.viewH = h
  }

  follow(targetX: number, targetY: number, dt: number) {
    const LERP = 1 - Math.pow(0.005, dt / 1000)
    const desired = {
      x: targetX - this.viewW / 2,
      y: targetY - this.viewH / 2,
    }
    this.x += (desired.x - this.x) * LERP
    this.y += (desired.y - this.y) * LERP
    // Clamp to world bounds
    this.x = Math.max(0, Math.min(this.x, MAP_W - this.viewW))
    this.y = Math.max(0, Math.min(this.y, MAP_H - this.viewH))

    // Smooth zoom
    this.zoom += (this.targetZoom - this.zoom) * LERP * 0.5
  }

  shake(magnitude = 6) {
    this.x += (Math.random() - 0.5) * magnitude
    this.y += (Math.random() - 0.5) * magnitude
  }

  worldToScreen(wx: number, wy: number) {
    return { x: (wx - this.x) * this.zoom, y: (wy - this.y) * this.zoom }
  }

  screenToWorld(sx: number, sy: number) {
    return { x: sx / this.zoom + this.x, y: sy / this.zoom + this.y }
  }

  /** Apply camera transform to canvas context */
  apply(ctx: CanvasRenderingContext2D) {
    ctx.setTransform(this.zoom, 0, 0, this.zoom, -this.x * this.zoom, -this.y * this.zoom)
  }

  reset(ctx: CanvasRenderingContext2D) {
    ctx.setTransform(1, 0, 0, 1, 0, 0)
  }
}
