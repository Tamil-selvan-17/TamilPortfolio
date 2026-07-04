'use client'

import { useLenis } from '@/hooks/useLenis'

/**
 * Thin client component whose only job is to initialise
 * the Lenis smooth-scroll instance for the whole page.
 * Mounted once in the root layout.
 */
export function LenisProvider() {
  useLenis()
  return null
}
