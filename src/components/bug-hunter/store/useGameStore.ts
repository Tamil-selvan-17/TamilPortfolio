import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface GameState {
  // Stats
  health: number
  maxHealth: number
  score: number
  level: number
  
  // Game Flow
  isMainMenu: boolean
  isPaused: boolean
  isGameOver: boolean
  
  // Upgrades
  laserLevel: number
  
  // Actions
  addScore: (amount: number) => void
  takeDamage: (amount: number) => void
  heal: (amount: number) => void
  upgradeLaser: () => void
  downgradeLaser: () => void
  decrementLaser: () => void
  setPaused: (paused: boolean) => void
  setMainMenu: (isMainMenu: boolean) => void
  setGameOver: (isOver: boolean) => void
  setLevel: (level: number) => void
  resetStats: () => void
}

const INITIAL_STATE = {
  health: 100,
  maxHealth: 100,
  score: 0,
  level: 1,
  isMainMenu: true,
  isPaused: false,
  isGameOver: false,
  laserLevel: 1,
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,
      
      addScore: (amount) => set((state) => ({ score: state.score + amount })),
      
      takeDamage: (amount) => set((state) => {
        const newHealth = Math.max(0, state.health - amount)
        if (newHealth <= 0) {
          return { health: 0, isGameOver: true, isPaused: true }
        }
        return { health: newHealth }
      }),
      
      heal: (amount) => set((state) => ({
        health: Math.min(state.maxHealth, state.health + amount)
      })),
      
      upgradeLaser: () => set((state) => ({
        laserLevel: Math.min(3, state.laserLevel + 1)
      })),
      
      downgradeLaser: () => set({ laserLevel: 1 }),
      
      decrementLaser: () => set((state) => ({
        laserLevel: Math.max(1, state.laserLevel - 1)
      })),
      
      setPaused: (paused) => set({ isPaused: paused }),
      
      setMainMenu: (isMainMenu) => set({ isMainMenu }),
      
      setGameOver: (isOver) => set({ isGameOver: isOver }),
      
      setLevel: (level) => set({ level: Math.min(10, level) }),
      
      resetStats: () => set(INITIAL_STATE)
    }),
    {
      name: 'bug-hunter-storage',
      partialize: (state) => ({
        health: state.health,
        maxHealth: state.maxHealth,
        score: state.score,
        level: state.level,
        laserLevel: state.laserLevel
      })
    }
  )
)
