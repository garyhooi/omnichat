import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { Message } from '../../../shared/types/models'
import { formatDate, isSameDisplayDay } from '../../../shared/lib/format'
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
  /** Agent console: offer Translate even when the target language is English. */
  alwaysOfferTranslate?: boolean
  onOpenLightbox: (url: string) => void
  onScrollStateChange?: (userScrolledUp: boolean) => void
  /** Display timezone for separators/bubble times (undefined = viewer's zone). */
  timeZone?: string
  /** Change this to force a scroll-to-bottom (e.g. panel just opened). */
  scrollKey?: number
  /** Older transcript exists on the server — shows the "load earlier" control. */
  hasMoreMessages?: boolean
  /** True while an older page is in flight. */
  loadingEarlier?: boolean
  onLoadEarlier?: () => void
}

type Row =
  | { kind: 'loadEarlier' }
  | { kind: 'date'; date: string }
  | { kind: 'message'; message: Message; isOwn: boolean; showSenderLabel: boolean }
  | { kind: 'stream'; content: string }
  | { kind: 'typing'; users: string[] }

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
  alwaysOfferTranslate,
  onOpenLightbox,
  onScrollStateChange,
  timeZone,
  scrollKey,
  hasMoreMessages,
  loadingEarlier,
  onLoadEarlier,
}: MessageListProps) {
  const { t } = useTranslation()
  const rows = useMemo<Row[]>(() => {
    const out: Row[] = []
    // Row 0 so it stays reachable when the list is scrolled up to its oldest end.
    if (hasMoreMessages && onLoadEarlier) out.push({ kind: 'loadEarlier' })
    let prev: Message | null = null
    for (const message of messages) {
      if (!prev || !isSameDisplayDay(prev.createdAt, message.createdAt, timeZone)) {
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
  }, [messages, visitorId, isOwnMessage, aiStreamContent, typingUsers, hasMoreMessages, onLoadEarlier, timeZone])

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

  // Preserve the reading position across a prepend: re-anchor to the message
  // that was at the top, so the newly loaded page sits ABOVE the viewport
  // instead of shoving it. Only the load-earlier path sets this ref, so appends
  // (new messages arriving) are never affected.
  const anchorMessageIdRef = useRef<string | null>(null)

  const handleLoadEarlier = useCallback(() => {
    const first = virtualizer.getVirtualItems()[0]
    const row = first ? rows[first.index] : undefined
    anchorMessageIdRef.current = row && row.kind === 'message' ? row.message.id : null
    onLoadEarlier?.()
  }, [onLoadEarlier, rows, virtualizer])

  useLayoutEffect(() => {
    const anchorId = anchorMessageIdRef.current
    if (!anchorId) return
    anchorMessageIdRef.current = null
    const index = rows.findIndex((r) => r.kind === 'message' && r.message.id === anchorId)
    if (index >= 0) virtualizer.scrollToIndex(index, { align: 'start' })
    // Runs exactly once per prepend — the ref is cleared above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length])

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
              {row.kind === 'loadEarlier' && (
                <div className="oc-load-earlier">
                  <button
                    type="button"
                    className="oc-load-earlier-btn"
                    onClick={handleLoadEarlier}
                    disabled={loadingEarlier}
                  >
                    {t('common.loadEarlierMessages')}
                  </button>
                </div>
              )}
              {row.kind === 'date' && (
                <div className="oc-date-sep">
                  <span>{formatDate(row.date, timeZone)}</span>
                </div>
              )}
              {row.kind === 'message' && (
                <MessageBubble
                  message={row.message}
                  isOwn={row.isOwn}
                  accentColor={accentColor}
                  timeZone={timeZone}
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
                  alwaysOfferTranslate={alwaysOfferTranslate}
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
