// =============================================================================
// Core domain models — mirrored from the NestJS/Prisma backend (MongoDB).
// These are the wire shapes produced by the API gateway, controllers & schema.
// =============================================================================

export type Role = 'agent' | 'admin' | 'developer'

export type ConversationStatus = 'active' | 'ai' | 'specialist' | 'resolved'

export type SenderType = 'visitor' | 'agent' | 'ai' | 'system'

export type MessageType = 'text' | 'image' | 'audio'

// ---------------------------------------------------------------------------
// Message (Prisma model + gateway emit-time additions)
// ---------------------------------------------------------------------------
export interface Message {
  id: string
  conversationId: string
  senderType: SenderType
  senderId?: string | null
  messageType: MessageType
  content?: string | null
  attachmentUrl?: string | null
  attachmentThumbnailUrl?: string | null
  readAt?: string | null
  createdAt: string
  /** Added at emit time by the gateway — never persisted. */
  senderDisplayName?: string
}

// ---------------------------------------------------------------------------
// Conversation (Prisma model + gateway decorations)
// ---------------------------------------------------------------------------
export interface ConversationAgent {
  id: string
  displayName: string
  username: string
  isOnline: boolean
}

export interface Conversation {
  id: string
  visitorId: string
  status: ConversationStatus
  agentId?: string | null
  /** JSON string — contains visitorName/visitorEmail/userAgent/externalAuthToken. */
  metadata?: string | null
  visitorIp?: string | null
  visitorBrowser?: string | null
  visitorOs?: string | null
  visitorDevice?: string | null
  visitorCurrentUrl?: string | null
  visitorTimezone?: string | null
  visitorLanguage?: string | null
  visitorScreenRes?: string | null
  visitorReferrer?: string | null
  rating?: number | null
  review?: string | null
  agentRemarks?: string | null
  assignedUsername?: string | null
  specialistUsername?: string | null
  resolvedByUsername?: string | null
  createdAt: string
  updatedAt: string
  agent?: ConversationAgent | null
  messages?: Message[]
  /** Present on conversations_list — unread visitor message count. */
  _count?: { messages: number }
  /** Decoration added by the agent widget — unread visitor messages. */
  unreadCount?: number
  /** Added by the gateway for list/history payloads. */
  isIpBlacklisted?: boolean
}

export interface ConversationMetadata {
  visitorName?: string
  visitorEmail?: string
  userAgent?: string
  externalAuthToken?: string
}

export function parseConversationMetadata(conversation: Conversation): ConversationMetadata {
  try {
    return JSON.parse(conversation.metadata ?? '{}') as ConversationMetadata
  } catch {
    return {}
  }
}

// ---------------------------------------------------------------------------
// AdminUser
// ---------------------------------------------------------------------------
export interface AdminUser {
  id: string
  username: string
  displayName: string
  role: Role
  isOnline: boolean
  isLocked: boolean
  lastSeenAt?: string | null
  lastLoginIp?: string | null
  userAgent?: string | null
  createdAt: string
  activeSessions: number
  effectiveOnline: boolean
}

export interface CurrentUser {
  id: string
  username: string
  displayName: string
  role: Role
}

export interface AgentPresenceEntry {
  id: string
  displayName: string
  username: string
  role: Role
  isOnline: boolean
}
