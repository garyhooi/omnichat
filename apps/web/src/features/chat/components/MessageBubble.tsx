import { memo, useEffect, useMemo, useState } from 'react'
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
  avatarUrl?: string | null
  /** Emoji symbol fallback when no avatar image is configured. */
  avatarSymbol?: string
  /** Display name for visitor messages (admin view; default "You"). */
  visitorName?: string
  showSenderLabel: boolean
  readReceiptsEnabled: boolean
  translations: Record<string, string>
  translateLang: string
  translationEnabled: boolean
  /** Translate one message; resolves false if the request failed. */
  onTranslate: (message: Message) => Promise<boolean> | boolean
  onOpenLightbox: (url: string) => void
}

/**
 * One chat message. System messages render as centered pills; image messages
 * as thumbnails (click → lightbox); text as sanitized markdown with an
 * optional translated view.
 */
export const MessageBubble = memo(function MessageBubble({
  message,
  isOwn,
  accentColor,
  avatarUrl,
  avatarSymbol,
  visitorName,
  showSenderLabel,
  readReceiptsEnabled,
  translations,
  translateLang,
  translationEnabled,
  onTranslate,
  onOpenLightbox,
}: MessageBubbleProps) {
  const { t } = useTranslation()
  // System messages — centered pill, no bubble chrome.
  if (message.senderType === 'system') {
    return (
      <div className="oc-sys-msg">
        <span>{message.content}</span>
      </div>
    )
  }

  const translated = translations[translationKey(message.id, translateLang)]
  const [showTranslated, setShowTranslated] = useState(!!translated)
  // Manual translate button state — visible feedback instead of dead silence:
  // "…" while the request is in flight, a transient "Failed" label on error.
  const [translating, setTranslating] = useState(false)
  const [translateFailed, setTranslateFailed] = useState(false)
  // Switching the target language invalidates this message's translation —
  // drop back to the original until the new-language translation arrives.
  useEffect(() => {
    setShowTranslated(!!translated)
    setTranslating(false)
    setTranslateFailed(false)
  }, [translated])
  const handleTranslate = () => {
    if (translating) return
    setTranslating(true)
    setTranslateFailed(false)
    Promise.resolve(onTranslate(message)).then((ok) => {
      setTranslating(false)
      if (!ok) {
        setTranslateFailed(true)
        setTimeout(() => setTranslateFailed((v) => (v ? false : v)), 4000)
      }
    })
  }
  const effectiveText = showTranslated && translated ? translated : (message.content ?? '')

  const html = useMemo(() => {
    if (message.messageType !== 'text' || showTranslated) return null
    return renderMarkdown(effectiveText)
  }, [message.messageType, effectiveText, showTranslated])

  const isImage = message.messageType === 'image'

  const senderName =
    message.senderType === 'ai'
      ? message.senderDisplayName || t('visitor.aiAgent')
      : message.senderType === 'agent'
        ? message.senderDisplayName || t('common.agent')
        : visitorName || t('visitor.you')

  return (
    <div className={`oc-msg-row ${isOwn ? 'oc-from-visitor' : `oc-from-${message.senderType}`}`}>
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
        ) : html ? (
          <div
            className={`oc-bubble ${showTranslated && translated ? 'oc-translated' : ''}`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <div className={`oc-bubble ${showTranslated && translated ? 'oc-translated' : ''}`}>
            {effectiveText}
          </div>
        )}
        <div className="oc-msg-meta">
          <span>{formatTimeOnly(message.createdAt)}</span>
          {isOwn && readReceiptsEnabled && (
            <span className="oc-read-tick" title={message.readAt ? t('visitor.read') : t('visitor.sent')}>
              {message.readAt ? <CheckCheck size={13} /> : <Check size={13} />}
            </span>
          )}
          {!isOwn &&
            translationEnabled &&
            message.messageType === 'text' &&
            !!message.content && (
              <>
                {translated && (
                  <button
                    type="button"
                    className="oc-translate-btn"
                    onClick={() => setShowTranslated((v) => !v)}
                  >
                    {showTranslated ? t('visitor.original') : t('visitor.translated')}
                  </button>
                )}
                {!translated && translateLang !== 'en' && (
                  <button
                    type="button"
                    className="oc-translate-btn"
                    disabled={translating}
                    onClick={handleTranslate}
                    title={translateFailed ? t('visitor.translateFailedTitle') : undefined}
                    style={translateFailed ? { color: '#dc2626', cursor: 'pointer' } : undefined}
                  >
                    {translating ? '…' : translateFailed ? t('visitor.translateFailed') : t('visitor.translate')}
                  </button>
                )}
              </>
            )}
        </div>
      </div>
    </div>
  )
})
