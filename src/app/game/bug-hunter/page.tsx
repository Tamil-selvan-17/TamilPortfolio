'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { useGameStore } from '@/components/bug-hunter/store/useGameStore'
import { useRouter } from 'next/navigation'

// Dynamically import the Phaser wrapper so it doesn't break SSR
const PhaserGame = dynamic(() => import('@/components/bug-hunter/engine/PhaserGame'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-zinc-950 text-emerald-400 font-mono text-xl animate-pulse">
      Loading Engine...
    </div>
  )
})

export default function BugHunterPage() {
  const [isClient, setIsClient] = useState(false)
  const store = useGameStore()
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
    if (sessionStorage.getItem('bug-hunter-start') === 'true') {
      useGameStore.getState().setMainMenu(false)
      sessionStorage.removeItem('bug-hunter-start')
    }
  }, [])

  if (!isClient) return null

  return (
    <div className="relative w-full h-[100dvh] bg-black overflow-hidden font-mono">
      {/* Phaser Game Canvas */}
      <PhaserGame />
      
      {/* React HUD Overlay */}
      <div className="absolute top-0 left-0 w-full p-2 md:p-4 pointer-events-none flex justify-between items-start z-50">
        
        {/* Top Left: Navigation & Production Health */}
        <div className="flex flex-col gap-2 md:gap-4">
          {/* Pause/Menu Button */}
          <button 
            onClick={() => store.setMainMenu(true)}
            className="pointer-events-auto w-fit bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 text-zinc-300 hover:text-white px-2 py-1 md:px-4 md:py-2 rounded-lg font-bold text-xs md:text-sm flex items-center gap-1 md:gap-2 transition-all hover:bg-zinc-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
            MENU
          </button>

          {/* Production Health */}
          <div className="w-24 md:w-48 h-4 md:h-6 bg-zinc-900/80 rounded-full border-2 border-zinc-700 overflow-hidden relative">
            <div 
              className="h-full bg-rose-500 transition-all duration-200" 
              style={{ width: `${(store.health / store.maxHealth) * 100}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[8px] md:text-[10px] font-bold text-white drop-shadow-md">
              HP: {store.health}%
            </span>
          </div>
        </div>

        {/* Top Center: Level Indicator & Score */}
        <div className="absolute left-1/2 -translate-x-1/2 top-2 md:top-4 flex flex-col items-center gap-1 md:gap-2">
          <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 px-3 py-1 md:px-6 md:py-2 rounded-full text-indigo-400 font-bold text-xs md:text-xl tracking-widest uppercase whitespace-nowrap">
            LEVEL {store.level}/10
          </div>
          <div className="text-amber-400 font-bold text-xs md:text-lg drop-shadow-md">
            SCORE: {store.score}
          </div>
        </div>

        {/* Top Right: Laser Level */}
        <div className="flex flex-col items-end gap-2">
          <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 p-1 px-2 md:p-2 md:px-4 rounded-xl text-emerald-400 font-bold flex flex-col gap-1 md:gap-2">
            <div className="text-[8px] md:text-[10px] text-zinc-400 text-center uppercase tracking-wider mb-0 md:mb-1 border-b border-zinc-800 pb-1 hidden md:block">
              Laser Power
            </div>
            <div className="text-xs md:text-xl text-center text-white">
              LVL {store.laserLevel}
            </div>
          </div>
        </div>

      </div>

      {/* Main Menu Overlay */}
      {store.isMainMenu && (
        <div className="absolute inset-0 z-[200] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md pointer-events-auto">
          <h1 className="text-7xl font-bold text-emerald-500 mb-12 tracking-widest uppercase">Bug Hunter</h1>
          <div className="flex flex-col gap-6 w-80">
            {store.score > 0 || store.level > 1 || store.health < 100 ? (
              <button 
                onClick={() => { store.setMainMenu(false); store.setPaused(false) }}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xl transition-transform hover:scale-105"
              >
                Resume Game
              </button>
            ) : null}
            <button 
              onClick={() => { 
                store.resetStats(); 
                sessionStorage.setItem('bug-hunter-start', 'true');
                window.location.reload(); 
              }}
              className="px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xl transition-transform hover:scale-105"
            >
              New Game
            </button>
            <button 
              onClick={() => router.push('/')}
              className="px-8 py-4 bg-zinc-700 hover:bg-zinc-600 text-white font-bold rounded-xl text-xl transition-transform hover:scale-105"
            >
              Exit to Portfolio
            </button>
          </div>
        </div>
      )}

      {/* Game Over Overlay */}
      {store.isGameOver && (
        <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md pointer-events-auto">
          <div className="text-center p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl shadow-2xl">
            <h1 className="text-6xl font-bold text-rose-500 mb-4 tracking-widest uppercase animate-pulse">Game Over</h1>
            <p className="text-zinc-400 text-xl mb-4">You reached <span className="text-indigo-400 font-bold">Level {store.level}</span></p>
            <p className="text-zinc-300 text-2xl mb-8">Final Score: <span className="text-amber-400 font-bold">{store.score}</span></p>
            <button 
              onClick={() => {
                store.resetStats()
                window.location.reload()
              }}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xl transition-transform hover:scale-105"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
