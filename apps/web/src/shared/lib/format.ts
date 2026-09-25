// =============================================================================
// Formatting helpers shared across all four apps.
//
// Date/time output honours the admin-configured display timezone
// (SiteConfig.displayTimezone): callers pass it in, so a component re-renders
// when the config arrives. Storing nothing keeps the viewer's own zone.
// =============================================================================

/** Last 8 chars of a Mongo ObjectId, upper-cased — the display "ticket" id. */
export function formatTicketId(id: string): string {
  return id.slice(-8).toUpperCase()
}

const FORMATTERS = new Map<string, Intl.DateTimeFormat>()

/**
 * Cached Intl formatter for the given display zone. A stored zone the runtime
 * cannot resolve degrades to the viewer's zone rather than throwing on render.
 */
function formatter(options: Intl.DateTimeFormatOptions, timeZone?: string): Intl.DateTimeFormat {
  const key = (timeZone || '') + '|' + JSON.stringify(options)
  const cached = FORMATTERS.get(key)
  if (cached) return cached
  let made: Intl.DateTimeFormat
  try {
    made = new Intl.DateTimeFormat(undefined, timeZone ? { ...options, timeZone } : options)
  } catch {
    made = new Intl.DateTimeFormat(undefined, options)
  }
  FORMATTERS.set(key, made)
  return made
}

function toDate(iso: string): Date | null {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? null : d
}

/** Calendar day of an instant as observed in the display zone. */
function dayParts(d: Date, timeZone?: string): { year: number; month: number; day: number } {
  if (!timeZone) return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() }
  const parts = formatter({ year: 'numeric', month: '2-digit', day: '2-digit' }, timeZone).formatToParts(d)
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value)
  return { year: get('year'), month: get('month'), day: get('day') }
}

/** "Sep 25, 10:10 AM". */
export function formatTime(iso: string, timeZone?: string): string {
  const d = toDate(iso)
  if (!d) return ''
  return formatter({ month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }, timeZone).format(d)
}

/** "10:10 AM". */
export function formatTimeOnly(iso: string, timeZone?: string): string {
  const d = toDate(iso)
  if (!d) return ''
  return formatter({ hour: '2-digit', minute: '2-digit' }, timeZone).format(d)
}

/** "Sep 25" — the year is only worth showing when it is not the current one. */
export function formatDate(iso: string, timeZone?: string): string {
  const d = toDate(iso)
  if (!d) return ''
  const sameYear = dayParts(d, timeZone).year === dayParts(new Date(), timeZone).year
  return formatter(
    sameYear
      ? { month: 'short', day: 'numeric' }
      : { month: 'short', day: 'numeric', year: 'numeric' },
    timeZone,
  ).format(d)
}

/** "Sep 25, 2026, 10:10:00 AM" — logs and user tables. */
export function formatDateTime(iso: string, timeZone?: string): string {
  const d = toDate(iso)
  if (!d) return ''
  return formatter(
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    },
    timeZone,
  ).format(d)
}

/** True when both instants fall on the same calendar day in the display zone. */
export function isSameDisplayDay(a: string, b: string, timeZone?: string): boolean {
  const da = toDate(a)
  const db = toDate(b)
  if (!da || !db) return false
  const pa = dayParts(da, timeZone)
  const pb = dayParts(db, timeZone)
  return pa.year === pb.year && pa.month === pb.month && pa.day === pb.day
}

/** Today as "YYYY-MM-DD" in the display zone — date-range defaults. */
export function todayIso(timeZone?: string): string {
  const { year, month, day } = dayParts(new Date(), timeZone)
  return year + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0')
}

/** Offset (ms) of a display zone at an instant: its wall clock minus UTC. */
function zoneOffsetMs(instant: Date, timeZone: string): number {
  // Truncate to the second: the wall-clock parts carry no milliseconds, so a
  // sub-second remainder here would skew the resulting boundary by up to 1s.
  const whole = new Date(Math.floor(instant.getTime() / 1000) * 1000)
  const parts = formatter(
    {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    },
    timeZone,
  ).formatToParts(whole)
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value)
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour') % 24, get('minute'), get('second'))
  return asUtc - whole.getTime()
}

/**
 * Exact ISO instant of a "YYYY-MM-DD" day boundary as observed in the display
 * zone. The conversation/report filters send these, so a day window means that
 * day where the operator is — not where the API server happens to run.
 */
export function zonedDayBoundaryIso(date: string, timeZone?: string, endOfDay = false): string {
  const [y, m, d] = date.split('-').map(Number)
  const year = y || new Date().getFullYear()
  const month = (m || 1) - 1
  const day = d || 1
  if (!timeZone) {
    return endOfDay
      ? new Date(year, month, day, 23, 59, 59, 999).toISOString()
      : new Date(year, month, day).toISOString()
  }
  const guess = endOfDay
    ? Date.UTC(year, month, day, 23, 59, 59, 999)
    : Date.UTC(year, month, day)
  // Two correction passes: the offset can itself move across a DST boundary.
  const first = new Date(guess - zoneOffsetMs(new Date(guess), timeZone))
  return new Date(guess - zoneOffsetMs(first, timeZone)).toISOString()
}

/** "just now", "5m ago", "2h ago", "3d ago", then the date. */
export function timeAgo(iso: string, timeZone?: string): string {
  const d = new Date(iso).getTime()
  if (Number.isNaN(d)) return ''
  const seconds = Math.max(0, Math.floor((Date.now() - d) / 1000))
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return minutes + 'm ago'
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return hours + 'h ago'
  const days = Math.floor(hours / 24)
  if (days < 7) return days + 'd ago'
  return formatDate(iso, timeZone)
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

/** Truncate a message preview to ~50 chars for list rows. */
export function truncate(text: string, max = 50): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  return clean.length > max ? clean.slice(0, max - 1) + '…' : clean
}

export function djb2Hash(str: string): string {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0
  }
  return (hash >>> 0).toString(36)
}
