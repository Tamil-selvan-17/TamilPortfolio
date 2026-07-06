'use client'
import { GameSave } from '../engine/SaveSystem'
import { SectionKey, BUILDINGS } from '../data/gameConfig'
import { Coins, Star, Key } from 'lucide-react'

interface Props {
  save: GameSave
  dayProgress: number   // 0–1
  onSettings: () => void
  nearBuilding: SectionKey | null
}

const PHASE_LABELS = ['🌅 Dawn', '☀️ Day', '🌆 Dusk', '🌙 Night']

function getPhase(t: number): string {
  return PHASE_LABELS[Math.floor(t * 4) % 4]
}

export function GameHUD({ save, dayProgress, onSettings, nearBuilding }: Props) {
  return (
    <>
      {/* Top bar */}
      <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-[120] pointer-events-none">
        {/* Collectibles */}
        <div className="flex gap-2">
          <HUDChip icon={<Coins size={16} />} val={save.coins} color="#fbbf24" />
          <HUDChip icon={<Star size={16} fill="currentColor" />} val={save.stars} color="#a78bfa" />
          <HUDChip icon={<Key size={16} />} val={save.keys}  color="#34d399" />
        </div>

        {/* Day/night + settings */}
        <div className="flex gap-2 pointer-events-auto">
          <div className="hidden sm:flex px-3 py-1.5 rounded-xl bg-black/50 backdrop-blur-sm border border-white/10 text-xs text-white font-medium items-center justify-center">
            {getPhase(dayProgress)}
          </div>
          <button
            onClick={onSettings}
            className="px-3 py-1.5 rounded-xl bg-black/50 backdrop-blur-sm border border-white/10 text-sm hover:bg-white/10 transition-colors text-white"
            aria-label="Settings"
          >
            ⚙️
          </button>
          <button
            onClick={() => { window.location.href = '/' }}
            className="px-3 py-1.5 rounded-xl bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-xs hover:bg-red-500/40 transition-colors text-red-500 font-bold"
            aria-label="Exit Game"
          >
            <span className="hidden sm:inline">Exit Game </span>🚪
          </button>
        </div>
      </div>

      {/* Progress bar (visited buildings) */}
      <div className="absolute top-14 left-3 z-[120] pointer-events-none">
        <div className="text-[10px] text-white/60 mb-1 font-medium tracking-wide">
          {save.visitedBuildings.length}/7 Discovered
        </div>
        <div className="w-28 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-400 transition-all duration-500"
            style={{ width: `${(save.visitedBuildings.length / 7) * 100}%` }}
          />
        </div>
      </div>

      {/* Minimap */}
      <Minimap save={save} />

      {/* Near-building prompt */}
      {nearBuilding && (
        <div className="absolute bottom-36 right-4 z-[120] px-4 py-2 rounded-xl
                        bg-black/60 border border-white/20 backdrop-blur-sm text-white text-sm font-medium
                        animate-pulse pointer-events-none">
          <span className="hidden md:inline">Press <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-xs font-bold">E</kbd> or </span>
          Walk into building to enter
        </div>
      )}

      {/* Controls hint (bottom) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[120] pointer-events-none hidden md:block">
        <p className="text-white/30 text-xs text-center">
          WASD / Arrows — move &nbsp;|&nbsp; Shift — sprint &nbsp;|&nbsp; E — interact
        </p>
      </div>
    </>
  )
}

function HUDChip({ icon, val, color }: { icon: React.ReactNode; val: number; color: string }) {
  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-black/50 backdrop-blur-sm border border-white/10 text-sm font-bold"
      style={{ color }}
    >
      <span className="flex items-center justify-center">{icon}</span>
      <span>{val}</span>
    </div>
  )
}

function Minimap({ save }: { save: GameSave }) {
  const SCALE = 4
  const MAP_COLS = 40
  const MAP_ROWS = 32
  const W = MAP_COLS * SCALE
  const H = MAP_ROWS * SCALE

  return (
    <div className="absolute bottom-8 right-3 z-[120] rounded-xl overflow-hidden border border-white/20 shadow-xl bg-black/70 hidden md:block"
         style={{ width: W, height: H }}>
      {/* Grid bg */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: 'linear-gradient(#2d6a30 1px, transparent 1px), linear-gradient(90deg, #2d6a30 1px, transparent 1px)',
        backgroundSize: `${SCALE * 5}px ${SCALE * 5}px`,
      }} />
      {/* River */}
      <div className="absolute bg-blue-500/60 left-0 right-0" style={{ top: 25 * SCALE, height: 2 * SCALE }} />
      {/* Buildings */}
      {BUILDINGS.map(b => (
        <div
          key={b.id}
          className="absolute rounded-sm"
          style={{
            background: b.color,
            left: b.tileX * SCALE,
            top: b.tileY * SCALE,
            width: b.widthTiles * SCALE,
            height: b.heightTiles * SCALE,
            opacity: save.visitedBuildings.includes(b.id) ? 1 : 0.4,
          }}
        />
      ))}
      {/* Player dot */}
      <div id="minimap-player-dot" className="absolute w-2 h-2 rounded-full bg-yellow-400 border border-white shadow-lg z-10" style={{
        left: save.playerTileX * SCALE,
        top: save.playerTileY * SCALE,
        transform: 'translate(-50%, -50%)'
      }} />
    </div>
  )
}
