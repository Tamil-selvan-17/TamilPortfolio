'use client'

import { useEffect, useState } from 'react'
import { getTenure, type TenureResult } from '@/lib/date-utils'

/**
 * Returns a live-computed tenure from startDate to "today".
 * Recalculates on every mount — so the counter advances every day
 * without any redeployment. Perfect for the "days and counting" hero stat.
 */
export function useLiveTenure(startDate: string, endDate: string | null = null): TenureResult {
  const [tenure, setTenure] = useState<TenureResult>(() =>
    getTenure(startDate, endDate)
  )

  useEffect(() => {
    // Recalculate immediately on mount (client may differ from SSR snapshot)
    setTenure(getTenure(startDate, endDate))

    // Recalculate at midnight every day
    const now = new Date()
    const midnight = new Date(now)
    midnight.setHours(24, 0, 0, 0)
    const msUntilMidnight = midnight.getTime() - now.getTime()

    const timeout = setTimeout(() => {
      setTenure(getTenure(startDate, endDate))
    }, msUntilMidnight)

    return () => clearTimeout(timeout)
  }, [startDate, endDate])

  return tenure
}
