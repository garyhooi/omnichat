import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MessageCircle } from 'lucide-react'
import { BubbleSvgIcon, DEFAULT_BUBBLE_ICON, parseSvgIcon } from '../../../shared/lib/bubbleIcons'

export interface WelcomeScreenProps {
  title?: string
  message?: string
  accentColor: string
  connected: boolean
  onStart: (name: string, email?: string) => void
  /** Error returned by start_conversation (e.g. rate limited). */
  error?: string | null
  /** Site-configured bubble icon value (e.g. "svg:headset", emoji, "custom:…"). */
  bubbleIcon?: string
  /** Server base URL for resolving relative custom-image paths. */
  serverUrl?: string
}

/**
 * Pre-chat form — the visitor enters a name (email optional) to start a
 * conversation. Disabled until the socket connects.
 */
export function WelcomeScreen({
  title = 'OmniChat',
  message,
  accentColor,
  connected,
  onStart,
  error,
  bubbleIcon = '',
  serverUrl = '',
}: WelcomeScreenProps) {
  const { t } = useTranslation()
  const effectiveMessage = message || t('visitor.welcomeDefault')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  // Resolve the welcome-logo icon the same way the launcher bubble does.
  const svgIcon = parseSvgIcon(bubbleIcon) || (bubbleIcon ? null : DEFAULT_BUBBLE_ICON)
  const iconIsImage = bubbleIcon.startsWith('custom:') || bubbleIcon.startsWith('/') || bubbleIcon.startsWith('http')
  let iconSrc: string | null = null
  if (iconIsImage) {
    const raw = bubbleIcon.startsWith('custom:') ? bubbleIcon.slice(7) : bubbleIcon
    iconSrc = raw.startsWith('http') ? raw : serverUrl + raw
  }
  const iconEmoji = iconIsImage || svgIcon ? null : bubbleIcon

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!connected) return
    if (!name.trim()) {
      setLocalError(t('visitor.nameRequired'))
      return
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setLocalError(t('visitor.emailInvalid'))
      return
    }
    setLocalError(null)
    onStart(name.trim(), email.trim() || undefined)
  }

  const showError = localError || error

  return (
    <div className="oc-welcome">
      <div className="oc-welcome-logo" style={{ background: accentColor }}>
        {iconSrc ? (
          <img src={iconSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : svgIcon ? (
          <BubbleSvgIcon name={svgIcon} size={26} />
        ) : iconEmoji ? (
          <span style={{ fontSize: 22, lineHeight: 1 }}>{iconEmoji}</span>
        ) : (
          <MessageCircle size={26} />
        )}
      </div>
      <h2>{title}</h2>
      <p>{effectiveMessage}</p>

      {!connected ? (
        <div className="oc-connecting">
          <span className="oc-spinner" /> {t('common.connecting')}
        </div>
      ) : (
        <form className="oc-form" onSubmit={submit}>
          <div className="oc-field">
            <label htmlFor="oc-name">{t('visitor.yourName')}</label>
            <input
              id="oc-name"
              className="oc-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('visitor.namePlaceholder')}
              maxLength={60}
              autoFocus
            />
          </div>
          <div className="oc-field">
            <label htmlFor="oc-email">{t('visitor.emailOptional')}</label>
            <input
              id="oc-email"
              className="oc-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('visitor.emailPlaceholder')}
              type="text"
              inputMode="email"
              autoComplete="email"
              maxLength={120}
            />
          </div>
          {showError && <span className="oc-form-error">{showError}</span>}
          <button type="submit" className="oc-start-btn">
            {t('visitor.startChat')}
          </button>
        </form>
      )}
    </div>
  )
}
