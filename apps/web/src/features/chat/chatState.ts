// =============================================================================
// Pure helpers for mutating ConversationQueryState in the query cache.
// Every function returns a new object (immutable update) so TanStack Query's
// structural sharing works and components re-render correctly.
// =============================================================================

import type {
  Conversation,
  Message,
} from '../../shared/types/models'
import type { AiStreamPayload } from '../../shared/types/socket'
import type {
  AiStreamState,
  ConversationQueryState,
  PendingSend,
} from './types'
import { createEmptyConversationState } from './types'

export function withConversation(
  state: ConversationQueryState,
  conversation: Conversation,
): ConversationQueryState {
  return { ...state, conversation, loaded: true }
}

/**
 * Initial history from `conversation_history`. The payload embeds messages on
 * the conversation object — split them out into the flat messages list.
 */
export function applyHistory(
  state: ConversationQueryState,
  conversation: Conversation & { messages: Message[] },
  isIpBlacklisted: boolean,
): ConversationQueryState {
  const { messages, ...rest } = conversation
  return {
    ...state,
    conversation: rest as Conversation,
    messages: dedupeMessages(messages ?? []),
    isIpBlacklisted,
    aiStream: null,
    inactivityWarning: null,
    loaded: true,
  }
}

/** Optimistic placeholder inserted before the server echo arrives. */
export function addPendingSend(
  state: ConversationQueryState,
  tempId: string,
  content: string,
  conversationId: string,
  senderId = 'me',
): ConversationQueryState {
  const pending: PendingSend = { tempId, content, conversationId, sentAt: new Date().toISOString() }
  const placeholder: Message = {
    id: tempId,
    conversationId,
    senderType: 'visitor',
    senderId,
    messageType: 'text',
    content,
    attachmentUrl: null,
    attachmentThumbnailUrl: null,
    readAt: null,
    createdAt: new Date().toISOString(),
  }
  return {
    ...state,
    messages: [...state.messages, placeholder],
    pendingSends: [...state.pendingSends, pending],
  }
}

/** Roll back an optimistic send on message_error. */
export function removePendingSend(
  state: ConversationQueryState,
  conversationId: string,
  content?: string,
): ConversationQueryState {
  const pending = content
    ? state.pendingSends.filter(
        (p) => !(p.conversationId === conversationId && p.content === content),
      )
    : state.pendingSends.filter((p) => p.conversationId !== conversationId)
  const tempIds = new Set(pending === state.pendingSends ? [] : state.pendingSends.filter(
    (p) => !pending.includes(p),
  ).map((p) => p.tempId))
  return {
    ...state,
    messages: state.messages.filter((m) => !tempIds.has(m.id)),
    pendingSends: pending,
  }
}

/**
 * Append an incoming message. Dedupes by id (the same message can arrive
 * from new_message echoes) and resolves optimistic sends by matching the
 * pending content — the server echo carries the real id, the client replaces
 * its temp bubble with it. Pending resolution applies to any sender whose
 * content matches (visitor and agent echoes alike).
 */
export function appendMessage(state: ConversationQueryState, message: Message): ConversationQueryState {
  if (state.messages.some((m) => m.id === message.id)) return state

  let messages = [...state.messages, message]
  let pendingSends = state.pendingSends

  const idx = pendingSends.findIndex(
    (p) => p.content === message.content && p.conversationId === message.conversationId,
  )
  if (idx !== -1) {
    const pending = pendingSends[idx]
    const tempIdx = messages.findIndex((m) => m.id === pending.tempId)
    if (tempIdx !== -1) {
      messages[tempIdx] = message
      messages = dedupeMessages(messages)
    }
    pendingSends = pendingSends.filter((_, i) => i !== idx)
  } else if (message.senderType === 'ai') {
    // The full AI message supersedes the synthetic streaming bubble.
    if (state.aiStream && state.aiStream.conversationId === message.conversationId) {
      messages = messages.filter((m) => !m.id.startsWith('stream_'))
    }
  }

  return { ...state, messages: dedupeMessages(messages), pendingSends }
}

/** Streamed token frames from the AI agent. */
export function upsertAiStream(
  state: ConversationQueryState,
  payload: AiStreamPayload,
): ConversationQueryState {
  if (payload.isComplete) {
    // new_message for the final AI text arrives before this frame (gateway
    // emits it first) — the real message is already in the list, so just
    // drop the synthetic bubble. If it somehow never arrived, synthesize
    // one so the visitor isn't left hanging.
    const hasFull = state.messages.some(
      (m) =>
        m.senderType === 'ai' &&
        m.conversationId === payload.conversationId &&
        !!payload.fullText &&
        m.content === payload.fullText,
    )
    if (!hasFull && payload.fullText?.trim()) {
      const synthetic: Message = {
        id: `stream_${payload.conversationId}_${Date.now()}`,
        conversationId: payload.conversationId,
        senderType: 'ai',
        senderId: 'ai-agent',
        messageType: 'text',
        content: payload.fullText,
        attachmentUrl: null,
        attachmentThumbnailUrl: null,
        readAt: null,
        createdAt: new Date().toISOString(),
        senderDisplayName: 'AI Agent',
      }
      return { ...state, aiStream: null, messages: dedupeMessages([...state.messages, synthetic]) }
    }
    return { ...state, aiStream: null }
  }

  const prev = state.aiStream
  const stream: AiStreamState = {
    conversationId: payload.conversationId,
    content: (prev?.conversationId === payload.conversationId ? prev.content : '') + payload.token,
  }
  return { ...state, aiStream: stream }
}

/** Remove the synthetic streaming bubble (used by consumers that keep it locally). */
export function clearAiStream(state: ConversationQueryState): ConversationQueryState {
  return {
    ...state,
    aiStream: null,
    messages: state.messages.filter((m) => !m.id.startsWith('stream_')),
  }
}

export function markMessageRead(
  state: ConversationQueryState,
  messageId: string,
  readAt: string,
): ConversationQueryState {
  if (!state.messages.some((m) => m.id === messageId && !m.readAt)) return state
  return {
    ...state,
    messages: state.messages.map((m) =>
      m.id === messageId ? { ...m, readAt } : m,
    ),
  }
}

export function setConversationStatus(
  state: ConversationQueryState,
  status: Conversation['status'],
): ConversationQueryState {
  if (!state.conversation || state.conversation.status === status) return state
  return { ...state, conversation: { ...state.conversation, status } }
}

export function setBlacklisted(state: ConversationQueryState, value: boolean): ConversationQueryState {
  if (state.isIpBlacklisted === value) return state
  return { ...state, isIpBlacklisted: value }
}

export function setUploadToken(state: ConversationQueryState, token: string | null): ConversationQueryState {
  if (state.uploadToken === token) return state
  return { ...state, uploadToken: token }
}

/**
 * Translation lookup key — one slot PER MESSAGE AND PER LANGUAGE, so switching
 * the target language yields a fresh translation instead of reusing the
 * previous language's cached text.
 */
export function translationKey(messageId: string, lang: string): string {
  return `${messageId}:${lang}`
}

export function setTranslation(
  state: ConversationQueryState,
  messageId: string,
  lang: string,
  text: string,
): ConversationQueryState {
  const key = translationKey(messageId, lang)
  if (state.translations[key] === text) return state
  return { ...state, translations: { ...state.translations, [key]: text } }
}

export function setInactivityWarning(
  state: ConversationQueryState,
  warning: string | null,
): ConversationQueryState {
  if (state.inactivityWarning === warning) return state
  return { ...state, inactivityWarning: warning }
}

export function setLastError(state: ConversationQueryState, error: string | null): ConversationQueryState {
  if (state.lastError === error) return state
  return { ...state, lastError: error }
}

export function resetConversationState(): ConversationQueryState {
  return createEmptyConversationState()
}

// ---------------------------------------------------------------------------
// Misc
// ---------------------------------------------------------------------------
export function dedupeMessages(messages: Message[]): Message[] {
  const seen = new Set<string>()
  const out: Message[] = []
  for (const m of messages) {
    if (seen.has(m.id)) continue
    seen.add(m.id)
    out.push(m)
  }
  return out
}

export function sortMessagesByCreatedAt(messages: Message[]): Message[] {
  return [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )
}
