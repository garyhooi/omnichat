// =============================================================================
// Agent incoming-message notifications — shared by the admin portal
// (ConversationsPage) and the agent widget. Plays the site-configured AGENT
// notification sound (callers fall back to the visitor sound for setups that
// only configured the legacy single sound) when a message the operator should
// hear arrives for a conversation they are NOT currently reading, and raises a
// browser-native desktop banner alongside it while they are away from the tab.
//
// Rules (aligns the React surfaces with the legacy Vue operator console):
//  - new_message: visitor messages, other agents' messages and AI/specialist
//    replies in active / specialist conversations.
//  - skipped: 'ai'-status conversations (AI-owned — no operator on watch),
//    system messages, automatic greetings (senderId 'system'), the operator's
//    own echoes, and messages in the conversation currently open.
//  - new_conversation: alert when a fresh conversation appears that is not
//    AI-owned and not already open.
//
// Sound and banner are two channels of one alert, not two features: the sound
// is always attempted (it needs a prior gesture — see notificationSound.ts),
// and the banner is additive and self-gating — it only appears when the page is
// hidden or unfocused, so an operator watching the console is not double-alerted.
// =============================================================================

import { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { parseConversationMetadata, type Conversation, type Message } from '../../shared/types/models'
import type { ServerEventMap } from '../../shared/types/socket'
import { conversationTag, showDesktopAlert, type DesktopAlert } from '../../shared/lib/desktopAlerts'
import { useSound } from '../chat/hooks/useSound'
import { useDesktopAlerts } from './useDesktopAlerts'
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
  /** Extra gate evaluated just before alerting (e.g. "another console on this
   *  page already alerts"). Defaults to always allowed. */
  shouldAlert?: () => boolean
  /** Opens a conversation — used when the operator clicks a desktop banner. */
  onOpenConversation?: (conversationId: string) => void
}

export function useAgentIncomingSound({
  serverUrl,
  mutedKey,
  soundUrl,
  socket,
  conversations,
  openConversationId,
  shouldAlert,
  onOpenConversation,
}: AgentIncomingSoundOptions) {
  const { t } = useTranslation()
  const { muted, toggleMuted, playSound } = useSound(serverUrl, mutedKey, soundUrl)
  const desktop = useDesktopAlerts()

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

  const openConversationRef = useRef(onOpenConversation)
  useEffect(() => {
    openConversationRef.current = onOpenConversation
  }, [onOpenConversation])

  // Transient toast copy can change with the UI language; keep it in a ref so
  // the socket subscription does not churn on re-render.
  const labelsRef = useRef<AlertLabels>({ visitor: '', image: '', newConversation: '' })
  useEffect(() => {
    labelsRef.current = {
      visitor: t('agent.visitor'),
      image: t('agent.imageMsg'),
      newConversation: t('agent.newConversationNotice'),
    }
  }, [t])

  const raise = useCallback((alert: DesktopAlert, conversationId: string) => {
    showDesktopAlert({
      ...alert,
      onActivate: () => openConversationRef.current?.(conversationId),
    })
  }, [])

  const handleEvent = useCallback<AgentServerEventListener>(
    (event, payload) => {
      if (event === 'new_message') {
        const { message } = payload as ServerEventMap['new_message']
        const conv = convsRef.current.find((c) => c.id === message.conversationId)
        if (shouldPlayForMessage(message, conv?.status, openRef.current, meRef.current) && alertAllowed()) {
          playSound()
          raise(describeMessageAlert(message, conv, labelsRef.current), message.conversationId)
        }
        return
      }
      if (event === 'new_conversation') {
        const { conversation } = payload as ServerEventMap['new_conversation']
        if (shouldPlayForConversation(conversation.id, conversation.status, openRef.current) && alertAllowed()) {
          playSound()
          raise(describeConversationAlert(conversation, labelsRef.current), conversation.id)
        }
      }
    },
    [playSound, raise],
  )

  useEffect(() => socket.subscribeEvents(handleEvent), [socket, handleEvent])

  return { muted, toggleMuted, desktop }
}

// ---------------------------------------------------------------------------
// Desktop banner content (pure, unit-tested). The banner carries who and what,
// and a per-conversation tag so repeat messages replace each other.
// ---------------------------------------------------------------------------

export interface AlertLabels {
  /** Fallback name when the visitor did not give one. */
  visitor: string
  /** Body for an image message (the file name is not in the payload). */
  image: string
  /** Body for a brand-new conversation. */
  newConversation: string
}

/** Collapse markdown to one plain line — notification bodies are not rendered. */
export function plainPreview(text: string | null | undefined, max = 140): string {
  const flat = (text ?? '')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_~#>]+/g, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (flat.length <= max) return flat
  return `${flat.slice(0, max - 1).trimEnd()}…`
}

function visitorName(conversation: Conversation | undefined): string {
  return (conversation ? parseConversationMetadata(conversation).visitorName : '') || ''
}

/** new_message → banner title/body/tag. */
export function describeMessageAlert(
  message: Message,
  conversation: Conversation | undefined,
  labels: AlertLabels,
): DesktopAlert {
  const who = message.senderDisplayName || visitorName(conversation) || labels.visitor
  const body = message.messageType === 'image' ? labels.image : plainPreview(message.content)
  return { title: who, body, tag: conversationTag(message.conversationId) }
}

/** new_conversation → banner title/body/tag. */
export function describeConversationAlert(conversation: Conversation, labels: AlertLabels): DesktopAlert {
  return {
    title: visitorName(conversation) || labels.visitor,
    body: labels.newConversation,
    tag: conversationTag(conversation.id),
  }
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
