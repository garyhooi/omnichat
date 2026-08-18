import { describe, expect, it } from 'vitest'
import {
  addPendingSend,
  appendMessage,
  applyHistory,
  clearAiStream,
  dedupeMessages,
  markMessageRead,
  removePendingSend,
  setBlacklisted,
  setConversationStatus,
  setInactivityWarning,
  setLastError,
  setTranslation,
  setUploadToken,
  sortMessagesByCreatedAt,
  translationKey,
  upsertAiStream,
  withConversation,
} from './chatState'
import { createEmptyConversationState } from './types'
import type { Conversation, Message } from '../../shared/types/models'

function msg(overrides: Partial<Message>): Message {
  return {
    id: 'm1',
    conversationId: 'conv1',
    senderType: 'visitor',
    senderId: 'v1',
    messageType: 'text',
    content: 'hello',
    attachmentUrl: null,
    attachmentThumbnailUrl: null,
    readAt: null,
    createdAt: '2026-08-16T00:00:00.000Z',
    ...overrides,
  }
}

const conv = { id: 'conv1', visitorId: 'v1', status: 'active' } as Conversation

describe('createEmptyConversationState', () => {
  it('starts empty and unloaded', () => {
    const s = createEmptyConversationState()
    expect(s.conversation).toBeNull()
    expect(s.messages).toEqual([])
    expect(s.loaded).toBe(false)
    expect(s.pendingSends).toEqual([])
    expect(s.translations).toEqual({})
    expect(s.isIpBlacklisted).toBe(false)
    expect(s.uploadToken).toBeNull()
    expect(s.aiStream).toBeNull()
  })
})

describe('withConversation / applyHistory', () => {
  it('marks loaded with conversation', () => {
    const s = withConversation(createEmptyConversationState(), conv)
    expect(s.loaded).toBe(true)
    expect(s.conversation?.id).toBe('conv1')
  })

  it('splits embedded messages out of the history payload', () => {
    const historyConv = { ...conv, messages: [msg({ id: 'a' }), msg({ id: 'b' })] }
    const s = applyHistory(createEmptyConversationState(), historyConv, true)
    expect(s.messages).toHaveLength(2)
    expect(s.conversation).not.toHaveProperty('messages')
    expect(s.isIpBlacklisted).toBe(true)
    expect(s.loaded).toBe(true)
  })

  it('dedupes repeated history messages', () => {
    const historyConv = { ...conv, messages: [msg({ id: 'a' }), msg({ id: 'a' })] }
    const s = applyHistory(createEmptyConversationState(), historyConv, false)
    expect(s.messages).toHaveLength(1)
  })
})

describe('optimistic sends (addPendingSend / appendMessage / removePendingSend)', () => {
  it('adds a pending placeholder as the last message', () => {
    const s = addPendingSend(createEmptyConversationState(), 'temp_1', 'hi', 'conv1')
    expect(s.messages).toHaveLength(1)
    expect(s.messages[0].id).toBe('temp_1')
    expect(s.pendingSends).toHaveLength(1)
    expect(s.pendingSends[0].tempId).toBe('temp_1')
  })

  it('keeps a custom senderId for the placeholder (agent sends)', () => {
    const s = addPendingSend(createEmptyConversationState(), 'temp_1', 'hi', 'conv1', 'agent-1')
    expect(s.messages[0].senderId).toBe('agent-1')
  })

  it('resolves the pending send when the echo arrives (content match)', () => {
    let s = addPendingSend(createEmptyConversationState(), 'temp_1', 'hello', 'conv1')
    const echo = msg({ id: 'real-1', senderId: 'v1', content: 'hello', createdAt: '2026-08-16T00:00:01.000Z' })
    s = appendMessage(s, echo)
    expect(s.messages).toHaveLength(1)
    expect(s.messages[0].id).toBe('real-1')
    expect(s.pendingSends).toHaveLength(0)
  })

  it('appends the echo without matching when no pending send exists', () => {
    const s = appendMessage(createEmptyConversationState(), msg({ id: 'real-1' }))
    expect(s.messages).toHaveLength(1)
    expect(s.messages[0].id).toBe('real-1')
  })

  it('dedupes identical message ids', () => {
    let s = appendMessage(createEmptyConversationState(), msg({ id: 'a' }))
    s = appendMessage(s, msg({ id: 'a' }))
    expect(s.messages).toHaveLength(1)
  })

  it('does not let a second echo of the same send duplicate', () => {
    let s = addPendingSend(createEmptyConversationState(), 'temp_1', 'hello', 'conv1')
    const echo = msg({ id: 'real-1', content: 'hello' })
    s = appendMessage(s, echo)
    s = appendMessage(s, echo) // duplicate id → ignored
    expect(s.messages).toHaveLength(1)
  })

  it('rolls back the optimistic send on message_error', () => {
    let s = addPendingSend(createEmptyConversationState(), 'temp_1', 'hello', 'conv1')
    s = removePendingSend(s, 'conv1')
    expect(s.messages).toHaveLength(0)
    expect(s.pendingSends).toHaveLength(0)
  })

  it('rolls back only the matching conversation', () => {
    let s = addPendingSend(createEmptyConversationState(), 'temp_1', 'hello', 'conv1')
    s = addPendingSend(s, 'temp_2', 'bye', 'conv2')
    s = removePendingSend(s, 'conv1')
    expect(s.pendingSends).toHaveLength(1)
    expect(s.pendingSends[0].conversationId).toBe('conv2')
  })
})

describe('AI streaming (upsertAiStream / clearAiStream)', () => {
  it('accumulates tokens into the stream state', () => {
    let s = createEmptyConversationState()
    s = upsertAiStream(s, { conversationId: 'conv1', token: 'Hel', isComplete: false })
    s = upsertAiStream(s, { conversationId: 'conv1', token: 'lo', isComplete: false })
    expect(s.aiStream?.content).toBe('Hello')
  })

  it('resets accumulation when a new stream starts', () => {
    let s = upsertAiStream(createEmptyConversationState(), { conversationId: 'conv1', token: 'old', isComplete: false })
    s = upsertAiStream(s, { conversationId: 'conv2', token: 'new', isComplete: false })
    expect(s.aiStream?.content).toBe('new')
  })

  it('clears the stream on complete when the full message already arrived', () => {
    let s = upsertAiStream(createEmptyConversationState(), { conversationId: 'conv1', token: 'Hi', isComplete: false })
    s = appendMessage(s, msg({ id: 'ai-1', senderType: 'ai', content: 'Hi there', createdAt: '2026-08-16T00:00:02.000Z' }))
    s = upsertAiStream(s, { conversationId: 'conv1', token: '', isComplete: true, fullText: 'Hi there' })
    expect(s.aiStream).toBeNull()
    expect(s.messages.some((m) => m.id === 'ai-1')).toBe(true)
  })

  it('synthesizes the full message when completion arrived without new_message', () => {
    let s = upsertAiStream(createEmptyConversationState(), { conversationId: 'conv1', token: 'partial', isComplete: false })
    s = upsertAiStream(s, { conversationId: 'conv1', token: '', isComplete: true, fullText: 'Full answer' })
    expect(s.aiStream).toBeNull()
    expect(s.messages).toHaveLength(1)
    expect(s.messages[0].content).toBe('Full answer')
    expect(s.messages[0].senderType).toBe('ai')
  })

  it('does not synthesize an empty completion', () => {
    let s = upsertAiStream(createEmptyConversationState(), { conversationId: 'conv1', token: 'x', isComplete: false })
    s = upsertAiStream(s, { conversationId: 'conv1', token: '', isComplete: true, fullText: '' })
    expect(s.messages).toHaveLength(0)
  })

  it('clearAiStream removes synthetic stream rows only', () => {
    let s = upsertAiStream(createEmptyConversationState(), { conversationId: 'conv1', token: 'x', isComplete: false })
    s = appendMessage(s, msg({ id: 'stream_123', content: 'synthetic', createdAt: '2026-08-16T00:00:03.000Z' }))
    s = appendMessage(s, msg({ id: 'real', content: 'real', createdAt: '2026-08-16T00:00:04.000Z' }))
    s = clearAiStream(s)
    expect(s.messages.map((m) => m.id)).toEqual(['real'])
  })
})

describe('message state updates', () => {
  it('markMessageRead sets readAt only for the target', () => {
    let s = appendMessage(createEmptyConversationState(), msg({ id: 'a' }))
    s = appendMessage(s, msg({ id: 'b' }))
    s = markMessageRead(s, 'a', '2026-08-16T01:00:00.000Z')
    expect(s.messages.find((m) => m.id === 'a')?.readAt).toBe('2026-08-16T01:00:00.000Z')
    expect(s.messages.find((m) => m.id === 'b')?.readAt).toBeNull()
  })

  it('setConversationStatus updates status and keeps other fields', () => {
    const s = setConversationStatus(createEmptyConversationState(), 'resolved')
    expect(s.conversation).toBeNull() // no conversation yet → no-op safe
    let s2 = withConversation(createEmptyConversationState(), conv)
    s2 = setConversationStatus(s2, 'resolved')
    expect(s2.conversation?.status).toBe('resolved')
  })

  it('setBlacklisted / setUploadToken / setTranslation / setInactivityWarning / setLastError', () => {
    let s = createEmptyConversationState()
    s = setBlacklisted(s, true)
    expect(s.isIpBlacklisted).toBe(true)
    s = setUploadToken(s, 'upload_abc')
    expect(s.uploadToken).toBe('upload_abc')
    s = setTranslation(s, 'm1', 'fr', 'traduit')
    expect(s.translations[translationKey('m1', 'fr')]).toBe('traduit')
    // Per-language slots: the same message in another language is a separate entry.
    s = setTranslation(s, 'm1', 'ja', '翻訳')
    expect(s.translations[translationKey('m1', 'fr')]).toBe('traduit')
    expect(s.translations[translationKey('m1', 'ja')]).toBe('翻訳')
    expect(s.translations[translationKey('m1', 'en')]).toBeUndefined()
    s = setInactivityWarning(s, 'closing soon')
    expect(s.inactivityWarning).toBe('closing soon')
    s = setLastError(s, 'boom')
    expect(s.lastError).toBe('boom')
  })
})

describe('helpers', () => {
  it('dedupeMessages keeps first occurrence order', () => {
    const out = dedupeMessages([msg({ id: 'a' }), msg({ id: 'b' }), msg({ id: 'a' })])
    expect(out.map((m) => m.id)).toEqual(['a', 'b'])
  })

  it('sortMessagesByCreatedAt orders ascending', () => {
    const out = sortMessagesByCreatedAt([
      msg({ id: 'later', createdAt: '2026-08-16T02:00:00.000Z' }),
      msg({ id: 'earlier', createdAt: '2026-08-16T01:00:00.000Z' }),
    ])
    expect(out.map((m) => m.id)).toEqual(['earlier', 'later'])
  })
})
