// =============================================================================
// Public site config — GET /config/active, the per-site settings the widget
// needs (bubble look, welcome/offline messages, avatars, feature toggles).
// =============================================================================

import { useCallback, useEffect, useState } from 'react'

export interface SiteConfig {
  siteName?: string
  bubbleColor?: string
  bubbleIcon?: string
  bubbleSize?: 'small' | 'medium' | 'large'
  bubblePattern?: string
  websitePosition?: string
  welcomeMessage?: string
  offlineMessage?: string
  greetingMessage?: string | null
  visitorLanguage?: string
  adminLanguage?: string
  notificationSoundUrl?: string
  enableReadReceipts?: boolean
  isOfflineMode?: boolean
  showVisitorWidget?: boolean
  aiEnabled?: boolean
  translationEnabled?: boolean
  autoTranslationEnabled?: boolean
  aiAvatar?: string
  agentAvatar?: string
  visitorAvatar?: string
}

export function useSiteConfig(serverUrl: string) {
  const [config, setConfig] = useState<SiteConfig | null>(null)

  const refresh = useCallback(() => {
    if (!serverUrl) return
    fetch(`${serverUrl}/config/active`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: SiteConfig | null) => {
        if (data) setConfig(data)
      })
      .catch(() => {
        /* config unavailable — fall back to element attributes */
      })
  }, [serverUrl])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { config, refresh }
}
