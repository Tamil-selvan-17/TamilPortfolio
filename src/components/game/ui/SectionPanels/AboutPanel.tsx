'use client'
import { motion } from 'framer-motion'

import profile from '@/content/profile.json'

export function AboutPanel() {
  return (
    <div className="flex flex-col md:flex-row gap-8 h-full items-start">
      {/* Avatar */}
      <motion.div
        className="shrink-0 mx-auto md:mx-0"
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
      >
        <div className="w-32 h-32 md:w-44 md:h-44 rounded-3xl overflow-hidden border-4 border-emerald-500/50 shadow-2xl shadow-emerald-500/30 bg-slate-800">
          <img src="/images/logo1.jpg" alt={profile.name} className="w-full h-full object-cover"
               onError={e => { (e.currentTarget as HTMLImageElement).src = '' }} />
        </div>
        {/* Status badge */}
        <div className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-medium">{profile.availability.label}</span>
        </div>
      </motion.div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-1">{profile.name}</h2>
          <p className="text-indigo-400 font-semibold text-lg mb-3">{profile.title}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.taglines.map(t => (
              <span key={t} className="px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">{t}</span>
            ))}
          </div>
          <p className="text-slate-300 text-sm leading-relaxed mb-5">{profile.summary}</p>
          <div className="flex flex-wrap gap-3">
            <InfoChip icon="📍" label={profile.location} />
            <InfoChip icon="✉️" label={profile.email} href={`mailto:${profile.email}`} />
            <InfoChip icon="🐙" label="GitHub" href={profile.links.github} />
            <InfoChip icon="🔗" label="LinkedIn" href={profile.links.linkedin} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function InfoChip({ icon, label, href }: { icon: string; label: string; href?: string }) {
  const cls = "flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
  return href
    ? <a href={href} target="_blank" rel="noopener noreferrer" className={cls}><span>{icon}</span><span>{label}</span></a>
    : <div className={cls}><span>{icon}</span><span>{label}</span></div>
}
