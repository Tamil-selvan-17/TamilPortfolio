import { ACHIEVEMENTS, BUILDINGS } from '../data/gameConfig'
import { GameSave } from './SaveSystem'

export interface AchievementEvent {
  id: string
  name: string
  icon: string
}

export class AchievementSystem {
  private onUnlock: (ev: AchievementEvent) => void

  constructor(onUnlock: (ev: AchievementEvent) => void) {
    this.onUnlock = onUnlock
  }

  check(save: GameSave, unlock: (id: string) => boolean) {
    const { visitedBuildings, collectedIds, achievements, sprintMs, npcsTalkedTo } = save

    const tryUnlock = (id: string) => {
      if (achievements.includes(id)) return
      const cfg = ACHIEVEMENTS.find(a => a.id === id)
      if (!cfg) return
      if (unlock(id)) {
        this.onUnlock({ id, name: cfg.name, icon: cfg.icon })
      }
    }

    // Explorer: visit all 6 main buildings
    const mainBuildings = BUILDINGS.filter(b => b.id !== 'secret').map(b => b.id)
    if (mainBuildings.every(id => visitedBuildings.includes(id))) tryUnlock('explorer')

    // Completed: all sections (including secret)
    if (BUILDINGS.every(b => visitedBuildings.includes(b.id))) tryUnlock('completed')

    // Project hunter: visited projects building
    if (visitedBuildings.includes('projects')) tryUnlock('project_hunter')

    // Secret finder
    if (visitedBuildings.includes('secret')) tryUnlock('secret_finder')

    // Collector: 10 coins
    if (save.coins >= 10) tryUnlock('collector')

    // Speedrunner: 5s sprint
    if (sprintMs >= 5000) tryUnlock('speedrunner')

    // Social: talked to all NPCs
    if (npcsTalkedTo.length >= 5) tryUnlock('social')

    void collectedIds
  }
}
