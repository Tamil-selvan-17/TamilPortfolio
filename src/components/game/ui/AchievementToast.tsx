'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { AchievementEvent } from '../engine/AchievementSystem'

interface Props {
  event: AchievementEvent | null
}

export function AchievementToast({ event }: Props) {
  return (
    <AnimatePresence>
      {event && (
        <motion.div
          key={event.id}
          initial={{ x: 120, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="fixed top-6 right-6 z-[200] flex items-center gap-3 px-4 py-3 rounded-2xl
                     bg-gradient-to-r from-violet-900/95 to-indigo-900/95 border border-violet-500/60
                     shadow-2xl shadow-violet-900/50 backdrop-blur-md"
        >
          <span className="text-3xl">{event.icon}</span>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-violet-300 font-bold">Achievement Unlocked!</p>
            <p className="text-sm font-bold text-white">{event.name}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
