import { describe, expect, it } from 'vitest'
import { DEFAULT_AVATAR_SYMBOLS, resolveAvatarSource } from './avatars'

describe('resolveAvatarSource', () => {
  const server = 'https://api.example.com'

  it('returns nothing for empty values', () => {
    expect(resolveAvatarSource(undefined, server)).toEqual({})
    expect(resolveAvatarSource(null, server)).toEqual({})
    expect(resolveAvatarSource('', server)).toEqual({})
  })

  it('treats bare values as emoji symbols', () => {
    expect(resolveAvatarSource('🤖', server)).toEqual({ symbol: '🤖' })
  })

  it('resolves custom: URLs relative to the server', () => {
    expect(resolveAvatarSource('custom:/uploads/icon.webp', server)).toEqual({
      url: 'https://api.example.com/uploads/icon.webp',
    })
    expect(resolveAvatarSource('custom:https://cdn.other.com/x.png', server)).toEqual({
      url: 'https://cdn.other.com/x.png',
    })
  })

  it('resolves absolute and server-relative paths', () => {
    expect(resolveAvatarSource('/uploads/a.png', server)).toEqual({ url: 'https://api.example.com/uploads/a.png' })
    expect(resolveAvatarSource('https://cdn.other.com/a.png', server)).toEqual({ url: 'https://cdn.other.com/a.png' })
  })

  it('strips a trailing slash from the server base', () => {
    expect(resolveAvatarSource('/uploads/a.png', 'https://api.example.com/')).toEqual({
      url: 'https://api.example.com/uploads/a.png',
    })
  })
})

describe('DEFAULT_AVATAR_SYMBOLS', () => {
  it('mirrors the legacy emoji defaults', () => {
    expect(DEFAULT_AVATAR_SYMBOLS.agent).toBe('👨‍💻')
    expect(DEFAULT_AVATAR_SYMBOLS.ai).toBe('🤖')
    expect(DEFAULT_AVATAR_SYMBOLS.visitor).toBe('👤')
  })
})
