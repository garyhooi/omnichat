// @vitest-environment jsdom
// =============================================================================
// Regression tests for agent-socket credential recovery.
//
// The bug these lock down: the socket froze its access token into `auth` at
// construction, so once the token rotated (or before login) every reconnect
// replayed a dead credential. The gateway refuses a bad credential by ACCEPTING
// the connection and then calling socket.disconnect(), which reaches the client
// as reason 'io server disconnect' — the one reason socket.io never auto-retries.
// The console therefore sat on "connecting" until a full page reload.
//
// storage is mocked because this Node build exposes an unusable global
// localStorage (see the --localstorage-file warning), which would otherwise
// make the token plumbing untestable.
// =============================================================================

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => {
  class FakeSocket {
    connected = false
    active = false
    auth: unknown = undefined
    private handlers = new Map<string, Array<(...args: unknown[]) => void>>()
    connect = vi.fn(() => {
      this.active = true
    })
    disconnect = vi.fn(() => {
      this.active = false
    })
    emit = vi.fn()
    on = vi.fn((event: string, handler: (...args: unknown[]) => void) => {
      const list = this.handlers.get(event) ?? []
      list.push(handler)
      this.handlers.set(event, list)
      return this
    })
    trigger(event: string, ...args: unknown[]) {
      for (const handler of this.handlers.get(event) ?? []) handler(...args)
    }
  }

  const sockets: FakeSocket[] = []
  const store = new Map<string, string>()

  return {
    sockets,
    store,
    ACCESS_TOKEN_KEY: 'omnichat_accessToken',
    storageGet: (key: string) => store.get(key) ?? null,
    storageSet: (key: string, value: string) => {
      store.set(key, value)
    },
    storageRemove: (key: string) => {
      store.delete(key)
    },
    io: vi.fn((_url: string, _options: unknown) => {
      const socket = new FakeSocket()
      sockets.push(socket)
      return socket
    }),
    refreshTokens: vi.fn(() =>
      Promise.resolve({ accessToken: 'rotated-at', refreshToken: 'rotated-rt', siteToken: 'st' }),
    ),
  }
})

vi.mock('socket.io-client', () => ({ io: mocks.io, Socket: class {} }))
vi.mock('../../shared/lib/api-client', () => ({ refreshTokens: mocks.refreshTokens }))
vi.mock('../../shared/lib/storage', () => ({
  ACCESS_TOKEN_KEY: mocks.ACCESS_TOKEN_KEY,
  storageGet: mocks.storageGet,
  storageSet: mocks.storageSet,
  storageRemove: mocks.storageRemove,
}))

import { ACCESS_TOKEN_KEY } from '../../shared/lib/storage'
import { useAgentSocket } from './useAgentSocket'

function Harness() {
  useAgentSocket({ serverUrl: 'http://api.test' })
  return null
}

let container: HTMLDivElement
let root: Root
let queryClient: QueryClient

beforeEach(() => {
  ;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  mocks.store.clear()
  mocks.sockets.length = 0
  mocks.io.mockClear()
  mocks.refreshTokens.mockClear()
  queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  act(() => root?.unmount())
  container.remove()
})

async function mount() {
  await act(async () => {
    root = createRoot(container)
    root.render(
      <QueryClientProvider client={queryClient}>
        <Harness />
      </QueryClientProvider>,
    )
  })
}

function authOption(): (cb: (data: Record<string, unknown>) => void) => void {
  const options = mocks.io.mock.calls[0][1] as { auth: unknown }
  return options.auth as (cb: (data: Record<string, unknown>) => void) => void
}

describe('useAgentSocket — auth is resolved per connection attempt', () => {
  it('passes a FUNCTION, not a frozen object', async () => {
    mocks.store.set(ACCESS_TOKEN_KEY, 'at-1')
    await mount()
    expect(typeof authOption()).toBe('function')
  })

  it('re-reads the stored token on every attempt instead of replaying the first', async () => {
    mocks.store.set(ACCESS_TOKEN_KEY, 'at-1')
    await mount()
    const auth = authOption()

    const first = vi.fn()
    auth(first)
    expect(first).toHaveBeenCalledWith(expect.objectContaining({ token: 'at-1' }))

    // The HTTP client rotated the token after the socket was built.
    mocks.store.set(ACCESS_TOKEN_KEY, 'at-2')
    const second = vi.fn()
    auth(second)
    expect(second).toHaveBeenCalledWith(expect.objectContaining({ token: 'at-2' }))
  })
})

describe('useAgentSocket — recovery from a refused credential', () => {
  it('refreshes through the shared client and reconnects on "io server disconnect"', async () => {
    await mount()
    const socket = mocks.sockets[0]
    expect(socket.connect).not.toHaveBeenCalled()

    await act(async () => {
      socket.trigger('disconnect', 'io server disconnect')
    })

    expect(mocks.refreshTokens).toHaveBeenCalledTimes(1)
    // Must target the element's API origin, not the host page's own origin:
    // the agent widget has no AuthProvider, so the api-client module state is
    // empty and a bare refreshTokens() would call the wrong server.
    expect((mocks.refreshTokens.mock.calls[0] as unknown[])[0]).toBe('http://api.test')
    expect(socket.connect).toHaveBeenCalled()
  })

  it('leaves transport-level disconnects to socket.io reconnection', async () => {
    await mount()
    const socket = mocks.sockets[0]

    await act(async () => {
      socket.trigger('disconnect', 'transport close')
    })

    expect(mocks.refreshTokens).not.toHaveBeenCalled()
    expect(socket.connect).not.toHaveBeenCalled()
  })

  it('refreshes and retries after a rejected handshake', async () => {
    await mount()
    const socket = mocks.sockets[0]

    await act(async () => {
      socket.trigger('connect_error', new Error('unauthorised'))
    })

    expect(mocks.refreshTokens).toHaveBeenCalledTimes(1)
    expect(socket.connect).toHaveBeenCalled()
  })

  it('reacts to a coded auth error from the gateway', async () => {
    await mount()
    const socket = mocks.sockets[0]

    await act(async () => {
      socket.trigger('error', { message: 'Authentication failed', code: 'auth' })
    })

    expect(mocks.refreshTokens).toHaveBeenCalledTimes(1)
  })

  it('does not refresh for an unrelated error event', async () => {
    await mount()
    const socket = mocks.sockets[0]

    await act(async () => {
      socket.trigger('error', { message: 'Something else' })
    })

    expect(mocks.refreshTokens).not.toHaveBeenCalled()
  })
})

describe('useAgentSocket — credential appearing after the socket exists', () => {
  it('reconnects when the operator logs in (token appears) without a page reload', async () => {
    await mount()
    const socket = mocks.sockets[0]
    expect(socket.connect).not.toHaveBeenCalled()

    mocks.store.set(ACCESS_TOKEN_KEY, 'at-after-login')
    await act(async () => {
      window.dispatchEvent(new Event('focus'))
    })

    expect(socket.connect).toHaveBeenCalled()
  })

  it('ignores an unchanged token', async () => {
    mocks.store.set(ACCESS_TOKEN_KEY, 'at-1')
    await mount()
    const socket = mocks.sockets[0]

    await act(async () => {
      window.dispatchEvent(new Event('focus'))
    })

    expect(socket.connect).not.toHaveBeenCalled()
  })
})
