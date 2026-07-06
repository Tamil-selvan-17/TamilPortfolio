'use client'
import { motion } from 'framer-motion'
import { useLiveTenure } from '@/hooks/useLiveTenure'
import profile from '@/content/profile.json'
import expData from '@/content/experience.json'
import projectData from '@/content/projects.json'

export function ResumePanel() {
  const tenure = useLiveTenure('2022-06-01')
  return (
    <div className="flex flex-col h-full gap-4">
      {/* Top actions */}
      <motion.div
        className="flex flex-wrap items-center gap-3"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div>
          <h3 className="text-xl font-black text-white">📄 Resume</h3>
          <p className="text-slate-400 text-xs">{profile.name} — {profile.title} · {profile.resumeVersion} · {new Date(profile.resumeUpdatedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
        </div>
        <div className="ml-auto flex gap-2">
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-colors border border-slate-600"
          >
            👁️ View
          </a>
          <a
            href={profile.resumeUrl}
            download
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white text-sm font-bold transition-all shadow-lg shadow-emerald-900/40"
          >
            ⬇️ Download PDF
          </a>
        </div>
      </motion.div>

      {/* Resume preview */}
      <motion.div
        className="flex-1 rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 min-h-[400px]"
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <iframe
          src={profile.resumeUrl}
          className="w-full h-full"
          title={`${profile.name} Resume`}
          style={{ minHeight: '400px' }}
        />
      </motion.div>

      {/* Quick highlights */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        {[
          { icon: '📅', label: `${tenure.years}+ Years`, sub: 'Experience' },
          { icon: '🏢', label: expData[0]?.company || 'Current Employer', sub: 'Current Employer' },
          { icon: '🛠️', label: `${projectData.length}+ Apps`, sub: 'Delivered' },
          { icon: '📍', label: profile.location.split(',')[1]?.trim() || profile.location, sub: 'Location' },
        ].map(item => (
          <div key={item.label} className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-center">
            <p className="text-xl mb-1">{item.icon}</p>
            <p className="text-white text-sm font-bold">{item.label}</p>
            <p className="text-slate-500 text-xs">{item.sub}</p>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
