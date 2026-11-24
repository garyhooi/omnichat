// =============================================================================
// Browser-native desktop alerts — the OS/browser notification channel that
// runs alongside the in-page sound.
//
// Why it exists: a notification is rendered and sounded by the browser itself,
// not by the page's audio pipeline. So it reaches the operator while the tab is
// in the background, minimised or on another desktop, and it is not subject to
// the autoplay policy that silences the in-page beep before the first user
// gesture (see notificationSound.ts).
//
// Deliberately boring rules:
//  - permission is only ever requested from the operator's own click, never on
//    load — the prompt is persistent and expensive to get wrong;
//  - no banner while the page is visible AND focused: the in-page sound and
//    the unread badge already cover that, and double-alerting is noise;
//  - one tag per conversation (renotify), so a chatty conversation replaces
//    its banner instead of stacking ten of them;
//  - at most one banner per tag across tabs — two operator tabs must not both
//    announce the same message.
//
// Nothing here throws: a browser that refuses notifications (insecure context,
// permission revoked mid-session, Brave/Chrome session restrictions) simply
// returns false and the in-page channel carries on.
// =============================================================================

/** Persisted operator preference — off until they opt in. */
const PREF_KEY = 'omnichat_desktop_alerts'
/** Cross-tab record of the last banner shown, for de-duplication. */
const SEEN_KEY = 'omnichat_desktop_alerts_seen'
/** A second tab showing the same conversation within this window stays quiet. */
const DEDUPE_MS = 3000

export type DesktopAlertPermission = 'unsupported' | NotificationPermission

export interface DesktopAlert {
  title: string
  body?: string
  /** Stable identity, usually the conversation id — replaces the old banner. */
  tag?: string
  /** Runs after the page is focused (clicking the banner). */
  onActivate?: () => void
}

function storage(): Storage | null {
  try {
    return window.localStorage
  } catch {
    return null // private mode / storage disabled
  }
}

export function desktopAlertsSupported(): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) return false
  if (typeof Notification === 'undefined') return false
  // Notifications require a secure context; localhost counts as secure.
  return window.isSecureContext !== false
}

export function desktopAlertPermission(): DesktopAlertPermission {
  if (!desktopAlertsSupported()) return 'unsupported'
  try {
    return Notification.permission
  } catch {
    return 'unsupported'
  }
}

/** Raw operator preference, independent of the browser permission. */
function desktopAlertsPreference(): boolean {
  return storage()?.getItem(PREF_KEY) === 'true'
}

/** True when a banner would actually be shown: opted in AND permitted. */
export function isDesktopAlertsEnabled(): boolean {
  return desktopAlertsPreference() && desktopAlertPermission() === 'granted'
}

export function setDesktopAlertsEnabled(on: boolean): void {
  try {
    storage()?.setItem(PREF_KEY, on ? 'true' : 'false')
  } catch {
    /* storage blocked — the preference simply will not persist */
  }
}

/**
 * Ask the browser for notification permission. Must be called from a click or
 * key press handler — that gesture is what makes the prompt appear.
 */
export async function requestDesktopAlerts(): Promise<DesktopAlertPermission> {
  if (!desktopAlertsSupported()) return 'unsupported'
  try {
    return await Notification.requestPermission()
  } catch {
    return desktopAlertPermission()
  }
}

/** Only alert when nobody is looking at the console already. */
function pageIsInView(): boolean {
  if (typeof document === 'undefined') return false
  if (document.visibilityState !== 'visible') return false
  return document.hasFocus()
}

/** Cross-tab guard: two open tabs must not announce the same conversation. */
function claimTag(tag?: string): boolean {
  if (!tag) return true
  const store = storage()
  if (!store) return true
  try {
    const raw = store.getItem(SEEN_KEY)
    if (raw) {
      const seen = JSON.parse(raw) as { tag?: string; at?: number }
      if (seen.tag === tag && typeof seen.at === 'number' && Date.now() - seen.at < DEDUPE_MS) {
        return false
      }
    }
    store.setItem(SEEN_KEY, JSON.stringify({ tag, at: Date.now() }))
  } catch {
    /* corrupt entry or blocked storage — do not lose the alert over it */
  }
  return true
}

/** @returns true when a banner was actually handed to the browser. */
export function showDesktopAlert(alert: DesktopAlert): boolean {
  if (!isDesktopAlertsEnabled()) return false
  if (pageIsInView()) return false
  if (!claimTag(alert.tag)) return false
  try {
    // `renotify` ships in Chromium (and thus Brave) but is missing from lib.dom.
    const options: NotificationOptions & { renotify?: boolean } = {
      body: alert.body || undefined,
      tag: alert.tag,
      // Re-alert when a newer message replaces the banner (needs a tag).
      renotify: Boolean(alert.tag),
    }
    const notification = new Notification(alert.title, options)
    notification.onclick = () => {
      try {
        window.focus()
      } catch {
        /* popup blocking — the notification still closes */
      }
      try {
        notification.close()
      } catch {
        /* already gone */
      }
      alert.onActivate?.()
    }
    return true
  } catch {
    return false
  }
}

/** Tag for a conversation — one banner per conversation, replaced not stacked. */
export function conversationTag(conversationId: string): string {
  return `omnichat:conv:${conversationId}`
}
