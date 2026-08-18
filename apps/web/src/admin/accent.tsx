// =============================================================================
// Site accent — the admin portal's buttons/highlights follow the site's
// configured bubble color (Settings → Widget appearance). Loaded from the
// public /config/active endpoint and applied as the --adm-accent CSS variable
// on the portal root, so every adm-* style picks it up automatically.
// =============================================================================

import type { CSSProperties, ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { authFetchJson } from '../shared/lib/api-client'

const accentKey = (serverUrl: string) => ['site-accent', serverUrl] as const

export function useSiteAccent(serverUrl: string): string {
  const { data } = useQuery<{ bubbleColor?: string }>({
    queryKey: accentKey(serverUrl),
    enabled: !!serverUrl,
    queryFn: () => authFetchJson<{ bubbleColor?: string }>(`${serverUrl}/config/active`),
    staleTime: 5 * 60_000,
    placeholderData: {},
  })
  return data?.bubbleColor || '#4f46e5'
}

/** Wrapper that themes the whole portal subtree with the site accent.
 *  Must fill the host element (height 100%) so the .adm-shell 100% chain
 *  works inside any embedded container. */
export function AccentProvider({ serverUrl, children }: { serverUrl: string; children: ReactNode }) {
  const accent = useSiteAccent(serverUrl)
  return (
    <div style={{ '--adm-accent': accent, height: '100%' } as CSSProperties}>
      {children}
    </div>
  )
}
