'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Gamepad2, Bug, ArrowLeft } from 'lucide-react'

export default function GameHubPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col items-center justify-center p-6 pt-24 md:p-8 relative overflow-hidden">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* Back Button */}
      <Link href="/" className="absolute top-6 left-6 md:top-8 md:left-8 text-zinc-400 hover:text-white transition-colors flex items-center gap-2 z-10 text-sm md:text-base">
        <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
        Back to Portfolio
      </Link>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10 md:mb-16 z-10"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-3 md:mb-4">
          Game Hub
        </h1>
        <p className="text-zinc-400 text-base md:text-lg max-w-lg mx-auto">
          Choose a game to play. Explore my interactive portfolio or destroy some bugs!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl z-10">
        
        {/* Portfolio Quest Card */}
        <Link href="/game/portfolio-quest">
          <motion.div 
            whileHover={{ y: -10, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 cursor-pointer group hover:border-indigo-500 transition-colors shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            
            <div className="w-16 h-16 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
              <Gamepad2 size={32} />
            </div>
            
            <h2 className="text-2xl font-bold mb-3 text-white">Portfolio Quest</h2>
            <p className="text-zinc-400 leading-relaxed">
              An interactive 2D RPG experience where you explore my projects, skills, and experience as a player character.
            </p>
          </motion.div>
        </Link>

        {/* Bug Hunter Card */}
        <Link href="/game/bug-hunter">
          <motion.div 
            whileHover={{ y: -10, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 cursor-pointer group hover:border-emerald-500 transition-colors shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
              <Bug size={32} />
            </div>
            
            <h2 className="text-2xl font-bold mb-3 text-white">Bug Hunter</h2>
            <p className="text-zinc-400 leading-relaxed">
              A fast-paced AAA action survival game. Survive waves of programming bugs, buy upgrades, and defeat Bosses!
            </p>
          </motion.div>
        </Link>

      </div>
    </div>
  )
}
