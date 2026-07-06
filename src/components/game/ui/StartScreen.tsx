'use client'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface Props {
  hasSave: boolean
  onNewGame: () => void
  onContinue: () => void
}

export function StartScreen({ hasSave, onNewGame, onContinue }: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="start-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 z-50 flex flex-col items-center justify-center"
        style={{
          // Full coverage so root-layout elements cannot receive clicks
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, #0f172a 0%, #000 100%)',
        }}
      >
        {/* Animated stars bg */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 60 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 rounded-full bg-white"
              style={{
                left: `${(i * 37.3) % 100}%`,
                top:  `${(i * 19.7) % 100}%`,
              }}
              animate={{ opacity: [0.1, 1, 0.1] }}
              transition={{
                duration: 2 + (i % 4),
                repeat: Infinity,
                delay: (i % 8) * 0.4,
              }}
            />
          ))}
        </div>

        {/* Title */}
        <motion.div
          className="text-center mb-12 z-10 px-4"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
        >
          <motion.div
            className="text-8xl mb-4 select-none"
            animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
          >
            🎮
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text
                         bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400
                         tracking-tight leading-none mb-3">
            Portfolio Quest
          </h1>
          <p className="text-slate-400 text-sm tracking-widest uppercase font-semibold">
            An Interactive Portfolio Experience
          </p>
          <p className="text-slate-500 text-xs mt-2">by Tamilselvan G — Full Stack Engineer</p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="z-10 flex flex-col items-center gap-3 w-64 px-4"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 120 }}
        >
          {hasSave && (
            <motion.button
              id="btn-continue"
              onClick={onContinue}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-4 rounded-2xl text-base font-bold text-white
                         bg-gradient-to-r from-violet-600 to-indigo-600
                         shadow-lg shadow-violet-900/60
                         cursor-pointer select-none"
              style={{ pointerEvents: 'auto' }}
            >
              ▶ Continue
            </motion.button>
          )}

          <motion.button
            id="btn-start-game"
            onClick={onNewGame}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{ pointerEvents: 'auto' }}
            className={`w-full py-4 rounded-2xl text-base font-bold cursor-pointer select-none transition-all duration-200
              ${hasSave
                ? 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600'
                : 'text-white bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg shadow-violet-900/60'
              }`}
          >
            {hasSave ? '🔄 New Game' : '🎮 Start Game'}
          </motion.button>

          <Link
            href="/"
            id="btn-back-portfolio"
            className="w-full py-3 rounded-2xl text-sm font-medium text-slate-400
                       hover:text-white border border-slate-700 hover:border-slate-500
                       text-center transition-colors duration-200 cursor-pointer select-none"
            style={{ pointerEvents: 'auto' }}
          >
            ← Back to Portfolio
          </Link>
        </motion.div>

        {/* Controls hint */}
        <motion.div
          className="absolute bottom-8 left-0 right-0 text-center z-10 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-slate-600 text-xs">
            WASD / Arrow Keys to move &nbsp;•&nbsp; Space / E to interact &nbsp;•&nbsp; Shift to sprint
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
