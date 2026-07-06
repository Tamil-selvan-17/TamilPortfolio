'use client'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  message: string | null
  npcName: string
  onNext: () => void
  onClose: () => void
}

export function NPCDialog({ message, npcName, onNext, onClose }: Props) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key={message}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          className="absolute bottom-36 left-1/2 -translate-x-1/2 z-[160] w-80 max-w-[90vw]"
        >
          <div className="relative bg-slate-900/95 border border-indigo-500/50 rounded-2xl px-5 py-4 shadow-2xl shadow-black/50 backdrop-blur-md">
            {/* Arrow up */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-l border-t border-indigo-500/50 rotate-45" />
            <p className="text-xs font-bold text-indigo-400 mb-1 uppercase tracking-wider">{npcName}</p>
            <p className="text-sm text-white leading-relaxed font-medium">{message}</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={onNext}
                className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              >
                Next ›
              </button>
              <button
                onClick={onClose}
                className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
