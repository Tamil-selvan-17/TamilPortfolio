'use client'

import { motion } from 'framer-motion'
import { getProfile, getEducation, getCertifications } from '@/lib/content'
import { GraduationCap, MapPin, Award } from 'lucide-react'

export function OrganicAbout() {
  const profile = getProfile()
  const educationList = getEducation()
  const certifications = getCertifications()

  return (
    <section id="about" className="relative py-32 bg-transparent text-stone-600 dark:text-slate-300 overflow-hidden">
      
      {/* Background massive scrolling text */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-10 dark:opacity-5 select-none -z-10">
        <motion.h2 
          initial={{ x: "20%" }}
          whileInView={{ x: "-20%" }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
          className="text-[15vw] font-bold whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-cyan-400 dark:to-blue-500 pb-4"
        >
          ABOUT • ABOUT • ABOUT • ABOUT •
        </motion.h2>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Intro Summary - Scroll Reading / Typing Animation */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            visible: { transition: { staggerChildren: 0.03 } }
          }}
          className="text-2xl md:text-4xl leading-relaxed md:leading-relaxed font-light mb-24 max-w-4xl"
        >
          {profile.summary.split(/(\s+)/).map((segment, idx) => {
            if (!segment.trim()) {
              return <span key={idx} className="whitespace-pre-wrap">{segment}</span>
            }
            return (
              <motion.span
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 15, filter: 'blur(8px)' },
                  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: 'easeOut' } }
                }}
                className="inline-block text-stone-900 dark:text-white font-medium"
              >
                {segment}
              </motion.span>
            )
          })}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          
          {/* Location */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="md:col-span-1"
          >
            <div className="flex items-center gap-4 mb-6">
              <MapPin size={32} className="text-teal-600 dark:text-cyan-400" />
              <h3 className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-cyan-400">Location</h3>
            </div>
            <p className="text-xl">{profile.location}</p>
          </motion.div>

          {/* Education */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="md:col-span-1"
          >
            <div className="flex items-center gap-4 mb-6">
              <GraduationCap size={32} className="text-teal-600 dark:text-cyan-400" />
              <h3 className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-cyan-400">Education</h3>
            </div>
            
            <div className="space-y-8">
              {educationList.map((edu, idx) => (
                <div key={idx} className="relative pl-6 border-l border-emerald-700/30 dark:border-blue-600/30">
                  <div className="absolute left-[-5px] top-2 w-2 h-2 rounded-full bg-emerald-700 dark:bg-blue-400" />
                  <p className="text-xl text-stone-900 dark:text-white font-medium">{edu.degree}</p>
                  <p className="text-emerald-700 dark:text-blue-400">{edu.field}</p>
                  <p className="text-stone-500 dark:text-slate-500 mt-2">{edu.institution}, {edu.location} ({edu.graduationYear})</p>
                  {edu.highlights && edu.highlights.length > 0 && (
                    <ul className="mt-3 space-y-1 text-sm text-stone-500 dark:text-slate-400 list-disc list-inside">
                      {edu.highlights.map((h, i) => <li key={i}>{h}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Certifications */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="md:col-span-1"
          >
            <div className="flex items-center gap-4 mb-6">
              <Award size={32} className="text-teal-600 dark:text-cyan-400" />
              <h3 className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-cyan-400">Certifications</h3>
            </div>
            
            <div className="space-y-8">
              {certifications.map((cert, idx) => (
                <div key={idx} className="relative pl-6 border-l border-emerald-700/30 dark:border-blue-600/30">
                  <div className="absolute left-[-5px] top-2 w-2 h-2 rounded-full bg-emerald-700 dark:bg-blue-400" />
                  <p className="text-xl text-stone-900 dark:text-white font-medium">{cert.name}</p>
                  <p className="text-emerald-700 dark:text-blue-400">{cert.issuer}</p>
                  <p className="text-stone-500 dark:text-slate-500 mt-2 text-sm">{cert.date}</p>
                  {cert.credentialId && (
                    <p className="text-xs text-stone-500 dark:text-slate-500 mt-1 font-mono">ID: {cert.credentialId}</p>
                  )}
                  {cert.url && (
                    <a href={cert.url} target="_blank" rel="noreferrer" className="inline-block mt-3 text-xs text-emerald-700 dark:text-blue-400 uppercase tracking-widest hover:text-emerald-900 dark:hover:text-white transition-colors">
                      View Credential →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
