// =============================================================================
// Admin portal shell — sidebar navigation, auth guard, page routing.
// =============================================================================

import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  BarChart3,
  Bot,
  BookOpen,
  Files,
  Gauge,
  Headset,
  LogOut,
  MessageSquare,
  Settings,
  Users,
} from 'lucide-react'
import { useApplyUiLang } from '../shared/hooks/useUiLang'
import { useSiteConfig } from '../features/chat/hooks/useSiteConfig'
import { useAgentIncomingSound } from '../features/agent/useAgentIncomingSound'
import { ADMIN_MUTED_KEY } from '../shared/lib/storage'
import { useAuth } from './auth'
import { AdminDataProvider, useAdminData } from './AdminDataProvider'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { ConversationsPage } from './pages/ConversationsPage'
import { UsersPage } from './pages/UsersPage'
import { SettingsPage } from './pages/SettingsPage'
import { LogsPage } from './pages/LogsPage'
import { AiSetupPage } from './pages/AiSetupPage'
import { KnowledgeBasePage } from './pages/KnowledgeBasePage'
import { ReportPage } from './pages/ReportPage'

type PageKey = 'conversations' | 'dashboard' | 'report' | 'ai' | 'knowledge' | 'logs' | 'users' | 'settings'

export interface AdminAppProps {
  /** Element [lang] attribute from the admin portal (optional). */
  lang?: string
}

export function AdminApp({ lang }: AdminAppProps) {
  const { serverUrl, user, initializing } = useAuth()

  if (!serverUrl) return <LoginPage />
  if (initializing) {
    return (
      <div className="adm-center" style={{ minHeight: '100%' }}>
        <span className="adm-spinner" />
      </div>
    )
  }
  if (!user) return <LoginPage />

  return (
    <AdminDataProvider serverUrl={serverUrl}>
      <Shell lang={lang} />
    </AdminDataProvider>
  )
}

/** The authenticated shell — must live inside AdminDataProvider. */
function Shell({ lang }: { lang?: string }) {
  const { t } = useTranslation()
  const { user: currentUser, logout, serverUrl } = useAuth()
  const { config: siteConfig } = useSiteConfig(serverUrl)
  // Admin-controlled operator UI language (site config → Widget Setup).
  // The element's [lang] attribute still overrides it per embed.
  useApplyUiLang(lang, siteConfig?.adminLanguage)
  const { conversations, socket } = useAdminData()
  const [page, setPage] = useState<PageKey>('conversations')
  const [collapsed, setCollapsed] = useState(false)

  // Incoming-message notification sound — mounted here in the shell (not in the
  // Conversations page) so alerts keep ringing while the operator is on any
  // page (Settings, Users, Logs…). Mute toggle lives in the sidebar footer
  // (persisted under the legacy omnichat_admin_muted key).
  const { muted, toggleMuted } = useAgentIncomingSound({
    serverUrl,
    mutedKey: ADMIN_MUTED_KEY,
    soundUrl: siteConfig?.agentNotificationSoundUrl || siteConfig?.visitorNotificationSoundUrl || null,
    socket,
    conversations,
    openConversationId: socket.openConversationId,
  })

  const user = currentUser!
  const totalUnread = useMemo(
    () =>
      conversations
        .filter((c) => c.status === 'active' || c.status === 'ai' || c.status === 'specialist')
        .reduce((sum, c) => sum + (c.unreadCount ?? 0), 0),
    [conversations],
  )

  const nav = useMemo(
    () =>
      [
        { key: 'conversations' as const, labelKey: 'admin.conversations', icon: <MessageSquare size={16} />, adminOnly: false },
        { key: 'dashboard' as const, labelKey: 'admin.dashboard', icon: <Gauge size={16} />, adminOnly: false },
        { key: 'report' as const, labelKey: 'admin.report', icon: <BarChart3 size={16} />, adminOnly: true },
        { key: 'ai' as const, labelKey: 'admin.aiSetup', icon: <Bot size={16} />, adminOnly: true },
        { key: 'knowledge' as const, labelKey: 'admin.knowledgeBase', icon: <BookOpen size={16} />, adminOnly: true },
        { key: 'logs' as const, labelKey: 'admin.logs', icon: <Files size={16} />, adminOnly: false },
        { key: 'users' as const, labelKey: 'admin.users', icon: <Users size={16} />, adminOnly: true },
        { key: 'settings' as const, labelKey: 'admin.settings', icon: <Settings size={16} />, adminOnly: false },
      ].filter((item) => !item.adminOnly || user?.role === 'admin' || user?.role === 'developer'),
    [user?.role],
  )

  const navItems = useMemo(
    () => nav.map((item) => ({ ...item, label: t(item.labelKey) })),
    [nav, t],
  )

  return (
    <div className="adm-shell">
      <aside className={`adm-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="adm-sidebar-head">
          <span className="adm-sidebar-brand" style={{ display: collapsed ? 'none' : undefined }}>
            <Headset size={17} style={{ verticalAlign: '-3px', marginRight: 6, color: '#818cf8' }} />
            OmniChat
          </span>
          <button
            className="adm-btn adm-btn-sm"
            style={{ background: 'none', border: 'none', color: '#9ca3af' }}
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? t('admin.expandSidebar') : t('admin.collapseSidebar')}
          >
            {collapsed ? <ArrowRightCircle size={16} /> : <ArrowLeftCircle size={16} />}
          </button>
        </div>

        <nav className="adm-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`adm-nav-item ${page === item.key ? 'active' : ''}`}
              onClick={() => setPage(item.key)}
              title={collapsed ? item.label : undefined}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
              {item.key === 'conversations' && totalUnread > 0 && (
                <span className="adm-badge adm-badge-danger">{totalUnread > 99 ? '99+' : totalUnread}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="adm-sidebar-foot">
          {!collapsed && (
            <div className="adm-sidebar-user">
              <strong>{user.displayName || user.username}</strong>
              <span>{user.role}</span>
            </div>
          )}
          <button
            type="button"
            className="adm-btn adm-btn-sm"
            style={{ background: 'none', border: 'none', color: '#9ca3af' }}
            onClick={toggleMuted}
            title={muted ? t('common.unmute') : t('common.mute')}
            aria-label={muted ? t('common.unmute') : t('common.mute')}
          >
            {muted ? '🔕' : '🔔'}
          </button>
          <button
            className="adm-btn adm-btn-sm"
            style={{ background: 'none', border: 'none', color: '#9ca3af' }}
            onClick={() => void logout()}
            title={t('admin.logout')}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      <main className="adm-main">
        {page === 'conversations' && <ConversationsPage />}
        {page === 'dashboard' && <DashboardPage />}
        {page === 'report' && <ReportPage />}
        {page === 'ai' && <AiSetupPage />}
        {page === 'knowledge' && <KnowledgeBasePage />}
        {page === 'logs' && <LogsPage />}
        {page === 'users' && <UsersPage />}
        {page === 'settings' && <SettingsPage />}
      </main>
    </div>
  )
}
