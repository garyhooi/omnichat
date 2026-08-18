import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import {
  Bot,
  CheckCircle2,
  Inbox,
  ShieldAlert,
  Users,
  Zap,
} from 'lucide-react'
import { useAdminData } from '../AdminDataProvider'
import { useAuth } from '../auth'
import { authFetchJson } from '../../shared/lib/api-client'
import { visitorLabel } from '../../features/agent/AgentConversationList'
import { formatTicketId, timeAgo, truncate } from '../../shared/lib/format'
import type { ReportSummary } from '../../shared/types/api'

const STATUS_COLORS: Record<string, string> = {
  active: '#10b981',
  ai: '#8b5cf6',
  specialist: '#f59e0b',
  resolved: '#94a3b8',
}

const STATUS_KEYS: Record<string, string> = {
  active: 'common.statusActive',
  ai: 'common.statusAi',
  specialist: 'common.statusSpecialist',
  resolved: 'common.statusResolved',
}

/**
 * Dashboard — live stats derived from the socket conversation stream plus a
 * usage & activity section from /reports/summary (tokens, spend, charts).
 */
export function DashboardPage() {
  const { t } = useTranslation()
  const { conversations, loaded, agents } = useAdminData()
  const { serverUrl } = useAuth()

  const { data: summary } = useQuery<ReportSummary>({
    queryKey: ['report-summary', serverUrl],
    queryFn: () => authFetchJson(`${serverUrl}/reports/summary`),
    staleTime: 60_000,
  })

  const stats = useMemo(() => {
    const open = conversations.filter((c) => c.status === 'active' || c.status === 'ai' || c.status === 'specialist')
    const active = conversations.filter((c) => c.status === 'active').length
    const aiHandled = conversations.filter((c) => c.status === 'ai').length
    const specialist = conversations.filter((c) => c.status === 'specialist').length
    const resolvedToday = conversations.filter((c) => {
      if (c.status !== 'resolved') return false
      const d = new Date(c.updatedAt)
      const now = new Date()
      return (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      )
    }).length
    const blacklisted = conversations.filter((c) => c.isIpBlacklisted).length
    const unread = open.reduce((sum, c) => sum + (c.unreadCount ?? 0), 0)
    const onlineAgents = agents.filter((a) => a.isOnline).length
    return { active, aiHandled, specialist, resolvedToday, blacklisted, unread, onlineAgents }
  }, [agents, conversations])

  const recent = useMemo(
    () =>
      [...conversations]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 8),
    [conversations],
  )

  const cards = [
    { labelKey: 'admin.activeChats', value: stats.active, icon: <Inbox size={17} />, bg: '#dbeafe', color: '#1e40af' },
    { labelKey: 'admin.aiHandled', value: stats.aiHandled, icon: <Bot size={17} />, bg: '#ede9fe', color: '#6d28d9' },
    { labelKey: 'admin.specialist', value: stats.specialist, icon: <Zap size={17} />, bg: '#fef3c7', color: '#92400e' },
    { labelKey: 'admin.resolvedToday', value: stats.resolvedToday, icon: <CheckCircle2 size={17} />, bg: '#d1fae5', color: '#065f46' },
    { labelKey: 'admin.unread', value: stats.unread, icon: <Inbox size={17} />, bg: '#fee2e2', color: '#991b1b' },
    { labelKey: 'admin.blacklistedIps', value: stats.blacklisted, icon: <ShieldAlert size={17} />, bg: '#fef2f2', color: '#b91c1c' },
    { labelKey: 'admin.agentsOnline', value: stats.onlineAgents, icon: <Users size={17} />, bg: '#e0f2fe', color: '#075985' },
  ]

  // Usage charts
  const daily = summary?.daily ?? []
  const maxTokens = Math.max(1, ...daily.map((d) => d.tokens))
  const maxMessages = Math.max(1, ...daily.map((d) => d.messages))
  const totals = summary?.totals
  const statuses = Object.entries(summary?.conversationsByStatus ?? {})
  const statusTotal = statuses.reduce((n, [, v]) => n + v, 0)

  const donut = useMemo(() => {
    const C = 2 * Math.PI * 34
    let acc = 0
    return statuses.map(([status, value]) => {
      const pct = statusTotal > 0 ? value / statusTotal : 0
      const seg = { status, value, pct, offset: -acc * C }
      acc += pct
      return seg
    })
  }, [statusTotal, statuses])

  const fmtShort = (date: string) => date.slice(5) // MM-DD

  return (
    <div>
      <div className="adm-page-head">
        <div>
          <h1 className="adm-page-title">{t('admin.dashboard')}</h1>
          <p className="adm-page-sub">
            {loaded ? t('admin.live') : t('common.connecting')} · {serverUrl}
          </p>
        </div>
      </div>

      <div className="adm-grid adm-grid-4" style={{ marginBottom: 18 }}>
        {cards.map((c) => (
          <div key={c.labelKey} className="adm-card adm-stat">
            <span className="adm-stat-icon" style={{ background: c.bg, color: c.color }}>
              {c.icon}
            </span>
            <span className="adm-stat-value">{loaded ? c.value : '—'}</span>
            <span className="adm-stat-label">{t(c.labelKey)}</span>
          </div>
        ))}
      </div>

      {/* Usage & activity (token reports) */}
      <div className="adm-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginBottom: 18 }}>
        <div className="adm-card">
          <h2 className="adm-card-title">{t('admin.tokenUsage')}</h2>
          {totals && (
            <div className="adm-row" style={{ gap: 18, marginBottom: 12, flexWrap: 'wrap' }}>
              <span className="adm-muted" style={{ fontSize: 12 }}>
                {t('admin.totalTokens')} <strong style={{ color: 'var(--adm-text)' }}>{totals.totalTokens.toLocaleString()}</strong>
              </span>
              <span className="adm-muted" style={{ fontSize: 12 }}>
                {t('admin.estCost')} <strong style={{ color: 'var(--adm-accent)' }}>${totals.cost.toFixed(5)}</strong>
              </span>
              <span className="adm-muted" style={{ fontSize: 12 }}>
                {t('admin.aiCalls')} <strong style={{ color: 'var(--adm-text)' }}>{totals.calls.toLocaleString()}</strong>
              </span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 110 }}>
            {daily.map((d) => (
              <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, minWidth: 0 }}>
                <div
                  title={t('admin.tokenTitle', { date: d.date, tokens: d.tokens.toLocaleString() })}
                  style={{
                    width: '100%',
                    maxWidth: 26,
                    height: `${Math.max(2, (d.tokens / maxTokens) * 100)}px`,
                    background: 'var(--adm-accent)',
                    borderRadius: '4px 4px 0 0',
                    opacity: d.tokens > 0 ? 0.9 : 0.15,
                  }}
                />
                <span style={{ fontSize: 9, color: 'var(--adm-muted)', writingMode: 'vertical-rl', transform: 'rotate(180deg)', maxHeight: 22, overflow: 'hidden' }}>
                  {fmtShort(d.date)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="adm-card">
          <h2 className="adm-card-title">{t('admin.messages14d')}</h2>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 110 }}>
            {daily.map((d) => (
              <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, minWidth: 0 }}>
                <div
                  title={t('admin.messageTitle', { date: d.date, messages: d.messages })}
                  style={{
                    width: '100%',
                    maxWidth: 26,
                    height: `${Math.max(2, (d.messages / maxMessages) * 100)}px`,
                    background: '#10b981',
                    borderRadius: '4px 4px 0 0',
                    opacity: d.messages > 0 ? 0.85 : 0.15,
                  }}
                />
                <span style={{ fontSize: 9, color: 'var(--adm-muted)', writingMode: 'vertical-rl', transform: 'rotate(180deg)', maxHeight: 22, overflow: 'hidden' }}>
                  {fmtShort(d.date)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="adm-card">
          <h2 className="adm-card-title">{t('admin.conversationsByStatus')}</h2>
          {statusTotal === 0 ? (
            <div className="adm-empty" style={{ padding: '24px 0' }}>{t('admin.noConversations')}</div>
          ) : (
            <div className="adm-row" style={{ gap: 20, alignItems: 'center' }}>
              <svg width="92" height="92" viewBox="0 0 92 92" style={{ flex: 'none' }}>
                <circle cx="46" cy="46" r="34" fill="none" stroke="var(--adm-bg)" strokeWidth="14" />
                {donut.map((seg) =>
                  seg.pct > 0 ? (
                    <circle
                      key={seg.status}
                      cx="46"
                      cy="46"
                      r="34"
                      fill="none"
                      stroke={STATUS_COLORS[seg.status] ?? '#94a3b8'}
                      strokeWidth="14"
                      strokeDasharray={`${seg.pct * 2 * Math.PI * 34} ${2 * Math.PI * 34}`}
                      strokeDashoffset={seg.offset}
                      transform="rotate(-90 46 46)"
                    />
                  ) : null,
                )}
                <text x="46" y="50" textAnchor="middle" style={{ fontSize: 15, fontWeight: 700, fill: 'var(--adm-text)' }}>
                  {statusTotal}
                </text>
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                {statuses.map(([status, value]) => (
                  <div key={status} className="adm-row" style={{ gap: 8, fontSize: 12.5 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 3, background: STATUS_COLORS[status] ?? '#94a3b8', flex: 'none' }} />
                    <span style={{ flex: 1 }}>{t(STATUS_KEYS[status] ?? 'common.unknown')}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="adm-card">
        <h2 className="adm-card-title">{t('admin.recentConversations')}</h2>
        {recent.length === 0 ? (
          <div className="adm-empty">{t('admin.noConversations')}</div>
        ) : (
          <div className="adm-table-wrap" style={{ border: 'none', borderRadius: 0 }}>
            <table className="adm-table">
              <thead>
                <tr>
                  <th>{t('admin.visitor')}</th>
                  <th>{t('admin.ticket')}</th>
                  <th>{t('admin.lastMessage')}</th>
                  <th>{t('admin.status')}</th>
                  <th>{t('admin.updated')}</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong>{visitorLabel(c) || t('agent.visitor')}</strong>
                    </td>
                    <td className="adm-mono">#{formatTicketId(c.id)}</td>
                    <td className="adm-muted">{truncate(c.messages?.[0]?.content || t('common.noMessages'), 70)}</td>
                    <td>
                      <span className={`adm-badge adm-badge-${c.status}`}>
                        {c.status === 'ai' ? t('common.statusAi') : t(STATUS_KEYS[c.status] ?? 'common.unknown')}
                      </span>
                    </td>
                    <td className="adm-muted">{timeAgo(c.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
