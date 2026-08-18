import { describe, expect, it } from 'vitest'
import {
  WIDGET_MARGIN,
  bubbleDiameter,
  isSmallScreen,
  parsePosition,
} from './useWidgetPosition'

describe('parsePosition', () => {
  it('parses the legacy "xy:x,y" format', () => {
    expect(parsePosition('xy:120,340')).toEqual({ x: 120, y: 340 })
  })

  it('rejects malformed values', () => {
    expect(parsePosition(null)).toBeNull()
    expect(parsePosition(undefined)).toBeNull()
    expect(parsePosition('')).toBeNull()
    expect(parsePosition('bottom-right')).toBeNull()
    expect(parsePosition('xy:abc,def')).toBeNull()
    expect(parsePosition('xy:12')).toBeNull()
    expect(parsePosition('xy:,340')).toBeNull()
  })

  it('rounds decimals', () => {
    expect(parsePosition('xy:12.6,340.2')).toEqual({ x: 12, y: 340 })
  })
})

describe('bubbleDiameter', () => {
  it('maps site bubble sizes to diameters', () => {
    expect(bubbleDiameter('small')).toBe(48)
    expect(bubbleDiameter('medium')).toBe(56)
    expect(bubbleDiameter('large')).toBe(64)
    expect(bubbleDiameter(undefined)).toBe(56)
    expect(bubbleDiameter('weird')).toBe(56)
  })
})

describe('isSmallScreen', () => {
  it('flags <= 640px viewports as mobile', () => {
    expect(isSmallScreen(640)).toBe(true)
    expect(isSmallScreen(639)).toBe(true)
    expect(isSmallScreen(641)).toBe(false)
  })
})

describe('layout constants', () => {
  it('keeps the widget margin consistent', () => {
    expect(WIDGET_MARGIN).toBe(12)
  })
})
