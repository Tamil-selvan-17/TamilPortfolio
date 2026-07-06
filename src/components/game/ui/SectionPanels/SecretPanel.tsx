'use client'
import { motion } from 'framer-motion'
import { EASTER_EGG_MESSAGE } from '../../data/npcDialogs'

export function SecretPanel() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-center gap-6">
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="text-8xl"
      >
        🗝️
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-black text-white mb-2">Secret Cave Discovered!</h2>
        <div className="max-w-sm mx-auto bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
          <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono leading-relaxed text-left">
            {EASTER_EGG_MESSAGE.trim()}
          </pre>
        </div>
      </motion.div>
      <motion.div
        className="flex gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <a
          href="https://github.com/Tamil-selvan-17/Tamil-selvan-17"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors"
        >
          🐙 Follow on GitHub
        </a>
        <a
          href="http://www.linkedin.com/in/tamil-selvan-7200206323-full-stack-developer/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-sm font-medium transition-colors"
        >
          🔗 Connect on LinkedIn
        </a>
      </motion.div>
    </div>
  )
}
