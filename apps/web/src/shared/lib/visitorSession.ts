// =============================================================================
// Visitor session bootstrap — legacy parity.
//
// The legacy Vue widgets POSTed to /auth/visitor before connecting the socket
// so the server issued an httpOnly `omnichat_visitor_token` cookie bound to
// the visitor id. The gateway prefers that cookie over the handshake auth, so
// every entry point (chat page, widget, …) shares ONE visitor identity and can
// resume each other's conversations. The React rebuild must do the same.
// =============================================================================

import { REACT_VISITOR_ID_KEY, storageSet } from './storage'

/**
 * Establish (or reuse) the server-side visitor session and return the
 * authoritative visitor id.
 *
 * The server reuses the existing cookie's visitorId when present, so this may
 * differ from `localVisitorId` (e.g. an id issued by an earlier legacy
 * session). Callers must use the returned id for the socket handshake AND the
 * start_conversation payload so ownership checks stay consistent.
 */
export async function ensureVisitorSession(
  serverUrl: string,
  localVisitorId: string,
  externalToken?: string,
): Promise<string> {
  try {
    const res = await fetch(`${serverUrl}/auth/visitor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId: localVisitorId,
        ...(externalToken ? { externalToken } : {}),
      }),
      credentials: 'include',
    })
    if (!res.ok) return localVisitorId
    const data = (await res.json()) as { visitorId?: string }
    if (data.visitorId && data.visitorId !== localVisitorId) {
      // Server identity wins (existing cookie) — keep every entry point in sync.
      storageSet(REACT_VISITOR_ID_KEY, data.visitorId)
    }
    return data.visitorId || localVisitorId
  } catch {
    // Best-effort — fall back to the local id (legacy behavior).
    return localVisitorId
  }
}
