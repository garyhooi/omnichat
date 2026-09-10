// @vitest-environment jsdom
// =============================================================================
// Regression: switching between two SVG bubble icons must save the NEW icon.
//
// The Settings page builds the PATCH body inside a useCallback. When `iconName`
// is missing from that callback's dependency array, React keeps the memoized
// callback from the previous render: an icon -> icon switch saves the PREVIOUS
// icon (the request succeeds, so the UI reports "Settings saved"), and the
// value reverts on reload. icon -> emoji was unaffected because iconType /
// iconEmoji are in the dependency array.
// =============================================================================

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const authFetchJson = vi.fn()

vi.mock('../../shared/lib/api-client', () => ({
  authFetch: vi.fn(),
  authFetchJson: (...args: unknown[]) => authFetchJson(...args),
}))

vi.mock('../auth', () => ({
  useAuth: () => ({ serverUrl: 'http://test.local', isDeveloper: true }),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en', changeLanguage: vi.fn() },
  }),
}))

import { SettingsPage } from './SettingsPage'

/** Active site config as returned by GET /config/admin-active. */
const CONFIG = {
  id: 'cfg1',
  siteName: 'test',
  bubbleColor: '#4F46E5',
  welcomeMessage: '',
  offlineMessage: '',
  greetingMessage: null,
  visitorLanguage: 'en',
  adminLanguage: 'en',
  bubbleSize: 'medium',
  bubblePattern: 'solid',
  websitePosition: 'xy:20,20',
  bubbleIcon: 'svg:headset', // currently the headset icon
  aiAvatar: '🤖',
  agentAvatar: '👨‍💻',
  visitorAvatar: '👤',
  allowedOrigins: '*',
  adminAllowedIps: null,
  isActive: true,
  isOfflineMode: false,
  enableReadReceipts: true,
  visitorNotificationSoundUrl: null,
  agentNotificationSoundUrl: null,
  showAdminWidget: true,
  showVisitorWidget: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

let container: HTMLDivElement
let root: Root
let patchBody: Record<string, unknown> | null

async function flush(ms = 0) {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, ms))
  })
}

async function waitForSelector(selector: string, attempts = 40) {
  for (let i = 0; i < attempts; i++) {
    const el = container.querySelector(selector)
    if (el) return el as HTMLElement
    await flush(5)
  }
  throw new Error(`timed out waiting for ${selector}`)
}

beforeEach(async () => {
  ;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  patchBody = null
  authFetchJson.mockReset()
  authFetchJson.mockImplementation(async (url: string, options?: RequestInit) => {
    if (url.endsWith('/config/admin-active')) return CONFIG
    if (url.endsWith('/quick-replies')) return []
    if (options?.method === 'PATCH' && url.includes('/config/')) {
      patchBody = JSON.parse(String(options.body)) as Record<string, unknown>
      return { ...CONFIG, ...patchBody }
    }
    return {}
  })

  container = document.createElement('div')
  document.body.appendChild(container)
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  root = createRoot(container)
  await act(async () => {
    root.render(
      <QueryClientProvider client={queryClient}>
        <SettingsPage />
      </QueryClientProvider>,
    )
  })
})

describe('Settings — bubble icon picker', () => {
  it('saves the newly selected SVG icon (not the previous one)', async () => {
    // The gallery is rendered with title="<icon name>".
    const botButton = await waitForSelector('button[title="bot"]')
    await act(async () => {
      botButton.click()
    })

    const saveButton = await waitForSelector('button.adm-btn-primary')
    expect(saveButton.textContent).toContain('admin.saveChanges')
    await act(async () => {
      saveButton.click()
    })

    for (let i = 0; i < 40 && !patchBody; i++) await flush(5)

    expect(patchBody, 'PATCH /config/:id was not sent').not.toBeNull()
    expect(patchBody!.bubbleIcon).toBe('svg:bot')
    // The bug: the stale callback sent the previous icon back.
    expect(patchBody!.bubbleIcon).not.toBe('svg:headset')
  })
})
