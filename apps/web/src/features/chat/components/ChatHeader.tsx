import { useTranslation } from 'react-i18next'
import { Bell, BellOff, LogOut, RotateCcw, X } from 'lucide-react'
import { TranslatePopover } from './TranslatePopover'

export interface ChatHeaderProps {
  title: string
  subtitle: string
  muted: boolean
  onToggleMute: () => void
  showClose: boolean
  onClose?: () => void
  showEndChat: boolean
  onEndChat?: () => void
  showNewChat: boolean
  onNewChat?: () => void
  accentColor: string
  translateLang: string
  autoTranslateEnabled: boolean
  onLangChange: (lang: string) => void
  onAutoChange: (enabled: boolean) => void
  translationEnabled: boolean
  /** Drag-to-move the panel by its header (widget only). */
  onHeaderPointerDown?: (e: React.PointerEvent) => void
}

/** Panel header — identity, status, and the mute/translate/close controls. */
export function ChatHeader({
  title,
  subtitle,
  muted,
  onToggleMute,
  showClose,
  onClose,
  showEndChat,
  onEndChat,
  showNewChat,
  onNewChat,
  accentColor,
  translateLang,
  autoTranslateEnabled,
  onLangChange,
  onAutoChange,
  translationEnabled,
  onHeaderPointerDown,
}: ChatHeaderProps) {
  const { t } = useTranslation()
  const isOnline = !subtitle.toLowerCase().includes('offline') && !subtitle.toLowerCase().includes('connect')

  return (
    <div className="oc-chat-header" style={{ background: accentColor }} onPointerDown={onHeaderPointerDown}>
      <div className="oc-chat-header-title">
        <div className="oc-chat-header-name">{title}</div>
        <div className="oc-chat-header-status">
          <span className={`oc-status-dot ${isOnline ? '' : 'oc-offline'}`} />
          {subtitle}
        </div>
      </div>

      <button
        type="button"
        className="oc-icon-btn"
        title={muted ? t('common.unmute') : t('common.mute')}
        onClick={onToggleMute}
      >
        {muted ? <BellOff size={16} /> : <Bell size={16} />}
      </button>



      {translationEnabled && (
        <TranslatePopover
          lang={translateLang}
          autoEnabled={autoTranslateEnabled}
          onLangChange={onLangChange}
          onAutoChange={onAutoChange}
        />
      )}

      {showNewChat && onNewChat && (
        <button type="button" className="oc-icon-btn" title={t('visitor.newChat')} onClick={onNewChat}>
          <RotateCcw size={16} />
        </button>
      )}

      {showEndChat && onEndChat && (
        <button type="button" className="oc-icon-btn" title={t('visitor.endChat')} onClick={onEndChat}>
          <LogOut size={16} />
        </button>
      )}

      {showClose && onClose && (
        <button type="button" className="oc-icon-btn" title={t('common.close')} onClick={onClose}>
          <X size={18} />
        </button>
      )}
    </div>
  )
}
