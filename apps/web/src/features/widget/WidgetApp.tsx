// =============================================================================
// WidgetApp — the React root rendered inside <omnichat-chat-widget>.
// Launcher bubble (draggable, unread badge, site-styled) + chat panel
// (free-positioned, header-draggable). All data flows through useChatSession
// → TanStack Query cache.
// =============================================================================

import { useCallback, useMemo, useRef, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { BubbleSvgIcon, DEFAULT_BUBBLE_ICON, parseSvgIcon } from '../../shared/lib/bubbleIcons'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nScope } from '../../shared/components/I18nScope'
import { useApplyUiLang } from '../../shared/hooks/useUiLang'
import { useChatSession } from '../chat/hooks/useChatSession'
import { ChatPanel } from '../chat/components/ChatPanel'
import {
  DESKTOP_PANEL_GAP,
  MOBILE_PANEL_MARGIN,
  PANEL_HEIGHT,
  PANEL_WIDTH,
  WIDGET_MARGIN,
  bubbleDiameter,
  useWidgetPosition,
} from './useWidgetPosition'
import {
  WIDGET_MUTED_KEY,
  WIDGET_TRANSLATE_LANG_KEY,
} from '../../shared/lib/storage'

export interface WidgetAppProps {
  serverUrl: string
  bubbleColor?: string
  externalToken?: string
  position?: string
  /** Optional UI language (element [lang] attribute); default English. */
  lang?: string
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

export function WidgetApp({ serverUrl, bubbleColor, externalToken, position, lang }: WidgetAppProps) {
  const [open, setOpen] = useState(false)
  const openRef = useRef(false)
  const [scrollResetKey, setScrollResetKey] = useState(0)
  const [attention, setAttention] = useState(false)

  const session = useChatSession({
    serverUrl,
    externalToken,
    storageKeys: {
      mutedKey: WIDGET_MUTED_KEY,
      translateLangKey: WIDGET_TRANSLATE_LANG_KEY,
      autoTranslateKey: 'omnichat_client_auto_translate',
    },
    getPanelOpen: () => openRef.current,
    onEvent: (event) => {
      // First incoming message while closed → brief attention pulse on the bubble.
      if (event === 'new_message' && !openRef.current) {
        setAttention(true)
        setTimeout(() => setAttention(false), 2200)
      }
    },
  })

  const setOpenState = useCallback((next: boolean) => {
    openRef.current = next
    setOpen(next)
    if (next) setScrollResetKey((k) => k + 1)
  }, [])

  // Admin-controlled visitor UI language (site config → Widget Setup).
  useApplyUiLang(lang, session.siteConfig?.visitorLanguage)

  const pos = useWidgetPosition({
    serverUrl,
    defaultPosition: position,
    bubbleSize: session.siteConfig?.bubbleSize,
  })

  const accentColor = session.siteConfig?.bubbleColor || bubbleColor || '#4f46e5'
  const icon = session.siteConfig?.bubbleIcon || ''
  // Legacy parity: bubbleIcon is "svg:<name>" (lucide icon), an emoji char, a
  // "custom:…" URL, an absolute URL, or a server-relative path. Fall back to
  // the default headset icon when nothing is configured.
  const svgIcon = parseSvgIcon(icon) || (icon ? null : DEFAULT_BUBBLE_ICON)
  const iconIsImage = icon.startsWith('custom:') || icon.startsWith('/') || icon.startsWith('http')
  let iconSrc: string | null = null
  if (iconIsImage) {
    const raw = icon.startsWith('custom:') ? icon.slice(7) : icon
    iconSrc = raw.startsWith('http') ? raw : serverUrl + raw
  }
  const iconEmoji = iconIsImage || svgIcon ? null : icon

  const diameter = bubbleDiameter(session.siteConfig?.bubbleSize)

  // Unread badge — derived from messages the visitor hasn't read yet. Only
  // shown while the panel is closed (opening marks everything as read).
  const unreadCount = useMemo(() => {
    if (open) return 0
    return session.messages.filter(
      (m) => (m.senderType === 'agent' || m.senderType === 'ai') && !m.readAt,
    ).length
  }, [open, session.messages])

  const handleOpen = useCallback(() => {
    if (pos.suppressClick()) return
    setOpenState(true)
    session.markAllAsRead()
    // First open (no saved anchor): position the panel relative to the bubble,
    // flipped above it — mirrors the legacy widget exactly.
    if (!pos.hasSavedPanel) {
      const pw = Math.min(PANEL_WIDTH, Math.max(280, pos.viewport.width - WIDGET_MARGIN * 2))
      const ph = Math.min(PANEL_HEIGHT, Math.max(320, pos.viewport.height - WIDGET_MARGIN * 2))
      const ax = Math.max(0, pos.bubble.x + diameter - pw)
      let ay = Math.max(0, pos.bubble.y - ph - DESKTOP_PANEL_GAP)
      if (ay <= 0) ay = pos.bubble.y + diameter + DESKTOP_PANEL_GAP
      pos.setPanelPosition({ x: ax, y: ay })
    }
  }, [diameter, pos, session])

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
    const pw = Math.min(PANEL_WIDTH, Math.max(280, pos.viewport.width - WIDGET_MARGIN * 2))
    const ph = Math.min(PANEL_HEIGHT, Math.max(320, pos.viewport.height - WIDGET_MARGIN * 2))
    const maxLeft = Math.max(0, pos.viewport.width - pw)
    const maxTop = Math.max(0, pos.viewport.height - ph)
    return {
      left: Math.min(Math.max(pos.panel.x, 0), maxLeft),
      top: Math.min(Math.max(pos.panel.y, 0), maxTop),
      width: pw,
      height: ph,
    }
  }, [pos])

  return (
    <div className="oc-widget-root">
      {/* Launcher bubble — hidden while the panel is open (the panel has its
          own Close button; keeping both would let the bubble cover the
          composer on short viewports). */}
      {!open && (
        <button
          type="button"
          className={`oc-bubble-btn oc-pattern-${session.siteConfig?.bubblePattern || 'solid'} ${attention ? 'oc-attention' : ''}`}
          style={{
            left: pos.bubble.x,
            top: pos.bubble.y,
            width: diameter,
            height: diameter,
            background: accentColor,
            fontSize: diameter * 0.42,
          }}
          onPointerDown={(e) => {
            // Legacy: no bubble drag on small screens while the panel is open.
            if (pos.isSmall && open) return
            pos.startBubbleDrag(e)
          }}
          onClick={handleOpen}
          aria-label="Open chat"
        >
          {iconSrc ? (
            <img
              src={iconSrc}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', pointerEvents: 'none' }}
            />
          ) : svgIcon ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <BubbleSvgIcon name={svgIcon} size={diameter * 0.5} />
            </span>
          ) : iconEmoji ? (
            <span style={{ fontSize: diameter * 0.45, lineHeight: 1, pointerEvents: 'none' }}>{iconEmoji}</span>
          ) : (
            <MessageCircle size={diameter * 0.45} fill="currentColor" />
          )}
          {unreadCount > 0 && <span className="oc-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="oc-panel-frame" style={panelStyle as React.CSSProperties}>
          <ChatPanel
            session={session}
            serverUrl={serverUrl}
            accentColor={accentColor}
            title={session.siteConfig?.siteName}
            showCloseButton
            onClose={() => setOpenState(false)}
            scrollResetKey={scrollResetKey}
            onHeaderPointerDown={pos.startPanelDrag}
          />
        </div>
      )}
    </div>
  )
}

export function WidgetRoot(props: WidgetAppProps) {
  return (
    <I18nScope lang={props.lang}>
      <QueryClientProvider client={queryClient}>
        <WidgetApp {...props} />
      </QueryClientProvider>
    </I18nScope>
  )
}
