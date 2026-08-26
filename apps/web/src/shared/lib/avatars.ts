// =============================================================================
// Avatar source resolution — the backend stores avatar values as either an
// emoji, a "custom:…" URL, an absolute URL, or a server-relative path.
// =============================================================================

export interface AvatarSource {
  url?: string
  symbol?: string
}

export function resolveAvatarSource(raw: string | undefined | null, serverUrl: string): AvatarSource {
  if (!raw) return {}
  const base = serverUrl.replace(/\/$/, '')
  if (raw.startsWith('custom:')) {
    const url = raw.slice(7)
    return { url: url.startsWith('http') ? url : base + url }
  }
  if (raw.startsWith('http')) return { url: raw }
  if (raw.startsWith('/')) return { url: base + raw }
  return { symbol: raw }
}

export const DEFAULT_AVATAR_SYMBOLS = {
  agent: '👨‍💻',
  ai: '🤖',
  visitor: '👤',
} as const
