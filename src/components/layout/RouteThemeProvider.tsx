'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const routeThemes: Record<string, string> = {
  '/': 'theme-ocean', // Default deep navy
  '/projects': 'theme-cyberpunk',
  '/experience': 'theme-forest',
  '/about': 'theme-solar',
  '/contact': 'theme-noir',
}

export function RouteThemeProvider() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    
    // Remove all existing theme classes
    const existingClasses = Array.from(root.classList).filter(c => c.startsWith('theme-'))
    existingClasses.forEach(c => root.classList.remove(c))

    // Add the new theme class based on exact path match or fallback
    let newTheme = 'theme-ocean' // default
    
    if (pathname) {
      if (pathname.startsWith('/projects/') && pathname !== '/projects') {
        newTheme = 'theme-cyberpunk' // Individual case studies also cyberpunk
      } else {
        newTheme = routeThemes[pathname] || 'theme-ocean'
      }
    }

    root.classList.add(newTheme)
  }, [pathname])

  return null
}
