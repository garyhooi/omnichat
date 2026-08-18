// =============================================================================
// Visitor context tracking — the payload sent with `start_conversation`.
// IP / OS / Browser / Device are derived server-side from the socket connection;
// the client reports URL, timezone, language, screen, referrer & user agent.
// =============================================================================

import { useMemo } from 'react'
import { getOrCreateVisitorId } from '../lib/storage'

export interface VisitorContext {
  visitorId: string
  visitorCurrentUrl: string
  visitorTimezone: string
  visitorLanguage: string
  visitorScreenRes: string
  visitorReferrer: string
  userAgent: string
}

export function buildVisitorContext(): VisitorContext {
  return {
    visitorId: getOrCreateVisitorId(),
    visitorCurrentUrl: window.location.href,
    visitorTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    visitorLanguage: navigator.language || 'en',
    visitorScreenRes: `${window.screen.width}x${window.screen.height}`,
    visitorReferrer: document.referrer || '',
    userAgent: navigator.userAgent,
  }
}

export function useVisitorContext(): VisitorContext {
  return useMemo(buildVisitorContext, [])
}
