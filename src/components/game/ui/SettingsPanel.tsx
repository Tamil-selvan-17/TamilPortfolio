'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { ACHIEVEMENTS } from '../data/gameConfig'
import { GameSave } from '../engine/SaveSystem'

interface Props {
  save: GameSave
  isOpen: boolean
  onClose: () => void
  onMusicChange: (v: number) => void
  onSfxChange: (v: number) => void
  onReset: () => void
  onFullscreen: () => void
}

export function SettingsPanel({ save, isOpen, onClose, onMusicChange, onSfxChange, onReset, onFullscreen }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[180] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative z-10 w-[380px] max-w-[90vw] bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl"
            initial={{ scale: 0.8, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 40 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">⚙️ Settings</h2>
              <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">✕</button>
            </div>

            {/* Volume controls */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2 block">🎵 Music Volume</label>
                <input
                  type="range" min={0} max={1} step={0.05}
                  defaultValue={save.musicVolume}
                  onChange={e => onMusicChange(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-2 block">🔊 SFX Volume</label>
                <input
                  type="range" min={0} max={1} step={0.05}
                  defaultValue={save.sfxVolume}
                  onChange={e => onSfxChange(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>

            {/* Achievements */}
            <div className="mb-6">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">🏆 Achievements</p>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto" data-lenis-prevent="true">
                {ACHIEVEMENTS.map(a => {
                  const unlocked = save.achievements.includes(a.id)
                  return (
                    <div
                      key={a.id}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-xs transition-all
                        ${unlocked ? 'border-violet-500/60 bg-violet-900/30 text-white' : 'border-slate-700 bg-slate-800/50 text-slate-500'}`}
                    >
                      <span className="text-lg">{a.secret && !unlocked ? '❓' : a.icon}</span>
                      <span className="font-medium leading-tight">{a.secret && !unlocked ? '???' : a.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={onFullscreen}
                className="flex-1 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors"
              >
                ⛶ Fullscreen
              </button>
              <button
                onClick={() => { if (confirm('Reset all progress?')) onReset() }}
                className="flex-1 py-2 rounded-xl bg-red-900/60 hover:bg-red-800 text-red-300 text-sm font-medium transition-colors border border-red-800"
              >
                🗑️ Reset
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
