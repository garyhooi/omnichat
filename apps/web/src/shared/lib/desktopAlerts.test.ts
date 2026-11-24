// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  desktopAlertPermission,
  desktopAlertsSupported,
  isDesktopAlertsEnabled,
  requestDesktopAlerts,
  setDesktopAlertsEnabled,
  showDesktopAlert,
} from './desktopAlerts'

const instances: FakeNotification[] = []

/** jsdom's storage is not wired up in this Node version — a plain Map will do. */
class MemStorage {
  private m = new Map<string, string>()
  getItem(key: string) {
    return this.m.has(key) ? this.m.get(key)! : null
  }
  setItem(key: string, value: string) {
    this.m.set(key, String(value))
  }
  removeItem(key: string) {
    this.m.delete(key)
  }
  clear() {
    this.m.clear()
  }
  key(index: number) {
    return Array.from(this.m.keys())[index] ?? null
  }
  get length() {
    return this.m.size
  }
}

class FakeNotification {
  static permission: NotificationPermission = 'granted'
  static requestPermission = vi.fn(async () => FakeNotification.permission)
  title: string
  options?: NotificationOptions
  onclick: (() => void) | null = null
  close = vi.fn()
  constructor(title: string, options?: NotificationOptions) {
    this.title = title
    this.options = options
    instances.push(this)
  }
}

function hide() {
  Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' })
}
function show() {
  Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' })
}

beforeEach(() => {
  instances.length = 0
  vi.stubGlobal('localStorage', new MemStorage())
  FakeNotification.permission = 'granted'
  vi.stubGlobal('Notification', FakeNotification)
  setDesktopAlertsEnabled(true)
  show()
  vi.spyOn(document, 'hasFocus').mockReturnValue(true)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('desktop alerts — channel gating', () => {
  it('stays quiet while the operator is looking at the console', () => {
    expect(showDesktopAlert({ title: 'Aiman', body: 'hi', tag: 'omnichat:conv:a' })).toBe(false)
    expect(instances).toHaveLength(0)
  })

  it('shows a banner once the tab is hidden or unfocused', () => {
    hide()
    expect(showDesktopAlert({ title: 'Aiman', body: 'hi', tag: 'omnichat:conv:a' })).toBe(true)
    expect(instances).toHaveLength(1)
    expect(instances[0].title).toBe('Aiman')
    expect(instances[0].options).toMatchObject({ body: 'hi', tag: 'omnichat:conv:a', renotify: true })

    show()
    vi.spyOn(document, 'hasFocus').mockReturnValue(false)
    expect(showDesktopAlert({ title: 'Bala', tag: 'omnichat:conv:b' })).toBe(true)
  })

  it('does nothing until the operator opts in', () => {
    setDesktopAlertsEnabled(false)
    hide()
    expect(isDesktopAlertsEnabled()).toBe(false)
    expect(showDesktopAlert({ title: 'Aiman', tag: 'omnichat:conv:a' })).toBe(false)
    expect(instances).toHaveLength(0)
  })

  it('does nothing when the browser permission is refused', () => {
    FakeNotification.permission = 'denied'
    hide()
    expect(desktopAlertPermission()).toBe('denied')
    expect(isDesktopAlertsEnabled()).toBe(false)
    expect(showDesktopAlert({ title: 'Aiman', tag: 'omnichat:conv:a' })).toBe(false)
  })

  it('replaces a conversation banner instead of stacking, and keeps other conversations audible', () => {
    hide()
    expect(showDesktopAlert({ title: 'Aiman', tag: 'omnichat:conv:a' })).toBe(true)
    expect(showDesktopAlert({ title: 'Aiman', tag: 'omnichat:conv:a' })).toBe(false)
    expect(showDesktopAlert({ title: 'Bala', tag: 'omnichat:conv:b' })).toBe(true)
  })

  it('lets the same conversation alert again after the burst window', () => {
    vi.useFakeTimers()
    hide()
    expect(showDesktopAlert({ title: 'Aiman', tag: 'omnichat:conv:a' })).toBe(true)
    vi.advanceTimersByTime(4000)
    expect(showDesktopAlert({ title: 'Aiman', tag: 'omnichat:conv:a' })).toBe(true)
  })

  it('focuses the page and runs the handler when the banner is clicked', () => {
    hide()
    const focus = vi.spyOn(window, 'focus').mockImplementation(() => {})
    const onActivate = vi.fn()
    showDesktopAlert({ title: 'Aiman', tag: 'omnichat:conv:a', onActivate })
    instances[0].onclick?.()
    expect(focus).toHaveBeenCalled()
    expect(onActivate).toHaveBeenCalledTimes(1)
    expect(instances[0].close).toHaveBeenCalled()
  })

  it('reports unsupported when the browser has no Notification API', () => {
    vi.unstubAllGlobals()
    // @ts-expect-error — deleting the API is the point of this test
    delete window.Notification
    expect(desktopAlertsSupported()).toBe(false)
    expect(desktopAlertPermission()).toBe('unsupported')
    expect(isDesktopAlertsEnabled()).toBe(false)
  })

  it('asks for permission only through requestDesktopAlerts', async () => {
    FakeNotification.permission = 'default'
    expect(await requestDesktopAlerts()).toBe('default')
    expect(FakeNotification.requestPermission).toHaveBeenCalledTimes(1)
  })
})
