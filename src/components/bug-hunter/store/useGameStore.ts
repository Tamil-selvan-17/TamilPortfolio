import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface GameState {
  // Stats
  health: number
  maxHealth: number
  energy: number
  maxEnergy: number
  xp: number
  level: number
  coins: number
  
  // Game Flow
  isPaused: boolean
  isShopOpen: boolean
  isGameOver: boolean
  wave: number
  
  // Upgrades
  weapons: string[]
  currentWeaponIndex: number
  
  // Actions
  addCoins: (amount: number) => void
  addXp: (amount: number) => void
  takeDamage: (amount: number) => void
  heal: (amount: number) => void
  unlockWeapon: (weaponId: string) => void
  switchWeapon: (index?: number) => void
  toggleShop: () => void
  setPaused: (paused: boolean) => void
  setGameOver: (isOver: boolean) => void
  setWave: (wave: number) => void
  resetStats: () => void
}

const INITIAL_STATE = {
  health: 100,
  maxHealth: 100,
  energy: 100,
  maxEnergy: 100,
  xp: 0,
  level: 1,
  coins: 0,
  isPaused: false,
  isShopOpen: false,
  isGameOver: false,
  wave: 1,
  weapons: ['debug_laser'],
  currentWeaponIndex: 0,
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      
      addCoins: (amount) => set((state) => ({ coins: state.coins + amount })),
      
      addXp: (amount) => set((state) => {
        let newXp = state.xp + amount
        let newLevel = state.level
        const xpRequired = state.level * 100
        
        if (newXp >= xpRequired) {
          newLevel++
          newXp -= xpRequired
        }
        
        return { xp: newXp, level: newLevel }
      }),
      
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
      
      unlockWeapon: (weaponId) => set((state) => ({
        weapons: state.weapons.includes(weaponId) ? state.weapons : [...state.weapons, weaponId]
      })),
      
      switchWeapon: (index) => set((state) => {
        if (index !== undefined && index < state.weapons.length) return { currentWeaponIndex: index }
        return { currentWeaponIndex: (state.currentWeaponIndex + 1) % state.weapons.length }
      }),
      
      toggleShop: () => set((state) => ({ 
        isShopOpen: !state.isShopOpen, 
        isPaused: !state.isShopOpen // Pause when shop is open
      })),
      
      setPaused: (paused) => set({ isPaused: paused }),
      
      setGameOver: (isOver) => set({ isGameOver: isOver }),
      
      setWave: (wave) => set({ wave }),
      
      resetStats: () => set(INITIAL_STATE)
    }),
    {
      name: 'bug-hunter-save',
    }
  )
)
