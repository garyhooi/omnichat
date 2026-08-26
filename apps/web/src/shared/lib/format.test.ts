import { describe, expect, it } from 'vitest'
import {
  formatBytes,
  formatTicketId,
  formatTime,
  formatTimeOnly,
  timeAgo,
  truncate,
} from './format'

describe('formatTicketId', () => {
  it('takes the last 8 chars upper-cased', () => {
    expect(formatTicketId('6a80b819c3425ba2eb1c8006')).toBe('EB1C8006')
    expect(formatTicketId('short')).toBe('SHORT')
  })
})

describe('formatBytes', () => {
  it('formats byte sizes', () => {
    expect(formatBytes(162)).toBe('162 B')
    expect(formatBytes(2048)).toBe('2.0 KB')
    expect(formatBytes(3.3 * 1024)).toBe('3.3 KB')
    expect(formatBytes(5 * 1024 * 1024)).toBe('5.0 MB')
  })
})

describe('formatTime / formatTimeOnly', () => {
  it('formats ISO timestamps', () => {
    const iso = '2026-08-16T02:30:00.000Z'
    expect(formatTimeOnly(iso)).toMatch(/^\d{1,2}:\d{2}/)
    expect(formatTime(iso)).toContain(':')
  })

  it('returns empty for invalid dates', () => {
    expect(formatTime('nope')).toBe('')
    expect(formatTimeOnly('nope')).toBe('')
  })
})

describe('timeAgo', () => {
  it('handles recent and older timestamps', () => {
    const now = Date.now()
    expect(timeAgo(new Date(now - 30_000).toISOString())).toBe('just now')
    expect(timeAgo(new Date(now - 5 * 60_000).toISOString())).toBe('5m ago')
    expect(timeAgo(new Date(now - 3 * 3600_000).toISOString())).toBe('3h ago')
    expect(timeAgo(new Date(now - 2 * 86_400_000).toISOString())).toBe('2d ago')
    expect(timeAgo('bad')).toBe('')
  })
})

describe('truncate', () => {
  it('collapses whitespace and truncates at the limit', () => {
    expect(truncate('  hello   world  ', 50)).toBe('hello world')
    expect(truncate('x'.repeat(100), 50)).toHaveLength(50)
    expect(truncate('x'.repeat(100), 50).endsWith('…')).toBe(true)
  })
})
