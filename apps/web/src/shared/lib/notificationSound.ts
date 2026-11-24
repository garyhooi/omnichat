// =============================================================================
// Notification sound engine — ONE shared AudioContext for the whole page.
//
// Browsers gate audio on "sticky user activation": until the user clicks, taps
// or presses a key somewhere on the document, an AudioContext starts suspended
// and <audio>.play() rejects. Chrome and Brave log, per context created, the
// console warning:
//
//   "The AudioContext was not allowed to start. It must be resumed (or
//    created) after a user gesture on the page."
//
// There is no permission to request for this — the gesture is the only key, so
// "the user is not active on the page" cannot be solved by a flag or header.
// What CAN be solved is everything around it:
//
//  1. One context, created lazily INSIDE the first gesture (capture-phase
//     listener on window, so any click on the host page counts) and primed
//     with a silent buffer — the audible unlock iOS/Safari also needs.
//  2. That context is reused for the page's lifetime. Chromium caps a page at
//     a handful of contexts, and every throwaway one is another warning.
//  3. resume() on visibility/focus changes, so tab switches don't leave the
//     context suspended where the platform does that.
//  4. An alert that arrives before the user has touched the page is held and
//     replayed the moment they do (for a short window), instead of being lost.
//  5. Once unlocked the context stays running while the tab is in the
//     background — that is why unlocking early matters so much.
//
// Playback never throws and never logs on the blocked path.
// =============================================================================

/** Gestures that satisfy the autoplay policy. Capture-phase: host-page clicks
 *  count even when the widget lives in a shadow root. */
const UNLOCK_EVENTS = ['pointerdown', 'mousedown', 'keydown', 'touchstart', 'click'] as const

/** How long a held alert stays worth replaying after the unlocking gesture. */
const PENDING_TTL_MS = 20_000

/** A resume() that only completes after a much later gesture must not fire a
 *  stale beep minutes after the message arrived. */
const LATE_UNLOCK_MS = 5_000

let ctx: AudioContext | null = null
let media: HTMLAudioElement | null = null
let bound = false
/** True once we have seen a gesture ourselves (fallback for browsers without
 *  navigator.userActivation). */
let sawGesture = false
let pending: { at: number; serverUrl: string; soundUrl?: string | null } | null = null

type AudioContextCtor = new () => AudioContext

function audioContextCtor(): AudioContextCtor | null {
  const w = window as unknown as {
    AudioContext?: AudioContextCtor
    webkitAudioContext?: AudioContextCtor
  }
  return w.AudioContext ?? w.webkitAudioContext ?? null
}

/** Does the document have sticky user activation, i.e. may audio start? */
function hasActivation(): boolean {
  const nav = navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }
  if (nav.userActivation && typeof nav.userActivation.hasBeenActive === 'boolean') {
    return nav.userActivation.hasBeenActive || sawGesture
  }
  return sawGesture
}

function sharedContext(): AudioContext | null {
  if (ctx) return ctx
  const Ctor = audioContextCtor()
  if (!Ctor) return null
  try {
    ctx = new Ctor()
  } catch {
    ctx = null
    return null
  }
  ctx.addEventListener('statechange', () => {
    if (ctx?.state === 'running') flushPending()
  })
  return ctx
}

/** Silent one-buffer blip — the classic Web Audio unlock. */
function silentBlip(ac: AudioContext) {
  try {
    const buffer = ac.createBuffer(1, Math.max(1, Math.round(ac.sampleRate * 0.002)), ac.sampleRate)
    const source = ac.createBufferSource()
    source.buffer = buffer
    source.connect(ac.destination)
    source.start(0)
    source.onended = () => {
      try {
        source.disconnect()
      } catch {
        /* already gone */
      }
    }
  } catch {
    /* non-fatal — the unlock still counts */
  }
}

function resumeInBackground(ac: AudioContext | null) {
  if (!ac || ac.state === 'running') return
  try {
    void ac.resume().catch(() => {
      /* still blocked — the next gesture retries */
    })
  } catch {
    /* older implementations throw instead of rejecting */
  }
}

function unlock() {
  sawGesture = true
  const ac = sharedContext()
  if (ac && ac.state !== 'running') {
    resumeInBackground(ac)
    silentBlip(ac)
  }
  flushPending()
}

function onGesture() {
  unlock()
}

function onVisibleAgain() {
  if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return
  // Only ever resume a context that already exists: building one from a focus
  // or visibility event (no gesture behind it) is exactly what re-triggers the
  // "AudioContext was not allowed to start" warning.
  if (!ctx) return
  resumeInBackground(ctx)
}

/**
 * Start listening for the unlocking gesture. Idempotent and cheap — call it on
 * mount of any surface that can make a sound so the unlock happens at the
 * first click anywhere, not at the first notification.
 */
export function primeNotificationSound(): void {
  if (bound || typeof window === 'undefined') return
  bound = true
  for (const type of UNLOCK_EVENTS) {
    window.addEventListener(type, onGesture, { capture: true, passive: true })
  }
  window.addEventListener('focus', onVisibleAgain)
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', onVisibleAgain)
  }
}

function unbind() {
  if (!bound || typeof window === 'undefined') return
  bound = false
  for (const type of UNLOCK_EVENTS) {
    window.removeEventListener(type, onGesture, { capture: true })
  }
  window.removeEventListener('focus', onVisibleAgain)
  if (typeof document !== 'undefined') {
    document.removeEventListener('visibilitychange', onVisibleAgain)
  }
}

/** Is audio actually allowed to start on this page right now? */
export function isNotificationSoundUnlocked(): boolean {
  if (!hasActivation()) return false
  return ctx ? ctx.state === 'running' : true
}

function resolveSrc(serverUrl: string, soundUrl?: string | null): string | null {
  if (!soundUrl) return null
  if (soundUrl.startsWith('http')) return soundUrl
  return serverUrl.replace(/\/$/, '') + soundUrl
}

/** @returns true when the file started; false on any block or load failure. */
function playFile(src: string): Promise<boolean> {
  try {
    if (!media) media = new Audio()
    const el = media
    el.preload = 'auto'
    if (el.src !== src) el.src = src
    el.currentTime = 0
    return Promise.resolve(el.play()).then(
      () => true,
      () => false,
    )
  } catch {
    return Promise.resolve(false)
  }
}

function beep(requestedAt: number) {
  const ac = sharedContext()
  if (!ac) return
  const start = () => {
    if (Date.now() - requestedAt > LATE_UNLOCK_MS) return
    try {
      const now = ac.currentTime
      const gain = ac.createGain()
      const osc = ac.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, now)
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.12)
      gain.gain.setValueAtTime(0.35, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12)
      osc.connect(gain)
      gain.connect(ac.destination)
      osc.start(now)
      osc.stop(now + 0.12)
      osc.onended = () => {
        try {
          osc.disconnect()
          gain.disconnect()
        } catch {
          /* already gone */
        }
      }
    } catch {
      /* audio unavailable — stay silent */
    }
  }
  if (ac.state === 'running') {
    start()
    return
  }
  // Chromium keeps this promise pending until activation arrives, which makes
  // it a free "play the beep once the user finally clicks" hook.
  try {
    void ac.resume().then(start, () => {
      /* stays blocked */
    })
  } catch {
    /* older implementations throw instead of rejecting */
  }
}

function playNow(serverUrl: string, soundUrl?: string | null) {
  const requestedAt = Date.now()
  const src = resolveSrc(serverUrl, soundUrl)
  if (src) {
    void playFile(src).then((ok) => {
      if (!ok) beep(requestedAt)
    })
    return
  }
  beep(requestedAt)
}

function flushPending() {
  const held = pending
  pending = null
  if (!held) return
  if (Date.now() - held.at > PENDING_TTL_MS) return
  playNow(held.serverUrl, held.soundUrl)
}

/**
 * Play the notification alert: the configured audio file when it loads, else a
 * synthesized two-tone beep.
 *
 * Before the first user gesture nothing can be played — the alert is held and
 * replayed on that gesture instead of throwing a console warning per attempt.
 */
export function playNotificationSound(serverUrl: string, soundUrl?: string | null): void {
  primeNotificationSound()
  if (!hasActivation()) {
    pending = { at: Date.now(), serverUrl, soundUrl }
    return
  }
  pending = null // a fresh alert supersedes anything still held
  playNow(serverUrl, soundUrl)
}

/** Drop every piece of module state. Tests only. */
export function resetNotificationSound(): void {
  unbind()
  try {
    media?.pause()
  } catch {
    /* not playing */
  }
  media = null
  try {
    void ctx?.close()
  } catch {
    /* already closed */
  }
  ctx = null
  sawGesture = false
  pending = null
}
