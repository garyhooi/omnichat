// =============================================================================
// Notification sound — plays the site-configured audio file, falling back to
// a synthesized two-tone "ding" (WebAudio) when none is configured or the
// audio file fails. Muted state is persisted in localStorage (per entry point).
// =============================================================================

import { useCallback, useRef } from 'react'
import { useLocalStorageBoolean } from '../../../shared/hooks/useLocalStorage'

export function useSound(serverUrl: string, mutedKey: string, notificationSoundUrl?: string | null) {
  const [muted, setMuted] = useLocalStorageBoolean(mutedKey, false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const play = useCallback(() => {
    if (muted) return
    if (notificationSoundUrl) {
      const base = serverUrl.replace(/\/$/, '')
      const src = notificationSoundUrl.startsWith('http')
        ? notificationSoundUrl
        : base + notificationSoundUrl
      try {
        if (!audioRef.current) audioRef.current = new Audio()
        const player = audioRef.current
        if (player.src !== src) player.src = src
        player.currentTime = 0
        void player.play().catch(() => playFallback())
        return
      } catch {
        /* fall through to synthesized beep */
      }
    }
    playFallback()
  }, [muted, notificationSoundUrl, serverUrl])

  return { muted, toggleMuted: () => setMuted(!muted), playSound: play }
}

/** Short descending sine beep — no asset required, works in sandboxed frames. */
function playFallback() {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new Ctx()
    const gain = ctx.createGain()
    const osc = ctx.createOscillator()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.12)
    gain.gain.setValueAtTime(0.35, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12)
    osc.start()
    osc.stop(ctx.currentTime + 0.12)
  } catch {
    /* audio unavailable — silent */
  }
}
