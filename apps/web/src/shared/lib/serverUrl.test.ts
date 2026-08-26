// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { checkServerUrl, isLoopbackOrigin } from './serverUrl'

afterEach(() => {
  vi.restoreAllMocks()
})

function stubLocation(hostname: string) {
  Object.defineProperty(window, 'location', {
    value: { hostname },
    configurable: true,
  })
}

describe('checkServerUrl — scheme', () => {
  it('accepts http and https', () => {
    expect(checkServerUrl('https://api.example.com').ok).toBe(true)
    expect(checkServerUrl('http://api.example.com').ok).toBe(true)
  })

  it('rejects non-http schemes', () => {
    expect(checkServerUrl('ftp://example.com').ok).toBe(false)
    expect(checkServerUrl('file:///etc/passwd').ok).toBe(false)
    expect(checkServerUrl('javascript:alert(1)').ok).toBe(false)
  })

  it('rejects unparseable input', () => {
    expect(checkServerUrl('not a url').ok).toBe(false)
    expect(checkServerUrl('').ok).toBe(false)
  })
})

describe('checkServerUrl — host restrictions from a remote page', () => {
  beforeEach(() => stubLocation('admin.example.com'))

  it('rejects localhost hostnames', () => {
    expect(checkServerUrl('http://localhost:3001').ok).toBe(false)
    expect(checkServerUrl('https://localhost').ok).toBe(false)
    expect(checkServerUrl('http://localhost.localdomain').ok).toBe(false)
    expect(checkServerUrl('http://api.localhost:3001').ok).toBe(false)
  })

  it('rejects loopback and private IP literals', () => {
    expect(checkServerUrl('http://127.0.0.1:3001').ok).toBe(false)
    expect(checkServerUrl('http://127.0.0.2').ok).toBe(false)
    expect(checkServerUrl('http://10.0.0.5').ok).toBe(false)
    expect(checkServerUrl('http://172.16.0.5').ok).toBe(false)
    expect(checkServerUrl('http://172.31.255.255').ok).toBe(false)
    expect(checkServerUrl('http://192.168.1.10').ok).toBe(false)
    expect(checkServerUrl('http://169.254.169.254').ok).toBe(false) // cloud metadata
    expect(checkServerUrl('http://100.64.0.1').ok).toBe(false) // CGNAT
    expect(checkServerUrl('http://0.0.0.0').ok).toBe(false)
    expect(checkServerUrl('http://224.0.0.1').ok).toBe(false) // multicast
    expect(checkServerUrl('http://255.255.255.255').ok).toBe(false)
  })

  it('rejects IPv6 loopback / link-local / unique-local', () => {
    expect(checkServerUrl('http://[::1]:3001').ok).toBe(false)
    expect(checkServerUrl('http://[fe80::1]').ok).toBe(false)
    expect(checkServerUrl('http://[fc00::1]').ok).toBe(false)
    expect(checkServerUrl('http://[fd00::1]').ok).toBe(false)
  })

  it('accepts public IPs and hostnames', () => {
    expect(checkServerUrl('https://8.8.8.8').ok).toBe(true)
    expect(checkServerUrl('https://203.0.113.10').ok).toBe(true)
    expect(checkServerUrl('https://api.yoursite.com').ok).toBe(true)
    expect(checkServerUrl('https://sub.domain.co.uk:8443/path').ok).toBe(true)
  })
})

describe('checkServerUrl — dev carve-out', () => {
  it('allows localhost targets when the page itself is served from a loopback origin', () => {
    stubLocation('localhost')
    expect(checkServerUrl('http://localhost:3001').ok).toBe(true)
    expect(checkServerUrl('http://127.0.0.1:3001').ok).toBe(true)
    stubLocation('127.0.0.1')
    expect(checkServerUrl('http://localhost:3001').ok).toBe(true)
  })

  it('still enforces the scheme from a loopback origin', () => {
    stubLocation('localhost')
    expect(checkServerUrl('ftp://localhost').ok).toBe(false)
  })
})

describe('isLoopbackOrigin', () => {
  it('detects loopback hostnames', () => {
    stubLocation('localhost')
    expect(isLoopbackOrigin()).toBe(true)
    stubLocation('127.0.0.1')
    expect(isLoopbackOrigin()).toBe(true)
    stubLocation('192.168.1.5')
    expect(isLoopbackOrigin()).toBe(false)
  })
})
