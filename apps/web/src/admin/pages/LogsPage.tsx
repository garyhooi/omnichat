import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { ChevronDown, ChevronRight, FileText, Cpu, Wrench } from 'lucide-react'
import { useAuth } from '../auth'
import { authFetchJson } from '../../shared/lib/api-client'
import type { Paginated, HttpLogEntry, AiLogEntry, ToolLogEntry } from '../../shared/types/api'

type LogKind = 'http' | 'ai' | 'tool'

const LIMIT = 25

/** Pretty-print a JSON string field (or show it raw). */
function tryParseJson(raw: string | null | undefined): string {
  if (!raw) return '—'
  try {
    return JSON.stringify(JSON.parse(raw), null, 2)
  } catch {
    return raw
  }
}

function Pre({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div>
      <p style={{ fontWeight: 650, margin: '10px 0 4px' }}>{label}</p>
      <pre
        className="adm-mono"
        style={{
          margin: 0,
          background: '#f8fafc',
          border: '1px solid var(--adm-border, #e2e8f0)',
          borderRadius: 8,
          padding: 8,
          fontSize: 11.5,
          maxHeight: 180,
          overflow: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {tryParseJson(value)}
      </pre>
    </div>
  )
}

/** Logs — paginated HTTP / AI / tool logs with text search + expandable rows. */
export function LogsPage() {
  const { t } = useTranslation()
  const { serverUrl } = useAuth()
  const [kind, setKind] = useState<LogKind>('http')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const { data, isLoading } = useQuery<Paginated<HttpLogEntry | AiLogEntry | ToolLogEntry>>({
    queryKey: ['logs', serverUrl, kind, page, search],
    queryFn: () => {
      const qs = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
        ...(search ? { search } : {}),
      })
      return authFetchJson(`${serverUrl}/logs/${kind}?${qs}`)
    },
    placeholderData: (prev) => prev,
  })

  const entries = data?.data ?? []
  const totalPages = Math.max(1, data?.totalPages ?? 1)

  const toggle = (id: string) => setExpandedId((cur) => (cur === id ? null : id))

  return (
    <div>
      <div className="adm-page-head">
        <div>
          <h1 className="adm-page-title">{t('admin.logs')}</h1>
          <p className="adm-page-sub">{t('admin.logsSub', { total: data?.total ?? 0 })}</p>
        </div>
        <input
          className="adm-input"
          style={{ width: 240 }}
          placeholder={t('admin.searchLogs')}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />
      </div>

      <div className="adm-tabs">
        {(
          [
            { key: 'http', label: 'HTTP', icon: <FileText size={14} /> },
            { key: 'ai', label: 'AI', icon: <Cpu size={14} /> },
            { key: 'tool', labelKey: 'admin.logsTools', icon: <Wrench size={14} /> },
          ] as { key: LogKind; label?: string; labelKey?: string; icon: React.ReactNode }[]
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`adm-tab ${kind === tab.key ? 'active' : ''}`}
            onClick={() => {
              setKind(tab.key)
              setPage(1)
              setExpandedId(null)
            }}
          >
            {tab.icon} {tab.label ?? t(tab.labelKey!)}
          </button>
        ))}
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th style={{ width: 28 }}></th>
              <th>{t('admin.time')}</th>
              {kind === 'http' && (
                <>
                  <th>{t('admin.method')}</th>
                  <th>{t('admin.url')}</th>
                  <th>{t('admin.status')}</th>
                  <th>{t('agent.ip')}</th>
                  <th>{t('admin.duration')}</th>
                </>
              )}
              {kind === 'ai' && (
                <>
                  <th>{t('admin.event')}</th>
                  <th>{t('admin.conversation')}</th>
                  <th>{t('admin.message')}</th>
                </>
              )}
              {kind === 'tool' && (
                <>
                  <th>{t('admin.tool')}</th>
                  <th>{t('admin.status')}</th>
                  <th>{t('admin.duration')}</th>
                  <th>{t('admin.error')}</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {isLoading && !data ? (
              <tr>
                <td colSpan={8}>
                  <div className="adm-center">
                    <span className="adm-spinner" />
                  </div>
                </td>
              </tr>
            ) : entries.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="adm-empty">{t('admin.noLogEntries')}</div>
                </td>
              </tr>
            ) : (
              entries.map((e) => (
                <ExpandedRow
                  key={e.id}
                  entry={e}
                  kind={kind}
                  expanded={expandedId === e.id}
                  onToggle={() => toggle(e.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="adm-row" style={{ justifyContent: 'flex-end', marginTop: 14 }}>
        <button className="adm-btn adm-btn-sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          {t('admin.previous')}
        </button>
        <span className="adm-muted" style={{ fontSize: 12.5 }}>
          {t('admin.pageOf', { page, total: totalPages })}
        </span>
        <button className="adm-btn adm-btn-sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
          {t('admin.next')}
        </button>
      </div>
    </div>
  )
}

function ExpandedRow({
  entry,
  kind,
  expanded,
  onToggle,
}: {
  entry: HttpLogEntry | AiLogEntry | ToolLogEntry
  kind: LogKind
  expanded: boolean
  onToggle: () => void
}) {
  const { t } = useTranslation()
  return (
    <>
      <tr className="clickable" onClick={onToggle} title={t('admin.clickToExpand')}>
        <td>
          <span className="adm-muted" style={{ display: 'inline-flex', verticalAlign: '-2px' }}>
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        </td>
        <td className="adm-muted" style={{ whiteSpace: 'nowrap' }}>
          {new Date(entry.createdAt).toLocaleString()}
        </td>
        {kind === 'http' && (
          <>
            <td>
              <span className="adm-badge adm-badge-neutral">{(entry as HttpLogEntry).method}</span>
            </td>
            <td className="adm-mono" style={{ maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {(entry as HttpLogEntry).url}
            </td>
            <td>
              <span
                className={`adm-badge ${(entry as HttpLogEntry).statusCode != null && (entry as HttpLogEntry).statusCode! >= 400 ? 'adm-badge-danger' : 'adm-badge-success'}`}
              >
                {(entry as HttpLogEntry).statusCode ?? '—'}
              </span>
            </td>
            <td className="adm-mono">{(entry as HttpLogEntry).clientIp ?? '—'}</td>
            <td className="adm-muted">{(entry as HttpLogEntry).duration != null ? `${(entry as HttpLogEntry).duration}ms` : '—'}</td>
          </>
        )}
        {kind === 'ai' && (
          <>
            <td>
              <span className="adm-badge adm-badge-ai">{(entry as AiLogEntry).eventType}</span>
            </td>
            <td className="adm-mono">
              {((entry as AiLogEntry).conversationId ?? '').slice(-8) || '—'}
            </td>
            <td className="adm-muted" style={{ maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {(entry as AiLogEntry).message ?? '—'}
            </td>
          </>
        )}
        {kind === 'tool' && (
          <>
            <td className="adm-mono">{(entry as ToolLogEntry).toolName}</td>
            <td>
              <span className={`adm-badge ${(entry as ToolLogEntry).success ? 'adm-badge-success' : 'adm-badge-danger'}`}>
                {(entry as ToolLogEntry).success ? 'OK' : 'FAIL'}
              </span>
            </td>
            <td className="adm-muted">{(entry as ToolLogEntry).duration != null ? `${(entry as ToolLogEntry).duration}ms` : '—'}</td>
            <td className="adm-muted" style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {(entry as ToolLogEntry).errorMessage ?? '—'}
            </td>
          </>
        )}
      </tr>
      {expanded && (
        <tr>
          <td colSpan={8} style={{ background: '#f8fafc' }}>
            <div style={{ padding: '4px 12px 12px', fontSize: 12.5 }}>
              {kind === 'http' && (
                <>
                  <div className="adm-row" style={{ gap: 16, flexWrap: 'wrap', marginTop: 6 }}>
                    {(entry as HttpLogEntry).username && (
                      <span className="adm-muted">{t('admin.user')}<strong>{(entry as HttpLogEntry).username}</strong></span>
                    )}
                    {(entry as HttpLogEntry).userAgent && (
                      <span className="adm-muted" style={{ maxWidth: 420, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        UA: {(entry as HttpLogEntry).userAgent}
                      </span>
                    )}
                    {(entry as HttpLogEntry).contentLength != null && (
                      <span className="adm-muted">Response: {((entry as HttpLogEntry).contentLength ?? 0) / 1024 >= 1 ? `${((entry as HttpLogEntry).contentLength! / 1024).toFixed(1)} KB` : `${(entry as HttpLogEntry).contentLength} B`}</span>
                    )}
                  </div>
                  <Pre label={t('admin.requestBody')} value={(entry as HttpLogEntry).requestBody} />
                  <Pre label={t('admin.responseBody')} value={(entry as HttpLogEntry).responseBody} />
                  <Pre label={t('admin.requestHeaders')} value={(entry as HttpLogEntry).requestHeaders} />
                </>
              )}
              {kind === 'ai' && (
                <>
                  <Pre label={t('admin.details')} value={(entry as AiLogEntry).details} />
                  {(entry as AiLogEntry).message && (
                    <div>
                      <p style={{ fontWeight: 650, margin: '10px 0 4px' }}>{t('admin.fullMessage')}</p>
                      <p className="adm-muted" style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{(entry as AiLogEntry).message}</p>
                    </div>
                  )}
                </>
              )}
              {kind === 'tool' && (
                <>
                  {(entry as ToolLogEntry).requestUrl && (
                    <p style={{ margin: '8px 0 0' }}>
                      <strong>{t('admin.request')}</strong>
                      <code className="adm-mono">{(entry as ToolLogEntry).requestMethod ?? 'POST'} {(entry as ToolLogEntry).requestUrl}</code>
                    </p>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <Pre label={t('admin.requestHeaders')} value={(entry as ToolLogEntry).requestHeaders} />
                    <Pre label={t('admin.requestBody')} value={(entry as ToolLogEntry).requestBody} />
                    <div>
                      <p style={{ fontWeight: 650, margin: '10px 0 4px' }}>{t('admin.responseStatus')}</p>
                      <p className="adm-muted" style={{ margin: 0 }}>{(entry as ToolLogEntry).responseStatus ?? '—'}</p>
                    </div>
                    <Pre label={t('admin.responseBody')} value={(entry as ToolLogEntry).responseBody} />
                  </div>
                  {(entry as ToolLogEntry).errorMessage && (
                    <Pre label={t('admin.errorMessage')} value={(entry as ToolLogEntry).errorMessage} />
                  )}
                </>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
