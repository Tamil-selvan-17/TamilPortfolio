'use client'

import { useCountUp } from '@/hooks/useCountUp'
import type { ReactNode } from 'react'

interface AnimatedNumberProps {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
  className?: string
}

export function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 2,
  className,
}: AnimatedNumberProps) {
  const { count, ref } = useCountUp({ end: value, duration, decimals })

  return (
    <span ref={ref} className={className}>
      {prefix}{decimals > 0 ? count.toFixed(decimals) : Math.round(count)}{suffix}
    </span>
  )
}
