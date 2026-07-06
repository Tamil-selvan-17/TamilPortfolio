'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { useGameStore } from '@/components/bug-hunter/store/useGameStore'

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

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <div className="relative w-full h-[100dvh] bg-black overflow-hidden font-mono">
      {/* Phaser Game Canvas */}
      <PhaserGame />
      
      {/* React HUD Overlay */}
      <div className="absolute top-0 left-0 w-full p-4 pointer-events-none flex justify-between items-start z-50">
        
        {/* Top Left: Health & Energy */}
        <div className="flex flex-col gap-2">
          {/* Health Bar */}
          <div className="w-48 h-6 bg-zinc-800 rounded-full border-2 border-zinc-700 overflow-hidden relative">
            <div 
              className="h-full bg-rose-500 transition-all duration-200" 
              style={{ width: `${(store.health / store.maxHealth) * 100}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md">
              HP: {store.health}/{store.maxHealth}
            </span>
          </div>

          {/* Energy Bar */}
          <div className="w-48 h-4 bg-zinc-800 rounded-full border-2 border-zinc-700 overflow-hidden relative">
            <div 
              className="h-full bg-cyan-500 transition-all duration-200" 
              style={{ width: `${(store.energy / store.maxEnergy) * 100}%` }}
            />
          </div>
        </div>

        {/* Top Center: Wave Indicator */}
        <div className="absolute left-1/2 -translate-x-1/2 top-4">
          <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 px-6 py-2 rounded-full text-indigo-400 font-bold text-xl tracking-widest uppercase">
            Wave {store.wave}
          </div>
        </div>

        {/* Top Right: Level, XP, Coins & Shop */}
        <div className="flex flex-col items-end gap-2">
          <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 px-4 py-2 rounded-xl text-emerald-400 font-bold flex gap-4 items-center">
            <span>LVL {store.level}</span>
            <span className="text-zinc-500">|</span>
            <span className="text-amber-400">🪙 {store.coins}</span>
            <button 
              onClick={store.toggleShop}
              className="ml-2 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded shadow-lg pointer-events-auto transition-colors"
            >
              SHOP
            </button>
          </div>
          
          {/* XP Bar */}
          <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-200"
              style={{ width: `${(store.xp / (store.level * 100)) * 100}%` }}
            />
          </div>
        </div>

      </div>

      {/* Game Over Overlay */}
      {store.isGameOver && (
        <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md pointer-events-auto">
          <div className="text-center p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl shadow-2xl">
            <h1 className="text-6xl font-bold text-rose-500 mb-4 tracking-widest uppercase animate-pulse">Game Over</h1>
            <p className="text-zinc-400 text-xl mb-8">You survived until <span className="text-indigo-400 font-bold">Wave {store.wave}</span></p>
            <p className="text-zinc-300 text-lg mb-8">Level Reached: <span className="text-emerald-400 font-bold">{store.level}</span></p>
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

      {/* Shop Overlay */}
      {store.isShopOpen && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-6 text-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-indigo-400">Upgrade Shop</h2>
              <button 
                onClick={store.toggleShop}
                className="text-zinc-400 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Weapon: Console Cannon */}
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-orange-400">Console Cannon</h3>
                  <p className="text-sm text-zinc-500">High damage, slower fire rate. (Cost: 100 🪙)</p>
                </div>
                
                {store.weapons.includes('console_cannon') ? (
                  <button 
                    onClick={() => store.switchWeapon(store.weapons.indexOf('console_cannon'))}
                    className={`px-4 py-2 rounded font-bold ${
                      store.weapons[store.currentWeaponIndex] === 'console_cannon' 
                        ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed' 
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {store.weapons[store.currentWeaponIndex] === 'console_cannon' ? 'Equipped' : 'Equip'}
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      if (store.coins >= 100) {
                        store.addCoins(-100)
                        store.unlockWeapon('console_cannon')
                      }
                    }}
                    className={`px-4 py-2 rounded font-bold ${
                      store.coins >= 100 
                        ? 'bg-amber-500 hover:bg-amber-400 text-black' 
                        : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    Buy
                  </button>
                )}
              </div>

              {/* Weapon: Debug Laser (Default) */}
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-cyan-400">Debug Laser</h3>
                  <p className="text-sm text-zinc-500">Fast, low damage.</p>
                </div>
                
                <button 
                  onClick={() => store.switchWeapon(store.weapons.indexOf('debug_laser'))}
                  className={`px-4 py-2 rounded font-bold ${
                    store.weapons[store.currentWeaponIndex] === 'debug_laser' 
                      ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed' 
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {store.weapons[store.currentWeaponIndex] === 'debug_laser' ? 'Equipped' : 'Equip'}
                </button>
              </div>
              {/* Weapon: TypeScript Missile */}
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-950 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-blue-500">TypeScript Missile</h3>
                  <p className="text-sm text-zinc-500">Homing missiles. (Cost: 300 🪙)</p>
                </div>
                
                {store.weapons.includes('ts_missile') ? (
                  <button 
                    onClick={() => store.switchWeapon(store.weapons.indexOf('ts_missile'))}
                    className={`px-4 py-2 rounded font-bold ${
                      store.weapons[store.currentWeaponIndex] === 'ts_missile' 
                        ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed' 
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    {store.weapons[store.currentWeaponIndex] === 'ts_missile' ? 'Equipped' : 'Equip'}
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      if (store.coins >= 300) {
                        store.addCoins(-300)
                        store.unlockWeapon('ts_missile')
                      }
                    }}
                    className={`px-4 py-2 rounded font-bold ${
                      store.coins >= 300 
                        ? 'bg-amber-500 hover:bg-amber-400 text-black' 
                        : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    Buy
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}
