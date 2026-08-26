// =============================================================================
// Login page — server URL + credentials. Mirrors the legacy portal login.
// =============================================================================

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Headset, Lock, User } from 'lucide-react'
import { useAuth } from '../auth'
import { checkServerUrl } from '../../shared/lib/serverUrl'

export function LoginPage() {
  const { t } = useTranslation()
  const { serverUrl, login } = useAuth()
  const [url, setUrl] = useState(serverUrl)
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('omnichat_admin_api_key') ?? '')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Security: only http/https to a non-local/private host (the element's
    // server-url attribute is trusted site config; free-form input is not).
    const check = checkServerUrl(url)
    if (!check.ok) {
      setError(check.reason ?? t('admin.invalidServerUrl'))
      return
    }

    setBusy(true)
    try {
      if (apiKey) localStorage.setItem('omnichat_admin_api_key', apiKey)
      await login(url, username, password, apiKey || undefined)
    } catch (err) {
      setError(err instanceof Error ? err.message : t('admin.loginFailed'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="adm-login">
      <form className="adm-login-card" onSubmit={submit}>
        <div className="adm-login-logo">
          <Headset size={24} />
        </div>
        <h1>{t('admin.loginTitle')}</h1>
        <p>{t('admin.loginSubtitle')}</p>

        <div className="adm-field">
          <label className="adm-label" htmlFor="login-server">
            {t('admin.serverUrl')}
          </label>
          <input
            id="login-server"
            className="adm-input"
            style={{ width: '100%' }}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.yoursite.com"
            required
          />
          <span className="adm-muted" style={{ fontSize: 11, display: 'block', marginTop: 4 }}>
            {t('admin.serverUrlHint')}
          </span>
        </div>
        <div className="adm-field">
          <label className="adm-label" htmlFor="login-user">
            {t('admin.username')}
          </label>
          <div style={{ position: 'relative' }}>
            <User size={15} style={{ position: 'absolute', left: 10, top: 9, color: '#94a3b8' }} />
            <input
              id="login-user"
              className="adm-input"
              style={{ width: '100%', paddingLeft: 32 }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
        </div>
        <div className="adm-field">
          <label className="adm-label" htmlFor="login-pass">
            {t('admin.password')}
          </label>
          <div style={{ position: 'relative' }}>
            <Lock size={15} style={{ position: 'absolute', left: 10, top: 9, color: '#94a3b8' }} />
            <input
              id="login-pass"
              className="adm-input"
              style={{ width: '100%', paddingLeft: 32 }}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
        </div>
        <div className="adm-field">
          <label className="adm-label" htmlFor="login-apikey">
            {t('admin.loginApiKey')}
          </label>
          <input
            id="login-apikey"
            className="adm-input"
            style={{ width: '100%' }}
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={t('admin.apiKeyPlaceholder')}
          />
        </div>

        {error && <p className="adm-login-error">{error}</p>}

        <button type="submit" className="adm-btn adm-btn-primary" style={{ width: '100%', marginTop: 16 }} disabled={busy}>
          {busy ? <span className="adm-spinner" style={{ borderColor: 'rgb(255 255 255 / .4)', borderTopColor: '#fff' }} /> : t('admin.signIn')}
        </button>
      </form>
    </div>
  )
}
