// =============================================================================
// Normalisation for visitor-supplied fields.
//
// `start_conversation` is the one unauthenticated door into a conversation and
// everything it carries is client-controlled: the display name, the email, and
// the "current URL" / "referrer" pair that the console renders as clickable
// links. None of it is re-checked downstream, so it is normalised once, here.
// =============================================================================

/** Longest accepted visitor display name. */
export const VISITOR_NAME_MAX = 100;
/** Longest accepted visitor email (practical RFC 5321 maximum). */
export const VISITOR_EMAIL_MAX = 254;
/** Longest accepted user-agent string kept in metadata. */
export const VISITOR_USER_AGENT_MAX = 500;
/** Longest accepted URL. */
export const VISITOR_URL_MAX = 2048;
/** Longest accepted value for the short session fields (timezone, screen, …). */
export const VISITOR_SHORT_MAX = 100;
/**
 * Longest accepted raw metadata JSON. Metadata ships inside EVERY
 * conversations_list response, so an oversized blob is paid for on every poll,
 * by every console watching that operator.
 */
export const VISITOR_METADATA_MAX = 4096;

/** Trim, drop blanks, and hard-cap length by CODE POINT (never split a surrogate pair). */
export function clampVisitorText(value: unknown, max: number): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const codePoints = Array.from(trimmed);
  return codePoints.length <= max ? trimmed : codePoints.slice(0, max).join('');
}

/**
 * Keep only absolute http(s) URLs.
 *
 * The console renders these as `<a href>`. React 19 blocks `javascript:` in an
 * href, but nothing blocks `data:` — and a stored URL is also a phishing surface
 * ("Visitor URL" pointing at an attacker's lookalike page). Anything that is not
 * an absolute http(s) URL — including protocol-relative `//host` and malformed
 * input — is dropped instead of stored. Over-long values are rejected rather
 * than truncated, because truncating a URL silently changes its meaning.
 */
export function sanitizeVisitorUrl(value: unknown, max = VISITOR_URL_MAX): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) return undefined;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

/** Metadata keys the console renders (and that are capped on the way in). */
const METADATA_TEXT_LIMITS: Record<string, number> = {
  visitorName: VISITOR_NAME_MAX,
  visitorEmail: VISITOR_EMAIL_MAX,
  userAgent: VISITOR_USER_AGENT_MAX,
};

/**
 * Parse the client's metadata JSON, dropping the whole blob when it is not a
 * plain object or exceeds the cap.
 *
 * `externalAuthToken` is ALWAYS stripped: the caller re-adds it from the socket
 * handshake. Trusting a client-supplied copy let a visitor plant a token whose
 * payload is decoded into `assignedUsername` — i.e. claim any agent as the
 * assignee of their own conversation.
 */
export function parseVisitorMetadata(raw: unknown): Record<string, unknown> {
  if (typeof raw !== 'string' || raw.length === 0 || raw.length > VISITOR_METADATA_MAX) return {};

  let candidate: unknown;
  try {
    candidate = JSON.parse(raw);
  } catch {
    return {};
  }
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return {};

  const parsed: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(candidate as Record<string, unknown>)) {
    if (key === 'externalAuthToken') continue;
    parsed[key] = value;
  }
  return parsed;
}

/**
 * Cap the metadata fields the console renders and that ship with every
 * conversations_list response. Blanked-out fields are dropped rather than kept
 * as empty strings.
 */
export function clampVisitorMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...metadata };
  for (const [key, max] of Object.entries(METADATA_TEXT_LIMITS)) {
    if (out[key] === undefined) continue;
    const clamped = clampVisitorText(out[key], max);
    if (clamped === undefined) delete out[key];
    else out[key] = clamped;
  }
  return out;
}
