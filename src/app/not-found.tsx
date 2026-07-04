'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      {/* Glitch number */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-8"
      >
        <span
          className="text-[10rem] font-black tracking-tighter gradient-text select-none leading-none"
          aria-hidden="true"
        >
          404
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="space-y-3 mb-10"
      >
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-muted-foreground max-w-md">
          This page doesn&apos;t exist — or it moved. Use the command palette{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-white/8 border border-white/12 text-xs font-mono">
            ⌘K
          </kbd>{' '}
          to navigate anywhere instantly.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="flex gap-3"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-bg text-white text-sm font-medium"
        >
          <Home size={15} />
          Back Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass text-sm font-medium hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={15} />
          Go Back
        </button>
      </motion.div>
    </div>
  )
}
