import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ShieldAlert, Search } from 'lucide-react'
import type { Conversation } from '../../shared/types/models'
import { parseConversationMetadata } from '../../shared/types/models'
import { formatTicketId, timeAgo, truncate } from '../../shared/lib/format'
import { useAdminData } from '../AdminDataProvider'
import { useAuth } from '../auth'
import { useSiteAccent } from '../accent'
import { useSiteConfig } from '../../features/chat/hooks/useSiteConfig'
import { AgentChatView } from '../../features/agent/AgentChatView'

type StatusTab = 'active' | 'ai' | 'specialist' | 'resolved'

const TABS: { key: StatusTab; labelKey: string }[] = [
  { key: 'active', labelKey: 'common.statusActive' },
  { key: 'ai', labelKey: 'common.statusAi' },
  { key: 'specialist', labelKey: 'common.statusSpecialist' },
  { key: 'resolved', labelKey: 'common.statusResolved' },
]

function visitorLabel(c: Conversation): string {
  return parseConversationMetadata(c).visitorName || ''
}

function visitorEmail(c: Conversation): string | null {
  return parseConversationMetadata(c).visitorEmail || null
}

/**
 * Conversations table — status tabs, smart search (#ticket / @username /
 * free text over name/email/remarks), and a chat drawer for replies.
 */
export function ConversationsPage() {
  const { t } = useTranslation()
  const { socket, conversations, loaded, agents } = useAdminData()
  const { serverUrl } = useAuth()
  const accentColor = useSiteAccent(serverUrl)
  const { config: siteConfig } = useSiteConfig(serverUrl)
  const [tab, setTab] = useState<StatusTab>('active')
  const [searchQuery, setSearchQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)

  // The shell-level notification sound + read receipts key off the socket's
  // open conversation. Leaving this page must release it, otherwise alerts for
  // that conversation would stay suppressed while the operator is elsewhere and
  // its unread badge would stop counting.
  const socketRef = useRef(socket)
  useEffect(() => {
    socketRef.current = socket
  })
  useEffect(() => () => socketRef.current.closeConversation(), [])

  // Resolved-tab date-range filter (legacy parity). Applied both server-side
  // (re-fetch through list_conversations with the window) and client-side as a
  // fallback, so the UI narrows immediately and the server sends only that slice.
  const [resolvedStart, setResolvedStart] = useState('')
  const [resolvedEnd, setResolvedEnd] = useState('')
  const [resolvedDefaulted, setResolvedDefaulted] = useState(false)

  const applyResolvedDateRange = useCallback(
    (range: { start?: string; end?: string }) => {
      socket.listConversations('resolved', range)
    },
    [socket],
  )

  const todayIso = () => {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return y + '-' + m + '-' + day
  }

  const handleTabChange = useCallback(
    (next: StatusTab) => {
      setTab(next)
      if (next === 'resolved') {
        if (!resolvedDefaulted) {
          const today = todayIso()
          setResolvedDefaulted(true)
          setResolvedStart(today)
          setResolvedEnd(today)
          applyResolvedDateRange({ start: today, end: today })
        } else {
          // Re-entering the Resolved tab: the shared list was replaced by the
          // other tab's fetch on the way out — re-fetch with the held window.
          applyResolvedDateRange({ start: resolvedStart || undefined, end: resolvedEnd || undefined })
        }
      } else {
        // Leaving the Resolved tab → fetch the clicked status list without the
        // date window (active / AI / specialist are live lists).
        socket.listConversations(next)
      }
    },
    [applyResolvedDateRange, resolvedDefaulted, resolvedStart, resolvedEnd, socket],
  )

  const filtered = useMemo(() => {
    let list = conversations.filter((c) => {
      if (tab === 'specialist') {
        return c.status === 'specialist' && c.specialistUsername === socket.currentUser?.username
      }
      return c.status === tab
    })

    // Client-side fallback for the server-side resolved date window, so the
    // table narrows immediately and stays correct while the refetch is in flight.
    if (tab === 'resolved' && (resolvedStart || resolvedEnd)) {
      const start = resolvedStart ? new Date(resolvedStart + 'T00:00:00') : null
      const end = resolvedEnd ? new Date(resolvedEnd + 'T23:59:59.999') : null
      list = list.filter((c) => {
        const d = new Date(c.updatedAt).getTime()
        if (start && d < start.getTime()) return false
        if (end && d > end.getTime()) return false
        return true
      })
    }

    const rawQ = searchQuery.trim()
    if (rawQ) {
      const isUsernameSearch = rawQ.startsWith('@')
      const isTicketSearch = rawQ.startsWith('#')
      const q = (isUsernameSearch || isTicketSearch ? rawQ.slice(1) : rawQ).toLowerCase()

      list = list.filter((c) => {
        const assigned = (c.assignedUsername || '').toLowerCase()
        const specialist = (c.specialistUsername || '').toLowerCase()
        const id = c.id.toLowerCase()
        const ticketId = c.id.slice(-8).toLowerCase()

        if (isUsernameSearch) return assigned.includes(q) || specialist.includes(q)
        if (isTicketSearch) return id.includes(q) || ticketId.includes(q)

        return (
          visitorLabel(c).toLowerCase().includes(q) ||
          (visitorEmail(c) ?? '').toLowerCase().includes(q) ||
          assigned.includes(q) ||
          specialist.includes(q) ||
          (c.agentRemarks || '').toLowerCase().includes(q) ||
          id.includes(q) ||
          ticketId.includes(q)
        )
      })
    }

    return [...list].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }, [conversations, resolvedEnd, resolvedStart, searchQuery, socket.currentUser?.username, tab])

  const openConversation = conversations.find((c) => c.id === openId) ?? null

  const handleOpen = useCallback(
    (id: string) => {
      setOpenId(id)
      socket.openConversation(id)
    },
    [socket],
  )

  const handleBack = useCallback(() => {
    setOpenId(null)
    socket.closeConversation()
  }, [socket])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div className="adm-page-head">
        <div>
          <h1 className="adm-page-title">{t('admin.conversations')}</h1>
          <p className="adm-page-sub">
            {loaded ? `${conversations.length} total · ${filtered.length} shown` : t('common.connecting')}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {tab === 'resolved' && (
            <div className="adm-row" style={{ gap: 6, alignItems: 'center' }}>
              <input
                type="date"
                className="adm-input"
                title={t('admin.startDate')}
                aria-label={t('admin.startDate')}
                value={resolvedStart}
                max={resolvedEnd || undefined}
                onChange={(e) => {
                  const v = e.target.value
                  setResolvedStart(v)
                  // Keep the range valid: if start moves past end, pull end forward.
                  if (v && resolvedEnd && v > resolvedEnd) {
                    setResolvedEnd(v)
                    applyResolvedDateRange({ start: v, end: v })
                  } else {
                    applyResolvedDateRange({ start: v || undefined, end: resolvedEnd || undefined })
                  }
                }}
              />
              <span style={{ color: '#94a3b8', fontSize: 12 }}>{t('admin.to')}</span>
              <input
                type="date"
                className="adm-input"
                title={t('admin.endDate')}
                aria-label={t('admin.endDate')}
                value={resolvedEnd}
                min={resolvedStart || undefined}
                onChange={(e) => {
                  const v = e.target.value
                  setResolvedEnd(v)
                  // Keep the range valid: if end moves before start, pull start back.
                  if (v && resolvedStart && v < resolvedStart) {
                    setResolvedStart(v)
                    applyResolvedDateRange({ start: v, end: v })
                  } else {
                    applyResolvedDateRange({ start: resolvedStart || undefined, end: v || undefined })
                  }
                }}
              />
            </div>
          )}
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: 9, color: '#94a3b8' }} />
            <input
              className="adm-input"
              style={{ width: 280, paddingLeft: 32 }}
              placeholder={t('admin.searchConversations')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Two-pane layout: the table scrolls internally, the chat drawer fills
          the remaining height — fits any container the portal is embedded in. */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, minWidth: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div className="adm-tabs" role="tablist">
            {TABS.map((tb) => (
              <button
                key={tb.key}
                type="button"
                role="tab"
                aria-selected={tab === tb.key}
                className={`adm-tab ${tab === tb.key ? 'active' : ''}`}
                onClick={() => handleTabChange(tb.key)}
              >
                {t(tb.labelKey)}
              </button>
            ))}
          </div>

          <div className="adm-table-wrap" style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
            <table className="adm-table">
              <thead>
                <tr>
                  <th>{t('admin.visitor')}</th>
                  <th>{t('admin.ticket')}</th>
                  <th>{t('admin.lastMessage')}</th>
                  <th>{t('admin.status')}</th>
                  <th>{t('common.agent')}</th>
                  <th>{t('admin.updated')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="adm-empty">
                        {loaded ? t('admin.noConversations') : t('common.connecting')}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr
                      key={c.id}
                      className={`clickable ${c.id === openId ? 'adm-row-active' : ''}`}
                      onClick={() => handleOpen(c.id)}
                    >
                      <td>
                        <strong>{visitorLabel(c) || t('agent.visitor')}</strong>
                        <div className="adm-muted" style={{ fontSize: 12 }}>
                          {visitorEmail(c) ?? t('agent.noEmail')}
                        </div>
                      </td>
                      <td className="adm-mono">#{formatTicketId(c.id)}</td>
                      <td style={{ maxWidth: 260 }}>
                        <span className="adm-muted">
                          {c.isIpBlacklisted && (
                            <ShieldAlert size={12} style={{ verticalAlign: '-2px', marginRight: 4, color: '#ef4444' }} />
                          )}
                          {truncate(c.messages?.[0]?.content || t('common.noMessages'), 60)}
                        </span>
                        {c.agentRemarks && (
                          <div
                            className="adm-muted"
                            style={{ fontSize: 11, marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--adm-accent)' }}
                            title={c.agentRemarks}
                          >
                            📝 {c.agentRemarks}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`adm-badge adm-badge-${c.status}`}>
                          {c.status === 'ai'
                            ? t('common.statusAi')
                            : c.status === 'active'
                              ? t('common.statusActive')
                              : c.status === 'specialist'
                                ? t('common.statusSpecialist')
                                : t('common.statusResolved')}
                        </span>
                      </td>
                      <td className="adm-muted">{c.assignedUsername || c.specialistUsername || '—'}</td>
                      <td className="adm-muted">{timeAgo(c.updatedAt)}</td>
                      <td>
                        {(c.unreadCount ?? 0) > 0 && (
                          <span className="adm-badge adm-badge-danger">{c.unreadCount}</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {openConversation && (
          <div style={{ width: 520, flex: 'none', alignSelf: 'stretch' }}>
            <div
              className="adm-card"
              style={{
                padding: 0,
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <AgentChatView
                socket={socket}
                serverUrl={serverUrl}
                conversationId={openConversation.id}
                conversation={openConversation}
                agents={agents.map((a) => ({ username: a.username, displayName: a.displayName }))}
                currentUserUsername={socket.currentUser?.username ?? ''}
                accentColor={accentColor}
                translationsEnabled={siteConfig?.translationEnabled !== false}
                onBack={handleBack}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
