export class AudioManager {
  private ctx: AudioContext | null = null
  private masterGain: GainNode | null = null
  private sfxGain: GainNode | null = null
  private musicGain: GainNode | null = null
  private musicOsc: OscillatorNode | null = null
  private musicLoop: ReturnType<typeof setTimeout> | null = null
  private footstepTimer = 0
  musicVolume = 0.3
  sfxVolume = 0.5
  private started = false

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext()
      this.masterGain = this.ctx.createGain()
      this.sfxGain    = this.ctx.createGain()
      this.musicGain  = this.ctx.createGain()
      this.sfxGain.connect(this.masterGain)
      this.musicGain.connect(this.masterGain)
      this.masterGain.connect(this.ctx.destination)
      this.masterGain.gain.value = 1
      this.sfxGain.gain.value    = this.sfxVolume
      this.musicGain.gain.value  = this.musicVolume
    }
    return this.ctx
  }

  start() {
    if (this.started) return
    this.started = true
    this.playAmbient()
  }

  stop() {
    this.started = false
    if (this.musicLoop) clearTimeout(this.musicLoop)
    this.ctx?.close()
    this.ctx = null
  }

  private note(freq: number, dur: number, gain: GainNode, type: OscillatorType = 'sine', vol = 0.2) {
    const ctx = this.getCtx()
    const osc = ctx.createOscillator()
    const g   = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    g.gain.setValueAtTime(vol, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur)
    osc.connect(g)
    g.connect(gain)
    osc.start()
    osc.stop(ctx.currentTime + dur)
  }

  private playAmbient() {
    if (!this.started) return
    const ctx = this.getCtx()
    const gain = this.musicGain!
    // Gentle pentatonic arpeggio melody
    const scale = [261.6, 293.7, 329.6, 392, 440, 523.3, 587.3, 659.3]
    const melody = [0, 2, 4, 7, 4, 2, 0, 5, 7, 4, 2, 0]
    let t = ctx.currentTime
    for (const idx of melody) {
      const osc = ctx.createOscillator()
      const g   = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.value = scale[idx % scale.length]
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.15 * this.musicVolume, t + 0.05)
      g.gain.linearRampToValueAtTime(0, t + 0.38)
      osc.connect(g)
      g.connect(gain)
      osc.start(t)
      osc.stop(t + 0.4)
      t += 0.4
    }
    // Pad chord
    const chordFreqs = [130.8, 164.8, 196, 261.6]
    for (const f of chordFreqs) {
      const osc = ctx.createOscillator()
      const g   = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = f
      g.gain.setValueAtTime(0, ctx.currentTime)
      g.gain.linearRampToValueAtTime(0.04 * this.musicVolume, ctx.currentTime + 1)
      g.gain.linearRampToValueAtTime(0, ctx.currentTime + melody.length * 0.4 - 0.5)
      osc.connect(g)
      g.connect(gain)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + melody.length * 0.4)
    }
    this.musicLoop = setTimeout(() => this.playAmbient(), melody.length * 400 + 200)
  }

  playFootstep(isRunning: boolean, dt: number) {
    this.footstepTimer += dt
    const interval = isRunning ? 220 : 380
    if (this.footstepTimer < interval) return
    this.footstepTimer = 0
    const ctx = this.getCtx()
    const gain = this.sfxGain!
    // Low thud
    const noise = ctx.createOscillator()
    const g     = ctx.createGain()
    noise.type = 'square'
    noise.frequency.setValueAtTime(60, ctx.currentTime)
    noise.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.1)
    g.gain.setValueAtTime(0.15 * this.sfxVolume, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
    noise.connect(g)
    g.connect(gain)
    noise.start()
    noise.stop(ctx.currentTime + 0.1)
  }

  playCoin() {
    const gain = this.sfxGain!
    this.note(880, 0.1, gain, 'sine', 0.3)
    setTimeout(() => this.note(1320, 0.15, gain, 'sine', 0.2), 80)
  }

  playStar() {
    const gain = this.sfxGain!
    ;[660, 880, 1100, 1320].forEach((f, i) => {
      setTimeout(() => this.note(f, 0.12, gain, 'triangle', 0.25), i * 60)
    })
  }

  playKey() {
    const gain = this.sfxGain!
    this.note(440, 0.3, gain, 'triangle', 0.3)
    setTimeout(() => this.note(550, 0.3, gain, 'triangle', 0.2), 150)
  }

  playEnterBuilding() {
    const gain = this.sfxGain!
    ;[440, 550, 660, 880].forEach((f, i) => {
      setTimeout(() => this.note(f, 0.15, gain, 'triangle', 0.2), i * 50)
    })
  }

  playAchievement() {
    const gain = this.sfxGain!
    const melody = [523, 659, 784, 1047, 784, 659, 1047]
    melody.forEach((f, i) => {
      setTimeout(() => this.note(f, 0.18, gain, 'triangle', 0.3), i * 80)
    })
  }

  setMusicVolume(v: number) {
    this.musicVolume = v
    if (this.musicGain) this.musicGain.gain.value = v
  }

  setSfxVolume(v: number) {
    this.sfxVolume = v
    if (this.sfxGain) this.sfxGain.gain.value = v
  }
}
