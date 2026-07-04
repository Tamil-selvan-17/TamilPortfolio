'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipForward, SkipBack, Music, Volume2, VolumeX, ChevronDown } from 'lucide-react'
import { siteConfig } from '@/config/site.config'

type Track = { title: string; artist: string; src: string }

export function MusicPlayer() {
  const tracks: Track[] = siteConfig.music
  const [trackIdx, setTrackIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const track = tracks[trackIdx]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const update = () => setProgress(audio.duration ? audio.currentTime / audio.duration : 0)
    audio.addEventListener('timeupdate', update)
    audio.addEventListener('ended', next)
    return () => {
      audio.removeEventListener('timeupdate', update)
      audio.removeEventListener('ended', next)
    }
  }, [trackIdx])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.play().catch(() => {}); setPlaying(true) }
  }

  function next() {
    setTrackIdx((i) => (i + 1) % tracks.length)
    setPlaying(false)
    setTimeout(() => { audioRef.current?.play().catch(() => {}); setPlaying(true) }, 50)
  }

  function prev() {
    setTrackIdx((i) => (i - 1 + tracks.length) % tracks.length)
    setPlaying(false)
    setTimeout(() => { audioRef.current?.play().catch(() => {}); setPlaying(true) }, 50)
  }

  if (!siteConfig.features.musicPlayer) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 no-print">
      <audio ref={audioRef} src={track.src} muted={muted} />

      <motion.div
        layout
        className="glass rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
        animate={{ width: expanded ? 240 : 56 }}
        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
      >
        {expanded ? (
          <div className="p-3 w-60">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg gradient-bg flex items-center justify-center">
                  <Music size={11} className="text-white" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">Now Playing</span>
              </div>
              <button onClick={() => setExpanded(false)} className="text-muted-foreground hover:text-foreground">
                <ChevronDown size={14} />
              </button>
            </div>

            {/* Track info */}
            <div className="mb-3">
              <p className="text-sm font-semibold truncate">{track.title}</p>
              <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 bg-white/10 rounded-full mb-3 overflow-hidden">
              <div
                className="h-full gradient-bg rounded-full transition-all duration-200"
                style={{ width: `${progress * 100}%` }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <button onClick={() => setMuted((m) => !m)} className="text-muted-foreground hover:text-foreground">
                {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
              <div className="flex items-center gap-2">
                <button onClick={prev} className="text-muted-foreground hover:text-foreground">
                  <SkipBack size={14} />
                </button>
                <button
                  onClick={togglePlay}
                  className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white shadow-lg"
                >
                  {playing ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
                </button>
                <button onClick={next} className="text-muted-foreground hover:text-foreground">
                  <SkipForward size={14} />
                </button>
              </div>
              <div className="w-5" />
            </div>
          </div>
        ) : (
          <button
            onClick={() => setExpanded(true)}
            className="w-14 h-14 flex items-center justify-center"
            aria-label="Open music player"
          >
            <div className="relative">
              <Music size={18} className="text-indigo-400" />
              {playing && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </div>
          </button>
        )}
      </motion.div>
    </div>
  )
}
