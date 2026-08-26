import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { BarChart3, CalendarRange, Coins, Download, Sparkles, User } from 'lucide-react'
import { useAuth } from '../auth'
import { authFetchJson } from '../../shared/lib/api-client'
import type {
  AiProvider,
  AiReviewResponse,
  MonthlyUsageRow,
  TokenUsageReport,
  UsageTotals,
} from '../../shared/types/api'

interface AgentPerformanceRow {
  agent: string
  agentType: 'AI' | 'Human'
  totalConversations: number
  ratedConversations: number
  averageRating: number
  ratingDistribution: { [key: number]: number }
  positiveReviews: number
  negativeReviews: number
  totalReviews: number
  resolutionRate: number
}

interface AgentPerformanceTotals {
  totalConversations: number
  totalRated: number
  overallAverageRating: number
  totalPositiveReviews: number
  totalNegativeReviews: number
  reviewRate: number
}

type ReportType = 'conversations' | 'monthly'

/**
 * Available reports — add a new entry here (plus a render branch below)
 * when a new report type ships.
 */
type ReportKey = 'token-usage' | 'agent-performance'

const REPORTS: { key: ReportKey; labelKey: string; descKey: string; icon: React.ReactNode }[] = [
  {
    key: 'token-usage',
    labelKey: 'admin.reportTokenUsage',
    descKey: 'admin.reportTokenDesc',
    icon: <Coins size={15} />,
  },
  {
    key: 'agent-performance',
    labelKey: 'admin.reportAgentPerformance',
    descKey: 'admin.reportAgentPerformanceDesc',
    icon: <User size={15} />,
  },
]

const STATUS_KEYS: Record<string, string> = {
  active: 'common.statusActive',
  ai: 'common.statusAi',
  specialist: 'common.statusSpecialist',
  resolved: 'common.statusResolved',
}

const reportsKey = (serverUrl: string, report: ReportKey, type: ReportType, from: string, to: string, username: string) =>
  ['reports', serverUrl, report, type, from, to, username] as const

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

function monthStart(): string {
  const d = new Date()
  d.setDate(1)
  return d.toISOString().slice(0, 10)
}

function fmtCost(cost: number): string {
  if (cost === 0) return '$0.00'
  if (cost < 0.01) return `$${cost.toFixed(5)}`
  return `$${cost.toFixed(2)}`
}

function fmtTokens(n: number): string {
  return n.toLocaleString('en-US')
}

function csvEscape(v: string | number): string {
  const s = String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/** Build and download a CSV file client-side. */
function downloadCsv(filename: string, header: string[], rows: (string | number)[][]) {
  const lines = [header.map(csvEscape).join(','), ...rows.map((r) => r.map(csvEscape).join(','))]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function TotalsCards({ totals }: { totals: UsageTotals }) {
  const { t } = useTranslation()
  const cards = [
    { label: t('admin.totalTokens'), value: fmtTokens(totals.totalTokens), hint: t('admin.inputPlusOutput') },
    { label: t('admin.inputTokens'), value: fmtTokens(totals.promptTokens) },
    { label: t('admin.outputTokens'), value: fmtTokens(totals.completionTokens) },
    { label: t('admin.estCost'), value: fmtCost(totals.cost), accent: true },
    { label: t('admin.aiCalls'), value: fmtTokens(totals.calls) },
    { label: t('admin.conversations'), value: fmtTokens(totals.conversations) },
  ]
  return (
    <div className="adm-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 16 }}>
      {cards.map((c) => (
        <div key={c.label} className="adm-card" style={{ padding: '14px 16px' }}>
          <div className="adm-muted" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {c.label}
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4, color: c.accent ? 'var(--adm-accent)' : undefined }}>
            {c.value}
          </div>
          {c.hint && <div className="adm-muted" style={{ fontSize: 11 }}>{c.hint}</div>}
        </div>
      ))}
    </div>
  )
}


function AgentPerformanceTotalsCards({ totals }: { totals: AgentPerformanceTotals }) {
  const { t } = useTranslation()
  const cards = [
    { label: t('admin.totalChats'), value: totals.totalConversations.toLocaleString() },
    { label: t('admin.ratedChats'), value: totals.totalRated.toLocaleString() },
    { label: t('admin.reviewRate'), value: `${(totals.reviewRate * 100).toFixed(0)}%` },
    { label: t('admin.avgRating'), value: totals.overallAverageRating.toFixed(1), accent: true },
    { label: t('admin.positiveReviews'), value: totals.totalPositiveReviews.toLocaleString(), hint: t('admin.positiveHint') },
    { label: t('admin.negativeReviews'), value: totals.totalNegativeReviews.toLocaleString(), hint: t('admin.negativeHint') },
  ]
  return (
    <div className="adm-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 16 }}>
      {cards.map((c) => (
        <div key={c.label} className="adm-card" style={{ padding: '14px 16px' }}>
          <div className="adm-muted" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {c.label}
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4, color: c.accent ? 'var(--adm-accent)' : undefined }}>
            {c.value}
          </div>
          {c.hint && <div className="adm-muted" style={{ fontSize: 11 }}>{c.hint}</div>}
        </div>
      ))}
    </div>
  )
}

/** Reports — selectable report types (token usage today, more to come). */
type SortDir = 'asc' | 'desc'

function SortHeader({
  label,
  column,
  sortKey,
  sortDir,
  onSort,
}: {
  label: string
  column: string
  sortKey: string | null
  sortDir: SortDir
  onSort: (column: string) => void
}) {
  const active = sortKey === column
  return (
    <th style={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }} onClick={() => onSort(column)}>
      {label} {active ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
    </th>
  )
}

export function ReportPage() {
  const { t, i18n } = useTranslation()
  const { serverUrl } = useAuth()
  const [report, setReport] = useState<ReportKey>('token-usage')
  const [type, setType] = useState<ReportType>('conversations')
  const [from, setFrom] = useState(monthStart)
  const [to, setTo] = useState(today)
  const [username, setUsername] = useState('')
  const [agentTypeFilter] = useState<'All' | 'AI' | 'Human'>('All')
  const [providerId, setProviderId] = useState<string>('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [aiReview, setAiReview] = useState<string | null>(null)
  const [aiReviewLoading, setAiReviewLoading] = useState(false)
  const [aiReviewError, setAiReviewError] = useState<string | null>(null)
  const [agentReviews, setAgentReviews] = useState<Record<string, string>>({})
  const [agentReviewLoading, setAgentReviewLoading] = useState<Record<string, boolean>>({})
  const [agentReviewErrors, setAgentReviewErrors] = useState<Record<string, string>>({})

  const activeReport = REPORTS.find((r) => r.key === report) ?? REPORTS[0]

  const { data, isLoading } = useQuery<any>({
    queryKey: reportsKey(serverUrl, report, type, from, to, username),
    queryFn: () => {
      const qs = new URLSearchParams({ from, to })
      if (username.trim()) qs.set('username', username.trim())
      let endpoint: string
      if (report === 'agent-performance') {
        endpoint = 'agent-performance'
      } else {
        endpoint = type === 'conversations' ? 'token-usage' : 'monthly'
      }
      return authFetchJson(`${serverUrl}/reports/${endpoint}?${qs}`)
    },
    // Only reuse the previous payload when it comes from the same report + view.
    // Other reports return a different shape (agent-performance vs token-usage),
    // and rendering the stale shape throws `undefined.toFixed` in this branch.
    placeholderData: (prev: any, prevQuery: any) =>
      prev && prevQuery?.queryKey?.[2] === report && prevQuery?.queryKey?.[3] === type ? prev : undefined,
  })

  const { data: providers = [] } = useQuery<AiProvider[]>({
    queryKey: ['ai-providers', serverUrl],
    queryFn: () => authFetchJson<AiProvider[]>(`${serverUrl}/ai/config/providers`),
    staleTime: 5 * 60_000,
    enabled: report === 'agent-performance',
  })
  const selectedProvider =
    providers.find((p) => p.id === providerId) ?? providers.find((p) => p.isActive) ?? providers[0]

  // Clear a previously generated review whenever the range/report changes so we
  // never show feedback computed for a different date range.
  useEffect(() => {
    setAiReview(null)
    setAiReviewError(null)
    setAgentReviews({})
    setAgentReviewLoading({})
    setAgentReviewErrors({})
  }, [report, type, from, to, username])

  const runAiReview = useCallback(async () => {
    setAiReviewLoading(true)
    setAiReviewError(null)
    try {
      const res = await authFetchJson<AiReviewResponse>(
        `${serverUrl}/reports/agent-performance/ai-review`,
        {
          method: 'POST',
          body: JSON.stringify({
            from,
            to,
            username: username || undefined,
            providerId: providerId || selectedProvider?.id || undefined,
            lang: i18n.language,
          }),
        },
      )
      setAiReview(res.review)
    } catch (e: any) {
      setAiReviewError(e?.message ?? t('admin.aiReviewFailed'))
    } finally {
      setAiReviewLoading(false)
    }
  }, [serverUrl, from, to, username, providerId, selectedProvider?.id, i18n.language, t])

  const runAgentReview = useCallback(
    async (agent: string) => {
      if (!selectedProvider) return
      setAgentReviewLoading((p) => ({ ...p, [agent]: true }))
      setAgentReviewErrors((p) => ({ ...p, [agent]: '' }))
      try {
        const res = await authFetchJson<AiReviewResponse>(
          `${serverUrl}/reports/agent-performance/ai-review`,
          {
            method: 'POST',
            body: JSON.stringify({
              from,
              to,
              agent,
              providerId: providerId || selectedProvider.id,
              lang: i18n.language,
            }),
          },
        )
        setAgentReviews((p) => ({ ...p, [agent]: res.review }))
      } catch (e: any) {
        setAgentReviewErrors((p) => ({ ...p, [agent]: e?.message ?? t('admin.aiReviewFailed') }))
      } finally {
        setAgentReviewLoading((p) => ({ ...p, [agent]: false }))
      }
    },
    [serverUrl, from, to, providerId, selectedProvider, i18n.language, t],
  )

  const rows = data?.rows ?? []
  const totals: UsageTotals = useMemo(() => {
    if (type === 'conversations') return (data as TokenUsageReport | undefined)?.totals ?? { promptTokens: 0, completionTokens: 0, totalTokens: 0, cost: 0, calls: 0, conversations: 0 }
    // Derive totals from the daily buckets.
    const days = (data?.rows ?? []) as MonthlyUsageRow[]
    return days.reduce(
      (acc, d) => ({
        promptTokens: acc.promptTokens + d.promptTokens,
        completionTokens: acc.completionTokens + d.completionTokens,
        totalTokens: acc.totalTokens + d.totalTokens,
        cost: acc.cost + d.cost,
        calls: acc.calls + d.calls,
        conversations: acc.conversations + d.conversations,
      }),
      { promptTokens: 0, completionTokens: 0, totalTokens: 0, cost: 0, calls: 0, conversations: 0 },
    )
  }, [data, type])

  const maxDailyTokens = useMemo(() => {
    const days = (data?.rows ?? []) as MonthlyUsageRow[]
    return Math.max(1, ...days.map((d) => d.totalTokens))
  }, [data])

  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const cmp = (a: unknown, b: unknown, dir: SortDir): number => {
    const av = a ?? ''
    const bv = b ?? ''
    const r =
      typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv), undefined, { numeric: true })
    return dir === 'asc' ? r : -r
  }

  const agentRows = useMemo(() => {
    const base = (rows as AgentPerformanceRow[])
      .filter((r) => agentTypeFilter === 'All' || r.agentType === agentTypeFilter)
      .filter((r) => !username || r.agent.toLowerCase().includes(username.toLowerCase()))
    if (!sortKey) return base
    const get = (r: AgentPerformanceRow): unknown => {
      switch (sortKey) {
        case 'agent': return r.agent
        case 'agentType': return r.agentType
        case 'totalConversations': return r.totalConversations ?? 0
        case 'ratedConversations': return r.ratedConversations ?? 0
        case 'averageRating': return r.averageRating ?? 0
        case 'positiveReviews': return r.positiveReviews ?? 0
        case 'negativeReviews': return r.negativeReviews ?? 0
        case 'resolutionRate': return r.resolutionRate ?? 0
        case 'review': return agentReviews[r.agent] ?? ''
        default: return ''
      }
    }
    return [...base].sort((a, b) => cmp(get(a), get(b), sortDir))
  }, [rows, sortKey, sortDir, agentTypeFilter, username, agentReviews])

  const convRows = useMemo(() => {
    const base = rows as TokenUsageReport['rows']
    if (!sortKey) return base
    const get = (r: TokenUsageReport['rows'][number]): unknown => {
      switch (sortKey) {
        case 'visitorName': return r.visitorName
        case 'ticketId': return r.ticketId
        case 'username': return r.assignedUsername ?? ''
        case 'agent': return r.agent
        case 'status': return r.status
        case 'calls': return r.calls
        case 'promptTokens': return r.promptTokens
        case 'completionTokens': return r.completionTokens
        case 'totalTokens': return r.totalTokens
        case 'cost': return r.cost
        default: return ''
      }
    }
    return [...base].sort((a, b) => cmp(get(a), get(b), sortDir))
  }, [rows, sortKey, sortDir])

  const monthlyRows = useMemo(() => {
    const base = rows as MonthlyUsageRow[]
    if (!sortKey) return base
    const get = (d: MonthlyUsageRow): unknown => {
      switch (sortKey) {
        case 'date': return d.date
        case 'conversations': return d.conversations
        case 'calls': return d.calls
        case 'promptTokens': return d.promptTokens
        case 'completionTokens': return d.completionTokens
        case 'totalTokens': return d.totalTokens
        case 'cost': return d.cost
        default: return ''
      }
    }
    return [...base].sort((a, b) => cmp(get(a), get(b), sortDir))
  }, [rows, sortKey, sortDir])

  const exportCsv = useCallback(() => {
    if (report === 'agent-performance') {
      const r = rows as AgentPerformanceRow[]
      downloadCsv(
        `omnichat-agent-performance-${from}-to-${to}.csv`,
        ['Agent', 'Type', 'Total Chats', 'Rated (%)', 'Avg Rating', 'Positive (%)', 'Negative (%)', 'Resolution Rate (%)', 'AI Review'],
        [
          ...r.map((row) => [
            row.agent,
            row.agentType,
            row.totalConversations ?? 0,
            `${(((row.ratedConversations ?? 0) / Math.max(1, row.totalConversations ?? 0)) * 100).toFixed(0)}%`,
            (row.averageRating ?? 0).toFixed(1),
            `${(((row.positiveReviews ?? 0) / Math.max(1, row.totalReviews ?? 0)) * 100).toFixed(0)}%`,
            `${(((row.negativeReviews ?? 0) / Math.max(1, row.totalReviews ?? 0)) * 100).toFixed(0)}%`,
            `${((row.resolutionRate ?? 0) * 100).toFixed(0)}%`,
            agentReviews[row.agent] ?? '',
          ]),
          ...(aiReview ? [[''], ['AI Review', '', ''], [aiReview, ''], ['']] : []),
        ],
      )
      return
    }
    if (type === 'conversations') {
      const r = rows as TokenUsageReport['rows']
      downloadCsv(
        `omnichat-token-usage-${from}-to-${to}.csv`,
        ['Visitor', 'Ticket', 'Username', 'Agent', 'Status', 'AI calls', 'Prompt tokens', 'Completion tokens', 'Total tokens', 'Est. cost (USD)'],
        r.map((row) => [
          row.visitorName,
          `#${row.ticketId}`,
          row.assignedUsername ?? '',
          row.agent,
          row.status,
          row.calls,
          row.promptTokens,
          row.completionTokens,
          row.totalTokens,
          row.cost.toFixed(6),
        ]),
      )
    } else {
      const r = rows as MonthlyUsageRow[]
      downloadCsv(
        `omnichat-monthly-usage-${from}-to-${to}.csv`,
        ['Date', 'AI calls', 'Conversations', 'Prompt tokens', 'Completion tokens', 'Total tokens', 'Est. cost (USD)'],
        r.map((d) => [d.date, d.calls, d.conversations, d.promptTokens, d.completionTokens, d.totalTokens, d.cost.toFixed(6)]),
      )
    }
  }, [from, rows, to, type, aiReview, agentReviews])

  return (
    <div>
      <div className="adm-page-head">
        <div>
          <h1 className="adm-page-title">{t('admin.report')}</h1>
          <p className="adm-page-sub">{t(activeReport.descKey)}</p>
        </div>
        <button type="button" className="adm-btn adm-btn-primary" onClick={exportCsv} disabled={rows.length === 0}>
          <Download size={15} /> {t('admin.exportCsv')}
        </button>
      </div>

      {/* Report selector + filters */}
      <div className="adm-card" style={{ marginBottom: 16, display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 220 }}>
          <label className="adm-label">{t('admin.reportType')}</label>
          <select
            className="adm-select"
            style={{ width: '100%' }}
            value={report}
            onChange={(e) => setReport(e.target.value as ReportKey)}
          >
            {REPORTS.map((r) => (
              <option key={r.key} value={r.key}>{t(r.labelKey)}</option>
            ))}
          </select>
        </div>
        {report === 'token-usage' && (
          <>
            <div>
              <label className="adm-label">{t('admin.view')}</label>
              <div className="adm-tabs" style={{ borderBottom: 'none', padding: 0 }}>
                <button
                  type="button"
                  className={`adm-tab ${type === 'conversations' ? 'active' : ''}`}
                  onClick={() => setType('conversations')}
                >
                  <BarChart3 size={14} /> {t('admin.byConversation')}
                </button>
                <button
                  type="button"
                  className={`adm-tab ${type === 'monthly' ? 'active' : ''}`}
                  onClick={() => setType('monthly')}
                >
                  <CalendarRange size={14} /> {t('admin.byDay')}
                </button>
              </div>
            </div>
            <div style={{ minWidth: 220, flex: 1 }}>
              <label className="adm-label">{t('admin.agentOrVisitor')}</label>
              <div style={{ position: 'relative' }}>
                <User size={14} style={{ position: 'absolute', left: 10, top: 9, color: '#94a3b8' }} />
                <input
                  className="adm-input"
                  style={{ width: '100%', paddingLeft: 30 }}
                  placeholder={t('admin.reportPlaceholder')}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
          </>
        )}
        {(report === 'token-usage' || report === 'agent-performance') && (
          <>
            <div>
              <label className="adm-label">{t('admin.from')}</label>
              <input className="adm-input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div>
              <label className="adm-label">{t('admin.to')}</label>
              <input className="adm-input" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </>
        )}
        {report === 'agent-performance' && (
          <div style={{ minWidth: 220 }}>
            <label className="adm-label">{t('admin.aiReviewModel')}</label>
            <select
              className="adm-select"
              style={{ width: '100%' }}
              value={providerId || selectedProvider?.id || ''}
              onChange={(e) => setProviderId(e.target.value)}
            >
              {providers.length === 0 && <option value="">{t('admin.noAiProvider')}</option>}
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.chatModelId}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

            {report === 'agent-performance' ? (
        <>
          <AgentPerformanceTotalsCards
            totals={{
              totalConversations: data?.totals?.totalConversations ?? 0,
              totalRated: data?.totals?.totalRated ?? 0,
              overallAverageRating: data?.totals?.overallAverageRating ?? 0,
              totalPositiveReviews: data?.totals?.totalPositiveReviews ?? 0,
              totalNegativeReviews: data?.totals?.totalNegativeReviews ?? 0,
              reviewRate: data?.totals?.reviewRate ?? 0,
            }}
          />
          <div className="adm-card" style={{ padding: 18, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <h2 className="adm-card-title" style={{ margin: 0 }}>{t('admin.overallAiReview')}</h2>
              <button
                type="button"
                className="adm-btn"
                onClick={runAiReview}
                disabled={aiReviewLoading || !selectedProvider}
              >
                <Sparkles size={15} /> {aiReviewLoading ? t('admin.aiReviewRunning') : t('admin.aiReviewRun')}
              </button>
              {aiReviewError && (
                <span style={{ color: 'var(--adm-error)', fontSize: 12 }}>
                  {t('admin.aiReviewFailed')}: {aiReviewError}
                </span>
              )}
            </div>
            {aiReview && (
              <pre
                style={{
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'inherit',
                  margin: '12px 0 0',
                  fontSize: 13,
                  lineHeight: 1.55,
                }}
              >
                {aiReview}
              </pre>
            )}
          </div>
          {isLoading && !data ? (
            <div className="adm-center"><span className="adm-spinner" /></div>
          ) : rows.length === 0 ? (
            <div className="adm-card"><div className="adm-empty">{t('admin.noData')}</div></div>
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <SortHeader label={t('common.agent')} column="agent" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <SortHeader label={t('admin.agentType')} column="agentType" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <SortHeader label={t('admin.totalChats')} column="totalConversations" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <SortHeader label={t('admin.ratedChats')} column="ratedConversations" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <SortHeader label={t('admin.avgRating')} column="averageRating" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <SortHeader label={t('admin.positiveReviews')} column="positiveReviews" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <SortHeader label={t('admin.negativeReviews')} column="negativeReviews" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <SortHeader label={t('admin.resolutionRate')} column="resolutionRate" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <SortHeader label={t('admin.aiReview')} column="review" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                  </tr>
                </thead>
                <tbody>
                  {agentRows.map((r) => (
                      <tr key={r.agent}>
                        <td><strong>{r.agent}</strong></td>
                        <td>
                          <span className={`adm-badge ${r.agentType === 'AI' ? 'adm-badge-ai' : 'adm-badge-agent'}`}>
                            {r.agentType}
                          </span>
                        </td>
                        <td className="adm-muted">{r.totalConversations}</td>
                        <td className="adm-muted">{r.ratedConversations ?? 0} ({(((r.ratedConversations ?? 0) / Math.max(1, r.totalConversations ?? 0)) * 100).toFixed(0)}%)</td>
                        <td style={{ fontWeight: 650, color: (r.averageRating ?? 0) >= 4 ? 'var(--adm-accent)' : undefined }}>
                          {'★'.repeat(Math.round(r.averageRating ?? 0))}{'☆'.repeat(5 - Math.round(r.averageRating ?? 0))} {(r.averageRating ?? 0).toFixed(1)}
                        </td>
                        <td style={{ color: 'var(--adm-success)' }}>{(((r.positiveReviews ?? 0) / Math.max(1, r.totalReviews ?? 0)) * 100).toFixed(0)}%</td>
                        <td style={{ color: 'var(--adm-error)' }}>{(((r.negativeReviews ?? 0) / Math.max(1, r.totalReviews ?? 0)) * 100).toFixed(0)}%</td>
                        <td className="adm-muted">{((r.resolutionRate ?? 0) * 100).toFixed(0)}%</td>
                        <td style={{ minWidth: 240, maxWidth: 360, verticalAlign: 'top' }}>
                          {agentReviewLoading[r.agent] ? (
                            <span className="adm-muted">{t('admin.aiReviewRunning')}</span>
                          ) : agentReviews[r.agent] ? (
                            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0, fontSize: 12, lineHeight: 1.5 }}>{agentReviews[r.agent]}</pre>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="adm-btn"
                                onClick={() => runAgentReview(r.agent)}
                                disabled={!selectedProvider}
                              >
                                <Sparkles size={13} /> {t('admin.aiReviewRun')}
                              </button>
                              {agentReviewErrors[r.agent] && (
                                <div style={{ color: 'var(--adm-error)', fontSize: 11, marginTop: 4 }}>{agentReviewErrors[r.agent]}</div>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <>
          <TotalsCards totals={totals} />
          {isLoading && !data ? (
            <div className="adm-center">
              <span className="adm-spinner" />
            </div>
          ) : rows.length === 0 ? (
            <div className="adm-card">
              <div className="adm-empty">
                {t('admin.noUsageInRange')}
              </div>
            </div>
          ) : type === 'conversations' ? (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <SortHeader label={t('admin.visitor')} column="visitorName" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <SortHeader label={t('admin.ticket')} column="ticketId" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <SortHeader label={t('admin.username')} column="username" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <SortHeader label={t('common.agent')} column="agent" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <SortHeader label={t('admin.status')} column="status" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <SortHeader label={t('admin.aiCalls')} column="calls" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <SortHeader label={t('admin.inputTokens')} column="promptTokens" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <SortHeader label={t('admin.outputTokens')} column="completionTokens" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <SortHeader label={t('admin.totalTokens')} column="totalTokens" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <SortHeader label={t('admin.estCost')} column="cost" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                  </tr>
                </thead>
                <tbody>
                  {convRows.map((r) => (
                    <tr key={r.conversationId}>
                      <td><strong>{r.visitorName}</strong></td>
                      <td className="adm-mono">#{r.ticketId}</td>
                      <td className="adm-muted">{r.assignedUsername ?? '—'}</td>
                      <td className="adm-muted">{r.agent}</td>
                      <td><span className={`adm-badge adm-badge-${r.status}`}>{t(STATUS_KEYS[r.status] ?? 'common.unknown')}</span></td>
                      <td className="adm-muted">{r.calls}</td>
                      <td className="adm-mono">{fmtTokens(r.promptTokens)}</td>
                      <td className="adm-mono">{fmtTokens(r.completionTokens)}</td>
                      <td className="adm-mono" style={{ fontWeight: 650 }}>{fmtTokens(r.totalTokens)}</td>
                      <td style={{ color: 'var(--adm-accent)', fontWeight: 650 }}>{fmtCost(r.cost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="adm-card" style={{ padding: 18 }}>
              <h2 className="adm-card-title" style={{ marginTop: 0 }}>{t('admin.dailyUsage')}</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                {(rows as MonthlyUsageRow[]).map((d) => (
                  <div key={d.date} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="adm-mono" style={{ width: 90, flex: 'none', fontSize: 12 }}>{d.date}</span>
                    <div style={{ flex: 1, background: 'var(--adm-bg)', borderRadius: 6, height: 22, overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${Math.max(2, (d.totalTokens / maxDailyTokens) * 100)}%`,
                          background: 'var(--adm-accent)',
                          borderRadius: 6,
                          opacity: 0.85,
                        }}
                      />
                    </div>
                    <span className="adm-mono" style={{ width: 100, flex: 'none', textAlign: 'right', fontSize: 12 }}>
                      {fmtTokens(d.totalTokens)} tok · {fmtCost(d.cost)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                  <tr>
                    <SortHeader label={t('admin.date')} column="date" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <SortHeader label={t('admin.conversations')} column="conversations" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <SortHeader label={t('admin.aiCalls')} column="calls" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <SortHeader label={t('admin.inputTokens')} column="promptTokens" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <SortHeader label={t('admin.outputTokens')} column="completionTokens" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <SortHeader label={t('admin.totalTokens')} column="totalTokens" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                    <SortHeader label={t('admin.estCost')} column="cost" sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} />
                  </tr>
                </thead>
                <tbody>
                  {monthlyRows.map((d) => (
                      <tr key={d.date}>
                        <td className="adm-mono">{d.date}</td>
                        <td className="adm-muted">{d.conversations}</td>
                        <td className="adm-muted">{d.calls}</td>
                        <td className="adm-mono">{fmtTokens(d.promptTokens)}</td>
                        <td className="adm-mono">{fmtTokens(d.completionTokens)}</td>
                        <td className="adm-mono" style={{ fontWeight: 650 }}>{fmtTokens(d.totalTokens)}</td>
                        <td style={{ color: 'var(--adm-accent)', fontWeight: 650 }}>{fmtCost(d.cost)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}