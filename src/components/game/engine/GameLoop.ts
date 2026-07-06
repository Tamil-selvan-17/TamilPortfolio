export type GameLoopCallback = (deltaMs: number, timestamp: number) => void

export class GameLoop {
  private rafId = 0
  private lastTimestamp = 0
  private running = false
  private callback: GameLoopCallback

  constructor(callback: GameLoopCallback) {
    this.callback = callback
  }

  start() {
    if (this.running) return
    this.running = true
    this.lastTimestamp = performance.now()
    const tick = (ts: number) => {
      if (!this.running) return
      const delta = Math.min(ts - this.lastTimestamp, 50) // cap at 50ms (20fps min)
      this.lastTimestamp = ts
      this.callback(delta, ts)
      this.rafId = requestAnimationFrame(tick)
    }
    this.rafId = requestAnimationFrame(tick)
  }

  stop() {
    this.running = false
    cancelAnimationFrame(this.rafId)
  }

  isRunning() {
    return this.running
  }
}
