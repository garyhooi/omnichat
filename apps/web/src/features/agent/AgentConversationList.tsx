import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ShieldAlert } from 'lucide-react'
import type { Conversation } from '../../shared/types/models'
import { parseConversationMetadata } from '../../shared/types/models'
import { formatTicketId, timeAgo, truncate } from '../../shared/lib/format'

export type AgentTab = 'active' | 'ai' | 'specialist'

export interface AgentConversationListProps {
  conversations: Conversation[]
  currentUsername: string
  activeTab: AgentTab
  onTabChange: (tab: AgentTab) => void
  onSelect: (conversationId: string) => void
}

const TABS: { key: AgentTab; labelKey: string }[] = [
  { key: 'active', labelKey: 'agent.tabActive' },
  { key: 'ai', labelKey: 'agent.tabAi' },
  { key: 'specialist', labelKey: 'agent.tabSpecialist' },
]

export function visitorLabel(c: Conversation): string {
  return parseConversationMetadata(c).visitorName || ''
}

function previewOf(c: Conversation): string {
  const msg = c.messages?.[0]
  if (!msg) return ''
  if (msg.messageType === 'image') return '📷'
  return truncate(msg.content || '', 46)
}

/** Tabs + conversation rows with unread badges, status chips and blacklist warning. */
export function AgentConversationList({
  conversations,
  currentUsername,
  activeTab,
  onTabChange,
  onSelect,
}: AgentConversationListProps) {
  const { t } = useTranslation()
  const tabs: { key: AgentTab; label: string }[] = useMemo(
    () => TABS.map((tab) => ({ key: tab.key, label: t(tab.labelKey) })),
    [t],
  )
  const visible = useMemo(() => {
    const sorted = [...conversations].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    switch (activeTab) {
      case 'ai':
        return sorted.filter((c) => c.status === 'ai')
      case 'specialist':
        return sorted.filter(
          (c) => c.status === 'specialist' && c.specialistUsername === currentUsername,
        )
      default:
        // Active = conversations currently handled by a HUMAN agent. AI-handled
        // conversations have their own tab and must not pollute this list.
        return sorted.filter((c) => c.status === 'active')
    }
  }, [activeTab, conversations, currentUsername])

  const countFor = (tab: AgentTab) => {
    if (tab === 'ai') return conversations.filter((c) => c.status === 'ai').length
    if (tab === 'specialist')
      return conversations.filter(
        (c) => c.status === 'specialist' && c.specialistUsername === currentUsername,
      ).length
    // Active tab = human-agent conversations only (AI has its own tab).
    return conversations.filter((c) => c.status === 'active').length
  }

  return (
    <>
      <div className="aw-tabs" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            className={`aw-tab ${activeTab === tab.key ? 'aw-active' : ''}`}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label} ({countFor(tab.key)})
          </button>
        ))}
      </div>

      <div className="aw-conv-list">
        {visible.length === 0 ? (
          <div className="aw-conv-empty">
            {activeTab === 'ai'
              ? t('agent.noAiConvs')
              : activeTab === 'specialist'
                ? t('agent.noSpecialistConvs')
                : t('agent.noActiveConvs')}
          </div>
        ) : (
          visible.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`aw-conv-item ${c.isIpBlacklisted ? 'aw-conv-blacklisted' : ''}`}
              onClick={() => onSelect(c.id)}
            >
              <div className="aw-conv-item-top">
                <span className="aw-conv-name">{visitorLabel(c) || t('agent.visitor')}</span>
                <span className={`aw-status-chip aw-status-${c.status}`}>
                  {c.status === 'ai'
                    ? t('common.statusAi')
                    : c.status === 'specialist'
                      ? t('common.statusSpecialist')
                      : t('common.statusActive')}
                </span>
                <span className="aw-conv-time">{timeAgo(c.updatedAt)}</span>
              </div>
              <div className="aw-conv-item-bottom">
                <span className="aw-conv-preview">
                  {c.isIpBlacklisted && (
                    <ShieldAlert
                      size={12}
                      style={{ verticalAlign: '-2px', marginRight: 4, color: '#ef4444' }}
                    />
                  )}
                  {previewOf(c) || t('common.noMessages')}
                </span>
                {(c.unreadCount ?? 0) > 0 && (
                  <span className="aw-conv-unread">{Math.min(c.unreadCount ?? 0, 99)}</span>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </>
  )
}

export { formatTicketId }
