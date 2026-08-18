import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Lock, LockOpen, Plus, Search, Shield, Trash2, X } from 'lucide-react'
import { useAuth } from '../auth'
import { authFetchJson } from '../../shared/lib/api-client'
import type { AdminUser } from '../../shared/types/models'

const usersKey = (serverUrl: string) => ['admin-users', serverUrl] as const

/** User management — list, create, lock/unlock, revoke sessions. */
export function UsersPage() {
  const { t } = useTranslation()
  const { serverUrl, isAdmin, isDeveloper } = useAuth()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [newUser, setNewUser] = useState({ username: '', displayName: '', password: '', role: 'agent' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [roleUser, setRoleUser] = useState<AdminUser | null>(null)
  const [roleValue, setRoleValue] = useState('')

  const { data: users, isLoading } = useQuery<AdminUser[]>({
    queryKey: usersKey(serverUrl),
    staleTime: 30_000,
    queryFn: () => authFetchJson<AdminUser[]>(`${serverUrl}/admin/users`),
  })

  const canManage = isAdmin || isDeveloper

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const refresh = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: usersKey(serverUrl) })
  }, [queryClient, serverUrl])

  const toggleLock = useCallback(
    async (user: AdminUser) => {
      setBusy(true)
      try {
        await authFetchJson(`${serverUrl}/admin/users/${user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isLocked: !user.isLocked }),
        })
        refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to update user')
      } finally {
        setBusy(false)
      }
    },
    [refresh, serverUrl],
  )

  const revokeSessions = useCallback(
    async (user: AdminUser) => {
      if (!confirm(t('admin.revokeConfirm', { name: user.username }))) return
      setBusy(true)
      try {
        await authFetchJson(`${serverUrl}/admin/users/${user.id}/sessions`, { method: 'DELETE' })
        refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to revoke sessions')
      } finally {
        setBusy(false)
      }
    },
    [refresh, serverUrl, t],
  )

  const createUser = useCallback(async () => {
    if (!newUser.username.trim() || !newUser.password) {
      setError(t('admin.usernamePasswordRequired'))
      return
    }
    setBusy(true)
    try {
      await authFetchJson(`${serverUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      })
      setShowCreate(false)
      setNewUser({ username: '', displayName: '', password: '', role: 'agent' })
      refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create user')
    } finally {
      setBusy(false)
    }
  }, [newUser, refresh, serverUrl, t])

  const changeRole = useCallback(async () => {
    if (!roleUser) return
    setBusy(true)
    try {
      await authFetchJson(`${serverUrl}/admin/users/${roleUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: roleValue }),
      })
      setRoleUser(null)
      refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to change role')
    } finally {
      setBusy(false)
    }
  }, [refresh, roleUser, roleValue, serverUrl])

  const filtered = (users ?? []).filter(
    (u) =>
      !search ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.displayName.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div>
      <div className="adm-page-head">
        <div>
          <h1 className="adm-page-title">{t('admin.users')}</h1>
          <p className="adm-page-sub">{users?.length ?? 0} agents · admins · developers</p>
        </div>
        <div className="adm-row">
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: 9, color: '#94a3b8' }} />
            <input
              className="adm-input"
              style={{ paddingLeft: 32 }}
              placeholder={t('admin.searchUsers')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {isDeveloper && (
            <button type="button" className="adm-btn adm-btn-primary" onClick={() => setShowCreate((v) => !v)}>
              <Plus size={15} /> {t('admin.newUser')}
            </button>
          )}
        </div>
      </div>

      {showCreate && (
        <div className="adm-card" style={{ marginBottom: 14 }}>
          <div className="adm-grid adm-grid-4">
            <div>
              <label className="adm-label">{t('admin.usernameLabel')}</label>
              <input
                className="adm-input"
                style={{ width: '100%' }}
                value={newUser.username}
                onChange={(e) => setNewUser((s) => ({ ...s, username: e.target.value }))}
              />
            </div>
            <div>
              <label className="adm-label">{t('admin.displayName')}</label>
              <input
                className="adm-input"
                style={{ width: '100%' }}
                value={newUser.displayName}
                onChange={(e) => setNewUser((s) => ({ ...s, displayName: e.target.value }))}
              />
            </div>
            <div>
              <label className="adm-label">{t('admin.password')}</label>
              <input
                className="adm-input"
                style={{ width: '100%' }}
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser((s) => ({ ...s, password: e.target.value }))}
              />
            </div>
            <div>
              <label className="adm-label">{t('admin.role')}</label>
              <select
                className="adm-select"
                style={{ width: '100%' }}
                value={newUser.role}
                onChange={(e) => setNewUser((s) => ({ ...s, role: e.target.value }))}
              >
                <option value="agent">agent</option>
                <option value="admin">admin</option>
                <option value="developer">developer</option>
              </select>
            </div>
          </div>
          <div className="adm-row" style={{ marginTop: 12 }}>
            <button type="button" className="adm-btn adm-btn-primary" onClick={() => void createUser()} disabled={busy}>
              {t('admin.createUser')}
            </button>
            <button type="button" className="adm-btn" onClick={() => setShowCreate(false)}>
              {t('common.cancel')}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="adm-card" style={{ borderColor: '#fecaca', background: '#fef2f2', marginBottom: 14 }}>
          <span style={{ color: '#991b1b', fontSize: 13 }}>{error}</span>
        </div>
      )}

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>{t('admin.userHeader')}</th>
              <th>{t('admin.role')}</th>
              <th>{t('admin.status')}</th>
              <th>{t('admin.lastSeen')}</th>
              <th>{t('admin.sessions')}</th>
              <th>{t('admin.created')}</th>
              {canManage && <th></th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7}>
                  <div className="adm-center">
                    <span className="adm-spinner" />
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <strong>{u.displayName}</strong>
                    <div className="adm-muted" style={{ fontSize: 12 }}>
                      @{u.username}
                    </div>
                  </td>
                  <td>
                    {canManage ? (
                      <button
                        type="button"
                        className="adm-badge adm-badge-neutral"
                        style={{ border: 'none', cursor: 'pointer' }}
                        title={t('admin.changeRole')}
                        onClick={() => {
                          setRoleUser(u)
                          setRoleValue(u.role)
                        }}
                      >
                        {u.role}
                      </button>
                    ) : (
                      <span className="adm-badge adm-badge-neutral">{u.role}</span>
                    )}
                  </td>
                  <td>
                    {u.isLocked ? (
                      <span className="adm-badge adm-badge-danger">{t('admin.locked')}</span>
                    ) : u.effectiveOnline ? (
                      <span className="adm-badge adm-badge-success">{t('admin.online')}</span>
                    ) : (
                      <span className="adm-badge adm-badge-neutral">{t('admin.offline')}</span>
                    )}
                  </td>
                  <td className="adm-muted">{u.lastSeenAt ? new Date(u.lastSeenAt).toLocaleString() : '—'}</td>
                  <td className="adm-muted">{u.activeSessions}</td>
                  <td className="adm-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                  {canManage && (
                    <td>
                      <div className="adm-row" style={{ gap: 4 }}>
                        <button
                          className="adm-btn adm-btn-sm"
                          title={u.isLocked ? t('admin.unlock') : t('admin.lock')}
                          onClick={() => void toggleLock(u)}
                          disabled={busy}
                        >
                          {u.isLocked ? <LockOpen size={14} /> : <Lock size={14} />}
                        </button>
                        <button
                          className="adm-btn adm-btn-sm"
                          title={t('admin.revokeSessions')}
                          onClick={() => void revokeSessions(u)}
                          disabled={busy}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Role change modal */}
      {roleUser && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background: 'rgb(15 23 42 / 0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
          onClick={() => setRoleUser(null)}
        >
          <div
            className="adm-card"
            style={{ width: 360, maxWidth: '100%', padding: 18 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="adm-flex-between" style={{ marginBottom: 12 }}>
              <h2 className="adm-card-title" style={{ margin: 0 }}>
                {t('admin.changeRole')} — @{roleUser.username}
              </h2>
              <button type="button" className="adm-btn adm-btn-sm" onClick={() => setRoleUser(null)}>
                <X size={13} />
              </button>
            </div>
            <select
              className="adm-select"
              style={{ width: '100%' }}
              value={roleValue}
              onChange={(e) => setRoleValue(e.target.value)}
            >
              <option value="agent">agent</option>
              <option value="admin">admin</option>
              <option value="developer" disabled={!isDeveloper}>
                developer{!isDeveloper ? ' (developer only)' : ''}
              </option>
            </select>
            <div className="adm-row" style={{ marginTop: 14, justifyContent: 'flex-end' }}>
              <button type="button" className="adm-btn" onClick={() => setRoleUser(null)}>
                {t('common.cancel')}
              </button>
              <button type="button" className="adm-btn adm-btn-primary" onClick={() => void changeRole()} disabled={busy || roleValue === roleUser.role}>
                <Shield size={14} /> {busy ? t('admin.saving') : t('admin.saveRole')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
