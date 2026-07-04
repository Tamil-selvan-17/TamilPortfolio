'use client'

import { motion, Variants } from 'framer-motion'
import { Download } from 'lucide-react'
import { useTypewriter } from '@/hooks/useTypewriter'
import { useLiveTenure } from '@/hooks/useLiveTenure'
import { getProfile } from '@/lib/content'
import { CornerButton } from '@/components/intro/CornerButton'
import { ParticleCanvas } from '@/components/shared/ParticleCanvas'

const profile = getProfile()

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export function Hero() {
  const role = useTypewriter(profile.taglines, 75, 40, 2200)
  const tenure = useLiveTenure('2022-06-01', null)

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-28 pb-16 bg-[#02101f]"
    >
      {/* ── Animated Canvas Background ── */}
      <ParticleCanvas />

      {/* Grid overlay for terminal aesthetic */}
      <div
        className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#94e6fb 1px, transparent 1px), linear-gradient(90deg, #94e6fb 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      {/* ── Corner HUDs ── */}
      <div className="absolute top-24 left-6 md:left-12 terminal-text text-[10px] text-[#4a9eca] tracking-widest hidden sm:block z-10">
        <div>&gt; Loc: {profile.location}</div>
        <div>&gt; Coord: 13.0827° N / 80.2707° E</div>
      </div>

      <div className="absolute top-24 right-6 md:right-12 terminal-text text-[10px] text-[#4a9eca] tracking-widest text-right hidden sm:block z-10">
        <div>&gt; Status: {profile.availability.label}</div>
        <div className="flex items-center justify-end gap-2 mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9d] animate-pulse" />
          <span className="text-[#00ff9d]">Online</span>
        </div>
      </div>

      {/* ── Content ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl w-full flex flex-col items-center text-center z-10"
      >
        {/* Giant Outlined Name */}
        <motion.div variants={itemVariants} className="mb-6 font-[family-name:var(--font-space-grotesk)] select-none">
          <h1 className="text-[clamp(3rem,10vw,8rem)] leading-[0.85] tracking-tight font-bold uppercase flex flex-col items-center">
            <span className="text-outline block opacity-80">{profile.name.split(' ')[0]}</span>
            <span className="text-[#94e6fb] block">{profile.name.split(' ')[1] || 'Portfolio'}</span>
          </h1>
        </motion.div>

        {/* Typewriter role */}
        <motion.div variants={itemVariants} className="h-8 flex items-center mb-8 terminal-text text-[#4a9eca] text-sm md:text-base">
          <p>
            &gt; ROLE: <span className="text-[#f8fafc] typewriter-cursor">{role}</span>
          </p>
        </motion.div>

        {/* Summary */}
        <motion.p
          variants={itemVariants}
          className="text-sm md:text-base text-[#94a3b8] max-w-2xl leading-relaxed mb-8 font-light"
        >
          {profile.summary}
        </motion.p>

        {/* Live tenure stat - Terminal style */}
        <motion.div
          variants={itemVariants}
          className="terminal-text text-[10px] sm:text-xs text-[#94e6fb] mb-12 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 border border-[#94e6fb]/20 bg-[#041c33]/80 backdrop-blur-sm px-6 py-3"
        >
          <span>UPTIME: {tenure.totalDays.toLocaleString()} DAYS</span>
          <span className="hidden sm:inline opacity-50">|</span>
          <span className="opacity-80">
            {tenure.years} YRS, {tenure.months} MOS
          </span>
        </motion.div>

        {/* CTAs */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6">
          <CornerButton 
            active 
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          >
            VIEW_PROJECTS
          </CornerButton>

          <CornerButton 
            href="/resume/Tamilselvan_G_Resume.pdf" 
            target="_blank"
          >
            <Download size={14} />
            DOWNLOAD_SYS_LOG
          </CornerButton>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 flex flex-col items-center gap-2 z-10"
        aria-hidden="true"
      >
        <span className="terminal-text text-[9px] text-[#4a9eca]">SCROLL</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="w-px h-8 bg-[#94e6fb]/50"
        />
      </motion.div>
    </section>
  )
}
