import { SectionKey } from '../data/gameConfig'

export interface GameSave {
  playerTileX: number
  playerTileY: number
  visitedBuildings: SectionKey[]
  collectedIds: string[]
  achievements: string[]
  coins: number
  stars: number
  keys: number
  sprintMs: number
  npcsTalkedTo: string[]
  musicVolume: number
  sfxVolume: number
  timestamp: number
}

const SAVE_KEY = 'portfolio_quest_save'

const defaultSave = (): GameSave => ({
  playerTileX: 14,
  playerTileY: 11,
  visitedBuildings: [],
  collectedIds: [],
  achievements: [],
  coins: 0,
  stars: 0,
  keys: 0,
  sprintMs: 0,
  npcsTalkedTo: [],
  musicVolume: 0.3,
  sfxVolume: 0.5,
  timestamp: Date.now(),
})

export class SaveSystem {
  private save: GameSave
  private autoSaveInterval: ReturnType<typeof setInterval> | null = null

  constructor() {
    this.save = this.load()
  }

  load(): GameSave {
    try {
      const raw = localStorage.getItem(SAVE_KEY)
      if (raw) return { ...defaultSave(), ...JSON.parse(raw) }
    } catch {}
    return defaultSave()
  }

  getSave(): GameSave { return this.save }

  persist() {
    this.save.timestamp = Date.now()
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.save))
    } catch {}
  }

  startAutoSave(intervalMs = 30_000) {
    this.autoSaveInterval = setInterval(() => this.persist(), intervalMs)
  }

  stopAutoSave() {
    if (this.autoSaveInterval) clearInterval(this.autoSaveInterval)
  }

  reset() {
    this.save = defaultSave()
    try { localStorage.removeItem(SAVE_KEY) } catch {}
  }

  markVisited(id: SectionKey) {
    if (!this.save.visitedBuildings.includes(id)) {
      this.save.visitedBuildings.push(id)
    }
  }

  collect(itemId: string, type: 'coin' | 'star' | 'key'): boolean {
    if (this.save.collectedIds.includes(itemId)) return false
    this.save.collectedIds.push(itemId)
    if (type === 'coin')  this.save.coins++
    if (type === 'star')  this.save.stars++
    if (type === 'key')   this.save.keys++
    return true
  }

  unlockAchievement(id: string): boolean {
    if (this.save.achievements.includes(id)) return false
    this.save.achievements.push(id)
    return true
  }

  markNpcTalked(npcId: string) {
    if (!this.save.npcsTalkedTo.includes(npcId)) {
      this.save.npcsTalkedTo.push(npcId)
    }
  }

  hasSave(): boolean {
    try {
      return !!localStorage.getItem(SAVE_KEY)
    } catch { return false }
  }
}
