// =============================================================================
// Bubble-icon registry — the SVG (lucide) family the launcher bubble can show.
// The site config's bubbleIcon stores "svg:<name>" for these, e.g. "svg:headset".
// Kept framework-light: exports the icon names + a React resolver component so
// both the admin Settings picker and the widget/agent bubbles stay in sync.
// =============================================================================

import {
  Bot,
  Headset,
  LifeBuoy,
  MessageCircle,
  MessageSquare,
  MessagesSquare,
  Mic,
  Phone,
  Sparkles,
  User,
  type LucideIcon,
} from 'lucide-react'

/** Canonical names slotted into the picker, in display order. */
export const BUBBLE_ICON_NAMES = [
  'headset',
  'message-square',
  'message-circle',
  'messages-square',
  'bot',
  'sparkles',
  'mic',
  'phone',
  'life-buoy',
  'user',
] as const

export type BubbleIconName = (typeof BUBBLE_ICON_NAMES)[number]

const ICON_MAP: Record<BubbleIconName, LucideIcon> = {
  headset: Headset,
  'message-square': MessageSquare,
  'message-circle': MessageCircle,
  'messages-square': MessagesSquare,
  bot: Bot,
  sparkles: Sparkles,
  mic: Mic,
  phone: Phone,
  'life-buoy': LifeBuoy,
  user: User,
}

/** Default bubble icon shown when the site hasn't configured one (the headset glyph). */
export const DEFAULT_BUBBLE_ICON: BubbleIconName = 'headset'

export function isSvgIconName(name: string | null | undefined): name is BubbleIconName {
  return !!name && name in ICON_MAP
}

/** Serialized form stored in bubbleIcon — an icon name is stored as "svg:<name>". */
export function svgIconStoreValue(name: BubbleIconName): string {
  return `svg:${name}`
}

/** Parse a stored bubbleIcon value. Returns null when it is NOT an SVG icon. */
export function parseSvgIcon(value: string | null | undefined): BubbleIconName | null {
  if (!value) return null
  if (value.startsWith('svg:')) {
    const name = value.slice(4) as BubbleIconName
    return isSvgIconName(name) ? name : null
  }
  return null
}

/** React component that renders the named lucide icon (null when unknown). */
export function BubbleSvgIcon({ name, size = 26, strokeWidth = 2 }: { name: string; size?: number; strokeWidth?: number }) {
  const Icon = isSvgIconName(name) ? ICON_MAP[name] : null
  if (!Icon) return null
  return <Icon size={size} strokeWidth={strokeWidth} aria-hidden="true" />
}
