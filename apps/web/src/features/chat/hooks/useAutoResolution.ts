// =============================================================================
// Inactivity auto-resolution — when the server emits inactivity_warning the
// conversation is about to be auto-closed; the visitor sees a countdown banner.
// The widget shows a "keep chatting" affordance that re-arms the timer by
// sending a message; otherwise the countdown elapses and the chat ends.
// =============================================================================

import { useCallback, useEffect, useRef, useState } from 'react'

export const AUTO_RESOLVE_GRACE_MS = 120_000

export interface AutoResolutionOptions {
  /** True while an inactivity warning is active (from the query cache). */
  active: boolean
  /** Called when the countdown elapses. */
  onExpire: () => void
}

export function useAutoResolution({ active, onExpire }: AutoResolutionOptions) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null)
  const onExpireRef = useRef(onExpire)
  useEffect(() => {
    onExpireRef.current = onExpire
  })

  useEffect(() => {
    if (!active) {
      setSecondsLeft(null)
      return
    }
    const deadline = Date.now() + AUTO_RESOLVE_GRACE_MS
    const timer = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
      setSecondsLeft(remaining)
      if (remaining <= 0) {
        window.clearInterval(timer)
        onExpireRef.current()
      }
    }, 250)
    return () => window.clearInterval(timer)
  }, [active])

  const dismiss = useCallback(() => {
    setSecondsLeft(null)
  }, [])

  return { secondsLeft, dismiss }
}
