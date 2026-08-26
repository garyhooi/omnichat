import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Bot, Cpu, Pencil, Plug, Plus, Save, TestTube2, Trash2 } from 'lucide-react'
import { useAuth } from '../auth'
import { authFetch, authFetchJson } from '../../shared/lib/api-client'
import type {
  AiAgentConfig,
  AiProvider,
  AiProviderType,
  BudgetCheckResult,
  BudgetPeriodStatus,
  ToolAuthType,
  ToolRegistration,
} from '../../shared/types/api'

const aiKey = (serverUrl: string, kind: string) => ['ai-config', serverUrl, kind] as const

const PROVIDER_TYPES: AiProviderType[] = [
  'openai',
  'anthropic',
  'openrouter',
  'ollama',
  'deepseek',
  'gemini',
  'grok',
]

// Token spend budgets — the same six periods on providers and the global agent config.
const BUDGET_FIELDS = [
  'maxTokensPerDay',
  'maxTokensPerWeek',
  'maxTokensPerMonth',
  'maxTokensPerQuarter',
  'maxTokensPerHalfYear',
  'maxTokensPerYear',
] as const
type BudgetField = (typeof BUDGET_FIELDS)[number]

const BUDGET_FIELD_LABELS: Record<BudgetField, string> = {
  maxTokensPerDay: 'budgetPerDay',
  maxTokensPerWeek: 'budgetPerWeek',
  maxTokensPerMonth: 'budgetPerMonth',
  maxTokensPerQuarter: 'budgetPerQuarter',
  maxTokensPerHalfYear: 'budgetPerHalfYear',
  maxTokensPerYear: 'budgetPerYear',
}

// Short descriptions shown under each budget input. All windows are
// calendar-anchored and evaluated in UTC — never rolling "last N days".
const BUDGET_FIELD_DESCRIPTIONS: Record<BudgetField, string> = {
  maxTokensPerDay: 'budgetDescDay',
  maxTokensPerWeek: 'budgetDescWeek',
  maxTokensPerMonth: 'budgetDescMonth',
  maxTokensPerQuarter: 'budgetDescQuarter',
  maxTokensPerHalfYear: 'budgetDescHalfYear',
  maxTokensPerYear: 'budgetDescYear',
}

const BUDGET_FIELD_SHORT: Record<BudgetField, string> = {
  maxTokensPerDay: 'D',
  maxTokensPerWeek: 'W',
  maxTokensPerMonth: 'M',
  maxTokensPerQuarter: 'Q',
  maxTokensPerHalfYear: 'H',
  maxTokensPerYear: 'Y',
}

const formatTokens = (n: number) => n.toLocaleString()
const formatTokensCompact = (n: number) =>
  n >= 1_000_000 ? `${+(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${+(n / 1_000).toFixed(1)}k` : String(n)

/** AI Setup — providers, agent behaviour, and tool registrations. */
export function AiSetupPage() {
  const { t } = useTranslation()
  const { serverUrl } = useAuth()
  const queryClient = useQueryClient()
  const [tab, setTab] = useState<'providers' | 'agent' | 'tools'>('providers')
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    if (!notice) return
    const timer = setTimeout(() => setNotice(null), 4000)
    return () => clearTimeout(timer)
  }, [notice])

  const invalidate = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['ai-config', serverUrl] })
  }, [queryClient, serverUrl])

  // Token spend budget status — refreshes every 30s so the warning stays live.
  const { data: budget } = useQuery<BudgetCheckResult>({
    queryKey: aiKey(serverUrl, 'budget-status'),
    queryFn: () => authFetchJson<BudgetCheckResult>(`${serverUrl}/ai/config/budget-status`),
    refetchInterval: 30_000,
  })

  // Rows where usage reached >= 80% of a configured limit, worst first.
  const budgetWarnings = useMemo(() => {
    if (!budget) return []
    const rows: {
      scope: string
      label: string
      pct: number
      used: number
      limit: number
      exceeded: boolean
    }[] = []
    const collect = (scope: string, periods: BudgetPeriodStatus[]) => {
      for (const p of periods) {
        if (p.limit == null || p.limit <= 0) continue
        const pct = Math.round((p.used / p.limit) * 100)
        if (pct >= 80) rows.push({ scope, label: p.period, pct, used: p.used, limit: p.limit, exceeded: p.exceeded })
      }
    }
    collect(t('admin.budgetGlobal'), budget.global)
    if (budget.provider) collect(t('admin.budgetProvider', { name: budget.provider.name }), budget.provider.periods)
    return rows.sort((a, b) => b.pct - a.pct)
  }, [budget, t])

  return (
    <div>
      <div className="adm-page-head">
        <div>
          <h1 className="adm-page-title">{t('admin.aiSetup')}</h1>
          <p className="adm-page-sub">{t('admin.aiSetupSub')}</p>
        </div>
      </div>

      {notice && (
        <div className="adm-card" style={{ borderColor: '#a7f3d0', background: '#ecfdf5', marginBottom: 14 }}>
          <span style={{ color: '#065f46', fontSize: 13 }}>{notice}</span>
        </div>
      )}

      {budgetWarnings.length > 0 && (
        <div
          className="adm-card"
          style={{
            borderColor: '#fbbf24',
            background: '#fffbeb',
            marginBottom: 14,
            padding: '10px 14px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {budgetWarnings.map((w) => (
              <div
                key={`${w.scope}-${w.label}`}
                style={{ color: w.exceeded ? '#991b1b' : '#92400e', fontSize: 13, display: 'flex', gap: 8, alignItems: 'center' }}
              >
                <span style={{ fontSize: 15 }}>{w.exceeded ? '⛔' : '⚠️'}</span>
                <span>
                  <strong>{w.scope}</strong> · {w.label} {w.exceeded ? t('admin.budgetExceeded') : t('admin.budgetAt', { pct: w.pct })} (
                  {formatTokens(w.used)} / {formatTokens(w.limit)} {t('admin.budgetTokens')})
                  {w.exceeded ? t('admin.budgetPaused') : t('admin.budgetApproaching')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="adm-tabs">
        <button type="button" className={`adm-tab ${tab === 'providers' ? 'active' : ''}`} onClick={() => setTab('providers')}>
          <Plug size={14} /> {t('admin.providers')}
        </button>
        <button type="button" className={`adm-tab ${tab === 'agent' ? 'active' : ''}`} onClick={() => setTab('agent')}>
          <Bot size={14} /> {t('admin.agentTab')}
        </button>
        <button type="button" className={`adm-tab ${tab === 'tools' ? 'active' : ''}`} onClick={() => setTab('tools')}>
          <Cpu size={14} /> {t('admin.toolsTab')}
        </button>
      </div>

      {tab === 'providers' && (
        <ProvidersTab serverUrl={serverUrl} invalidate={invalidate} notify={setNotice} />
      )}
      {tab === 'agent' && <AgentTab serverUrl={serverUrl} invalidate={invalidate} notify={setNotice} />}
      {tab === 'tools' && <ToolsTab serverUrl={serverUrl} invalidate={invalidate} notify={setNotice} />}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Providers
// ---------------------------------------------------------------------------
function ProvidersTab({
  serverUrl,
  invalidate,
  notify,
}: {
  serverUrl: string
  invalidate: () => void
  notify: (m: string) => void
}) {
  const { t } = useTranslation()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    providerType: 'openai' as AiProviderType,
    apiKey: '',
    baseUrl: '',
    chatModelId: '',
    embeddingModelId: '',
    inputPricePerM: '',
    outputPricePerM: '',
    maxTokensPerDay: '',
    maxTokensPerWeek: '',
    maxTokensPerMonth: '',
    maxTokensPerQuarter: '',
    maxTokensPerHalfYear: '',
    maxTokensPerYear: '',
  })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: providers, isLoading } = useQuery<AiProvider[]>({
    queryKey: aiKey(serverUrl, 'providers'),
    queryFn: () => authFetchJson<AiProvider[]>(`${serverUrl}/ai/config/providers`),
  })

  const resetForm = () => {
    setEditingId(null)
    setForm({
      name: '',
      providerType: 'openai',
      apiKey: '',
      baseUrl: '',
      chatModelId: '',
      embeddingModelId: '',
      inputPricePerM: '',
      outputPricePerM: '',
      maxTokensPerDay: '',
      maxTokensPerWeek: '',
      maxTokensPerMonth: '',
      maxTokensPerQuarter: '',
      maxTokensPerHalfYear: '',
      maxTokensPerYear: '',
    })
  }

  const save = useCallback(async () => {
    setBusy(true)
    setError(null)
    try {
      const body: Record<string, unknown> = { ...form }
      // Never send the masked placeholder back — the server would store it.
      // Backend masks keys as "••••••••" (bullet U+2022), so check for both * and •.
      if (editingId && (!body.apiKey || String(body.apiKey).includes('*') || String(body.apiKey).includes('\u2022'))) delete body.apiKey
      // Price inputs are strings in the form — send numbers.
      body.inputPricePerM = form.inputPricePerM === '' ? 0 : Number(form.inputPricePerM)
      body.outputPricePerM = form.outputPricePerM === '' ? 0 : Number(form.outputPricePerM)
      // Budget inputs are strings — empty string means unlimited (null).
      for (const key of BUDGET_FIELDS) {
        const v = form[key]
        body[key] = v === '' || v == null ? null : Number(v)
      }
      if (editingId) {
        await authFetchJson(`${serverUrl}/ai/config/providers/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        notify(t('admin.providerUpdated'))
      } else {
        await authFetchJson(`${serverUrl}/ai/config/providers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        notify(t('admin.providerAdded'))
      }
      setShowForm(false)
      resetForm()
      invalidate()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save provider')
    } finally {
      setBusy(false)
    }
  }, [editingId, form, invalidate, notify, serverUrl, t])

  const patch = useCallback(
    async (id: string, body: Record<string, unknown>) => {
      await authFetchJson(`${serverUrl}/ai/config/providers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      invalidate()
    },
    [invalidate, serverUrl],
  )

  const test = useCallback(
    async (id: string) => {
      const res = await authFetch(`${serverUrl}/ai/config/providers/${id}/test`, { method: 'POST' })
      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean
        error?: string
      }
      if (data.success) notify(t('admin.connectOk'))
      else notify(t('admin.connectFailed', { error: data.error ?? res.status }))
    },
    [notify, serverUrl, t],
  )

  const remove = useCallback(
    async (id: string) => {
      if (!confirm(t('admin.deleteProviderConfirm'))) return
      await authFetchJson(`${serverUrl}/ai/config/providers/${id}`, { method: 'DELETE' })
      invalidate()
      notify(t('admin.providerDeleted'))
    },
    [invalidate, notify, serverUrl, t],
  )

  if (isLoading) {
    return (
      <div className="adm-center">
        <span className="adm-spinner" />
      </div>
    )
  }

  return (
    <div>
      <div className="adm-flex-between" style={{ marginBottom: 12 }}>
        <span className="adm-muted" style={{ fontSize: 13 }}>
          {t('admin.providerCount', { count: providers?.length ?? 0, suffix: (providers?.length ?? 0) === 1 ? '' : 's' })}
        </span>
        <button
          type="button"
          className="adm-btn adm-btn-primary adm-btn-sm"
          onClick={() => {
            resetForm()
            setShowForm((v) => !v)
          }}
        >
          <Plus size={14} /> {t('admin.addProvider')}
        </button>
      </div>

      {showForm && (
        <div className="adm-card" style={{ marginBottom: 14 }}>
          <h2 className="adm-card-title">{editingId ? t('admin.editProvider') : t('admin.addProvider')}</h2>
          <div className="adm-grid adm-grid-4">
            <div>
              <label className="adm-label">{t('admin.name')}</label>
              <input className="adm-input" style={{ width: '100%' }} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder={t('admin.providerNamePlaceholder')} />
            </div>
            <div>
              <label className="adm-label">{t('admin.providerType')}</label>
              <select className="adm-select" style={{ width: '100%' }} value={form.providerType} onChange={(e) => setForm((f) => ({ ...f, providerType: e.target.value as AiProviderType }))}>
                {PROVIDER_TYPES.map((pt) => (
                  <option key={pt} value={pt}>{pt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="adm-label">{t('admin.translationModel')}</label>
              <input className="adm-input" style={{ width: '100%' }} value={form.chatModelId} onChange={(e) => setForm((f) => ({ ...f, chatModelId: e.target.value }))} placeholder="deepseek-chat" />
            </div>
            <div>
              <label className="adm-label">{t('admin.embeddingModel')}</label>
              <input className="adm-input" style={{ width: '100%' }} value={form.embeddingModelId} onChange={(e) => setForm((f) => ({ ...f, embeddingModelId: e.target.value }))} placeholder="text-embedding-3-small" />
            </div>
            <div>
              <label className="adm-label">{t('admin.apiKey')}</label>
              {form.providerType === 'ollama' ? (
                <input className="adm-input" style={{ width: '100%' }} disabled placeholder={t('admin.notNeededOllama')} />
              ) : (
                <input className="adm-input" style={{ width: '100%' }} type="password" value={form.apiKey} onChange={(e) => setForm((f) => ({ ...f, apiKey: e.target.value }))} placeholder={editingId ? t('admin.leaveBlankKeep') : ''} />
              )}
            </div>
            <div>
              <label className="adm-label">{t('admin.baseUrl')}</label>
              <input className="adm-input" style={{ width: '100%' }} value={form.baseUrl} onChange={(e) => setForm((f) => ({ ...f, baseUrl: e.target.value }))} placeholder="https://api.openai.com/v1" />
            </div>
            <div>
              <label className="adm-label">{t('admin.inputPrice')}</label>
              <input
                className="adm-input adm-mono"
                style={{ width: '100%' }}
                type="number"
                min={0}
                step="0.01"
                value={form.inputPricePerM}
                onChange={(e) => setForm((f) => ({ ...f, inputPricePerM: e.target.value }))}
                placeholder="0.25"
              />
            </div>
            <div>
              <label className="adm-label">{t('admin.outputPrice')}</label>
              <input
                className="adm-input adm-mono"
                style={{ width: '100%' }}
                type="number"
                min={0}
                step="0.01"
                value={form.outputPricePerM}
                onChange={(e) => setForm((f) => ({ ...f, outputPricePerM: e.target.value }))}
                placeholder="0.75"
              />
            </div>
            {BUDGET_FIELDS.map((key) => (
              <div key={key}>
                <label className="adm-label">{t('admin.budgetLabel', { period: t('admin.' + BUDGET_FIELD_LABELS[key]) })}</label>
                <input
                  className="adm-input adm-mono"
                  style={{ width: '100%' }}
                  type="number"
                  min={0}
                  step={1000}
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  placeholder={t('admin.unlimited')}
                />
                <p className="adm-muted" style={{ fontSize: 11, margin: '2px 0 0' }}>
                  {t('admin.' + BUDGET_FIELD_DESCRIPTIONS[key])}
                </p>
              </div>
            ))}
          </div>
          {error && <p className="adm-login-error">{error}</p>}
          <div className="adm-row" style={{ marginTop: 12 }}>
            <button type="button" className="adm-btn adm-btn-primary" onClick={() => void save()} disabled={busy || !form.name || !form.chatModelId}>
              {editingId ? t('admin.saveChanges') : t('admin.saveProvider')}
            </button>
            <button
              type="button"
              className="adm-btn"
              onClick={() => {
                resetForm()
                setShowForm(false)
              }}
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>{t('admin.name')}</th>
              <th>{t('admin.type')}</th>
              <th>{t('admin.translationModel')}</th>
              <th>{t('admin.embedding')}</th>
              <th>{t('admin.pricePerM')}</th>
              <th>{t('admin.budget')}</th>
              <th>{t('admin.apiKey')}</th>
              <th>{t('admin.status')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(providers ?? []).map((p) => (
              <tr key={p.id}>
                <td><strong>{p.name}</strong></td>
                <td><span className="adm-badge adm-badge-neutral">{p.providerType}</span></td>
                <td className="adm-mono">{p.chatModelId}</td>
                <td className="adm-mono">{p.embeddingModelId ?? '—'}</td>
                <td className="adm-mono">
                  {(p.inputPricePerM ?? 0) > 0 || (p.outputPricePerM ?? 0) > 0
                    ? `$${p.inputPricePerM ?? 0} / $${p.outputPricePerM ?? 0}`
                    : '—'}
                </td>
                <td className="adm-mono" style={{ fontSize: 12 }}>
                  {BUDGET_FIELDS.filter((k) => (p[k] ?? 0) > 0).length > 0
                    ? BUDGET_FIELDS.filter((k) => (p[k] ?? 0) > 0)
                        .map((k) => `${BUDGET_FIELD_SHORT[k]} ${formatTokensCompact(p[k] as number)}`)
                        .join(' · ')
                    : '—'}
                </td>
                <td className="adm-mono">{p.apiKey ? (p.apiKey.includes('*') ? p.apiKey : '••••••••') : '—'}</td>
                <td>
                  <button
                    type="button"
                    className={`adm-badge ${p.isActive ? 'adm-badge-success' : 'adm-badge-neutral'}`}
                    style={{ border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
                    onClick={() => void patch(p.id, { isActive: !p.isActive })}
                    title={t('admin.toggleActive')}
                  >
                    {p.isActive ? t('admin.active') : t('admin.inactive')}
                  </button>
                </td>
                <td>
                  <div className="adm-row" style={{ gap: 4, flexWrap: 'wrap' }}>
                    <button className="adm-btn adm-btn-sm" title={t('admin.testConnection')} onClick={() => void test(p.id)}>
                      <TestTube2 size={14} /> {t('admin.test')}
                    </button>
                    <button
                      className="adm-btn adm-btn-sm"
                      title={t('common.edit')}
                      onClick={() => {
                        setEditingId(p.id)
                        setForm({
                          name: p.name,
                          providerType: p.providerType,
                          apiKey: p.apiKey ?? '',
                          baseUrl: p.baseUrl ?? '',
                          chatModelId: p.chatModelId,
                          embeddingModelId: p.embeddingModelId ?? '',
                          inputPricePerM: p.inputPricePerM != null ? String(p.inputPricePerM) : '',
                          outputPricePerM: p.outputPricePerM != null ? String(p.outputPricePerM) : '',
                          maxTokensPerDay: p.maxTokensPerDay != null ? String(p.maxTokensPerDay) : '',
                          maxTokensPerWeek: p.maxTokensPerWeek != null ? String(p.maxTokensPerWeek) : '',
                          maxTokensPerMonth: p.maxTokensPerMonth != null ? String(p.maxTokensPerMonth) : '',
                          maxTokensPerQuarter: p.maxTokensPerQuarter != null ? String(p.maxTokensPerQuarter) : '',
                          maxTokensPerHalfYear: p.maxTokensPerHalfYear != null ? String(p.maxTokensPerHalfYear) : '',
                          maxTokensPerYear: p.maxTokensPerYear != null ? String(p.maxTokensPerYear) : '',
                        })
                        setError(null)
                        setShowForm(true)
                      }}
                    >
                      <Pencil size={14} /> {t('common.edit')}
                    </button>
                    <button className="adm-btn adm-btn-sm" title={t('common.delete')} onClick={() => void remove(p.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {(providers ?? []).length === 0 && (
              <tr>
                <td colSpan={9}>
                  <div className="adm-empty">{t('admin.noProviders')}</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Agent config
// ---------------------------------------------------------------------------
function AgentTab({
  serverUrl,
  invalidate,
  notify,
}: {
  serverUrl: string
  invalidate: () => void
  notify: (m: string) => void
}) {
  const { t } = useTranslation()
  const { data: config, isLoading } = useQuery<AiAgentConfig | null>({
    queryKey: aiKey(serverUrl, 'agent'),
    queryFn: () => authFetchJson<AiAgentConfig | null>(`${serverUrl}/ai/config/agent`),
  })
  const { data: providers } = useQuery<AiProvider[]>({
    queryKey: aiKey(serverUrl, 'providers'),
    queryFn: () => authFetchJson<AiProvider[]>(`${serverUrl}/ai/config/providers`),
  })

  const [form, setForm] = useState<Partial<AiAgentConfig> | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (config && !form) setForm(config)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config])

  if (isLoading || !form) {
    return (
      <div className="adm-center">
        <span className="adm-spinner" />
      </div>
    )
  }

  const set = (key: keyof AiAgentConfig, value: unknown) => setForm((f) => (f ? { ...f, [key]: value } : f))
  const num = (key: keyof AiAgentConfig) => (v: string) => set(key, Number(v))

  const save = async () => {
    setSaving(true)
    try {
      // Strip server-owned fields — UpsertAgentConfigDto rejects unknown props.
      const { id: _id, createdAt: _ca, updatedAt: _ua, ...payload } = form as AiAgentConfig
      await authFetchJson(`${serverUrl}/ai/config/agent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      invalidate()
      notify(t('admin.agentConfigSaved'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="adm-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <div className="adm-card">
          <h2 className="adm-card-title">{t('admin.behaviour')}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label className="adm-row" style={{ cursor: 'pointer', gap: 10 }}>
              <input type="checkbox" checked={!!form.enabled} onChange={(e) => set('enabled', e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--adm-accent)' }} />
              <span style={{ fontSize: 13 }}>{t('admin.aiEnabled')}</span>
            </label>
            <div>
              <label className="adm-label">{t('admin.systemPrompt')}</label>
              <textarea className="adm-textarea" style={{ width: '100%', minHeight: 120 }} value={form.systemPrompt ?? ''} onChange={(e) => set('systemPrompt', e.target.value)} />
            </div>
            <div>
              <label className="adm-label">{t('admin.greetingAi')}</label>
              <textarea className="adm-textarea" style={{ width: '100%', minHeight: 56 }} value={form.greetingMessage ?? ''} onChange={(e) => set('greetingMessage', e.target.value)} />
            </div>
            <div>
              <label className="adm-label">{t('admin.humanKeywords')}</label>
              <textarea
                className="adm-textarea"
                style={{ width: '100%', minHeight: 88 }}
                value={form.humanRequestKeywords ?? ''}
                onChange={(e) => set('humanRequestKeywords', e.target.value)}
                placeholder={t('admin.humanKeywordsPlaceholder')}
              />
            </div>
          </div>
        </div>

        <div className="adm-card">
          <h2 className="adm-card-title">{t('admin.limitsThresholds')}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(
              [
                ['maxTokensPerResponse', 'admin.maxTokensPerResponse'],
                ['temperature', 'admin.temperature'],
                ['maxTurnsPerConversation', 'admin.maxTurnsPerConversation'],
                ['maxTokensPerSession', 'admin.maxTokensPerSession'],
                ['ragFailureThreshold', 'admin.ragFailureThreshold'],
                ['humanRequestThreshold', 'admin.humanRequestThreshold'],
                ['aiRateLimitPerMinute', 'admin.aiRateLimitPerMinute'],
                ['spamIpBlacklistMinutes', 'admin.spamIpBlacklistMinutes'],
              ] as [keyof AiAgentConfig, string][]
            ).map(([key, labelKey]) => (
              <div key={key}>
                <label className="adm-label">{t(labelKey)}</label>
                <input
                  className="adm-input adm-mono"
                  style={{ width: '100%' }}
                  type="number"
                  step={key === 'temperature' ? 0.1 : 1}
                  value={form[key] as number}
                  onChange={(e) => num(key)(e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="adm-card">
          <h2 className="adm-card-title">{t('admin.tokenBudget')}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p className="adm-muted" style={{ fontSize: 12, margin: 0 }}>
              {t('admin.budgetGlobalHelp')}
            </p>
            {BUDGET_FIELDS.map((key) => (
              <div key={key}>
                <label className="adm-label">{t('admin.' + BUDGET_FIELD_LABELS[key])} (tokens)</label>
                <input
                  className="adm-input adm-mono"
                  style={{ width: '100%' }}
                  type="number"
                  min={0}
                  step={1000}
                  value={form[key] ?? ''}
                  onChange={(e) => set(key, e.target.value === '' ? null : Number(e.target.value))}
                  placeholder={t('admin.unlimited')}
                />
                <p className="adm-muted" style={{ fontSize: 11, margin: '2px 0 0' }}>
                  {t('admin.' + BUDGET_FIELD_DESCRIPTIONS[key])}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="adm-card">
          <h2 className="adm-card-title">{t('admin.integrations')}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label className="adm-label">{t('admin.embeddingProvider')}</label>
              <select className="adm-select" style={{ width: '100%' }} value={form.embeddingProviderId ?? ''} onChange={(e) => set('embeddingProviderId', e.target.value || null)}>
                <option value="">{t('admin.none')}</option>
                {(providers ?? []).map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.providerType})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="adm-label">{t('admin.translationProvider')}</label>
              <select className="adm-select" style={{ width: '100%' }} value={form.translateProviderId ?? ''} onChange={(e) => set('translateProviderId', e.target.value || null)}>
                <option value="">{t('admin.none')}</option>
                {(providers ?? []).map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.providerType})</option>
                ))}
              </select>
            </div>
            <label className="adm-row" style={{ cursor: 'pointer', gap: 10 }}>
              <input type="checkbox" checked={!!form.translationEnabled} onChange={(e) => set('translationEnabled', e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--adm-accent)' }} />
              <span style={{ fontSize: 13 }}>{t('admin.translationEnabled')}</span>
            </label>
            <label className="adm-row" style={{ cursor: 'pointer', gap: 10 }}>
              <input type="checkbox" checked={!!form.autoTranslationEnabled} onChange={(e) => set('autoTranslationEnabled', e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--adm-accent)' }} />
              <span style={{ fontSize: 13 }}>{t('admin.autoTranslateIncoming')}</span>
            </label>
          </div>
        </div>

        <div className="adm-card">
          <h2 className="adm-card-title">{t('admin.failoverProviders')}</h2>
          <p className="adm-muted" style={{ fontSize: 12, margin: '-4px 0 10px' }}>
            {t('admin.failoverHelp')}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label className="adm-label">{t('admin.chatFailover')}</label>
              <select className="adm-select" style={{ width: '100%' }} value={form.chatFailoverProviderId ?? ''} onChange={(e) => set('chatFailoverProviderId', e.target.value || null)}>
                <option value="">{t('admin.none')}</option>
                {(providers ?? [])
                  // The active provider already serves chat — offer everyone else,
                  // but keep a stale selection visible instead of silently hiding it.
                  .filter((p) => !p.isActive || p.id === (form.chatFailoverProviderId ?? ''))
                  .map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.providerType})</option>
                  ))}
              </select>
              <p className="adm-muted" style={{ fontSize: 11, margin: '2px 0 0' }}>
                {t('admin.chatFailoverDesc')}
              </p>
            </div>
            <div>
              <label className="adm-label">{t('admin.embeddingFailover')}</label>
              <select className="adm-select" style={{ width: '100%' }} value={form.embeddingFailoverProviderId ?? ''} onChange={(e) => set('embeddingFailoverProviderId', e.target.value || null)}>
                <option value="">{t('admin.none')}</option>
                {(providers ?? []).map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.providerType})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="adm-label">{t('admin.translateFailover')}</label>
              <select className="adm-select" style={{ width: '100%' }} value={form.translateFailoverProviderId ?? ''} onChange={(e) => set('translateFailoverProviderId', e.target.value || null)}>
                <option value="">{t('admin.none')}</option>
                {(providers ?? []).map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.providerType})</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Save bar — sticky at the bottom of the scroll area so it never reads
          as a banner inside a card. */}
      <div
        style={{
          position: 'sticky',
          bottom: 0,
          zIndex: 30,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 8,
          marginTop: 16,
          padding: '12px 16px',
          background: 'var(--adm-surface)',
          border: '1px solid var(--adm-border)',
          borderRadius: 12,
          boxShadow: '0 -6px 20px rgb(0 0 0 / 0.08)',
        }}
      >
        <button type="button" className="adm-btn adm-btn-primary" onClick={() => void save()} disabled={saving}>
          <Save size={15} /> {saving ? t('admin.saving') : t('admin.saveAgentConfig')}
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tools
// ---------------------------------------------------------------------------
// Sample JSON payloads prefilled in the register form (legacy parity).
const SAMPLE_PARAMS = `{
  "orderId": { "type": "string", "description": "The order ID" }
}`
const SAMPLE_AUTH_TOKEN_EXCHANGE = `{
  "tokenUrl": "https://your-api.com/auth/token"
}`
const SAMPLE_AUTH_STATIC = `{
  "token": "my-token"
}`

// Built-in tools are registered server-side and always available to the AI;
// the register form in this tab is only for EXTERNAL tools. Mirrors the legacy
// Vue ToolsPage, which displayed these as a read-only "Active" list.
const BUILTIN_TOOLS: { name: string; descKey: string }[] = [
  { name: 'search_knowledge_base', descKey: 'admin.builtinSearchDesc' },
  { name: 'transfer_to_human', descKey: 'admin.builtinTransferDesc' },
  { name: 'check_human_availability', descKey: 'admin.builtinAvailabilityDesc' },
  { name: 'ip_spam_blacklist', descKey: 'admin.builtinSpamDesc' },
  { name: 'get_current_time', descKey: 'admin.builtinTimeDesc' },
  { name: 'get_visitor_info', descKey: 'admin.builtinVisitorDesc' },
]

function ToolsTab({
  serverUrl,
  invalidate,
  notify,
}: {
  serverUrl: string
  invalidate: () => void
  notify: (m: string) => void
}) {
  const { t } = useTranslation()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    description: '',
    parametersSchema: SAMPLE_PARAMS,
    handlerType: 'external', // register form is for external tools only (builtins are non-editable)
    endpoint: '',
    authType: 'token-exchange' as ToolAuthType,
    authConfig: SAMPLE_AUTH_TOKEN_EXCHANGE,
    isActive: true,
  })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: tools, isLoading } = useQuery<ToolRegistration[]>({
    queryKey: aiKey(serverUrl, 'tools'),
    queryFn: () => authFetchJson<ToolRegistration[]>(`${serverUrl}/ai/config/tools`),
  })

  const toJsonText = (v: unknown): string => {
    if (v == null || v === '') return ''
    return typeof v === 'string' ? v : JSON.stringify(v, null, 2)
  }

  const resetForm = () => {
    setEditingId(null)
    setForm({
      name: '',
      description: '',
      parametersSchema: SAMPLE_PARAMS,
      handlerType: 'external', // register form is for external tools only
      endpoint: '',
      authType: 'token-exchange',
      authConfig: SAMPLE_AUTH_TOKEN_EXCHANGE,
      isActive: true,
    })
  }

  const save = async () => {
    setBusy(true)
    setError(null)
    try {
      const parametersSchema = JSON.parse(form.parametersSchema || '{}')
      const authConfig = form.authConfig ? JSON.parse(form.authConfig) : undefined
      const body = { ...form, parametersSchema, authConfig }
      if (editingId) {
        await authFetchJson(`${serverUrl}/ai/config/tools/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        notify(t('admin.toolUpdated'))
      } else {
        await authFetchJson(`${serverUrl}/ai/config/tools`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        notify(t('admin.toolRegistered'))
      }
      setShowForm(false)
      resetForm()
      invalidate()
    } catch (e) {
      setError(e instanceof SyntaxError ? t('admin.invalidJson') : e instanceof Error ? e.message : 'Failed to save tool')
    } finally {
      setBusy(false)
    }
  }

  const toggle = async (id: string, isActive: boolean) => {
    await authFetchJson(`${serverUrl}/ai/config/tools/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive }),
    })
    invalidate()
  }

  const remove = async (id: string) => {
    if (!confirm(t('admin.deleteToolConfirm'))) return
    await authFetchJson(`${serverUrl}/ai/config/tools/${id}`, { method: 'DELETE' })
    invalidate()
    notify(t('admin.toolDeleted'))
  }

  if (isLoading) {
    return (
      <div className="adm-center">
        <span className="adm-spinner" />
      </div>
    )
  }

  return (
    <div>
      <div className="adm-flex-between" style={{ marginBottom: 12 }}>
        <span className="adm-muted" style={{ fontSize: 13 }}>
          {t('admin.toolCount', { count: tools?.length ?? 0, suffix: (tools?.length ?? 0) === 1 ? '' : 's' })}
        </span>
        <button
          type="button"
          className="adm-btn adm-btn-primary adm-btn-sm"
          onClick={() => {
            resetForm()
            setShowForm((v) => !v)
          }}
        >
          <Plus size={14} /> {t('admin.registerTool')}
        </button>
      </div>

      <div className="adm-card" style={{ marginBottom: 14 }}>
        <h2 className="adm-card-title">{t('admin.builtinTools')}</h2>
        <p className="adm-muted" style={{ fontSize: 12, marginTop: -4, marginBottom: 10 }}>
          {t('admin.builtinToolsHelp')}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {BUILTIN_TOOLS.map((tool) => (
            <div key={tool.name} className="adm-row" style={{ gap: 10, padding: '8px 10px', border: '1px solid var(--adm-border, #eef0f4)', borderRadius: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="adm-row" style={{ gap: 8 }}>
                  <code className="adm-mono">{tool.name}</code>
                  <span className="adm-badge adm-badge-neutral">{t('admin.builtin')}</span>
                </div>
                <div className="adm-muted" style={{ fontSize: 12, marginTop: 2 }}>{t(tool.descKey)}</div>
              </div>
              <span className="adm-badge adm-badge-success" style={{ flex: 'none' }}>{t('admin.active')}</span>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="adm-card" style={{ marginBottom: 14 }}>
          <h2 className="adm-card-title">{editingId ? t('admin.editTool') : t('admin.registerTool')}</h2>
          <div className="adm-grid adm-grid-4">
            <div>
              <label className="adm-label">{t('admin.name')}</label>
              <input className="adm-input" style={{ width: '100%' }} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="get_weather" />
            </div>
            <div>
              <label className="adm-label">{t('admin.authType')}</label>
              <select className="adm-select" style={{ width: '100%' }} value={form.authType} onChange={(e) => setForm((f) => ({ ...f, authType: e.target.value as ToolAuthType }))}>
                <option value="none">none</option>
                <option value="static">static</option>
                <option value="token-exchange">token-exchange</option>
              </select>
            </div>
            <div>
              <label className="adm-label">{t('admin.endpoint')}</label>
              <input className="adm-input" style={{ width: '100%' }} value={form.endpoint} onChange={(e) => setForm((f) => ({ ...f, endpoint: e.target.value }))} placeholder="https://api.example.com/weather" />
            </div>
            <div>
              <label className="adm-label">{t('admin.description')}</label>
              <input className="adm-input" style={{ width: '100%' }} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
            <div>
              <label className="adm-label">{t('admin.parametersSchema')}</label>
              <textarea className="adm-textarea adm-mono" style={{ width: '100%', minHeight: 60 }} value={form.parametersSchema} onChange={(e) => setForm((f) => ({ ...f, parametersSchema: e.target.value }))} />
            </div>
            {form.authType !== 'none' && (
              <div>
                <label className="adm-label">
                  {form.authType === 'static' ? t('admin.authConfigStatic') : t('admin.authConfigToken')}
                </label>
                <textarea
                  className="adm-textarea adm-mono"
                  style={{ width: '100%', minHeight: 60 }}
                  value={form.authConfig}
                  onChange={(e) => setForm((f) => ({ ...f, authConfig: e.target.value }))}
                  placeholder={form.authType === 'static' ? SAMPLE_AUTH_STATIC : SAMPLE_AUTH_TOKEN_EXCHANGE}
                />
              </div>
            )}
            <label className="adm-row" style={{ cursor: 'pointer', gap: 10, alignItems: 'flex-end', paddingBottom: 10 }}>
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} style={{ width: 16, height: 16, accentColor: 'var(--adm-accent)' }} />
              <span style={{ fontSize: 13 }}>{t('admin.active')}</span>
            </label>
          </div>
          {error && <p className="adm-login-error">{error}</p>}
          <div className="adm-row" style={{ marginTop: 10 }}>
            <button type="button" className="adm-btn adm-btn-primary" onClick={() => void save()} disabled={busy || !form.name}>
              {editingId ? t('admin.saveChanges') : t('admin.saveTool')}
            </button>
            <button
              type="button"
              className="adm-btn"
              onClick={() => {
                resetForm()
                setShowForm(false)
              }}
            >
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>{t('admin.name')}</th>
              <th>{t('admin.type')}</th>
              <th>{t('admin.description')}</th>
              <th>{t('admin.status')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(tools ?? []).map((tl) => (
              <tr key={tl.id}>
                <td className="adm-mono"><strong>{tl.name}</strong></td>
                <td><span className="adm-badge adm-badge-neutral">{t('admin.external')}</span></td>
                <td className="adm-muted" style={{ maxWidth: 360 }}>{tl.description}</td>
                <td>
                  <button
                    type="button"
                    className={`adm-badge ${tl.isActive ? 'adm-badge-success' : 'adm-badge-neutral'}`}
                    style={{ border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
                    onClick={() => void toggle(tl.id, !tl.isActive)}
                  >
                    {tl.isActive ? t('admin.active') : t('admin.inactive')}
                  </button>
                </td>
                <td>
                  <div className="adm-row" style={{ gap: 4, flexWrap: 'wrap' }}>
                    <button
                      className="adm-btn adm-btn-sm"
                      title={t('common.edit')}
                      onClick={() => {
                        setEditingId(tl.id)
                        setForm({
                          name: tl.name,
                          description: tl.description ?? '',
                          parametersSchema: toJsonText(tl.parametersSchema) || '{}',
                          handlerType: 'external', // register form is external-only; editing a builtin is not supported
                          endpoint: tl.endpoint ?? '',
                          authType: tl.authType ?? 'none',
                          authConfig: toJsonText(tl.authConfig),
                          isActive: tl.isActive,
                        })
                        setError(null)
                        setShowForm(true)
                      }}
                    >
                      <Pencil size={14} /> {t('common.edit')}
                    </button>
                    <button className="adm-btn adm-btn-sm" title={t('common.delete')} onClick={() => void remove(tl.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {(tools ?? []).length === 0 && (
              <tr>
                <td colSpan={5}>
                  <div className="adm-empty">{t('admin.noToolsRegistered')}</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
