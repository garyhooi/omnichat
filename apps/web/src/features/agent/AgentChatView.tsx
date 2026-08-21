import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Check, CircleCheck, Copy, Info, ShieldAlert, UserPlus } from 'lucide-react'
import type { Conversation, Message } from '../../shared/types/models'
import { parseConversationMetadata } from '../../shared/types/models'
import { formatTicketId } from '../../shared/lib/format'
import { fetchTranslation } from '../../shared/lib/translationCache'
import {
  clearTranslationCooldown,
  isTranslationOnCooldown,
  markTranslationFailed,
} from '../../shared/lib/translationCooldown'
import { TranslatePopover } from '../chat/components/TranslatePopover'
import { DEFAULT_AVATAR_SYMBOLS, resolveAvatarSource } from '../../shared/lib/avatars'
import { useSiteConfig } from '../chat/hooks/useSiteConfig'
import { useImageDrop } from '../chat/hooks/useImageDrop'
import { MessageList } from '../chat/components/MessageList'
import { Composer, type ComposerSuggestion } from '../chat/components/Composer'
import type { AgentSocket } from './useAgentSocket'
import type { ConversationQueryState } from '../chat/types'
import { conversationQueryKey, createEmptyConversationState, typingQueryKey } from '../chat/types'
import { setTranslation, translationKey } from '../chat/chatState'

const AGENT_MAX_CHARS = 2000

/** Clipboard fallback for sandboxed iframes where navigator.clipboard is denied. */
function fallbackCopy(text: string): boolean {
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    ta.remove()
    return ok
  } catch {
    return false
  }
}

export interface AgentChatViewProps {
  socket: AgentSocket
  serverUrl: string
  conversationId: string
  conversation: Conversation | null
  /** Online agents for the transfer dropdown (excluding self). */
  agents: { username: string; displayName: string }[]
  currentUserUsername: string
  accentColor: string
  translationsEnabled: boolean
  onBack: () => void
}

/**
 * Agent conversation view — used by the admin portal (chat pane) and the
 * agent widget. Visitor header, virtualized message list (shared with the
 * visitor UI), composer with quick-reply slash commands, and the
 * transfer / resolve / details flows.
 */
export function AgentChatView({
  socket,
  serverUrl,
  conversationId,
  conversation,
  agents,
  currentUserUsername,
  accentColor,
  translationsEnabled,
  onBack,
}: AgentChatViewProps) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { config: siteConfig } = useSiteConfig(serverUrl)
  const [showDetails, setShowDetails] = useState(false)
  const [showResolveConfirm, setShowResolveConfirm] = useState(false)
  const [showTransferConfirm, setShowTransferConfirm] = useState(false)
  const [transferTarget, setTransferTarget] = useState('')
  const [draftAssigned, setDraftAssigned] = useState('')
  const [draftRemarks, setDraftRemarks] = useState('')
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [translateLang, setTranslateLangState] = useState(() =>
    localStorage.getItem('omnichat_admin_widget_translate_lang') || 'en',
  )
  const [autoTranslate, setAutoTranslate] = useState(() =>
    localStorage.getItem('omnichat_admin_widget_auto_translate') === 'true',
  )
  const setTranslateLang = useCallback((lang: string) => {
    setTranslateLangState(lang)
    localStorage.setItem('omnichat_admin_widget_translate_lang', lang)
  }, [])

  const copyText = useCallback((text: string, label: string) => {
    const done = () => {
      setCopied(label)
      setTimeout(() => setCopied((c) => (c === label ? null : c)), 1500)
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => {
        if (fallbackCopy(text)) done()
      })
    } else if (fallbackCopy(text)) {
      done()
    }
  }, [])

  const { data: state } = useQuery<ConversationQueryState>({
    queryKey: conversationQueryKey(serverUrl, conversationId),
    enabled: !!conversationId,
    staleTime: Infinity,
    placeholderData: createEmptyConversationState(),
    queryFn: () => createEmptyConversationState(),
  })
  const { data: typingUsers } = useQuery<string[]>({
    queryKey: typingQueryKey(serverUrl, conversationId),
    enabled: !!conversationId,
    staleTime: Infinity,
    queryFn: () => [],
  })
  const { data: quickReplies } = useQuery<{ id: string; title: string; content: string }[]>({
    queryKey: ['quick-replies', serverUrl],
    staleTime: 60_000,
    queryFn: async () => {
      const token = localStorage.getItem('omnichat_accessToken')
      const res = await fetch(`${serverUrl}/quick-replies`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (!res.ok) return []
      return (await res.json()) as { id: string; title: string; content: string }[]
    },
  })

  const messages = useMemo(
    () =>
      [...(state?.messages ?? [])].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ),
    [state?.messages],
  )

  // Auto-translate incoming messages to the selected language (legacy parity).
  const inFlightTranslations = useRef<Set<string>>(new Set())
  useEffect(() => {
    if (!autoTranslate || !conversationId || messages.length === 0) return
    const latest = messages[messages.length - 1]
    if (!latest || latest.messageType !== 'text' || !latest.content) return
    const qk = conversationQueryKey(serverUrl, conversationId)
    const st = queryClient.getQueryData<ConversationQueryState>(qk)
    const key = translationKey(latest.id, translateLang)
    if (st?.translations[key] || inFlightTranslations.current.has(key) || isTranslationOnCooldown(key)) return
    inFlightTranslations.current.add(key)
    fetchTranslation(serverUrl, latest.content, translateLang)
      .then((text) => {
        clearTranslationCooldown(key)
        queryClient.setQueryData(qk, (s: ConversationQueryState | undefined) =>
          s ? setTranslation(s, latest.id, translateLang, text) : s,
        )
      })
      .catch(() => {
        markTranslationFailed(key)
      })
      .finally(() => {
        inFlightTranslations.current.delete(key)
      })
  }, [autoTranslate, conversationId, messages, queryClient, serverUrl, translateLang])

  const isOwn = useCallback(
    (m: Message) => m.senderType === 'agent' && m.senderId === socket.currentUser?.id,
    [socket.currentUser?.id],
  )

  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const translateMessage = useCallback(
    (message: Message): Promise<boolean> => {
      if (!message.content || message.messageType !== 'text') return Promise.resolve(false)
      const key = translationKey(message.id, translateLang)
      const qk = conversationQueryKey(serverUrl, conversationId)
      const current = queryClient.getQueryData<ConversationQueryState>(qk)
      if (current?.translations[key]) return Promise.resolve(true)
      if (isTranslationOnCooldown(key)) return Promise.resolve(false)
      return fetchTranslation(serverUrl, message.content, translateLang)
        .then((text) => {
          clearTranslationCooldown(key)
          queryClient.setQueryData(qk, (s: ConversationQueryState | undefined) =>
            s ? setTranslation(s, message.id, translateLang, text) : s,
          )
          return true
        })
        .catch(() => {
          markTranslationFailed(key)
          return false
        })
    },
    [conversationId, queryClient, serverUrl, translateLang],
  )

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return
      if (trimmed.length > AGENT_MAX_CHARS) {
        setError(t('common.tooLong', { current: trimmed.length, max: AGENT_MAX_CHARS }))
        setTimeout(() => setError(null), 4000)
        return
      }
      socket.sendText(conversationId, trimmed)
      setError(null)
    },
    [conversationId, socket],
  )

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) return
      setUploading(true)
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('conversationId', conversationId)
        const token = localStorage.getItem('omnichat_accessToken')
        const headers: HeadersInit = {}
        if (token) headers['Authorization'] = `Bearer ${token}`
        const res = await fetch(`${serverUrl}/upload`, { method: 'POST', headers, body: formData })
        if (!res.ok) throw new Error('Upload failed')
        const data = (await res.json()) as { url: string; thumbnailUrl?: string }
        socket.sendImage(conversationId, `${serverUrl}${data.url}`, `${serverUrl}${data.thumbnailUrl || data.url}`)
      } catch {
        setError(t('agent.uploadFailed'))
      } finally {
        setUploading(false)
      }
    },
    [conversationId, serverUrl, socket, t],
  )

  const meta = conversation ? parseConversationMetadata(conversation) : {}
  const status = conversation?.status ?? 'active'
  const isResolved = status === 'resolved'
  const isAiHandled = status === 'ai'
  const canSend = !isResolved && !isAiHandled

  const transferTargets = agents.filter((a) => a.username !== currentUserUsername)

  const suggestions: ComposerSuggestion[] = useMemo(
    () =>
      (quickReplies ?? []).map((q) => ({
        label: q.title,
        content: q.content,
      })),
    [quickReplies],
  )

  const visitorName = meta.visitorName || t('agent.visitor')
  const statusChip = `aw-status-chip aw-status-${status}`

  // Drag-and-drop image upload over the whole chat view (legacy parity).
  const { dragging: dropDragging, ...dropHandlers } = useImageDrop(
    (file) => void handleFile(file),
    canSend && socket.connected,
  )

  // Site-configured avatars (emoji or custom: image) — same source as the
  // visitor widget so all chat surfaces show the same faces.
  const avatars = useMemo(() => {
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
  }, [siteConfig?.agentAvatar, siteConfig?.aiAvatar, siteConfig?.visitorAvatar, serverUrl])

  return (
    <div
      className="aw-chat-view"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        // chat.css normally gets these from .oc-chat-root, which doesn't
        // exist in the agent console / admin portal — define them here so
        // bubbles, composer and separators render fully framed.
        ['--oc-accent' as string]: accentColor,
        ['--oc-accent-soft' as string]: `color-mix(in srgb, ${accentColor} 10%, white)`,
        ['--oc-accent-contrast' as string]: '#ffffff',
        ['--oc-bg' as string]: '#ffffff',
        ['--oc-surface' as string]: '#f7f7fb',
        ['--oc-border' as string]: '#ececf3',
        ['--oc-text' as string]: '#1a1d26',
        ['--oc-text-muted' as string]: '#8a8fa3',
        ['--oc-online' as string]: '#22c55e',
      }}
      {...dropHandlers}
    >
      {dropDragging && <div className="oc-drop-overlay">📥 {t('visitor.dropImage')}</div>}
      {/* Conversation header */}
      <div className="aw-chat-header">
        <button type="button" className="aw-icon-btn" onClick={onBack} aria-label={t('agent.backToConversations')}>
          <ArrowLeft size={17} />
        </button>
        <div className="aw-chat-visitor">
          <div className="aw-chat-avatar" style={avatars.visitor ? { backgroundImage: `url(${avatars.visitor})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
          {!avatars.visitor && (avatars.visitorSymbol || '👤')}
        </div>
          <div className="aw-chat-header-main">
            <div className="aw-chat-name-row">
              <span className="aw-chat-name" title={visitorName}>{visitorName}</span>
              {conversation?.isIpBlacklisted && (
                <ShieldAlert size={13} style={{ color: '#ef4444' }} />
              )}
              <span className={statusChip}>
                {status === 'ai'
                  ? t('common.statusAi')
                  : status === 'specialist'
                    ? t('common.statusSpecialist')
                    : status === 'resolved'
                      ? t('common.statusResolved')
                      : t('common.statusActive')}
              </span>
            </div>
            <div className="aw-chat-sub" title={`${meta.visitorEmail || t('agent.noEmail')} · ${conversation?.visitorBrowser || t('agent.unknownBrowser')}`}>
              {meta.visitorEmail ? (
                <button
                  type="button"
                  className="aw-copy-email"
                  title={`${meta.visitorEmail} — ${t('agent.clickToCopy')}`}
                  onClick={() => meta.visitorEmail && copyText(meta.visitorEmail, 'Email')}
                >
                  {meta.visitorEmail}
                  {copied === 'Email' ? <Check size={11} /> : <Copy size={11} />}
                </button>
              ) : (
                t('agent.noEmail')
              )}
              <span className="aw-chat-sub-browser">· {conversation?.visitorBrowser || t('agent.unknownBrowser')}</span>
            </div>
          </div>
          <span className="aw-ticket">#{formatTicketId(conversationId)}</span>
        </div>
        <div className="aw-chat-actions">
          {translationsEnabled && (
            <TranslatePopover
              lang={translateLang}
              autoEnabled={autoTranslate}
              onLangChange={setTranslateLang}
              onAutoChange={(v) => {
                setAutoTranslate(v)
                localStorage.setItem('omnichat_admin_widget_auto_translate', String(v))
              }}
            />
          )}
          <button
            type="button"
            className="aw-icon-btn"
            title={t('agent.details')}
            onClick={() => {
              setDraftAssigned(conversation?.assignedUsername ?? '')
              setDraftRemarks(conversation?.agentRemarks ?? '')
              setShowDetails((v) => !v)
            }}
          >
            <Info size={16} />
          </button>
          <button
            type="button"
            className="aw-icon-btn"
            title={t('agent.transferToSpecialist')}
            disabled={transferTargets.length === 0 || isAiHandled || isResolved}
            onClick={() => setShowTransferConfirm(true)}
          >
            <UserPlus size={16} />
          </button>
          <button
            type="button"
            className="aw-btn aw-btn-sm aw-btn-danger"
            disabled={isAiHandled || isResolved}
            onClick={() => setShowResolveConfirm(true)}
          >
            <CircleCheck size={14} /> {t('agent.resolve')}
          </button>
        </div>
      </div>

      {isAiHandled && (
        <div className="aw-ai-banner">
          {t('agent.aiHandling')}
          <button
            type="button"
            className="aw-takeover-btn"
            onClick={() => socket.takeOverConversation(conversationId)}
          >
            {t('agent.takeOver')}
          </button>
        </div>
      )}
      {isResolved && <div className="aw-resolved-banner">{t('agent.resolvedBanner')}</div>}

      {/* Details popover — edit fields + full visitor info (legacy parity) */}
      {showDetails && (
        <div className="aw-popover">
          <div className="aw-details-grid">
            <div className="aw-details-col">
              <h4 className="aw-details-heading">{t('agent.detailsHeading')}</h4>
              <label htmlFor="aw-assigned">{t('agent.assignedUsername')}</label>
              <input
                id="aw-assigned"
                value={draftAssigned}
                onChange={(e) => setDraftAssigned(e.target.value)}
                placeholder="visitor@example.com"
              />
              <label htmlFor="aw-remarks">{t('agent.agentRemarks')}</label>
              <textarea
                id="aw-remarks"
                value={draftRemarks}
                onChange={(e) => setDraftRemarks(e.target.value)}
                placeholder={t('agent.internalNotes')}
              />
              <div className="aw-popover-actions">
                <button type="button" className="aw-btn" onClick={() => setShowDetails(false)}>
                  {t('common.close')}
                </button>
                <button
                  type="button"
                  className="aw-btn aw-btn-primary"
                  onClick={() => {
                    socket.updateConversationDetails(conversationId, {
                      assignedUsername: draftAssigned.trim() || null,
                      agentRemarks: draftRemarks.trim() || null,
                    })
                    setShowDetails(false)
                  }}
                >
                  {t('common.save')}
                </button>
              </div>
            </div>

            <div className="aw-details-col">
              <h4 className="aw-details-heading">{t('agent.visitorInfo')}</h4>
              <div className="aw-info-list">
                <InfoRow
                  label={t('agent.email')}
                  value={meta.visitorEmail || t('common.unknown')}
                  copyable
                  copied={copied === 'Email'}
                  onCopy={() => meta.visitorEmail && copyText(meta.visitorEmail, 'Email')}
                />
                <InfoRow
                  label={t('agent.ip')}
                  value={conversation?.visitorIp || t('common.unknown')}
                  copyable
                  copied={copied === 'IP'}
                  onCopy={() => conversation?.visitorIp && copyText(conversation.visitorIp, 'IP')}
                />
                <InfoRow label={t('agent.browser')} value={conversation?.visitorBrowser || t('common.unknown')} />
                <InfoRow label={t('agent.os')} value={conversation?.visitorOs || t('common.unknown')} />
                <InfoRow label={t('agent.device')} value={conversation?.visitorDevice || t('common.unknown')} />
                <InfoRow label={t('agent.screen')} value={conversation?.visitorScreenRes || t('common.unknown')} />
              </div>
            </div>

            <div className="aw-details-col">
              <h4 className="aw-details-heading">{t('agent.sessionContext')}</h4>
              <div className="aw-info-list">
                <InfoRow
                  label={t('agent.url')}
                  value={conversation?.visitorCurrentUrl || t('common.unknown')}
                  link
                  copyable
                  copied={copied === 'URL'}
                  onCopy={() => conversation?.visitorCurrentUrl && copyText(conversation.visitorCurrentUrl, 'URL')}
                />
                <InfoRow
                  label={t('agent.referrer')}
                  value={conversation?.visitorReferrer || t('agent.directNone')}
                  link
                  copyable
                  copied={copied === 'Referrer'}
                  onCopy={() => conversation?.visitorReferrer && copyText(conversation.visitorReferrer, 'Referrer')}
                />
                <InfoRow label={t('agent.timezone')} value={conversation?.visitorTimezone || t('common.unknown')} />
                <InfoRow label={t('agent.language')} value={conversation?.visitorLanguage || t('common.unknown')} />
                <InfoRow label={t('agent.userAgent')} value={meta.userAgent || t('common.unknown')} />
                {isResolved && (
                  <InfoRow label={t('agent.resolvedBy')} value={`@${conversation?.resolvedByUsername || t('common.unknown')}`} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <MessageList
        messages={messages}
        visitorId=""
        isOwnMessage={isOwn}
        aiStreamContent={state?.aiStream?.content ?? null}
        typingUsers={typingUsers ?? []}
        accentColor={accentColor}
        avatars={avatars}
        visitorName={visitorName}
        readReceiptsEnabled
        translations={state?.translations ?? {}}
        translateLang={translateLang}
        translationEnabled={translationsEnabled}
        onTranslate={translateMessage}
        onOpenLightbox={setLightboxUrl}
        scrollKey={conversationId ? 1 : 0}
      />

      {/* Visitor review (shown after the visitor rates the conversation) */}
      {conversation?.rating ? (
        <div style={{ padding: '12px 16px', borderTop: '1px solid #e5e7f0', background: '#f8fafc', flex: 'none', textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 6 }}>{t('agent.visitorReview')}</div>
          <div style={{ fontSize: 16, lineHeight: 1, letterSpacing: 2 }} aria-label={t('agent.ratingOutOf', { n: conversation.rating })}>
            {'★'.repeat(conversation.rating)}
            {'☆'.repeat(Math.max(0, 5 - conversation.rating))}
          </div>
          {conversation.review && (
            <div style={{ fontSize: 13, color: '#64748b', fontStyle: 'italic', marginTop: 6 }}>
              &ldquo;{conversation.review}&rdquo;
            </div>
          )}
        </div>
      ) : null}

      {/* Composer + quick replies */}
      <Composer
        maxChars={AGENT_MAX_CHARS}
        disabled={!canSend || !socket.connected}
        placeholder={isAiHandled ? t('agent.takeOverToReply') : isResolved ? t('agent.conversationEnded') : t('visitor.typeMessage')}
        suggestions={suggestions}
        onSend={send}
        onAttach={(file) => void handleFile(file)}
        onTypingStart={() => socket.typingStart(conversationId)}
        onTypingStop={() => socket.typingStop(conversationId)}
        error={error}
        onDismissError={() => setError(null)}
        uploading={uploading}
      />

      {/* Resolve confirm */}
      {showResolveConfirm && (
        <div className="aw-confirm">
          <h3>{t('agent.resolveConfirmTitle')}</h3>
          <p>{t('agent.resolveConfirmBody')}</p>
          <div className="aw-confirm-actions">
            <button type="button" className="aw-btn" onClick={() => setShowResolveConfirm(false)}>
              {t('common.cancel')}
            </button>
            <button
              type="button"
              className="aw-btn aw-btn-danger"
              onClick={() => {
                socket.resolveConversation(conversationId)
                setShowResolveConfirm(false)
              }}
            >
              {t('agent.resolve')}
            </button>
          </div>
        </div>
      )}

      {/* Transfer confirm */}
      {showTransferConfirm && (
        <div className="aw-confirm">
          <h3>{t('agent.transferToSpecialist')}</h3>
          <p>{t('agent.handConversation')}</p>
          <select
            className="aw-select"
            value={transferTarget}
            onChange={(e) => setTransferTarget(e.target.value)}
          >
            <option value="">{t('agent.selectAgent')}</option>
            {transferTargets.map((a) => (
              <option key={a.username} value={a.username}>
                {a.displayName || a.username}
              </option>
            ))}
          </select>
          <div className="aw-confirm-actions">
            <button type="button" className="aw-btn" onClick={() => setShowTransferConfirm(false)}>
              {t('common.cancel')}
            </button>
            <button
              type="button"
              className="aw-btn aw-btn-primary"
              disabled={!transferTarget}
              onClick={() => {
                socket.transferToSpecialist(conversationId, transferTarget)
                setShowTransferConfirm(false)
                setTransferTarget('')
              }}
            >
              {t('agent.transfer')}
            </button>
          </div>
        </div>
      )}

      {lightboxUrl && (
        <div className="oc-lightbox" onClick={() => setLightboxUrl(null)}>
          <img src={lightboxUrl} alt={t('visitor.attachment')} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  )
}

function InfoRow({
  label,
  value,
  link,
  copyable,
  copied,
  onCopy,
}: {
  label: string
  value: string
  link?: boolean
  copyable?: boolean
  copied?: boolean
  onCopy?: () => void
}) {
  const { t } = useTranslation()
  const isLink = link && value && value !== t('common.unknown') && value !== t('agent.directNone')
  return (
    <div className="aw-info-row">
      <span className="aw-info-key">{label}</span>
      {isLink ? (
        <a className="aw-info-link" href={value} target="_blank" rel="noreferrer" title={value}>
          {value}
        </a>
      ) : (
        <span className="aw-info-val" title={value}>
          {value}
        </span>
      )}
      {copyable && value && value !== t('common.unknown') && value !== t('agent.directNone') && (
        <button type="button" className="aw-copy-btn" title={t('agent.copy', { label: label.toLowerCase() })} onClick={onCopy}>
          {copied ? <Check size={11} /> : <Copy size={11} />}
        </button>
      )}
    </div>
  )
}
