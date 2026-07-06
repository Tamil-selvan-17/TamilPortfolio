export interface InputState {
  left: boolean
  right: boolean
  up: boolean
  down: boolean
  sprint: boolean
  interact: boolean
}

export class InputManager {
  private keys = new Set<string>()
  public touchDX = 0
  public touchDY = 0
  private listeners: (() => void)[] = []

  public isModalOpen = false

  attach(el: Window | HTMLElement = window) {
    const onDown = (e: Event) => {
      const key = (e as KeyboardEvent).code
      if (!this.isModalOpen && ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',
           'KeyA','KeyD','KeyW','KeyS','ShiftLeft','ShiftRight','Space','KeyE'].includes(key)) {
        e.preventDefault()
      }
      this.keys.add(key)
    }
    const onUp = (e: Event) => this.keys.delete((e as KeyboardEvent).code)

    el.addEventListener('keydown', onDown as EventListener)
    el.addEventListener('keyup', onUp as EventListener)
    this.listeners.push(
      () => el.removeEventListener('keydown', onDown as EventListener),
      () => el.removeEventListener('keyup', onUp as EventListener),
    )
  }

  detach() {
    this.listeners.forEach(fn => fn())
    this.listeners = []
    this.keys.clear()
  }

  setTouch(dx: number, dy: number) {
    this.touchDX = dx
    this.touchDY = dy
  }

  getState(): InputState {
    const left    = this.keys.has('ArrowLeft')  || this.keys.has('KeyA') || this.touchDX < -0.2
    const right   = this.keys.has('ArrowRight') || this.keys.has('KeyD') || this.touchDX >  0.2
    const up      = this.keys.has('ArrowUp')    || this.keys.has('KeyW') || this.touchDY < -0.2
    const down    = this.keys.has('ArrowDown')  || this.keys.has('KeyS') || this.touchDY >  0.2
    const sprint  = this.keys.has('ShiftLeft')  || this.keys.has('ShiftRight') || Math.abs(this.touchDX) > 0.7 || Math.abs(this.touchDY) > 0.7
    const interact = this.keys.has('Space') || this.keys.has('KeyE')
    return { left, right, up, down, sprint, interact }
  }
}
