'use client'

import { useEffect, useState } from 'react'

interface CommandPaletteState {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
  query: string
  setQuery: (q: string) => void
}

/**
 * Manages command palette open/close state and Cmd+K / Ctrl+K binding.
 */
export function useCommandPalette(): CommandPaletteState {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', down)
    return () => window.removeEventListener('keydown', down)
  }, [])

  // Clear query when palette closes
  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  return {
    open,
    setOpen,
    toggle: () => setOpen((p) => !p),
    query,
    setQuery,
  }
}
