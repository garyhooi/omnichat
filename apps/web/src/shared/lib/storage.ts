// =============================================================================
// Storage keys & helpers — keep parity with the legacy Vue app so existing
// visitors/agents keep their session, position and preferences.
// =============================================================================

export const ACCESS_TOKEN_KEY = 'omnichat_accessToken'
export const REFRESH_TOKEN_KEY = 'omnichat_refreshToken'
export const SITE_TOKEN_KEY = 'omnichat_siteToken'
export const CONVERSATION_ID_KEY = 'omnichat_conversation_id'
export const LEGACY_VISITOR_ID_KEY = 'omnichat_visitor_id'
export const REACT_VISITOR_ID_KEY = 'omnichat_react_visitor_id'

// Widget (visitor)
export const WIDGET_MUTED_KEY = 'omnichat_client_muted'
export const WIDGET_TRANSLATE_LANG_KEY = 'omnichat_client_translate_lang'
export const WIDGET_POSITION_KEY = (serverUrl: string) =>
  `omnichat_widget_position_${encodeURIComponent(serverUrl)}`
export const WIDGET_PANEL_ANCHOR_KEY = (serverUrl: string) =>
  `omnichat_client_panel_anchor_${encodeURIComponent(serverUrl)}`

// Full-page chat (visitor)
export const PAGE_MUTED_KEY = 'omnichat_visitor_muted'
export const PAGE_TRANSLATE_LANG_KEY = 'omnichat_visitor_translate_lang'

// Agent widget
export const AGENT_WIDGET_MUTED_KEY = 'omnichat_admin_widget_muted'
export const AGENT_WIDGET_TRANSLATE_LANG_KEY = 'omnichat_admin_widget_translate_lang'
export const AGENT_WIDGET_POSITION_KEY = (serverUrl: string) =>
  `omnichat_admin_widget_position_${encodeURIComponent(serverUrl)}`
export const AGENT_WIDGET_PANEL_ANCHOR_KEY = (serverUrl: string) =>
  `omnichat_admin_widget_panel_anchor_${encodeURIComponent(serverUrl)}`

// Admin console (Conversations page)
export const ADMIN_MUTED_KEY = 'omnichat_admin_muted'
export const ADMIN_TRANSLATE_LANG_KEY = 'omnichat_admin_translate_lang'

// ---------------------------------------------------------------------------
// Safe localStorage access (widgets can run inside sandboxed iframes / shadow DOM)
// ---------------------------------------------------------------------------
export function storageGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function storageSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    /* storage unavailable (private mode etc.) — non-fatal */
  }
}

export function storageRemove(key: string): void {
  try {
    window.localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}

// ---------------------------------------------------------------------------
// Visitor identity — v_<uuid>; migrates the legacy localStorage visitor id
// (read once, then removed; the httpOnly cookie becomes the source of truth).
// ---------------------------------------------------------------------------
export function getOrCreateVisitorId(): string {
  const legacy = storageGet(LEGACY_VISITOR_ID_KEY)
  if (legacy) {
    // Persist the migrated id — otherwise the very next page load (widget,
    // chat page, …) generates a brand-new visitor id and can no longer resume
    // this visitor's conversation from another entry point.
    storageSet(REACT_VISITOR_ID_KEY, legacy)
    storageRemove(LEGACY_VISITOR_ID_KEY)
    return legacy
  }
  const existing = storageGet(REACT_VISITOR_ID_KEY)
  if (existing) return existing
  const id = `v_${crypto.randomUUID()}`
  storageSet(REACT_VISITOR_ID_KEY, id)
  return id
}
