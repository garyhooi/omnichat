import { Bot, User } from 'lucide-react'
import type { SenderType } from '../../../shared/types/models'

export interface ChatAvatarProps {
  senderType: SenderType
  name?: string
  /** Resolved image URL (absolute). */
  avatarUrl?: string | null
  /** Emoji symbol fallback (legacy default avatars are emojis). */
  symbol?: string
  accentColor: string
}

const AVATAR_BG: Record<string, string> = {
  agent: '#64748b',
  ai: '#8b5cf6',
  // Visitor bubbles are accent-colored everywhere, so the visitor avatar
  // matches the site color too (--oc-accent is defined by both chat roots).
  visitor: 'var(--oc-accent, #4f46e5)',
  system: '#94a3b8',
}

/**
 * Circular avatar for agent/AI/visitor rows. Site-configured image wins;
 * otherwise the emoji symbol, then an initial letter on a per-sender color.
 */
export function ChatAvatar({ senderType, name, avatarUrl, symbol, accentColor }: ChatAvatarProps) {
  const bg = senderType === 'ai' ? accentColor : AVATAR_BG[senderType] ?? AVATAR_BG.system
  const initial = name?.trim().charAt(0).toUpperCase() || (senderType === 'ai' ? 'AI' : '?')

  return (
    <div className="oc-avatar" style={{ background: bg }} aria-hidden="true">
      {avatarUrl ? (
        <img src={avatarUrl} alt="" />
      ) : symbol ? (
        <span style={{ fontSize: 14 }}>{symbol}</span>
      ) : senderType === 'agent' || senderType === 'visitor' ? (
        <span style={{ opacity: 0.9 }}>{initial}</span>
      ) : (
        <span style={{ display: 'inline-flex' }}>
          {senderType === 'ai' ? <Bot size={15} /> : <User size={15} />}
        </span>
      )}
    </div>
  )
}
