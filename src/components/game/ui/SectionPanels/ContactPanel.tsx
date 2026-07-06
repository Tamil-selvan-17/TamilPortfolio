'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import profile from '@/content/profile.json'

export function ContactPanel() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({ name: '', email: '', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    let newErrors = { name: '', email: '', message: '' }
    let valid = true
    if (!form.name.trim()) { newErrors.name = 'Name is required'; valid = false }
    if (!form.email.includes('@')) { newErrors.email = 'Valid email is required'; valid = false }
    if (!form.message.trim()) { newErrors.message = 'Message is required'; valid = false }
    
    setErrors(newErrors)
    if (!valid) return

    setStatus('sending')
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
          from_name: "TamilselvanG",
          name: form.name,
          email: form.email,
          subject: "New Message from Portfolio Game",
          message: form.message
        })
      })

      const result = await response.json()
      console.log("Web3Forms Response:", result)
      
      if (!result.success) throw new Error(result.message || 'Failed to send')
      
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full">
      {/* Left: info */}
      <motion.div
        className="md:w-52 shrink-0 space-y-5"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div>
          <h3 className="text-xl font-black text-white mb-1">Let's Connect</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Open to full-time opportunities, freelance projects, and interesting collaborations.
          </p>
        </div>
        <div className="space-y-3">
          {[
            { icon: '✉️', label: 'Email', val: profile.email, href: `mailto:${profile.email}` },
            { icon: '📍', label: 'Location', val: profile.location, href: null },
            { icon: '🔗', label: 'LinkedIn', val: 'LinkedIn Profile', href: profile.links.linkedin },
            { icon: '🐙', label: 'GitHub', val: 'GitHub Profile', href: profile.links.github },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-2.5">
              <span className="text-lg mt-0.5">{item.icon}</span>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold">{item.label}</p>
                {item.href
                  ? <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">{item.val}</a>
                  : <p className="text-xs text-slate-300 capitalize">{item.val}</p>
                }
              </div>
            </div>
          ))}
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-500/10 border border-green-500/30">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-green-400 text-xs font-medium">{profile.availability.label}</span>
        </div>
      </motion.div>

      {/* Right: form */}
      <motion.form
        onSubmit={handleSubmit}
        className="flex-1 space-y-3"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {status === 'sent' ? (
          <div className="h-full flex items-center justify-center flex-col gap-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
              <span className="text-6xl">🎉</span>
            </motion.div>
            <p className="text-white font-bold text-xl">Message sent!</p>
            <p className="text-slate-400 text-sm text-center">Thanks for reaching out. I'll get back to you soon!</p>
          </div>
        ) : (
          <>
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1 block">Name</label>
              <input
                value={form.name}
                onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(err => ({ ...err, name: '' })) }}
                placeholder="Your name"
                className={`w-full bg-slate-800 border ${errors.name ? 'border-red-500' : 'border-slate-700'} rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1 block">Email</label>
              <input
                type="email" value={form.email}
                onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(err => ({ ...err, email: '' })) }}
                placeholder="your@email.com"
                className={`w-full bg-slate-800 border ${errors.email ? 'border-red-500' : 'border-slate-700'} rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1 block">Message</label>
              <textarea
                rows={5} value={form.message}
                onChange={e => { setForm(f => ({ ...f, message: e.target.value })); setErrors(err => ({ ...err, message: '' })) }}
                placeholder="Your message..."
                className={`w-full bg-slate-800 border ${errors.message ? 'border-red-500' : 'border-slate-700'} rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none`}
              />
              {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
            </div>
            <motion.button
              type="submit"
              disabled={status === 'sending'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm disabled:opacity-60 transition-all"
            >
              {status === 'sending' ? '📤 Sending...' : '✉️ Send Message'}
            </motion.button>
          </>
        )}
      </motion.form>
    </div>
  )
}
