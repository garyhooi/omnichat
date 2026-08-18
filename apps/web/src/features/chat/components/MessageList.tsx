import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { Message } from '../../../shared/types/models'
import { useAutoScroll } from '../hooks/useAutoScroll'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'

export interface MessageListProps {
  messages: Message[]
  visitorId: string
  /** Override the "is this my message" check (agent view: senderId === me). */
  isOwnMessage?: (message: Message) => boolean
  /** Partial AI response streamed token-by-token (synthetic bubble). */
  aiStreamContent: string | null
  typingUsers: string[]
  accentColor: string
  avatars?: {
    agent?: string
    ai?: string
    visitor?: string
    agentSymbol?: string
    aiSymbol?: string
    visitorSymbol?: string
  }
  /** Display name for visitor messages (admin view; default "You"). */
  visitorName?: string
  readReceiptsEnabled: boolean
  translations: Record<string, string>
  translateLang: string
  translationEnabled: boolean
  onTranslate: (message: Message) => Promise<boolean> | boolean
  onOpenLightbox: (url: string) => void
  onScrollStateChange?: (userScrolledUp: boolean) => void
  /** Change this to force a scroll-to-bottom (e.g. panel just opened). */
  scrollKey?: number
}

type Row =
  | { kind: 'date'; date: string }
  | { kind: 'message'; message: Message; isOwn: boolean; showSenderLabel: boolean }
  | { kind: 'stream'; content: string }
  | { kind: 'typing'; users: string[] }

const DATE_FMT = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: new Date().getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
})

function sameDay(a: string, b: string): boolean {
  const da = new Date(a)
  const db = new Date(b)
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  )
}

/**
 * Virtualized message list with day separators, the AI streaming bubble and
 * the typing indicator. Auto-scrolls to the bottom unless the user scrolled up.
 */
export function MessageList({
  messages,
  visitorId,
  isOwnMessage,
  aiStreamContent,
  typingUsers,
  accentColor,
  avatars,
  visitorName,
  readReceiptsEnabled,
  translations,
  translateLang,
  translationEnabled,
  onTranslate,
  onOpenLightbox,
  onScrollStateChange,
  scrollKey,
}: MessageListProps) {
  const { t } = useTranslation()
  const rows = useMemo<Row[]>(() => {
    const out: Row[] = []
    let prev: Message | null = null
    for (const message of messages) {
      if (!prev || !sameDay(prev.createdAt, message.createdAt)) {
        out.push({ kind: 'date', date: message.createdAt })
      }
      const isOwn = isOwnMessage
        ? isOwnMessage(message)
        : message.senderType === 'visitor' && message.senderId === visitorId
      const showSenderLabel =
        message.senderType === 'agent' || message.senderType === 'ai'
          ? !prev ||
            prev.senderType !== message.senderType ||
            prev.senderDisplayName !== message.senderDisplayName
          : false
      out.push({ kind: 'message', message, isOwn, showSenderLabel })
      prev = message
    }
    if (aiStreamContent != null) {
      out.push({ kind: 'stream', content: aiStreamContent })
    } else if (typingUsers.length > 0) {
      out.push({ kind: 'typing', users: typingUsers })
    }
    return out
  }, [messages, visitorId, isOwnMessage, aiStreamContent, typingUsers])

  const { containerRef, scrollToBottom, onScroll } = useAutoScroll<HTMLDivElement>({
    // Re-stick whenever content identity changes (messages, stream text…).
    stickTo: `${messages.length}:${aiStreamContent?.length ?? 0}:${typingUsers.length}`,
  })

  // Panel (re)open → reset the scroll latch and jump to the bottom.
  useEffect(() => {
    if (scrollKey !== undefined) scrollToBottom(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollKey])

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: (index) => (rows[index]?.kind === 'date' ? 34 : 72),
    overscan: 6,
    getItemKey: (index) => {
      const row = rows[index]
      if (!row) return index
      return row.kind === 'message' ? row.message.id : `${row.kind}-${index}`
    },
  })

  const handleScroll = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const scrolledUp = el.scrollHeight - el.scrollTop - el.clientHeight > 60
    onScrollStateChange?.(scrolledUp)
    onScroll()
  }, [containerRef, onScroll, onScrollStateChange])

  return (
    <div className="oc-messages" ref={containerRef} onScroll={handleScroll}>
      <div
        style={{
          height: virtualizer.getTotalSize(),
          position: 'relative',
          width: '100%',
        }}
      >
        {virtualizer.getVirtualItems().map((vi) => {
          const row = rows[vi.index]
          return (
            <div
              key={vi.key}
              data-index={vi.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${vi.start}px)`,
              }}
            >
              {row.kind === 'date' && (
                <div className="oc-date-sep">
                  <span>{DATE_FMT.format(new Date(row.date))}</span>
                </div>
              )}
              {row.kind === 'message' && (
                <MessageBubble
                  message={row.message}
                  isOwn={row.isOwn}
                  accentColor={accentColor}
                  avatarUrl={
                    row.message.senderType === 'ai'
                      ? avatars?.ai
                      : row.message.senderType === 'agent'
                        ? avatars?.agent
                        : avatars?.visitor
                  }
                  avatarSymbol={
                    row.message.senderType === 'ai'
                      ? avatars?.aiSymbol
                      : row.message.senderType === 'agent'
                        ? avatars?.agentSymbol
                        : avatars?.visitorSymbol
                  }
                  visitorName={visitorName}
                  showSenderLabel={row.showSenderLabel}
                  readReceiptsEnabled={readReceiptsEnabled}
                  translations={translations}
                  translateLang={translateLang}
                  translationEnabled={translationEnabled}
                  onTranslate={onTranslate}
                  onOpenLightbox={onOpenLightbox}
                />
              )}
              {row.kind === 'stream' && (
                <div className="oc-msg-row oc-from-ai">
                  <div className="oc-msg-body">
                    <span className="oc-sender-label">{t('visitor.aiAgent')}</span>
                    <div className="oc-bubble">
                      <span className="oc-stream-caret">{row.content}</span>
                    </div>
                  </div>
                </div>
              )}
              {row.kind === 'typing' && (
                <TypingIndicator label={row.users.length === 1 ? row.users[0] : t('common.agents')} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
