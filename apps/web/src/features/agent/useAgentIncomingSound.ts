// =============================================================================
// Agent incoming-message notification sound — shared by the admin portal
// (ConversationsPage) and the agent widget. Plays the site-configured AGENT
// notification sound (callers fall back to the visitor sound for setups that
// only configured the legacy single sound) when a message the operator should
// hear arrives for a conversation they are NOT currently reading.
//
// Rules (aligns the React surfaces with the legacy Vue operator console):
//  - new_message: visitor messages, other agents' messages and AI/specialist
//    replies in active / specialist conversations.
//  - skipped: 'ai'-status conversations (AI-owned — no operator on watch),
//    system messages, automatic greetings (senderId 'system'), the operator's
//    own echoes, and messages in the conversation currently open.
//  - new_conversation: alert when a fresh conversation appears that is not
//    AI-owned and not already open.
// =============================================================================

import { useCallback, useEffect, useRef } from 'react'
import type { Conversation } from '../../shared/types/models'
import type { ServerEventMap } from '../../shared/types/socket'
import { useSound } from '../chat/hooks/useSound'
import type { AgentServerEventListener, AgentSocket } from './useAgentSocket'

export interface AgentIncomingSoundOptions {
  serverUrl: string
  /** localStorage key for the per-surface mute state. */
  mutedKey: string
  /** Agent-side notification audio URL (already resolved against the visitor
   *  sound fallback by the caller), or null to use the synthesized beep. */
  soundUrl?: string | null
  socket: AgentSocket
  /** Latest conversations list (used to look up each message's status). */
  conversations: Conversation[]
  /** Conversation the operator is currently reading, or null. */
  openConversationId: string | null
  /** Extra gate evaluated just before playing (e.g. "another console on this
   *  page already alerts"). Defaults to always allowed. */
  shouldAlert?: () => boolean
}

export function useAgentIncomingSound({
  serverUrl,
  mutedKey,
  soundUrl,
  socket,
  conversations,
  openConversationId,
  shouldAlert,
}: AgentIncomingSoundOptions) {
  const { muted, toggleMuted, playSound } = useSound(serverUrl, mutedKey, soundUrl)

  // Latest values for the subscription callback — keep the subscription stable
  // and read fresh state through refs instead of re-subscribing constantly.
  const convsRef = useRef(conversations)
  useEffect(() => {
    convsRef.current = conversations
  }, [conversations])

  const openRef = useRef(openConversationId)
  useEffect(() => {
    openRef.current = openConversationId
  }, [openConversationId])

  const meRef = useRef<string | undefined>(socket.currentUser?.id)
  useEffect(() => {
    meRef.current = socket.currentUser?.id
  }, [socket.currentUser?.id])

  const shouldAlertRef = useRef(shouldAlert)
  useEffect(() => {
    shouldAlertRef.current = shouldAlert
  }, [shouldAlert])
  const alertAllowed = () => shouldAlertRef.current?.() ?? true

  const handleEvent = useCallback<AgentServerEventListener>(
    (event, payload) => {
      if (event === 'new_message') {
        const { message } = payload as ServerEventMap['new_message']
        const conv = convsRef.current.find((c) => c.id === message.conversationId)
        if (shouldPlayForMessage(message, conv?.status, openRef.current, meRef.current) && alertAllowed()) {
          playSound()
        }
        return
      }
      if (event === 'new_conversation') {
        const { conversation } = payload as ServerEventMap['new_conversation']
        if (shouldPlayForConversation(conversation.id, conversation.status, openRef.current) && alertAllowed()) {
          playSound()
        }
      }
    },
    [playSound],
  )

  useEffect(() => socket.subscribeEvents(handleEvent), [socket, handleEvent])

  return { muted, toggleMuted }
}

// ---------------------------------------------------------------------------
// Decision rules (pure, unit-tested). They must stay in sync with the comment
// block at the top of this file: the operator is alerted only for genuinely
// incoming activity in a conversation they are not reading right now.
// ---------------------------------------------------------------------------

/** new_message → should the agent sound play? */
export function shouldPlayForMessage(
  message: { conversationId: string; senderType?: string; senderId?: string | null },
  conversationStatus: string | undefined,
  openConversationId: string | null,
  currentUserId: string | undefined,
): boolean {
  if (message.conversationId === openConversationId) return false // operator is reading it
  if (message.senderType === 'system') return false
  if (message.senderId === 'system') return false // automatic greeting, not a real peer
  if (message.senderType === 'agent' && message.senderId === currentUserId) return false // own echo
  if (conversationStatus === 'ai') return false // AI-owned conversation — no operator on watch
  return true
}

/** new_conversation → should the agent sound play? */
export function shouldPlayForConversation(
  conversationId: string,
  status: string | undefined,
  openConversationId: string | null,
): boolean {
  if (status === 'ai') return false
  if (conversationId === openConversationId) return false
  return true
}
