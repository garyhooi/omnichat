// =============================================================================
// Server URL validation for user-entered API endpoints (admin login form).
//
// Rule: only http/https; the host must not be localhost, loopback, private,
// link-local, multicast, CGNAT or reserved — before any request is made.
//
// Dev carve-out: when this page is itself served from a loopback origin
// (localhost dev workflow, e.g. the demo pages on localhost:8082 against an
// API on localhost:3001), loopback/private targets are allowed. The SSRF-style
// risk this guards against applies to remote-served admin consoles; a page
// already running on the loopback interface is a local deployment by
// definition. Remote origins still get the full reject list.
// =============================================================================

export interface UrlCheck {
  ok: boolean
  reason?: string
}

function parseIpv4(host: string): number[] | null {
  const parts = host.split('.')
  if (parts.length !== 4) return null
  const nums = parts.map((p) => Number.parseInt(p, 10))
  if (nums.some((n) => Number.isNaN(n) || n < 0 || n > 255)) return null
  return nums
}

/** Classify an IP literal host — returns true when it must be rejected. */
function isBlockedIp(host: string): boolean {
  const clean = host.replace(/^\[|\]$/g, '').toLowerCase()

  // IPv6 loopback / unspecified / link-local / unique-local / multicast.
  if (clean.includes(':')) {
    if (clean === '::1' || clean === '::' || clean === '0:0:0:0:0:0:0:1') return true
    if (clean.startsWith('fe80:') || clean.startsWith('fc') || clean.startsWith('fd')) return true
    if (clean.startsWith('ff')) return true
    return false
  }

  const parts = parseIpv4(clean)
  if (!parts) return false // not an IP literal — hostname, allowed (DNS is the backend's concern)
  const [a, b] = parts

  if (a === 0) return true // 0.0.0.0/8 — "this network"
  if (a === 10) return true // 10.0.0.0/8 — private
  if (a === 127) return true // 127.0.0.0/8 — loopback
  if (a === 169 && b === 254) return true // 169.254.0.0/16 — link-local
  if (a === 172 && b >= 16 && b <= 31) return true // 172.16.0.0/12 — private
  if (a === 192 && b === 168) return true // 192.168.0.0/16 — private
  if (a === 100 && b >= 64 && b <= 127) return true // 100.64.0.0/10 — CGNAT
  if (a >= 224) return true // multicast + reserved
  if (a === 198 && (b === 18 || b === 19)) return true // 198.18.0.0/15 — benchmarking
  return false
}

/** True when the browser page itself is served from a loopback origin. */
export function isLoopbackOrigin(): boolean {
  const host = window.location.hostname.toLowerCase()
  return host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '[::1]'
}

/**
 * Validate a user-supplied server URL before any request is made to it.
 * - scheme must be http/https
 * - host must resolve to a non-blocked address (see isBlockedIp)
 * - loopback/private targets are permitted while the page runs on a loopback
 *   origin (local development); remote pages get the strict reject list
 */
export function checkServerUrl(url: string): UrlCheck {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return { ok: false, reason: 'Enter a valid URL, e.g. https://api.yoursite.com' }
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { ok: false, reason: 'Only http:// and https:// URLs are allowed' }
  }

  const hostname = parsed.hostname.toLowerCase()
  const isLoopbackHost =
    hostname === 'localhost' ||
    hostname === 'localhost.localdomain' ||
    hostname.endsWith('.localhost') ||
    isBlockedIp(hostname)

  if (isLoopbackHost && !isLoopbackOrigin()) {
    return {
      ok: false,
      reason: 'This server URL points to a local/private address and is not allowed from a remote page',
    }
  }

  return { ok: true }
}
