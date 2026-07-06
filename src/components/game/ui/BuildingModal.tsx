'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { SectionKey, BUILDINGS } from '../data/gameConfig'
import { AboutPanel }      from './SectionPanels/AboutPanel'
import { SkillsPanel }     from './SectionPanels/SkillsPanel'
import { ExperiencePanel } from './SectionPanels/ExperiencePanel'
import { ProjectsPanel }   from './SectionPanels/ProjectsPanel'
import { ContactPanel }    from './SectionPanels/ContactPanel'
import { ResumePanel }     from './SectionPanels/ResumePanel'
import { SecretPanel }     from './SectionPanels/SecretPanel'

interface Props {
  section: SectionKey | null
  onClose: () => void
}

const PANELS: Record<SectionKey, React.ComponentType> = {
  about:      AboutPanel,
  skills:     SkillsPanel,
  experience: ExperiencePanel,
  projects:   ProjectsPanel,
  contact:    ContactPanel,
  resume:     ResumePanel,
  secret:     SecretPanel,
}

export function BuildingModal({ section, onClose }: Props) {
  const building = section ? BUILDINGS.find(b => b.id === section) : null
  const Panel    = section ? PANELS[section] : null

  return (
    <AnimatePresence>
      {section && building && Panel && (
        <motion.div
          className="fixed inset-0 z-[170] flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-3xl max-h-[88vh] flex flex-col
                       bg-slate-950 rounded-3xl shadow-2xl overflow-hidden"
            style={{ borderColor: building.color + '60', borderWidth: 1.5, borderStyle: 'solid' }}
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 22 }}
          >
            {/* Glow header strip */}
            <div
              className="h-1 w-full shrink-0"
              style={{ background: `linear-gradient(90deg, transparent, ${building.color}, transparent)` }}
            />

            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-4 shrink-0 border-b border-slate-800"
              style={{ background: building.color + '10' }}
            >
              <div className="flex items-center gap-3">
                <motion.span
                  className="text-3xl"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {building.floatIcon}
                </motion.span>
                <div>
                  <h2 className="text-lg font-black text-white">{building.label}</h2>
                  <p className="text-xs" style={{ color: building.color + 'cc' }}>
                    Portfolio Quest — {building.id.toUpperCase()}
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="w-9 h-9 flex items-center justify-center rounded-xl
                           bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white
                           border border-slate-700 transition-colors text-lg"
                aria-label="Close"
              >
                ✕
              </motion.button>
            </div>

            {/* Content */}
            <div 
              data-lenis-prevent="true"
              className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-track-slate-900 scrollbar-thumb-slate-700 pointer-events-auto"
            >
              <Panel />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
