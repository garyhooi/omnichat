import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle, ShieldAlert, X } from 'lucide-react'
import type { ChatSession } from '../hooks/useChatSession'
import { useAutoResolution } from '../hooks/useAutoResolution'
import { DEFAULT_AVATAR_SYMBOLS, resolveAvatarSource } from '../../../shared/lib/avatars'
import { ChatHeader } from './ChatHeader'
import { MessageList } from './MessageList'
import { Composer } from './Composer'
import { WelcomeScreen } from './WelcomeScreen'
import { ReviewForm } from './ReviewForm'
import { Lightbox } from './Lightbox'
import { useImageDrop } from '../hooks/useImageDrop'

export interface ChatPanelProps {
  session: ChatSession
  serverUrl: string
  accentColor: string
  title?: string
  showCloseButton?: boolean
  onClose?: () => void
  /** Increment to force the message list to scroll to bottom (panel opened). */
  scrollResetKey?: number
  /** Drag-to-move the panel by its header (widget only). */
  onHeaderPointerDown?: (e: React.PointerEvent) => void
}

const VISITOR_MAX_CHARS = 100

function formatCountdown(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/**
 * The complete visitor chat UI: header, banners, virtualized message list,
 * composer, welcome/review screens, end-chat confirm and image lightbox.
 * Shared by the widget (shadow DOM) and the full-page chat.
 */
export function ChatPanel({ session, serverUrl, accentColor, title = 'OmniChat', showCloseButton, onClose, scrollResetKey, onHeaderPointerDown }: ChatPanelProps) {
  const { t } = useTranslation()
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [lastConversationId, setLastConversationId] = useState<string | null>(null)

  const {
    connected,
    conversationId,
    messages,
    aiStreamContent,
    isAiStreaming,
    typingUsers,
    isIpBlacklisted,
    inactivityWarning,
    lastError,
    loaded,
    isResolved,
    hasRating,
    muted,
    toggleMuted,
    autoTranslateEnabled,
    setAutoTranslateEnabled,
    translateLang,
    setTranslateLang,
    translations,
    siteConfig,
  } = session

  // Reset the local review flag when the conversation changes. (React-sanctioned
  // "adjust state during render" pattern — guarded, so no infinite loop.)
  if (conversationId !== lastConversationId) {
    setLastConversationId(conversationId)
    setReviewSubmitted(false)
  }

  const translationEnabled = siteConfig?.translationEnabled !== false
  const readReceiptsEnabled = siteConfig?.enableReadReceipts !== false
  const avatars = useMemo(
    () => {
      const agent = resolveAvatarSource(siteConfig?.agentAvatar, serverUrl)
      const ai = resolveAvatarSource(siteConfig?.aiAvatar, serverUrl)
      const visitor = resolveAvatarSource(siteConfig?.visitorAvatar, serverUrl)
      return {
        agent: agent.url,
        ai: ai.url,
        visitor: visitor.url,
        agentSymbol: agent.symbol ?? DEFAULT_AVATAR_SYMBOLS.agent,
        aiSymbol: ai.symbol ?? DEFAULT_AVATAR_SYMBOLS.ai,
        visitorSymbol: visitor.symbol ?? DEFAULT_AVATAR_SYMBOLS.visitor,
      }
    },
    [siteConfig, serverUrl],
  )

  // Inactivity countdown banner.
  const { secondsLeft, dismiss: dismissWarning } = useAutoResolution({
    active: !!inactivityWarning && !isResolved,
    onExpire: () => dismissWarning(),
  })

  const offlineError = !conversationId && lastError && /offline|check back later/i.test(lastError)

  const headerSubtitle = useMemo(() => {
    if (isResolved) return t('visitor.chatEnded')
    if (typingUsers.length > 0) {
      const name = typingUsers.length === 1 ? typingUsers[0] : t('common.agents')
      return t('visitor.isTyping', { name })
    }
    return connected ? t('common.online') : t('common.connecting')
  }, [connected, isResolved, t, typingUsers])

  // Upload feedback for the composer — the session returns success/failure.
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleAttach = useCallback(
    async (file: File) => {
      setUploadingImage(true)
      setUploadError(null)
      const ok = await session.uploadImage(file)
      setUploadingImage(false)
      if (!ok) setUploadError(t('visitor.uploadFailed'))
    },
    [session, t],
  )

  // Drag-and-drop image upload over the whole chat panel (legacy parity).
  const { dragging: dropDragging, ...dropHandlers } = useImageDrop(
    (file) => void handleAttach(file),
    connected && !isResolved,
  )

  const handleSubmitReview = useCallback(
    (rating: number, review?: string) => {
      session.submitReview(rating, review)
      setReviewSubmitted(true)
    },
    [session],
  )

  return (
    <div
      className="oc-chat-root oc-chat-panel"
      style={{
        position: 'relative',
        // Theme the bubbles/highlights with the site-configured accent.
        ['--oc-accent' as string]: accentColor,
        ['--oc-accent-soft' as string]: `color-mix(in srgb, ${accentColor} 10%, white)`,
      }}
      {...dropHandlers}
    >
      {dropDragging && <div className="oc-drop-overlay">📥 {t('visitor.dropImage')}</div>}
      <ChatHeader
        title={siteConfig?.siteName || title}
        subtitle={headerSubtitle}
        muted={muted}
        onToggleMute={toggleMuted}
        showClose={!!showCloseButton}
        onClose={onClose}
        showEndChat={!!conversationId && !isResolved}
        onEndChat={() => setShowEndConfirm(true)}
        showNewChat={!!conversationId && isResolved}
        onNewChat={session.startNewChat}
        accentColor={accentColor}
        translateLang={translateLang}
        autoTranslateEnabled={autoTranslateEnabled}
        onLangChange={setTranslateLang}
        onAutoChange={setAutoTranslateEnabled}
        translationEnabled={translationEnabled}
        onHeaderPointerDown={onHeaderPointerDown}
      />

      {!offlineError && !!inactivityWarning && !isResolved && (
        <div className="oc-banner oc-banner-warn">
          {inactivityWarning}
          {secondsLeft != null && ` ${t('visitor.closesIn', { time: formatCountdown(secondsLeft) })}`}
          <button type="button" className="oc-translate-btn" onClick={dismissWarning} style={{ marginLeft: 8 }}>
            {t('visitor.dismiss')}
          </button>
        </div>
      )}

      {isIpBlacklisted && (
        <div className="oc-banner oc-banner-danger">
          <ShieldAlert size={13} style={{ verticalAlign: '-2px', marginRight: 4 }} />
          {t('visitor.spamBlocked')}
        </div>
      )}

      {!!lastError && !offlineError && !isIpBlacklisted && (
        <div className="oc-banner oc-banner-danger">
          <AlertTriangle size={13} style={{ verticalAlign: '-2px', marginRight: 4 }} />
          {lastError}
          <button type="button" className="oc-translate-btn" onClick={session.clearError} style={{ marginLeft: 8 }}>
            <X size={12} style={{ verticalAlign: '-1px' }} />
          </button>
        </div>
      )}

      {!conversationId ? (
        offlineError ? (
          <div className="oc-offline-screen">
            <div className="oc-welcome-logo" style={{ background: '#9ca3af' }}>
              ✕
            </div>
            <h2>{t('visitor.offlineTitle')}</h2>
            <p>{siteConfig?.offlineMessage || t('visitor.offlineBody')}</p>
          </div>
        ) : (
          <WelcomeScreen
            title={siteConfig?.siteName || title}
            message={siteConfig?.welcomeMessage || t('visitor.welcomeDefault')}
            accentColor={accentColor}
            connected={connected}
            onStart={session.startConversation}
            error={null}
          />
        )
      ) : isResolved ? (
        <ReviewForm
          submitted={reviewSubmitted || hasRating}
          onSubmit={handleSubmitReview}
          onSkip={() => setReviewSubmitted(true)}
        />
      ) : (
        <>
          <MessageList
            messages={messages}
            visitorId={session.visitorId}
            aiStreamContent={aiStreamContent}
            typingUsers={typingUsers}
            accentColor={accentColor}
            avatars={avatars}
            readReceiptsEnabled={readReceiptsEnabled}
            translations={translations}
            translateLang={translateLang}
            translationEnabled={translationEnabled}
            onTranslate={session.translateMessage}
            onOpenLightbox={setLightboxUrl}
            scrollKey={scrollResetKey}
          />
          <Composer
            maxChars={VISITOR_MAX_CHARS}
            disabled={!connected || isIpBlacklisted || isAiStreaming || !loaded}
            placeholder={isAiStreaming ? t('visitor.aiResponding') : t('visitor.typeMessage')}
            uploading={uploadingImage}
            error={uploadError}
            onSend={session.sendText}
            onAttach={(file) => void handleAttach(file)}
            onTypingStart={session.typingStart}
            onTypingStop={session.typingStop}
            onDismissError={() => setUploadError(null)}
          />
        </>
      )}

      {showEndConfirm && (
        <div className="oc-end-confirm">
          <h3>{t('visitor.endConfirmTitle')}</h3>
          <p>{t('visitor.endConfirmBody')}</p>
          <div className="oc-end-actions">
            <button type="button" className="oc-btn" onClick={() => setShowEndConfirm(false)}>
              {t('common.cancel')}
            </button>
            <button
              type="button"
              className="oc-btn oc-btn-danger"
              onClick={() => {
                session.endChat()
                setShowEndConfirm(false)
              }}
            >
              {t('visitor.confirmEnd')}
            </button>
          </div>
        </div>
      )}

      {lightboxUrl && <Lightbox url={lightboxUrl} onClose={() => setLightboxUrl(null)} />}
    </div>
  )
}
