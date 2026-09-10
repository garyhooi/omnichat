import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Pencil, Play, Plus, RotateCcw, Save, Trash2, X } from 'lucide-react'
import { useAuth } from '../auth'
import { authFetch, authFetchJson } from '../../shared/lib/api-client'
import { BubbleSvgIcon, BUBBLE_ICON_NAMES, DEFAULT_BUBBLE_ICON, isSvgIconName, parseSvgIcon, svgIconStoreValue } from '../../shared/lib/bubbleIcons'
import { TRANSLATE_LANGS } from '../../shared/lib/translationCache'
import type { QuickReply, SiteConfig } from '../../shared/types/api'

const configKey = (serverUrl: string) => ['site-config', serverUrl] as const
const quickRepliesKey = (serverUrl: string) => ['quick-replies', serverUrl] as const

const EMOJI_OPTIONS = ['💬', '👋', '🤖', '💡', '❓', '🎉', '⭐', '🔔', '📩', '🛎️']

/** Legacy parity: bubble icon / avatars are stored as an emoji char or "custom:url". */
type AvatarField = 'ai' | 'agent' | 'visitor'

const AVATAR_META: Record<AvatarField, { labelKey: string; descKey: string }> = {
  ai: { labelKey: 'admin.avatarAi', descKey: 'admin.avatarAiDesc' },
  agent: { labelKey: 'admin.avatarAgent', descKey: 'admin.avatarAgentDesc' },
  visitor: { labelKey: 'admin.avatarVisitor', descKey: 'admin.avatarVisitorDesc' },
}

// ---------------------------------------------------------------------------
// Notification sounds — split per side: the visitor widget/chat page hears the
// visitor sound when an agent/AI replies; the agent console/widget hears the
// agent sound on incoming messages (falls back to the visitor sound when the
// agent sound is unset, so existing single-sound setups keep working).
// ---------------------------------------------------------------------------
type SoundField = 'visitor' | 'agent'

const SOUND_META: Record<SoundField, { cfgKey: 'visitorNotificationSoundUrl' | 'agentNotificationSoundUrl'; labelKey: string; placeholder: string }> = {
  visitor: { cfgKey: 'visitorNotificationSoundUrl', labelKey: 'admin.notificationSoundVisitor', placeholder: '/uploads/visitor-notification.mp3' },
  agent: { cfgKey: 'agentNotificationSoundUrl', labelKey: 'admin.notificationSoundAgent', placeholder: '/uploads/agent-notification.mp3' },
}

const SOUND_FIELDS: SoundField[] = ['agent', 'visitor']

function parseXy(value: string | undefined | null): { x: number; y: number } | null {
  if (!value?.startsWith('xy:')) return null
  const [xRaw, yRaw] = value.slice(3).split(',')
  const x = Number.parseInt(xRaw ?? '', 10)
  const y = Number.parseInt(yRaw ?? '', 10)
  if (Number.isNaN(x) || Number.isNaN(y)) return null
  return { x, y }
}

function splitCustom(value: string | undefined | null): { emoji: string; url: string; isCustom: boolean } {
  if (value?.startsWith('custom:')) return { emoji: '', url: value.slice(7), isCustom: true }
  return { emoji: value || '', url: '', isCustom: false }
}

/** Resolve a stored avatar/icon URL to something an <img> can load. */
function absoluteUrl(raw: string, serverUrl: string): string {
  return raw.startsWith('http') ? raw : `${serverUrl.replace(/\/$/, '')}${raw}`
}

async function loadImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file)
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('Invalid image'))
      img.src = url
    })
  } finally {
    URL.revokeObjectURL(url)
  }
}

/** Client-side resize to a square webp (legacy parity: icon 128×128, avatar 80×80). */
async function compressToWebp(file: File, size: number): Promise<Blob> {
  const img = await loadImage(file)
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas unavailable')
  ctx.drawImage(img, 0, 0, size, size)
  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Conversion failed'))), 'image/webp', 0.85),
  )
}

async function uploadBlob(serverUrl: string, blob: Blob, filename: string): Promise<string> {
  const fd = new FormData()
  fd.append('file', blob, filename)
  const res = await authFetch(`${serverUrl}/upload`, { method: 'POST', body: fd })
  if (!res.ok) throw new Error('Upload failed')
  const data = (await res.json()) as { url: string }
  return data.url
}

/**
 * Settings — widget setup (appearance, messages, avatars, sound, position)
 * and quick-reply management. Mirrors the legacy Vue SettingsPage.
 */
export function SettingsPage() {
  const { t, i18n } = useTranslation()
  const { serverUrl, isDeveloper } = useAuth()
  const queryClient = useQueryClient()
  const [tab, setTab] = useState<'widget' | 'quick-replies'>('widget')
  const [form, setForm] = useState<Partial<SiteConfig> | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Widget position — the config stores "xy:x,y" (legacy contract).
  const [posX, setPosX] = useState(20)
  const [posY, setPosY] = useState(20)

  // Bubble icon — three families: svg (lucide, default = headset), emoji, custom image.
  const [iconType, setIconType] = useState<'icon' | 'emoji' | 'custom'>('icon')
  const [iconName, setIconName] = useState<string>(DEFAULT_BUBBLE_ICON)
  const [iconEmoji, setIconEmoji] = useState('💬')
  const [iconUrl, setIconUrl] = useState('')
  const [uploadingIcon, setUploadingIcon] = useState(false)
  const iconFileRef = useRef<HTMLInputElement | null>(null)

  // Message avatars
  const [avatarType, setAvatarType] = useState<Record<AvatarField, 'emoji' | 'custom'>>({ ai: 'emoji', agent: 'emoji', visitor: 'emoji' })
  const [avatarEmoji, setAvatarEmoji] = useState<Record<AvatarField, string>>({ ai: '🤖', agent: '👨‍💻', visitor: '👤' })
  const [avatarUrl, setAvatarUrl] = useState<Record<AvatarField, string>>({ ai: '', agent: '', visitor: '' })
  const [uploadingAvatar, setUploadingAvatar] = useState<Record<AvatarField, boolean>>({ ai: false, agent: false, visitor: false })
  const avatarFileRefs = useRef<Record<AvatarField, HTMLInputElement | null>>({ ai: null, agent: null, visitor: null })

  // Notification sounds (per side — visitor vs agent/operator)
  const [uploadingSound, setUploadingSound] = useState<Record<SoundField, boolean>>({ visitor: false, agent: false })
  const soundFileRefs = useRef<Record<SoundField, HTMLInputElement | null>>({ visitor: null, agent: null })

  const { data: config } = useQuery<SiteConfig | null>({
    queryKey: configKey(serverUrl),
    queryFn: () => authFetchJson<SiteConfig | null>(`${serverUrl}/config/admin-active`),
  })

  const { data: quickReplies, refetch: refetchQuickReplies } = useQuery<QuickReply[]>({
    queryKey: quickRepliesKey(serverUrl),
    staleTime: 30_000,
    queryFn: () => authFetchJson<QuickReply[]>(`${serverUrl}/quick-replies`),
  })

  useEffect(() => {
    if (config && !form) {
      setForm(config)
      // Legacy single-sound continuity: until a distinct agent sound is
      // uploaded, show the configured visitor sound in the agent row too
      // (the agent console falls back to it at runtime). They become fully
      // independent once either side is changed and saved.
      if (!config.agentNotificationSoundUrl && config.visitorNotificationSoundUrl) {
        setForm((f) => (f ? { ...f, agentNotificationSoundUrl: config.visitorNotificationSoundUrl } : f))
      }
      const xy = parseXy(config.websitePosition)
      setPosX(xy?.x ?? 20)
      setPosY(xy?.y ?? 20)
      const svg = parseSvgIcon(config.bubbleIcon)
      const icon = splitCustom(config.bubbleIcon)
      if (svg) {
        setIconType('icon')
        setIconName(svg)
        setIconEmoji('💬')
        setIconUrl('')
      } else if (icon.isCustom) {
        setIconType('custom')
        setIconUrl(icon.url)
      } else {
        setIconType('emoji')
        setIconEmoji(icon.emoji || '💬')
        setIconUrl('')
      }
      for (const field of ['ai', 'agent', 'visitor'] as AvatarField[]) {
        const parsed = splitCustom(config[`${field}Avatar`])
        setAvatarType((prev) => ({ ...prev, [field]: parsed.isCustom ? 'custom' : 'emoji' }))
        setAvatarUrl((u) => ({ ...u, [field]: parsed.url }))
        setAvatarEmoji((e) => ({ ...e, [field]: parsed.emoji || (field === 'ai' ? '🤖' : field === 'agent' ? '👨‍💻' : '👤') }))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config])

  const set = useCallback(
    (key: keyof SiteConfig, value: string | boolean) => {
      setForm((f) => (f ? { ...f, [key]: value } : f))
      setSaved(false)
    },
    [],
  )

  const save = useCallback(async () => {
    if (!config || !form) return
    setSaving(true)
    setError(null)
    try {
      // Only widget/appearance fields belong in the save body. allowedOrigins /
      // adminAllowedIps are security settings owned by the Developer page — sending
      // them here trips the backend's developer-role check and 403s every save for
      // agent/admin users. isActive must not be toggled by widget settings either.
      const { id, createdAt, updatedAt, allowedOrigins, adminAllowedIps, isActive, ...rest } = form as SiteConfig
      const body = {
        ...rest,
        websitePosition: `xy:${Math.round(posX)},${Math.round(posY)}`,
        bubbleIcon:
          iconType === 'icon'
            ? (isSvgIconName(iconName) ? svgIconStoreValue(iconName) : svgIconStoreValue(DEFAULT_BUBBLE_ICON))
            : iconType === 'custom' && iconUrl
              ? `custom:${iconUrl}`
              : iconEmoji || '💬',
        aiAvatar: avatarType.ai === 'custom' && avatarUrl.ai ? `custom:${avatarUrl.ai}` : avatarEmoji.ai || '🤖',
        agentAvatar: avatarType.agent === 'custom' && avatarUrl.agent ? `custom:${avatarUrl.agent}` : avatarEmoji.agent || '👨‍💻',
        visitorAvatar: avatarType.visitor === 'custom' && avatarUrl.visitor ? `custom:${avatarUrl.visitor}` : avatarEmoji.visitor || '👤',
      }
      await authFetchJson(`${serverUrl}/config/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      setSaved(true)
      void queryClient.invalidateQueries({ queryKey: configKey(serverUrl) })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }, [avatarEmoji, avatarType, avatarUrl, config, form, iconEmoji, iconType, iconUrl, posX, posY, queryClient, serverUrl])

  const handleIconUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) return
      setUploadingIcon(true)
      try {
        const blob = await compressToWebp(file, 128)
        const url = await uploadBlob(serverUrl, blob, 'icon.webp')
        setIconUrl(url)
        setIconType('custom')
      } catch {
        setError(t('admin.iconUploadFailed'))
      } finally {
        setUploadingIcon(false)
        if (iconFileRef.current) iconFileRef.current.value = ''
      }
    },
    [serverUrl, t],
  )

  const handleAvatarUpload = useCallback(
    async (file: File, field: AvatarField) => {
      if (!['image/webp', 'image/png', 'image/jpeg'].includes(file.type)) {
        setError(t('admin.invalidImageType'))
        return
      }
      if (file.size > 500 * 1024) {
        setError(t('admin.imageTooLarge'))
        return
      }
      setUploadingAvatar((u) => ({ ...u, [field]: true }))
      try {
        const blob = await compressToWebp(file, 80)
        if (blob.size > 500 * 1024) {
          setError(t('admin.imageTooLargeAfterCompress'))
          return
        }
        const url = await uploadBlob(serverUrl, blob, `avatar-${field}.webp`)
        setAvatarUrl((u) => ({ ...u, [field]: url }))
        setAvatarType((prev) => ({ ...prev, [field]: 'custom' }))
      } catch {
        setError(t('admin.avatarUploadFailed'))
      } finally {
        setUploadingAvatar((u) => ({ ...u, [field]: false }))
        if (avatarFileRefs.current[field]) avatarFileRefs.current[field]!.value = ''
      }
    },
    [serverUrl, t],
  )

  const handleSoundUpload = useCallback(
    async (field: SoundField, file: File) => {
      if (!file.type.startsWith('audio/')) return
      setUploadingSound((u) => ({ ...u, [field]: true }))
      try {
        const url = await uploadBlob(serverUrl, file, file.name)
        set(SOUND_META[field].cfgKey, url)
      } catch {
        setError(t('admin.soundUploadFailed'))
      } finally {
        setUploadingSound((u) => ({ ...u, [field]: false }))
        if (soundFileRefs.current[field]) soundFileRefs.current[field]!.value = ''
      }
    },
    [serverUrl, set, t],
  )

  const playSound = useCallback(
    (field: SoundField) => {
      const raw = form?.[SOUND_META[field].cfgKey]
      if (!raw) return
      const src = raw.startsWith('http') ? raw : `${serverUrl.replace(/\/$/, '')}${raw}`
      const audio = new Audio(src)
      audio.currentTime = 0
      audio.play().catch(() => {
        /* playback blocked or file missing */
      })
    },
    [form, serverUrl],
  )

  // -------------------------------------------------------------------------
  // Quick replies
  // -------------------------------------------------------------------------
  const [qrEditing, setQrEditing] = useState<string | null>(null) // '__new__' | id | null
  const [qrTitle, setQrTitle] = useState('')
  const [qrContent, setQrContent] = useState('')
  const [qrSaving, setQrSaving] = useState(false)

  const startQrAdd = () => {
    setQrEditing('__new__')
    setQrTitle('')
    setQrContent('')
  }

  const startQrEdit = (qr: QuickReply) => {
    setQrEditing(qr.id)
    setQrTitle(qr.title)
    setQrContent(qr.content)
  }

  const cancelQrEdit = () => {
    setQrEditing(null)
    setQrTitle('')
    setQrContent('')
  }

  const saveQuickReply = useCallback(async () => {
    const title = qrTitle.trim()
    if (!title) {
      setError(t('admin.titleRequired'))
      return
    }
    if (title.length > 200 || qrContent.length > 1000) {
      setError(t('admin.titleTooLong'))
      return
    }
    setQrSaving(true)
    try {
      const body = JSON.stringify({ title, content: qrContent })
      if (qrEditing === '__new__') {
        await authFetchJson(`${serverUrl}/quick-replies`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
        })
      } else if (qrEditing) {
        await authFetchJson(`${serverUrl}/quick-replies/${qrEditing}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body,
        })
      }
      cancelQrEdit()
      void refetchQuickReplies()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save quick reply')
    } finally {
      setQrSaving(false)
    }
  }, [qrContent, qrEditing, qrTitle, refetchQuickReplies, serverUrl, t])

  const deleteQuickReply = useCallback(
    async (id: string) => {
      if (!confirm(t('admin.deleteQuickReplyConfirm'))) return
      await authFetchJson(`${serverUrl}/quick-replies/${id}`, { method: 'DELETE' })
      void refetchQuickReplies()
    },
    [refetchQuickReplies, serverUrl, t],
  )

  if (!form) {
    return (
      <div className="adm-center">
        <span className="adm-spinner" />
      </div>
    )
  }

  return (
    <div>
      <div className="adm-page-head">
        <div>
          <h1 className="adm-page-title">{t('admin.settings')}</h1>
          <p className="adm-page-sub">{t('admin.siteConfigTitle')}</p>
        </div>
        {tab === 'widget' && (
          <button type="button" className="adm-btn adm-btn-primary" onClick={() => void save()} disabled={saving}>
            <Save size={15} /> {saving ? t('admin.saving') : t('admin.saveChanges')}
          </button>
        )}
      </div>

      <div className="adm-tabs" style={{ marginBottom: 16 }}>
        <button type="button" className={`adm-tab ${tab === 'widget' ? 'active' : ''}`} onClick={() => setTab('widget')}>
          {t('admin.widgetSetup')}
        </button>
        <button type="button" className={`adm-tab ${tab === 'quick-replies' ? 'active' : ''}`} onClick={() => setTab('quick-replies')}>
          {t('admin.quickReplies')}
        </button>
      </div>

      {saved && (
        <div className="adm-card" style={{ borderColor: '#a7f3d0', background: '#ecfdf5', marginBottom: 14 }}>
          <span style={{ color: '#065f46', fontSize: 13 }}>{t('admin.settingsSaved')}</span>
        </div>
      )}
      {error && (
        <div className="adm-card" style={{ borderColor: '#fecaca', background: '#fef2f2', marginBottom: 14 }}>
          <span style={{ color: '#991b1b', fontSize: 13 }}>{error}</span>
        </div>
      )}

      {tab === 'quick-replies' ? (
        <div className="adm-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          <div className="adm-card">
            <div className="adm-flex-between" style={{ marginBottom: 10 }}>
              <h2 className="adm-card-title" style={{ margin: 0 }}>
                {qrEditing === '__new__' ? t('admin.newQuickReply') : qrEditing ? t('admin.editQuickReply') : t('admin.quickRepliesTitle')}
              </h2>
              {!qrEditing && (
                <button type="button" className="adm-btn adm-btn-primary adm-btn-sm" onClick={startQrAdd}>
                  <Plus size={14} /> {t('admin.add')}
                </button>
              )}
            </div>
            {qrEditing && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <label className="adm-label">{t('admin.title')}</label>
                  <input
                    className="adm-input"
                    style={{ width: '100%' }}
                    maxLength={200}
                    value={qrTitle}
                    onChange={(e) => setQrTitle(e.target.value)}
                    placeholder={t('admin.titlePlaceholder')}
                  />
                  <span className="adm-muted" style={{ fontSize: 11 }}>{qrTitle.length}/200</span>
                </div>
                <div>
                  <label className="adm-label">{t('admin.content')}</label>
                  <textarea
                    className="adm-textarea"
                    style={{ width: '100%', minHeight: 90 }}
                    maxLength={1000}
                    value={qrContent}
                    onChange={(e) => setQrContent(e.target.value)}
                    placeholder={t('admin.contentPlaceholder')}
                  />
                  <span className="adm-muted" style={{ fontSize: 11 }}>{qrContent.length}/1000</span>
                </div>
                <div className="adm-row">
                  <button type="button" className="adm-btn adm-btn-primary" onClick={() => void saveQuickReply()} disabled={qrSaving || !qrTitle.trim()}>
                    {qrEditing === '__new__' ? t('admin.create') : t('admin.update')}
                  </button>
                  <button type="button" className="adm-btn" onClick={cancelQrEdit}>{t('common.cancel')}</button>
                </div>
              </div>
            )}
            {!qrEditing && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {(quickReplies ?? []).length === 0 && (
                  <span className="adm-muted" style={{ fontSize: 13, padding: '16px 0', textAlign: 'center' }}>
                    {t('admin.noQuickReplies')}
                  </span>
                )}
                {(quickReplies ?? []).map((qr) => (
                  <div key={qr.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 0', borderBottom: '1px solid var(--adm-border, #eef0f4)' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{qr.title}</div>
                      <div className="adm-muted" style={{ fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{qr.content}</div>
                    </div>
                    <div className="adm-row" style={{ gap: 4, flex: 'none' }}>
                      <button className="adm-btn adm-btn-sm" title={t('common.edit')} onClick={() => startQrEdit(qr)}>
                        <Pencil size={13} />
                      </button>
                      <button className="adm-btn adm-btn-sm" title={t('common.delete')} onClick={() => void deleteQuickReply(qr.id)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="adm-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div className="adm-card">
            <h2 className="adm-card-title">{t('admin.widgetAppearance')}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label className="adm-label">{t('admin.siteName')}</label>
                <input
                  className="adm-input"
                  style={{ width: '100%' }}
                  value={form.siteName ?? ''}
                  onChange={(e) => set('siteName', e.target.value)}
                />
              </div>
              <div>
                <label className="adm-label">{t('admin.bubbleColor')}</label>
                <div className="adm-row">
                  <input
                    type="color"
                    value={form.bubbleColor ?? '#4f46e5'}
                    onChange={(e) => set('bubbleColor', e.target.value)}
                    style={{ width: 44, height: 34, border: '1px solid var(--adm-border)', borderRadius: 8, background: 'none', padding: 2, cursor: 'pointer' }}
                  />
                  <input
                    className="adm-input adm-mono"
                    style={{ flex: 1 }}
                    value={form.bubbleColor ?? ''}
                    onChange={(e) => set('bubbleColor', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="adm-label">{t('admin.bubbleSize')}</label>
                <select className="adm-select" style={{ width: '100%' }} value={form.bubbleSize} onChange={(e) => set('bubbleSize', e.target.value)}>
                  <option value="small">{t('admin.sizeSmall')}</option>
                  <option value="medium">{t('admin.sizeMedium')}</option>
                  <option value="large">{t('admin.sizeLarge')}</option>
                </select>
              </div>
              <div>
                <label className="adm-label">{t('admin.bubblePattern')}</label>
                <select className="adm-select" style={{ width: '100%' }} value={form.bubblePattern} onChange={(e) => set('bubblePattern', e.target.value)}>
                  <option value="solid">{t('admin.patternSolid')}</option>
                  <option value="gradient">{t('admin.patternGradient')}</option>
                  <option value="stripes">{t('admin.patternStripes')}</option>
                  <option value="dots">{t('admin.patternDots')}</option>
                </select>
              </div>
              <div>
                <label className="adm-label">{t('admin.bubbleIcon')}</label>
                <div className="adm-row" style={{ gap: 12, marginBottom: 8 }}>
                  <label className="adm-row" style={{ cursor: 'pointer', gap: 6, fontSize: 13 }}>
                    <input type="radio" checked={iconType === 'icon'} onChange={() => { if (iconType !== 'icon') setIconType('icon') }} />
                    {t('admin.iconLabel')}
                  </label>
                  <label className="adm-row" style={{ cursor: 'pointer', gap: 6, fontSize: 13 }}>
                    <input type="radio" checked={iconType === 'emoji'} onChange={() => setIconType('emoji')} />
                    {t('admin.emoji')}
                  </label>
                  <label className="adm-row" style={{ cursor: 'pointer', gap: 6, fontSize: 13 }}>
                    <input type="radio" checked={iconType === 'custom'} onChange={() => setIconType('custom')} />
                    {t('admin.customImage')}
                  </label>
                </div>
                {iconType === 'icon' ? (
                  <>
                    <div role="radiogroup" aria-label={t('admin.bubbleIcon')} style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {BUBBLE_ICON_NAMES.map((name) => {
                        const active = iconName === name
                        return (
                          <button
                            key={name}
                            type="button"
                            title={name}
                            aria-checked={active}
                            role="radio"
                            onClick={() => setIconName(name)}
                            style={{
                              width: 44,
                              height: 44,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 10,
                              border: active ? '2px solid var(--adm-accent, #4f46e5)' : '1px solid var(--adm-border, #e5e7f0)',
                              background: active ? 'color-mix(in srgb, var(--adm-accent, #4f46e5) 10%, white)' : '#fff',
                              color: 'var(--adm-accent, #4f46e5)',
                              cursor: 'pointer',
                            }}
                          >
                            <BubbleSvgIcon name={name} size={22} />
                          </button>
                        )
                      })}
                    </div>
                    {iconName !== DEFAULT_BUBBLE_ICON && (
                      <button
                        type="button"
                        className="adm-btn"
                        style={{ marginTop: 8 }}
                        title={t('admin.resetDefaultHeadset')}
                        onClick={() => { setIconName(DEFAULT_BUBBLE_ICON); setIconType('icon') }}
                      >
                        <RotateCcw size={13} /> {t('admin.resetDefaultHeadset')}
                      </button>
                    )}
                  </>
                ) : iconType === 'emoji' ? (
                  <>
                    <select className="adm-select" style={{ width: '100%', fontSize: 16 }} value={iconEmoji} onChange={(e) => setIconEmoji(e.target.value)}>
                      {(EMOJI_OPTIONS.includes(iconEmoji) ? EMOJI_OPTIONS : [iconEmoji, ...EMOJI_OPTIONS]).map((e) => (
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                    {iconEmoji !== '💬' && (
                      <button
                        type="button"
                        className="adm-btn"
                        style={{ marginTop: 8 }}
                        title={t('admin.resetDefaultEmoji')}
                        onClick={() => { setIconUrl(''); setIconEmoji('💬'); setIconType('emoji') }}
                      >
                        <RotateCcw size={13} /> {t('admin.resetDefaultEmoji')}
                      </button>
                    )}
                  </>
                ) : (
                  <div className="adm-row" style={{ gap: 10 }}>
                    {iconUrl && (
                      <img
                        src={absoluteUrl(iconUrl, serverUrl)}
                        alt=""
                        style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--adm-border)' }}
                      />
                    )}
                    <button type="button" className="adm-btn" onClick={() => iconFileRef.current?.click()} disabled={uploadingIcon}>
                      {uploadingIcon ? t('admin.uploading') : t('admin.uploadImage')}
                    </button>
                    {iconUrl && (
                      <button
                        type="button"
                        className="adm-btn"
                        title={t('admin.resetDefaultHeadset')}
                        onClick={() => { setIconUrl(''); setIconName(DEFAULT_BUBBLE_ICON); setIconType('icon') }}
                      >
                        <RotateCcw size={13} /> {t('admin.resetDefault')}
                      </button>
                    )}
                    <input
                      ref={iconFileRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (f) void handleIconUpload(f)
                      }}
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="adm-label">{t('admin.websitePosition')}</label>
                <div className="adm-row" style={{ gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <label className="adm-label" style={{ fontSize: 11 }}>{t('admin.xOffset')}</label>
                    <input
                      className="adm-input adm-mono"
                      style={{ width: '100%' }}
                      type="number"
                      min={0}
                      step={1}
                      value={Number.isFinite(posX) ? posX : 20}
                      onChange={(e) => setPosX(Number(e.target.value) || 0)}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="adm-label" style={{ fontSize: 11 }}>{t('admin.yOffset')}</label>
                    <input
                      className="adm-input adm-mono"
                      style={{ width: '100%' }}
                      type="number"
                      min={0}
                      step={1}
                      value={Number.isFinite(posY) ? posY : 20}
                      onChange={(e) => setPosY(Number(e.target.value) || 0)}
                    />
                  </div>
                </div>
                <span className="adm-muted" style={{ fontSize: 11 }}>
                  {t('admin.positionHint')}
                </span>
              </div>
            </div>
          </div>

          <div className="adm-card">
            <h2 className="adm-card-title">{t('admin.messageAvatars')}</h2>
            <p className="adm-muted" style={{ fontSize: 12, marginTop: -6, marginBottom: 10 }}>
              {t('admin.avatarHelp')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(['ai', 'agent', 'visitor'] as AvatarField[]).map((field) => (
                <div key={field} style={{ border: '1px solid var(--adm-border)', borderRadius: 10, padding: 10 }}>
                  <div className="adm-flex-between" style={{ marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 650 }}>{t(AVATAR_META[field].labelKey)}</div>
                      <div className="adm-muted" style={{ fontSize: 11 }}>{t(AVATAR_META[field].descKey)}</div>
                    </div>
                    <div className="adm-row" style={{ gap: 10, fontSize: 12 }}>
                      <label className="adm-row" style={{ cursor: 'pointer', gap: 5 }}>
                        <input type="radio" checked={avatarType[field] === 'emoji'} onChange={() => setAvatarType((prev) => ({ ...prev, [field]: 'emoji' }))} />
                        {t('admin.emoji')}
                      </label>
                      <label className="adm-row" style={{ cursor: 'pointer', gap: 5 }}>
                        <input type="radio" checked={avatarType[field] === 'custom'} onChange={() => setAvatarType((prev) => ({ ...prev, [field]: 'custom' }))} />
                        {t('admin.image')}
                      </label>
                    </div>
                  </div>
                  {avatarType[field] === 'emoji' ? (
                    <div className="adm-row" style={{ gap: 8 }}>
                      <input
                        className="adm-input"
                        style={{ width: 72, textAlign: 'center', fontSize: 18 }}
                        maxLength={8}
                        value={avatarEmoji[field]}
                        onChange={(e) => setAvatarEmoji((s) => ({ ...s, [field]: e.target.value }))}
                      />
                      <span className="adm-muted" style={{ fontSize: 11 }}>{t('admin.typeEmoji')}</span>
                    </div>
                  ) : (
                    <div className="adm-row" style={{ gap: 10 }}>
                      {avatarUrl[field] && (
                        <img
                          src={absoluteUrl(avatarUrl[field], serverUrl)}
                          alt=""
                          style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--adm-border)' }}
                        />
                      )}
                      <button type="button" className="adm-btn" onClick={() => avatarFileRefs.current[field]?.click()} disabled={uploadingAvatar[field]}>
                        {uploadingAvatar[field] ? t('admin.uploading') : t('admin.uploadImage')}
                      </button>
                      {avatarUrl[field] && (
                        <button type="button" className="adm-btn" onClick={() => { setAvatarUrl((u) => ({ ...u, [field]: '' })); setAvatarType((prev) => ({ ...prev, [field]: 'emoji' })) }}>
                          {t('admin.remove')}
                        </button>
                      )}
                      {!avatarUrl[field] && <span className="adm-muted" style={{ fontSize: 11 }}>{t('admin.noImageUploaded')}</span>}
                      <input
                        ref={(el) => { avatarFileRefs.current[field] = el }}
                        type="file"
                        accept="image/webp,image/png,image/jpeg"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const f = e.target.files?.[0]
                          if (f) void handleAvatarUpload(f, field)
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="adm-card">
            <h2 className="adm-card-title">{t('admin.messagesLabel')}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label className="adm-label">{t('admin.welcomeMessage')}</label>
                <textarea
                  className="adm-textarea"
                  style={{ width: '100%', minHeight: 60 }}
                  value={form.welcomeMessage ?? ''}
                  onChange={(e) => set('welcomeMessage', e.target.value)}
                />
              </div>
              <div>
                <label className="adm-label">{t('admin.offlineMessage')}</label>
                <textarea
                  className="adm-textarea"
                  style={{ width: '100%', minHeight: 60 }}
                  value={form.offlineMessage ?? ''}
                  onChange={(e) => set('offlineMessage', e.target.value)}
                />
              </div>
              <div>
                <label className="adm-label">{t('admin.greetingHuman')}</label>
                <textarea
                  className="adm-textarea"
                  style={{ width: '100%', minHeight: 60 }}
                  value={form.greetingMessage ?? ''}
                  onChange={(e) => set('greetingMessage', e.target.value)}
                />
              </div>
              {SOUND_FIELDS.map((field) => {
                const meta = SOUND_META[field]
                const url = form?.[meta.cfgKey]
                return (
                  <div key={field}>
                    <label className="adm-label">{t(meta.labelKey)}</label>
                    <div className="adm-row" style={{ gap: 8, marginBottom: 8 }}>
                      <button
                        type="button"
                        className="adm-btn"
                        onClick={() => soundFileRefs.current[field]?.click()}
                        disabled={uploadingSound[field]}
                      >
                        {uploadingSound[field] ? t('admin.uploading') : t('admin.uploadSound')}
                      </button>
                      {url && (
                        <>
                          <button type="button" className="adm-btn" onClick={() => playSound(field)}>
                            <Play size={13} /> {t('admin.play')}
                          </button>
                          <button type="button" className="adm-btn" onClick={() => set(meta.cfgKey, '')}>
                            <X size={13} /> {t('admin.remove')}
                          </button>
                        </>
                      )}
                      <input
                        ref={(el) => {
                          soundFileRefs.current[field] = el
                        }}
                        type="file"
                        accept="audio/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const f = e.target.files?.[0]
                          if (f) void handleSoundUpload(field, f)
                        }}
                      />
                    </div>
                    <input
                      className="adm-input adm-mono"
                      style={{ width: '100%' }}
                      value={url ?? ''}
                      onChange={(e) => set(meta.cfgKey, e.target.value)}
                      placeholder={meta.placeholder}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          <div className="adm-card">
            <h2 className="adm-card-title">{t('admin.language')}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="adm-label">{t('admin.visitorUiLang')}</label>
                <select
                  className="adm-select"
                  style={{ width: '100%' }}
                  value={form.visitorLanguage ?? 'en'}
                  onChange={(e) => set('visitorLanguage', e.target.value)}
                >
                  {TRANSLATE_LANGS.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
                <span className="adm-muted" style={{ fontSize: 11, display: 'block', marginTop: 3 }}>
                  {t('admin.visitorUiLangHint')}
                </span>
              </div>
              <div>
                <label className="adm-label">{t('admin.operatorUiLang')}</label>
                <select
                  className="adm-select"
                  style={{ width: '100%' }}
                  value={form.adminLanguage ?? 'en'}
                  onChange={(e) => {
                    set('adminLanguage', e.target.value)
                    // Apply to the operator surfaces immediately (persisted on Save).
                    void i18n.changeLanguage(e.target.value)
                  }}
                >
                  {TRANSLATE_LANGS.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
                <span className="adm-muted" style={{ fontSize: 11, display: 'block', marginTop: 3 }}>
                  {t('admin.operatorUiLangHint')}
                </span>
              </div>
            </div>
          </div>

          <div className="adm-card">
            <h2 className="adm-card-title">{t('admin.behavior')}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {(
                [
                  ['isOfflineMode', 'admin.offlineMode'],
                  ['enableReadReceipts', 'admin.enableReadReceipts'],
                  ['showVisitorWidget', 'admin.showVisitorWidget'],
                  ['showAdminWidget', 'admin.showAdminWidget'],
                  ['isActive', 'admin.activeConfig'],
                ] as [keyof SiteConfig, string][]
              ).map(([key, labelKey]) => (
                <label key={key} className="adm-row" style={{ cursor: 'pointer', gap: 10 }}>
                  <input
                    type="checkbox"
                    checked={!!form[key]}
                    onChange={(e) => set(key, e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: 'var(--adm-accent)' }}
                  />
                  <span style={{ fontSize: 13 }}>{t(labelKey)}</span>
                </label>
              ))}
            </div>
          </div>

          {isDeveloper && (
            <div className="adm-card">
              <h2 className="adm-card-title">{t('admin.securityDev')}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label className="adm-label">{t('admin.allowedOrigins')}</label>
                  <textarea
                    className="adm-textarea adm-mono"
                    style={{ width: '100%', minHeight: 70 }}
                    value={form.allowedOrigins ?? ''}
                    onChange={(e) => set('allowedOrigins', e.target.value)}
                    placeholder="https://yoursite.com, http://localhost:3000"
                  />
                </div>
                <div>
                  <label className="adm-label">{t('admin.adminIpAllowlist')}</label>
                  <textarea
                    className="adm-textarea adm-mono"
                    style={{ width: '100%', minHeight: 70 }}
                    value={form.adminAllowedIps ?? ''}
                    onChange={(e) => set('adminAllowedIps', e.target.value)}
                    placeholder="203.0.113.1, 203.0.113.2"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
