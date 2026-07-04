'use client'

import React from 'react'
import Link from 'next/link'

interface CornerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  href?: string
  target?: string
  className?: string
  active?: boolean
}

export function CornerButton({ 
  children, 
  href, 
  target, 
  className = '', 
  active = false,
  ...props 
}: CornerButtonProps) {
  const baseClasses = `
    group relative px-6 py-3 terminal-text tracking-widest text-xs transition-colors overflow-hidden inline-block text-center
    ${active ? 'text-[#94e6fb]' : 'text-[#f8fafc] hover:text-[#94e6fb]'}
    ${className}
  `

  const innerContent = (
    <>
      <div className="relative z-10 flex items-center justify-center gap-2">{children}</div>
      
      {/* Background glow on hover or active */}
      <div className={`
        absolute inset-0 bg-[#94e6fb]/10 transition-transform duration-500 ease-[0.16,1,0.3,1]
        ${active ? 'translate-y-0' : 'translate-y-[100%] group-hover:translate-y-0'}
      `} />
      
      {/* Corner Accents */}
      <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l border-[#94e6fb] transition-all duration-300 ${active ? 'w-full h-full opacity-50' : 'group-hover:w-full group-hover:h-full group-hover:opacity-50'}`} />
      <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r border-[#94e6fb] transition-all duration-300 ${active ? 'w-full h-full opacity-50' : 'group-hover:w-full group-hover:h-full group-hover:opacity-50'}`} />
      <div className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#94e6fb] transition-all duration-300 ${active ? 'w-full h-full opacity-50' : 'group-hover:w-full group-hover:h-full group-hover:opacity-50'}`} />
      <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#94e6fb] transition-all duration-300 ${active ? 'w-full h-full opacity-50' : 'group-hover:w-full group-hover:h-full group-hover:opacity-50'}`} />
    </>
  )

  if (href) {
    if (href.startsWith('http') || target === '_blank') {
      return (
        <a href={href} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined} className={baseClasses}>
          {innerContent}
        </a>
      )
    }
    return (
      <Link href={href} className={baseClasses}>
        {innerContent}
      </Link>
    )
  }

  return (
    <button className={baseClasses} {...props}>
      {innerContent}
    </button>
  )
}
