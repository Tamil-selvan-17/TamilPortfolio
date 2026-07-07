'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Mail, Copy, MapPin, Phone, 
  CheckCircle, Loader2, Calendar, 
  Clock, Globe, ChevronLeft, ChevronRight, Video
} from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/shared/BrandIcons'
import { siteConfig } from '@/config/site.config'
import { Canvas } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(4, 'Subject must be at least 4 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
  _hp: z.string().max(0, ''), // honeypot
})

type ContactForm = z.infer<typeof contactSchema>

export function ContactCTA() {
  const [activeTab, setActiveTab] = useState<'form' | 'calendar'>('form')
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  
  // Real Date Logic for Mockup
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date(2026, 6, 1)) // Defaults to July 2026
  const [selectedDateObj, setSelectedDateObj] = useState<Date>(new Date(2026, 6, 3))
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM')
  const [bookCallEmail, setBookCallEmail] = useState<string>('')
  const [bookCallErrorText, setBookCallErrorText] = useState<string>('')
  const [bookCallStatus, setBookCallStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const daysInMonth = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), 1).getDay()

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1))
  }
  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1))
  }

  const formatSelectedDate = () => {
    return selectedDateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }
  const formatCurrentMonth = () => {
    return currentMonthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    defaultValues: { _hp: '' },
  })

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  async function onSubmit(data: ContactForm) {
    if (data._hp) return
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
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message
        })
      })

      const result = await response.json()
      console.log("Web3Forms Response:", result)
      
      if (!result.success) throw new Error(result.message || 'Failed to send')
      
      setStatus('success')
      reset()
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  const handleBookCall = async () => {
    if (!bookCallEmail || !bookCallEmail.includes('@')) {
      setBookCallErrorText("Please enter a valid email address.")
      return
    }
    setBookCallErrorText('')
    setBookCallStatus('sending')
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
          name: "Book Call Request",
          email: bookCallEmail,
          subject: "New Meeting Booked",
          message: `Meeting requested for ${formatSelectedDate()} at ${selectedTime}.\nEmail: ${bookCallEmail}`
        })
      })

      const result = await response.json()
      if (!result.success) throw new Error(result.message || 'Failed to send')
      
      setBookCallStatus('success')
    } catch (err) {
      console.error(err)
      setBookCallStatus('error')
    }
  }

  // Helper for input styles
  const inputClass = (hasError: boolean) =>
    `w-full bg-transparent border rounded-lg px-4 py-3 text-sm outline-none
     transition-all duration-200 placeholder:text-stone-400 dark:placeholder:text-slate-500
     focus:ring-2 focus:ring-blue-500/20 text-stone-800 dark:text-white
     ${hasError 
       ? 'border-red-400 focus:border-red-500' 
       : 'border-stone-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400'
     }`

  return (
    <section id="contact" className="py-20 px-4 md:px-8 w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* 3D Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none -z-10">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={1} />
          <Sparkles count={150} scale={15} size={2} speed={0.4} opacity={0.6} color="#3b82f6" />
          <Sparkles count={100} scale={12} size={4} speed={0.2} opacity={0.4} color="#10b981" />
          <Sparkles count={50} scale={10} size={6} speed={0.3} opacity={0.3} color="#8b5cf6" />
        </Canvas>
      </div>

      <div className="max-w-5xl w-full mx-auto flex flex-col items-center relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-10 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-bold text-stone-900 dark:text-white mb-4 font-sans tracking-tight">
            Get in touch
          </h2>
          
          <button 
            onClick={() => copyToClipboard(siteConfig.social.email, 'header-email')}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mb-6 group"
          >
            {copiedField === 'header-email' ? <CheckCircle size={18} /> : <Copy size={18} className="group-hover:scale-110 transition-transform" />}
            <span className="text-sm font-medium">{siteConfig.social.email}</span>
          </button>

          <div className="flex items-center gap-4 text-stone-600 dark:text-slate-400 mb-10">
            {siteConfig.social.linkedin && (
              <a href={siteConfig.social.linkedin} target="_blank" rel="noreferrer" className="hover:text-stone-900 dark:hover:text-white transition-colors">
                <LinkedinIcon style={{ width: 20, height: 20 }} />
              </a>
            )}
            {siteConfig.social.github && (
              <a href={siteConfig.social.github} target="_blank" rel="noreferrer" className="hover:text-stone-900 dark:hover:text-white transition-colors">
                <GithubIcon style={{ width: 20, height: 20 }} />
              </a>
            )}
            <a href="#" className="hover:text-stone-900 dark:hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
            <a href="#" className="hover:text-stone-900 dark:hover:text-white transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
          </div>

          {/* Toggle Button */}
          <div className="flex p-1 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-stone-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'form' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-stone-600 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Fill a Form
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === 'calendar' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-stone-600 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              Book a Call
            </button>
          </div>
        </div>

        {/* Main Card Container */}
        <div className="w-full bg-white dark:bg-slate-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] border border-stone-100 dark:border-slate-800 overflow-hidden relative min-h-[500px]">
          <AnimatePresence mode="wait">
            
            {/* ---------------- FORM VIEW ---------------- */}
            {activeTab === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 w-full"
              >
                {/* Left: Contact Details & Map */}
                <div className="flex flex-col gap-6">
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                      <MapPin size={20} className="text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-stone-900 dark:text-white">Address:</p>
                      <p className="text-sm text-stone-600 dark:text-slate-400">Porur, Chennai</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group cursor-pointer" onClick={() => copyToClipboard('+91 7200206323', 'phone')}>
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                      <Phone size={20} className="text-blue-500" />
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-stone-900 dark:text-white">Call Us:</p>
                      <p className="text-sm text-stone-600 dark:text-slate-400">+91 7200206323</p>
                      {copiedField === 'phone' ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} className="text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group cursor-pointer" onClick={() => copyToClipboard(siteConfig.social.email, 'email')}>
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                      <Mail size={20} className="text-purple-500" />
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-stone-900 dark:text-white">Email:</p>
                      <p className="text-sm text-stone-600 dark:text-slate-400">{siteConfig.social.email}</p>
                      {copiedField === 'email' ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} className="text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </div>
                  </div>

                  {/* Google Maps Embed */}
                  <div className="w-full h-48 rounded-xl overflow-hidden border border-stone-200 dark:border-slate-700 mt-2 bg-stone-100 dark:bg-slate-800">
                    <iframe 
                      src="https://maps.google.com/maps?q=Porur,+Chennai,+Tamil+Nadu&t=&z=13&ie=UTF8&iwloc=&output=embed"
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Porur, Chennai Map"
                    />
                  </div>
                </div>

                {/* Right: Form */}
                <div className="w-full">
                  {status === 'success' ? (
                    <div className="flex flex-col items-center justify-center text-center h-full min-h-[300px] gap-4">
                      <CheckCircle size={48} className="text-emerald-500" />
                      <h3 className="text-xl font-bold text-stone-900 dark:text-white">Message sent!</h3>
                      <p className="text-sm text-stone-500 dark:text-slate-400">Thanks for reaching out. I'll get back to you shortly.</p>
                      <button onClick={() => setStatus('idle')} className="text-sm text-blue-500 hover:underline mt-2">Send another message</button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                      <input type="text" {...register('_hp')} className="hidden" aria-hidden="true" tabIndex={-1} />
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <input {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })} placeholder="Your Name" className={inputClass(!!errors.name)} />
                          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>
                        <div className="flex flex-col">
                          <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Valid email is required' } })} placeholder="Your Email" type="email" className={inputClass(!!errors.email)} />
                          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                      </div>
                      
                      <div className="flex flex-col">
                        <input {...register('subject', { required: 'Subject is required', minLength: { value: 4, message: 'Subject must be at least 4 characters' } })} placeholder="Subject" className={inputClass(!!errors.subject)} />
                        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                      </div>
                      
                      <div className="flex flex-col">
                        <textarea {...register('message', { required: 'Message is required', minLength: { value: 20, message: 'Message must be at least 20 characters' } })} placeholder="Message" rows={5} className={`${inputClass(!!errors.message)} resize-none`} />
                        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                      </div>

                      {status === 'error' && <p className="text-sm text-red-500">Something went wrong. Please try emailing me directly.</p>}

                      <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg border border-blue-500 text-blue-600 dark:text-blue-400 font-medium text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50 transition-colors"
                      >
                        {status === 'sending' ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : 'Send Message'}
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            )}

            {/* ---------------- CALENDAR VIEW (Mockup) ---------------- */}
            {activeTab === 'calendar' && (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="p-6 md:p-10 flex flex-col lg:flex-row gap-8 lg:gap-12 w-full h-full"
              >
                {/* Left: Meeting Details */}
                <div className="w-full lg:w-1/3 flex flex-col border-b lg:border-b-0 lg:border-r border-stone-200 dark:border-slate-700 pb-8 lg:pb-0 lg:pr-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm border border-stone-200 dark:border-slate-700 shrink-0">
                      <img src="/images/logo1.jpg" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-xl font-bold text-stone-900 dark:text-white">Tamil Selvan</h3>
                  </div>

                  <p className="text-stone-600 dark:text-slate-300 font-medium mb-6">{formatSelectedDate()}</p>
                  
                  <div className="flex items-center gap-3 py-3 border-b border-stone-100 dark:border-slate-800 text-sm text-stone-600 dark:text-slate-400">
                    <Globe size={18} className="text-blue-500" />
                    <select className="bg-transparent outline-none flex-1 font-medium cursor-pointer appearance-none">
                      <option>Asia/Kolkata</option>
                      <option>America/New_York</option>
                      <option>Europe/London</option>
                    </select>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <p className="text-xs text-stone-400 dark:text-slate-500 uppercase tracking-wide font-semibold mb-1">Duration</p>
                      <div className="flex items-center gap-2 text-stone-700 dark:text-slate-300 font-medium">
                        <Clock size={16} /> 30 min
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-stone-400 dark:text-slate-500 uppercase tracking-wide font-semibold mb-1">Meeting Type</p>
                      <div className="flex items-center gap-2 text-stone-700 dark:text-slate-300 font-medium">
                        <Video size={16} className="text-blue-500" /> Google Meet
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Calendar Grid & Timeslots, then Email at bottom */}
                <div className="w-full lg:w-2/3 flex flex-col gap-10">
                  
                  <div className="flex flex-col md:flex-row gap-10">
                    {/* Calendar Matrix */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-8">
                        <button onClick={handlePrevMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-500 dark:text-slate-400 transition-colors"><ChevronLeft size={18} /></button>
                        <h4 className="font-bold text-stone-900 dark:text-white">{formatCurrentMonth()}</h4>
                        <button onClick={handleNextMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 dark:hover:bg-slate-800 text-stone-500 dark:text-slate-400 transition-colors"><ChevronRight size={18} /></button>
                      </div>

                      <div className="grid grid-cols-7 gap-y-6 gap-x-2 text-center text-sm">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                          <div key={day} className="text-stone-400 dark:text-slate-500 font-semibold text-xs tracking-wider uppercase">{day}</div>
                        ))}
                        
                        {/* Empty slots for start of month */}
                        {[...Array(firstDayOfMonth)].map((_, i) => <div key={`empty-${i}`} />)}
                        
                        {/* Dates */}
                        {[...Array(daysInMonth)].map((_, i) => {
                          const date = i + 1
                          const isSelected = date === selectedDateObj.getDate() && 
                                             currentMonthDate.getMonth() === selectedDateObj.getMonth() && 
                                             currentMonthDate.getFullYear() === selectedDateObj.getFullYear()
                          return (
                            <div key={date} className="flex justify-center">
                              <button 
                                onClick={() => setSelectedDateObj(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), date))}
                                className={`w-9 h-9 rounded-full flex items-center justify-center font-medium transition-all duration-300
                                  ${isSelected 
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-110' 
                                    : 'text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 hover:text-stone-900 dark:hover:text-white'
                                  }`}
                              >
                                {date}
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Time Slots */}
                    <div className="w-full md:w-[180px] flex flex-col gap-4">
                      <div className="text-sm font-bold text-stone-900 dark:text-white mb-2 md:mb-4">Select Time</div>
                      <div className="flex flex-col gap-2.5 max-h-[280px] overflow-y-auto pr-3 custom-scrollbar">
                        {['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM'].map(time => (
                          <button 
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`w-full py-3 border rounded-xl text-sm font-semibold transition-all duration-300
                              ${selectedTime === time
                                ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                                : 'border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400'
                              }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="h-px w-full bg-stone-100 dark:bg-slate-800/80"></div>

                  {/* Email Input - Modern sleek style */}
                  <div className="w-full">
                    <label className="block text-sm font-semibold text-stone-900 dark:text-white mb-3">Enter your email to book</label>
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      <div className="flex-1 w-full flex flex-col">
                        <input 
                          type="email" 
                          value={bookCallEmail}
                          onChange={(e) => {
                            setBookCallEmail(e.target.value)
                            setBookCallErrorText('')
                          }}
                          placeholder="hello@example.com"
                          className={`w-full px-5 py-3.5 rounded-xl border ${bookCallErrorText ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-800/50'} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-stone-900 dark:text-slate-100 transition-all shadow-sm`}
                          disabled={bookCallStatus === 'sending' || bookCallStatus === 'success'}
                        />
                        {bookCallErrorText && <p className="text-red-500 text-xs mt-2 px-1 font-medium">{bookCallErrorText}</p>}
                      </div>
                      <button 
                        onClick={handleBookCall}
                        disabled={bookCallStatus === 'sending' || bookCallStatus === 'success'}
                        className="w-full sm:w-auto shrink-0 px-8 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {bookCallStatus === 'sending' && <Loader2 className="w-4 h-4 animate-spin" />}
                        {bookCallStatus === 'success' ? 'Booking Confirmed' : 'Confirm Booking'}
                      </button>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
