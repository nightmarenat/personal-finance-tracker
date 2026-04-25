const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

export function formatAmount(amount: number): string {
  return '฿' + amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

/** Parse sheet date string — handles M/D/YYYY and ISO 8601 formats */
export function parseSheetDate(dateStr: string): Date {
  // ISO format: 2026-04-05T17:00:00.000Z or 2026-04-05
  if (dateStr.includes('-')) {
    const d = new Date(dateStr)
    // Use UTC values to avoid timezone shift
    return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  }
  // Legacy M/D/YYYY format
  const [month, day, year] = dateStr.split('/')
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
}

/** Format date for display: DD MMM YYYY */
export function formatDisplayDate(dateStr: string): string {
  const d = parseSheetDate(dateStr)
  const day = d.getDate().toString().padStart(2, '0')
  const month = MONTHS_SHORT[d.getMonth()]
  return `${day} ${month} ${d.getFullYear()}`
}

/** Format Date → M/D/YYYY for storing in sheet */
export function toSheetDate(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
}

/** Format Date → "Today, 24 Apr" or "24 Apr" */
export function formatDateBar(date: Date): string {
  const today = new Date()
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()

  const day = date.getDate()
  const month = MONTHS_SHORT[date.getMonth()]
  return isToday ? `Today, ${day} ${month}` : `${day} ${month} ${date.getFullYear()}`
}

/** Month label: "April 2026" */
export function formatMonthYear(year: number, month: number): string {
  return `${MONTHS[month]} ${year}`
}

/** Check if a sheet date string belongs to the given year/month */
export function isInMonth(dateStr: string, year: number, month: number): boolean {
  const d = parseSheetDate(dateStr)
  return d.getFullYear() === year && d.getMonth() === month
}
