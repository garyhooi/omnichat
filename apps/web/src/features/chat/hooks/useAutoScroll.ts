// =============================================================================
// Auto-scroll for the message list — tracks the scroll container, scrolls to
// the bottom on new content unless the user has scrolled up, and stays pinned
// while the user is at the bottom (scroll lock follows the visitor, matching
// the legacy widget's behavior).
// =============================================================================

import { useCallback, useEffect, useRef } from 'react'

export interface AutoScrollOptions {
  /** Content identity — scroll whenever this changes (message count, stream text). */
  stickTo: unknown
  /** Distance from the bottom (px) still treated as "at the bottom". */
  threshold?: number
}

export function useAutoScroll<T extends HTMLElement>(options: AutoScrollOptions) {
  const { stickTo, threshold = 60 } = options
  const containerRef = useRef<T | null>(null)
  const userScrolledUpRef = useRef(false)
  const rafRef = useRef<number | null>(null)

  const scrollToBottom = useCallback((instant = false) => {
    const el = containerRef.current
    if (!el) return
    if (instant) {
      el.scrollTop = el.scrollHeight
    } else {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    }
    userScrolledUpRef.current = false
  }, [])

  const onScroll = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    userScrolledUpRef.current = distanceFromBottom > threshold
  }, [threshold])

  // Reset the "user scrolled up" latch whenever the panel opens.
  const resetScrollLock = useCallback(() => {
    userScrolledUpRef.current = false
  }, [])

  // Stick to the bottom on new content (rAF-throttled; instant during streaming
  // so the list doesn't stutter on every token).
  useEffect(() => {
    const el = containerRef.current
    if (!el || userScrolledUpRef.current) return
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight
      rafRef.current = null
    })
  }, [stickTo])

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return { containerRef, scrollToBottom, onScroll, resetScrollLock }
}
