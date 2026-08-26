// =============================================================================
// AgentWidgetApp — the React root rendered inside <omnichat-agent-widget>.
// The agent's floating console: launcher bubble (with total unread badge),
// resizable panel with conversation list (tabs) and per-conversation chat.
// =============================================================================

import { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { I18nScope } from '../../shared/components/I18nScope'
import { useApplyUiLang } from '../../shared/hooks/useUiLang'
import { Headset, X } from 'lucide-react'
import { BubbleSvgIcon, DEFAULT_BUBBLE_ICON, parseSvgIcon } from '../../shared/lib/bubbleIcons'
import {
  useAgentSocket,
  agentConversationsQueryKey,
  agentPresenceQueryKey,
  type AgentConversationsState,
} from './useAgentSocket'
import { useSiteConfig } from '../chat/hooks/useSiteConfig'
import { useSound } from '../chat/hooks/useSound'
import { AgentConversationList, type AgentTab } from './AgentConversationList'
import { AgentChatView } from './AgentChatView'
import {
  MOBILE_PANEL_MARGIN,
  WIDGET_MARGIN,
  useWidgetPosition,
} from '../widget/useWidgetPosition'
import { AGENT_WIDGET_MUTED_KEY, ACCESS_TOKEN_KEY, storageGet } from '../../shared/lib/storage'
import type { AgentPresenceEntry } from '../../shared/types/models'

export interface AgentWidgetAppProps {
  serverUrl: string
  accentColor?: string
  /** Optional UI language (element [lang] attribute); default English. */
  lang?: string
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: false },
  },
})

const MIN_W = 320
const MIN_H = 420
const MAX_W = 720
const MAX_H = 820
const DEFAULT_W = 400
const DEFAULT_H = 620

export function AgentWidgetApp({ serverUrl, accentColor, lang }: AgentWidgetAppProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const openRef = useRef(false)
  const [activeTab, setActiveTab] = useState<AgentTab>('active')
  const [size, setSize] = useState({ width: DEFAULT_W, height: DEFAULT_H })
  const [attention, setAttention] = useState(false)

  const { config: siteConfig } = useSiteConfig(serverUrl)
  // Admin-controlled operator UI language (site config → Widget Setup).
  useApplyUiLang(lang, siteConfig?.adminLanguage)
  const accent = siteConfig?.bubbleColor || accentColor || '#1e293b'

  // Launcher bubble icon — honor the site-configured bubbleIcon ("svg:<name>"
  // lucide icon, emoji char, "custom:…" URL, absolute URL, or server-relative
  // path); fall back to the default headset glyph when none is configured.
  const bubbleIcon = siteConfig?.bubbleIcon || ''
  const svgIcon = parseSvgIcon(bubbleIcon) || (bubbleIcon ? null : DEFAULT_BUBBLE_ICON)
  const iconIsImage = bubbleIcon.startsWith('custom:') || bubbleIcon.startsWith('/') || bubbleIcon.startsWith('http')
  let iconSrc: string | null = null
  if (iconIsImage) {
    const raw = bubbleIcon.startsWith('custom:') ? bubbleIcon.slice(7) : bubbleIcon
    iconSrc = raw.startsWith('http') ? raw : serverUrl + raw
  }
  const iconEmoji = iconIsImage || svgIcon ? null : bubbleIcon

  const { muted, toggleMuted, playSound } = useSound(
    serverUrl,
    AGENT_WIDGET_MUTED_KEY,
    siteConfig?.notificationSoundUrl,
  )

  const socket = useAgentSocket({
    serverUrl,
    getToken: () => storageGet(ACCESS_TOKEN_KEY),
    onEvent: (event) => {
      if (event === 'new_message' && !openRef.current) {
        setAttention(true)
        setTimeout(() => setAttention(false), 2200)
        playSound()
      }
    },
  })

  const { data: convsState } = useQuery<AgentConversationsState>({
    queryKey: agentConversationsQueryKey(serverUrl),
    staleTime: Infinity,
    placeholderData: { conversations: [], currentUser: null, loaded: false },
    queryFn: () => ({ conversations: [], currentUser: null, loaded: false }),
  })
  const conversations = convsState?.conversations ?? []
  const currentUser = socket.currentUser ?? convsState?.currentUser ?? null

  const { data: agents } = useQuery<AgentPresenceEntry[]>({
    queryKey: agentPresenceQueryKey(serverUrl),
    staleTime: Infinity,
    placeholderData: [],
    queryFn: () => [],
  })
  const agentList = agents ?? []

  const pos = useWidgetPosition({
    serverUrl,
    positionKeyPrefix: 'omnichat_admin_widget_position_',
    panelAnchorKeyPrefix: 'omnichat_admin_widget_panel_anchor_',
  })

  const setOpenState = useCallback((next: boolean) => {
    openRef.current = next
    setOpen(next)
  }, [])

  // Total unread badge over active/ai/specialist conversations.
  const unreadTotal = useMemo(
    () =>
      conversations
        .filter((c) => c.status === 'active' || c.status === 'ai' || c.status === 'specialist')
        .reduce((sum, c) => sum + (c.unreadCount ?? 0), 0),
    [conversations],
  )

  const handleOpen = useCallback(() => {
    if (pos.suppressClick()) return
    setOpenState(true)
    if (!pos.hasSavedPanel) {
      const pw = Math.min(size.width, Math.max(MIN_W, pos.viewport.width - WIDGET_MARGIN * 2))
      const ph = Math.min(size.height, Math.max(MIN_H, pos.viewport.height - WIDGET_MARGIN * 2))
      const ax = Math.max(0, pos.bubble.x + 56 - pw)
      let ay = Math.max(0, pos.bubble.y - ph - 16)
      if (ay <= 0) ay = pos.bubble.y + 56 + 16
      pos.setPanelPosition({ x: ax, y: ay })
    }
  }, [pos, setOpenState, size.height, size.width])

  const panelStyle = useMemo(() => {
    if (pos.isSmall) {
      const m = MOBILE_PANEL_MARGIN
      return {
        left: m,
        top: m,
        width: `calc(100vw - ${m * 2}px)`,
        height: `calc(100dvh - ${m * 2}px)`,
      }
    }
    const w = Math.min(size.width, pos.viewport.width - WIDGET_MARGIN * 2)
    const h = Math.min(size.height, pos.viewport.height - WIDGET_MARGIN * 2)
    const maxLeft = Math.max(0, pos.viewport.width - w)
    const maxTop = Math.max(0, pos.viewport.height - h)
    return {
      left: Math.min(Math.max(pos.panel.x, 0), maxLeft),
      top: Math.min(Math.max(pos.panel.y, 0), maxTop),
      width: w,
      height: h,
    }
  }, [pos, size])

  // Resize via the bottom-right handle.
  const resizeRef = useRef<{ pointerId: number; startX: number; startY: number; w: number; h: number } | null>(null)
  const startResize = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      resizeRef.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        w: size.width,
        h: size.height,
      }
      const onMove = (ev: PointerEvent) => {
        const r = resizeRef.current
        if (!r || r.pointerId !== ev.pointerId) return
        const vw = pos.viewport.width - WIDGET_MARGIN * 2
        const vh = pos.viewport.height - WIDGET_MARGIN * 2
        setSize({
          width: Math.min(MAX_W, Math.max(MIN_W, Math.min(r.w + (ev.clientX - r.startX), vw))),
          height: Math.min(MAX_H, Math.max(MIN_H, Math.min(r.h + (ev.clientY - r.startY), vh))),
        })
      }
      const onUp = (ev: PointerEvent) => {
        const r = resizeRef.current
        if (!r || r.pointerId !== ev.pointerId) return
        resizeRef.current = null
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
      }
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
    },
    [pos.viewport, size.height, size.width],
  )

  const openConversationId = socket.openConversationId
  const openConversation = conversations.find((c) => c.id === openConversationId) ?? null

  return (
    <div
      className="aw-root"
      style={{
        ['--oc-accent' as string]: accent,
        ['--oc-accent-soft' as string]: `color-mix(in srgb, ${accent} 10%, white)`,
      }}
    >
      {/* Launcher bubble — hidden while the panel is open so it can't cover
          the composer on short viewports. */}
      {!open && (
        <button
          type="button"
          className={`aw-bubble-btn ${attention ? 'aw-attention' : ''}`}
          style={{ left: pos.bubble.x, top: pos.bubble.y, background: accent }}
          onPointerDown={(e) => {
            if (pos.isSmall && open) return
            pos.startBubbleDrag(e)
          }}
          onClick={handleOpen}
          aria-label={t('agent.openConsole')}
        >
          {iconSrc ? (
            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden' }}>
              <img
                src={iconSrc}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
              />
            </span>
          ) : svgIcon ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <BubbleSvgIcon name={svgIcon} size={26} />
            </span>
          ) : iconEmoji ? (
            <span style={{ fontSize: 26, lineHeight: 1, pointerEvents: 'none' }}>{iconEmoji}</span>
          ) : (
            <Headset size={26} />
          )}
          {unreadTotal > 0 && <span className="aw-badge">{unreadTotal > 99 ? '99+' : unreadTotal}</span>}
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="aw-panel-frame" style={panelStyle as React.CSSProperties}>
          <div className="aw-panel-header" onPointerDown={pos.startPanelDrag}>
            <span className="aw-panel-title">
              {t('agent.consoleTitle', {
                name: currentUser?.displayName || currentUser?.username || 'Console',
              })}
            </span>
            <span style={{ fontSize: 11, opacity: 0.7 }}>
              {socket.connected ? `● ${t('common.online')}` : `… ${t('common.connecting')}`}
            </span>
            <button
              type="button"
              className="aw-icon-btn"
              title={muted ? t('common.unmute') : t('common.mute')}
              onClick={toggleMuted}
            >
              {muted ? '🔕' : '🔔'}
            </button>
            <button
              type="button"
              className="aw-icon-btn"
              title={t('agent.collapseConsole')}
              aria-label={t('agent.collapseConsole')}
              onClick={() => setOpenState(false)}
            >
              <X size={16} />
            </button>
          </div>

          {!openConversationId ? (
            socket.connected || (convsState?.loaded ?? false) ? (
              <AgentConversationList
                conversations={conversations}
                currentUsername={currentUser?.username ?? ''}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onSelect={socket.openConversation}
              />
            ) : (
              <div className="aw-offline">
                <span className="aw-spinner" />
                {t('agent.connectingTo')}
              </div>
            )
          ) : (
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <AgentChatView
                socket={socket}
                serverUrl={serverUrl}
                conversationId={openConversationId}
                conversation={openConversation}
                agents={agentList.map((a) => ({ username: a.username, displayName: a.displayName }))}
                currentUserUsername={currentUser?.username ?? ''}
                accentColor={accent}
                translationsEnabled={siteConfig?.translationEnabled !== false}
                onBack={socket.closeConversation}
              />
            </div>
          )}

          <div className="aw-resize-handle" onPointerDown={startResize} aria-hidden="true" />
        </div>
      )}
    </div>
  )
}

export function AgentWidgetRoot(props: AgentWidgetAppProps) {
  return (
    <I18nScope lang={props.lang}>
      <QueryClientProvider client={queryClient}>
        <AgentWidgetApp {...props} />
      </QueryClientProvider>
    </I18nScope>
  )
}
