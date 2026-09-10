import { describe, expect, it } from 'vitest'
import { shouldPlayForConversation, shouldPlayForMessage } from './useAgentIncomingSound'

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
