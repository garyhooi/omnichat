import { describe, expect, it } from 'vitest'
import type { Conversation, Message } from '../../shared/types/models'
import { conversationTag } from '../../shared/lib/desktopAlerts'
import {
  describeConversationAlert,
  describeMessageAlert,
  plainPreview,
  shouldPlayForConversation,
  shouldPlayForMessage,
} from './useAgentIncomingSound'

const ME = 'user-1'

function msg(over: Partial<{ conversationId: string; senderType: string; senderId: string | null }> = {}) {
  return { conversationId: 'conv-a', senderType: 'visitor', senderId: 'visitor-1', ...over }
}

describe('agent incoming notification sound — new_message', () => {
  it('plays for a visitor message in a conversation the operator is not reading', () => {
    expect(shouldPlayForMessage(msg(), 'active', null, ME)).toBe(true)
    expect(shouldPlayForMessage(msg(), 'specialist', 'conv-b', ME)).toBe(true)
  })

  it('plays for AI/specialist replies and other agents in those conversations', () => {
    expect(shouldPlayForMessage(msg({ senderType: 'ai', senderId: 'ai-agent' }), 'specialist', null, ME)).toBe(true)
    expect(shouldPlayForMessage(msg({ senderType: 'agent', senderId: 'user-2' }), 'active', null, ME)).toBe(true)
  })

  it('stays silent for the conversation currently open in the console', () => {
    expect(shouldPlayForMessage(msg(), 'active', 'conv-a', ME)).toBe(false)
  })

  it('stays silent for the operator’s own echo', () => {
    expect(shouldPlayForMessage(msg({ senderType: 'agent', senderId: ME }), 'active', null, ME)).toBe(false)
  })

  it('stays silent for system messages and automatic greetings', () => {
    expect(shouldPlayForMessage(msg({ senderType: 'system', senderId: 'system' }), 'active', null, ME)).toBe(false)
    expect(shouldPlayForMessage(msg({ senderType: 'agent', senderId: 'system' }), 'active', null, ME)).toBe(false)
  })

  it('stays silent in AI-owned conversations (no operator on watch)', () => {
    expect(shouldPlayForMessage(msg(), 'ai', null, ME)).toBe(false)
  })

  it('still plays when the conversation is unknown in the current list slice', () => {
    // e.g. operator sits on the date-filtered Resolved tab while an active chat calls in
    expect(shouldPlayForMessage(msg(), undefined, null, ME)).toBe(true)
  })
})

describe('agent incoming notification sound — new_conversation', () => {
  it('plays for a new non-AI conversation that is not open', () => {
    expect(shouldPlayForConversation('conv-new', 'active', null)).toBe(true)
    expect(shouldPlayForConversation('conv-new', 'specialist', 'conv-other')).toBe(true)
  })

  it('stays silent for AI-owned conversations and the open one', () => {
    expect(shouldPlayForConversation('conv-new', 'ai', null)).toBe(false)
    expect(shouldPlayForConversation('conv-new', 'active', 'conv-new')).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// Desktop banner content
// ---------------------------------------------------------------------------

const LABELS = { visitor: 'Visitor', image: '📷 Image', newConversation: 'New conversation' }

function conversation(over: Partial<Conversation> = {}): Conversation {
  return {
    id: 'conv-a',
    visitorId: 'v1',
    status: 'active',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...over,
  }
}

function message(over: Partial<Message> = {}): Message {
  return {
    id: 'm1',
    conversationId: 'conv-a',
    senderType: 'visitor',
    messageType: 'text',
    content: 'hello there',
    createdAt: '2026-01-01T00:00:00.000Z',
    ...over,
  }
}

describe('desktop banner — plainPreview', () => {
  it('flattens markdown into one line', () => {
    expect(plainPreview('**Hi** there\n\nsee [the docs](https://example.com)')).toBe('Hi there see the docs')
    expect(plainPreview('- # Order **10**')).toBe('Order 10')
  })

  it('truncates with an ellipsis instead of dumping a wall of text', () => {
    const out = plainPreview('a'.repeat(200), 20)
    expect(out).toHaveLength(20)
    expect(out.endsWith('…')).toBe(true)
  })

  it('tolerates an empty body', () => {
    expect(plainPreview(null)).toBe('')
    expect(plainPreview('  ')).toBe('')
  })
})

describe('desktop banner — new_message', () => {
  it('names the visitor from the conversation metadata', () => {
    const alert = describeMessageAlert(message(), conversation({ metadata: JSON.stringify({ visitorName: 'Aiman' }) }), LABELS)
    expect(alert.title).toBe('Aiman')
    expect(alert.body).toBe('hello there')
    expect(alert.tag).toBe(conversationTag('conv-a'))
  })

  it('prefers the emitting agent name over the visitor, for peer replies', () => {
    const alert = describeMessageAlert(
      message({ senderType: 'agent', senderId: 'user-2', senderDisplayName: 'Bala' }),
      conversation({ metadata: JSON.stringify({ visitorName: 'Aiman' }) }),
      LABELS,
    )
    expect(alert.title).toBe('Bala')
  })

  it('falls back to a generic visitor label when no name was given', () => {
    expect(describeMessageAlert(message(), conversation(), LABELS).title).toBe('Visitor')
    expect(describeMessageAlert(message(), undefined, LABELS).title).toBe('Visitor')
  })

  it('labels image messages instead of showing an empty body', () => {
    const alert = describeMessageAlert(message({ messageType: 'image', content: null }), conversation(), LABELS)
    expect(alert.body).toBe('📷 Image')
  })
})

describe('desktop banner — new_conversation', () => {
  it('announces the visitor and the new-conversation notice', () => {
    const alert = describeConversationAlert(conversation({ id: 'conv-new', metadata: JSON.stringify({ visitorName: 'Aiman' }) }), LABELS)
    expect(alert.title).toBe('Aiman')
    expect(alert.body).toBe('New conversation')
    expect(alert.tag).toBe(conversationTag('conv-new'))
  })
})
