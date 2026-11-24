// =============================================================================
// Notification sound — plays the site-configured audio file, falling back to
// a synthesized two-tone "ding" (WebAudio) when none is configured or the
// audio file fails. Muted state is persisted in localStorage (per entry point).
//
// The audio plumbing itself lives in shared/lib/notificationSound: one shared
// AudioContext unlocked by the first user gesture on the page, so playback
// keeps working while the operator is looking at another tab — see the header
// there for why a gesture is unavoidable and what is done around it.
// =============================================================================

import { useCallback, useEffect } from 'react'
import { useLocalStorageBoolean } from '../../../shared/hooks/useLocalStorage'
import { playNotificationSound, primeNotificationSound } from '../../../shared/lib/notificationSound'

export function useSound(serverUrl: string, mutedKey: string, soundUrl?: string | null) {
  const [muted, setMuted] = useLocalStorageBoolean(mutedKey, false)

  // Unlock audio at the first click anywhere on the page, not at the first
  // notification — the earlier that happens, the fewer alerts are missed.
  useEffect(() => {
    primeNotificationSound()
  }, [])

  const play = useCallback(() => {
    if (muted) return
    playNotificationSound(serverUrl, soundUrl)
  }, [muted, soundUrl, serverUrl])

  return { muted, toggleMuted: () => setMuted(!muted), playSound: play }
}
