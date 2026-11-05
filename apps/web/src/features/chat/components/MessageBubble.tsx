import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, CheckCheck } from 'lucide-react'
import type { Message } from '../../../shared/types/models'
import { renderMarkdown } from '../../../shared/lib/markdown'
import { formatTimeOnly } from '../../../shared/lib/format'
import { translationKey } from '../chatState'
import { ChatAvatar } from './ChatAvatar'

export interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  accentColor: string
  /** Display timezone (undefined = viewer's zone). */
  timeZone?: string
  avatarUrl?: string | null
  /** Emoji symbol fallback when no avatar image is configured. */
  avatarSymbol?: string
  /** Display name for visitor messages (admin view; default "You"). */
  visitorName?: string
  showSenderLabel: boolean
  readReceiptsEnabled: boolean
  translations: Record<string, string>
  /** `messageId:lang` keys with a translation request in flight. */
  translationsPending?: Record<string, true>
  translateLang: string
  translationEnabled: boolean
  /** Translate one message; resolves false if the request failed or was cancelled. */
  onTranslate: (message: Message) => Promise<boolean> | boolean
  /** Cancel an in-flight translation (restores the original text). */
  onCancelTranslate?: (message: Message) => void
  /** Agent console: offer Translate even when the target language is English. */
  alwaysOfferTranslate?: boolean
  onOpenLightbox: (url: string) => void
}

/** How long the "translation failed" hint stays before clearing itself. */
const FAIL_HINT_MS = 6000

/**
 * One chat message. System messages render as centered pills; image messages
 * as thumbnails (click → lightbox); text as sanitized markdown with an
 * optional translated view.
 *
 * Translation is a small state machine driven by the query cache:
 *   idle → translating (placeholder + Cancel) → translated | failed
 * The pending marker lives in the conversation state so auto-translate and the
 * manual button share the exact same bubble UI.
 */
export const MessageBubble = memo(function MessageBubble({
  message,
  isOwn,
  accentColor,
  timeZone,
  avatarUrl,
  avatarSymbol,
  visitorName,
  showSenderLabel,
  readReceiptsEnabled,
  translations,
  translationsPending,
  translateLang,
  translationEnabled,
  onTranslate,
  onCancelTranslate,
  alwaysOfferTranslate,
  onOpenLightbox,
}: MessageBubbleProps) {
  const { t } = useTranslation()
  const key = translationKey(message.id, translateLang)
  const translated = translations[key]
  const isTranslating = !!translationsPending?.[key]

  const [showTranslated, setShowTranslated] = useState(!!translated)
  const [translateFailed, setTranslateFailed] = useState(false)
  // A user cancel must not show the error hint: the promise resolves false for
  // both "request failed" and "user aborted", so track which one happened.
  const cancelledByUser = useRef(false)
  const failTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // A translation arrived (or was dropped when the target language changed):
  // show it / fall back to the original.
  useEffect(() => {
    setShowTranslated(!!translated)
    if (translated) setTranslateFailed(false)
  }, [translated])

  // A new request starts: clear the previous failure state.
  useEffect(() => {
    if (isTranslating) {
      cancelledByUser.current = false
      setTranslateFailed(false)
    }
  }, [isTranslating])

  useEffect(
    () => () => {
      if (failTimer.current) clearTimeout(failTimer.current)
    },
    [],
  )

  const markFailed = () => {
    setTranslateFailed(true)
    if (failTimer.current) clearTimeout(failTimer.current)
    failTimer.current = setTimeout(() => {
      failTimer.current = null
      setTranslateFailed(false)
    }, FAIL_HINT_MS)
  }

  const handleTranslate = () => {
    if (isTranslating) return
    cancelledByUser.current = false
    setTranslateFailed(false)
    Promise.resolve(onTranslate(message))
      .then((ok) => {
        if (!ok && !cancelledByUser.current) markFailed()
      })
      .catch(() => {
        if (!cancelledByUser.current) markFailed()
      })
  }

  const handleCancel = () => {
    if (!isTranslating) return
    cancelledByUser.current = true
    setTranslateFailed(false)
    onCancelTranslate?.(message)
  }

  // Original and translated text go through the SAME markdown pipeline — the
  // translated view used to bypass renderMarkdown(), which is what turned
  // `- **bold**` lists into raw text.
  const showingTranslation = showTranslated && !!translated
  const effectiveText = showingTranslation ? translated : (message.content ?? '')
  const html = useMemo(
    () => (message.messageType !== 'text' ? null : renderMarkdown(effectiveText)),
    [message.messageType, effectiveText],
  )

  // System messages — centered pill, no bubble chrome.
  if (message.senderType === 'system') {
    return (
      <div className="oc-sys-msg">
        <span>{message.content}</span>
      </div>
    )
  }

  const isImage = message.messageType === 'image'

  const senderName =
    message.senderType === 'ai'
      ? message.senderDisplayName || t('visitor.aiAgent')
      : message.senderType === 'agent'
        ? message.senderDisplayName || t('common.agent')
        : visitorName || t('visitor.you')

  // .oc-from-visitor is the OWN side (right, accent bubble). A visitor message
  // in the agent console is the OTHER party, so it needs the left-side class.
  const rowSide = isOwn
    ? 'oc-from-visitor'
    : message.senderType === 'visitor'
      ? 'oc-from-visitor-other'
      : `oc-from-${message.senderType}`

  const canTranslate =
    !isOwn && translationEnabled && message.messageType === 'text' && !!message.content

  return (
    <div className={`oc-msg-row ${rowSide}`}>
      {!isOwn && (
        <ChatAvatar
          senderType={message.senderType}
          avatarUrl={avatarUrl}
          symbol={avatarSymbol}
          accentColor={accentColor}
          name={senderName}
        />
      )}
      <div className="oc-msg-body">
        {showSenderLabel && !isOwn && (
          <span className="oc-sender-label">{senderName}</span>
        )}
        {isImage ? (
          <button
            type="button"
            className="oc-bubble oc-image-msg"
            onClick={() => message.attachmentUrl && onOpenLightbox(message.attachmentUrl)}
            aria-label={t('visitor.viewImage')}
          >
            <img
              src={message.attachmentThumbnailUrl || message.attachmentUrl || ''}
              alt={message.content || t('visitor.image')}
              loading="lazy"
            />
          </button>
        ) : isTranslating ? (
          // Placeholder replaces the text while the request is in flight, so a
          // slow AI call never looks like a dead button. Cancel aborts it.
          <div className="oc-bubble oc-tx-bubble">
            <div className="oc-tx-loading" role="status" aria-live="polite">
              <div className="oc-tx-loading-top">
                <span className="oc-tx-loading-label">
                  <span className="oc-tx-spinner" aria-hidden="true" />
                  {t('visitor.translating')}
                </span>
                {onCancelTranslate && (
                  <button type="button" className="oc-tx-cancel" onClick={handleCancel}>
                    {t('common.cancel')}
                  </button>
                )}
              </div>
              <span className="oc-tx-shimmer" />
              <span className="oc-tx-shimmer w80" />
              <span className="oc-tx-shimmer w60" />
            </div>
          </div>
        ) : html ? (
          <div
            className={`oc-bubble ${showingTranslation ? 'oc-translated' : ''}`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <div className={`oc-bubble ${showingTranslation ? 'oc-translated' : ''}`}>
            {effectiveText}
          </div>
        )}
        {translateFailed && !isTranslating && !isOwn && (
          <div className="oc-tx-fail" role="status">
            {t('visitor.translateFallback')}{' '}
            <button type="button" onClick={handleTranslate}>
              {t('visitor.retry')}
            </button>
          </div>
        )}
        <div className="oc-msg-meta">
          <span>{formatTimeOnly(message.createdAt, timeZone)}</span>
          {isOwn && readReceiptsEnabled && (
            <span className="oc-read-tick" title={message.readAt ? t('visitor.read') : t('visitor.sent')}>
              {message.readAt ? <CheckCheck size={13} /> : <Check size={13} />}
            </span>
          )}
          {canTranslate && (
            <>
              {translated && !isTranslating && (
                <button
                  type="button"
                  className="oc-translate-btn"
                  onClick={() => setShowTranslated((v) => !v)}
                >
                  {showTranslated ? t('visitor.original') : t('visitor.translated')}
                </button>
              )}
              {isTranslating && (
                <span className="oc-translate-btn oc-translate-pending">{t('visitor.translating')}</span>
              )}
              {!translated && !isTranslating && (alwaysOfferTranslate || translateLang !== 'en') && (
                <button
                  type="button"
                  className="oc-translate-btn"
                  onClick={handleTranslate}
                >
                  {translateFailed ? t('visitor.retry') : t('visitor.translate')}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
})
