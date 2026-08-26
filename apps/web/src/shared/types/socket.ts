// =============================================================================
// Socket.io protocol — exact client→server / server→client event contracts
// from the NestJS ChatGateway.
// =============================================================================

import type { Conversation, CurrentUser, AgentPresenceEntry, Message } from './models'

// ---------------------------------------------------------------------------
// Client → server payloads
// ---------------------------------------------------------------------------
export interface StartConversationPayload {
  visitorId: string
  /** JSON string — visitorName, visitorEmail, userAgent, externalAuthToken. */
  metadata?: string
  visitorName?: string
  visitorEmail?: string
  visitorCurrentUrl?: string
  visitorTimezone?: string
  visitorLanguage?: string
  visitorScreenRes?: string
  visitorReferrer?: string
}

export interface SendMessagePayload {
  conversationId: string
  content?: string
  messageType?: string
  attachmentUrl?: string
  attachmentThumbnailUrl?: string
}

export interface ReadMessagePayload {
  messageId: string
  conversationId: string
}

export interface SubmitReviewPayload {
  conversationId: string
  rating: number
  review?: string
}

export interface UpdateConversationDetailsPayload {
  conversationId: string
  /** null clears the field on the server (Prisma ignores undefined). */
  assignedUsername?: string | null
  agentRemarks?: string | null
}

export interface TransferToSpecialistPayload {
  conversationId: string
  targetUsername: string
}

export interface ConversationActionPayload {
  conversationId: string
}

export interface ListConversationsPayload {
  status?: ConversationStatusFilter
  /** Inclusive window on updatedAt (ISO date strings, e.g. "2026-08-01"). Applied server-side. */
  startDate?: string
  endDate?: string
}

export type ConversationStatusFilter = 'active' | 'ai' | 'specialist' | 'resolved'

// ---------------------------------------------------------------------------
// Server → client payloads
// ---------------------------------------------------------------------------
export interface ErrorPayload {
  message: string
}

export interface ConversationsListPayload {
  conversations: Conversation[]
  currentUser: CurrentUser
}

export interface ConversationHistoryPayload {
  conversation: Conversation & { messages: Message[] }
  isIpBlacklisted: boolean
}

/** The gateway always wraps the message: new_message → { message }. */
export interface NewMessagePayload {
  message: Message & { senderDisplayName?: string }
}

export interface MessageReadPayload {
  messageId: string
  conversationId: string
  readAt: string
}

export interface MessageErrorPayload {
  conversationId: string
  error: string
}

export interface AiStreamPayload {
  conversationId: string
  token: string
  isComplete: boolean
  /** Present only on the final frame (isComplete: true). */
  fullText?: string
}

export interface TypingPayload {
  conversationId: string
  user: string
  isTyping: boolean
}

export interface ConversationResolvedPayload {
  conversationId: string
  resolvedBy: string
}

export interface ChatTransferredPayload {
  conversationId: string
  specialistUsername: string
  transferredBy: string
}

export interface ReviewSubmittedPayload {
  conversationId: string
  rating: number
  review?: string
}

export interface AiHandoffPayload {
  conversationId: string
  reason: string
  timestamp: string
}

export interface IpBlacklistedPayload {
  conversationId: string
  reason: string
  timestamp: string
}

export interface InactivityWarningPayload {
  conversationId: string
  message: string
}

export interface UploadTokenPayload {
  token: string
}

// ---------------------------------------------------------------------------
// Client → server events
// ---------------------------------------------------------------------------
export const CLIENT_EVENTS = {
  startConversation: 'start_conversation',
  joinConversation: 'join_conversation',
  sendMessage: 'send_message',
  readMessage: 'read_message',
  submitReview: 'submit_review',
  updateConversationDetails: 'update_conversation_details',
  typingStart: 'typing_start',
  typingStop: 'typing_stop',
  transferToSpecialist: 'transfer_to_specialist',
  resolveConversation: 'resolve_conversation',
  takeOverConversation: 'take_over_conversation',
  listConversations: 'list_conversations',
  heartbeat: 'heartbeat',
} as const

// ---------------------------------------------------------------------------
// Server → client events
// ---------------------------------------------------------------------------
export const SERVER_EVENTS = {
  error: 'error',
  conversationStarted: 'conversation_started',
  uploadToken: 'upload_token',
  conversationHistory: 'conversation_history',
  conversationsList: 'conversations_list',
  newMessage: 'new_message',
  messageRead: 'message_read',
  messageError: 'message_error',
  aiStream: 'ai_stream',
  agentTyping: 'agent_typing',
  visitorTyping: 'visitor_typing',
  conversationUpdated: 'conversation_updated',
  conversationResolved: 'conversation_resolved',
  chatTransferred: 'chat_transferred',
  reviewSubmitted: 'review_submitted',
  newConversation: 'new_conversation',
  agentPresence: 'agent_presence',
  aiHandoff: 'ai_handoff',
  ipBlacklisted: 'ip_blacklisted',
  inactivityWarning: 'inactivity_warning',
} as const

export type ServerEventMap = {
  error: ErrorPayload
  conversation_started: { conversation: Conversation }
  upload_token: UploadTokenPayload
  conversation_history: ConversationHistoryPayload
  conversations_list: ConversationsListPayload
  new_message: NewMessagePayload
  message_read: MessageReadPayload
  message_error: MessageErrorPayload
  ai_stream: AiStreamPayload
  agent_typing: TypingPayload
  visitor_typing: TypingPayload
  conversation_updated: { conversation: Conversation }
  conversation_resolved: ConversationResolvedPayload
  chat_transferred: ChatTransferredPayload
  review_submitted: ReviewSubmittedPayload
  new_conversation: { conversation: Conversation }
  agent_presence: AgentPresencePayload
  ai_handoff: AiHandoffPayload
  ip_blacklisted: IpBlacklistedPayload
  inactivity_warning: InactivityWarningPayload
}

export interface AgentPresencePayload {
  agents: AgentPresenceEntry[]
}
