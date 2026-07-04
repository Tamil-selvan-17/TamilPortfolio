export interface TenureResult {
  years: number
  months: number
  days: number
  totalDays: number
}

/**
 * Calculates the tenure between a start date and an end date.
 * If endDate is null, treats "today" as the end — so the counter
 * advances every day without any redeploy.
 */
export function getTenure(startDate: string, endDate: string | null): TenureResult {
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : new Date()

  const totalMs = end.getTime() - start.getTime()
  const totalDays = Math.floor(totalMs / 86_400_000)

  const years = Math.floor(totalDays / 365.25)
  const remainingDaysAfterYears = totalDays - Math.floor(years * 365.25)
  const months = Math.floor(remainingDaysAfterYears / 30.44)
  const days = Math.floor(remainingDaysAfterYears - months * 30.44)

  return { years, months, days, totalDays }
}

/**
 * Returns the number of whole days since a given date.
 */
export function getDaysSince(date: string): number {
  const past = new Date(date)
  const now = new Date()
  return Math.floor((now.getTime() - past.getTime()) / 86_400_000)
}

/**
 * Formats a date string (YYYY-MM-DD) to a human-readable "Month Year" string.
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Formats a date range. endDate null becomes "Present".
 */
export function formatDateRange(startDate: string, endDate: string | null): string {
  const start = formatDate(startDate)
  const end = endDate ? formatDate(endDate) : 'Present'
  return `${start} – ${end}`
}

/**
 * Returns a short "Mon YYYY" formatted date.
 */
export function formatShortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}
