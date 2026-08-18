import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { BarChart3, CalendarRange, Coins, Download, User } from 'lucide-react'
import { useAuth } from '../auth'
import { authFetchJson } from '../../shared/lib/api-client'
import type {
  MonthlyUsageRow,
  TokenUsageReport,
  UsageTotals,
} from '../../shared/types/api'

type ReportType = 'conversations' | 'monthly'

/**
 * Available reports — add a new entry here (plus a render branch below)
 * when a new report type ships.
 */
type ReportKey = 'token-usage'

const REPORTS: { key: ReportKey; labelKey: string; descKey: string; icon: React.ReactNode }[] = [
  {
    key: 'token-usage',
    labelKey: 'admin.reportTokenUsage',
    descKey: 'admin.reportTokenDesc',
    icon: <Coins size={15} />,
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

/** Reports — selectable report types (token usage today, more to come). */
export function ReportPage() {
  const { t } = useTranslation()
  const { serverUrl } = useAuth()
  const [report, setReport] = useState<ReportKey>('token-usage')
  const [type, setType] = useState<ReportType>('conversations')
  const [from, setFrom] = useState(monthStart)
  const [to, setTo] = useState(today)
  const [username, setUsername] = useState('')

  const activeReport = REPORTS.find((r) => r.key === report) ?? REPORTS[0]

  const { data, isLoading } = useQuery<TokenUsageReport | { rows: MonthlyUsageRow[] }>({
    queryKey: reportsKey(serverUrl, report, type, from, to, username),
    queryFn: () => {
      const qs = new URLSearchParams({ from, to })
      if (username.trim()) qs.set('username', username.trim())
      const endpoint = type === 'conversations' ? 'token-usage' : 'monthly'
      return authFetchJson(`${serverUrl}/reports/${endpoint}?${qs}`)
    },
    placeholderData: (prev) => prev,
  })

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

  const exportCsv = useCallback(() => {
    if (type === 'conversations') {
      const r = rows as TokenUsageReport['rows']
      downloadCsv(
        `omnichat-token-usage-${from}-to-${to}.csv`,
        ['Visitor', 'Ticket', 'Agent', 'Status', 'AI calls', 'Prompt tokens', 'Completion tokens', 'Total tokens', 'Est. cost (USD)'],
        r.map((row) => [
          row.visitorName,
          `#${row.ticketId}`,
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
  }, [from, rows, to, type])

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
            <div>
              <label className="adm-label">{t('admin.from')}</label>
              <input className="adm-input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div>
              <label className="adm-label">{t('admin.to')}</label>
              <input className="adm-input" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
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
      </div>

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
                <th>{t('admin.visitor')}</th>
                <th>{t('admin.ticket')}</th>
                <th>{t('common.agent')}</th>
                <th>{t('admin.status')}</th>
                <th>{t('admin.aiCalls')}</th>
                <th>{t('admin.inputTokens')}</th>
                <th>{t('admin.outputTokens')}</th>
                <th>{t('admin.totalTokens')}</th>
                <th>{t('admin.estCost')}</th>
              </tr>
            </thead>
            <tbody>
              {(rows as TokenUsageReport['rows']).map((r) => (
                <tr key={r.conversationId}>
                  <td><strong>{r.visitorName}</strong></td>
                  <td className="adm-mono">#{r.ticketId}</td>
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
                  <th>{t('admin.date')}</th>
                  <th>{t('admin.conversations')}</th>
                  <th>{t('admin.aiCalls')}</th>
                  <th>{t('admin.inputTokens')}</th>
                  <th>{t('admin.outputTokens')}</th>
                  <th>{t('admin.totalTokens')}</th>
                  <th>{t('admin.estCost')}</th>
                </tr>
              </thead>
              <tbody>
                {(rows as MonthlyUsageRow[]).map((d) => (
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
    </div>
  )
}
