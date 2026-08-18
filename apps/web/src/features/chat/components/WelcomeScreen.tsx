import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MessageCircle } from 'lucide-react'

export interface WelcomeScreenProps {
  title?: string
  message?: string
  accentColor: string
  connected: boolean
  onStart: (name: string, email?: string) => void
  /** Error returned by start_conversation (e.g. rate limited). */
  error?: string | null
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
}: WelcomeScreenProps) {
  const { t } = useTranslation()
  const effectiveMessage = message || t('visitor.welcomeDefault')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

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
        <MessageCircle size={26} />
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
