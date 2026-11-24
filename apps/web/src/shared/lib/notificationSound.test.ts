// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  isNotificationSoundUnlocked,
  playNotificationSound,
  primeNotificationSound,
  resetNotificationSound,
} from './notificationSound'

// ---------------------------------------------------------------------------
// Minimal fake AudioContext: enough surface for the engine, plus counters for
// the assertions (how many contexts were built, how many beeps were started).
// ---------------------------------------------------------------------------

const contexts: FakeAudioContext[] = []
let beeps = 0

class FakeAudioContext {
  state: AudioContextState = 'suspended'
  currentTime = 0
  sampleRate = 44100
  destination = {}
  resumes = 0
  private listeners = new Set<() => void>()

  constructor() {
    contexts.push(this)
  }
  addEventListener(_type: string, fn: () => void) {
    this.listeners.add(fn)
  }
  removeEventListener(_type: string, fn: () => void) {
    this.listeners.delete(fn)
  }
  createBuffer(_channels: number, length: number) {
    return { length }
  }
  createBufferSource() {
    return { buffer: null, connect() {}, disconnect() {}, start() {}, onended: null }
  }
  createGain() {
    return {
      gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
      connect() {},
      disconnect() {},
    }
  }
  createOscillator() {
    beeps++
    return {
      type: 'sine',
      frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
      connect() {},
      disconnect() {},
      start() {},
      stop() {},
      onended: null,
    }
  }
  resume() {
    this.resumes++
    this.state = 'running'
    for (const fn of this.listeners) fn()
    return Promise.resolve()
  }
  close() {
    return Promise.resolve()
  }
}

class BlockedAudioElement {
  src = ''
  preload = ''
  currentTime = 0
  play() {
    return Promise.reject(new Error('NotAllowedError'))
  }
  pause() {}
}

const SERVER = 'https://chat.example.com'

beforeEach(() => {
  contexts.length = 0
  beeps = 0
  vi.stubGlobal('AudioContext', FakeAudioContext)
  vi.stubGlobal('Audio', BlockedAudioElement)
  resetNotificationSound()
})

afterEach(() => {
  resetNotificationSound()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

function gesture() {
  window.dispatchEvent(new Event('pointerdown'))
}

describe('notification sound — autoplay unlock', () => {
  it('builds no AudioContext before a gesture and holds the alert instead', () => {
    playNotificationSound(SERVER, null)
    expect(contexts).toHaveLength(0)
    expect(beeps).toBe(0)
    expect(isNotificationSoundUnlocked()).toBe(false)
  })

  it('creates one context inside the first gesture and replays the held alert', () => {
    playNotificationSound(SERVER, null)
    gesture()
    expect(contexts).toHaveLength(1)
    expect(contexts[0].state).toBe('running')
    expect(contexts[0].resumes).toBe(1)
    expect(beeps).toBe(1)
    expect(isNotificationSoundUnlocked()).toBe(true)
  })

  it('reuses the same context for every later alert', () => {
    primeNotificationSound()
    gesture()
    playNotificationSound(SERVER, null)
    playNotificationSound(SERVER, null)
    playNotificationSound(SERVER, null)
    expect(contexts).toHaveLength(1)
    expect(beeps).toBe(3)
  })

  it('drops a held alert that goes stale before the user returns', () => {
    vi.useFakeTimers()
    playNotificationSound(SERVER, null)
    vi.advanceTimersByTime(30_000)
    gesture()
    expect(beeps).toBe(0)
  })

  it('falls back to the beep when the configured file cannot play', async () => {
    primeNotificationSound()
    gesture()
    playNotificationSound(SERVER, '/uploads/ding.mp3')
    await vi.waitFor(() => expect(beeps).toBe(1))
  })

  it('primes itself once, however many surfaces ask', () => {
    primeNotificationSound()
    primeNotificationSound()
    gesture()
    expect(contexts).toHaveLength(1)
    expect(beeps).toBe(0) // nothing was held, so the unlock stays silent
  })
})
