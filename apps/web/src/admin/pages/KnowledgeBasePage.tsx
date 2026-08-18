import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Eye, FileUp, Pencil, Search, Trash2, X } from 'lucide-react'
import { useAuth } from '../auth'
import { authFetch, authFetchJson } from '../../shared/lib/api-client'
import { formatBytes } from '../../shared/lib/format'
import type { KnowledgeDocument, KnowledgeSearchResult } from '../../shared/types/api'

const kbKey = (serverUrl: string) => ['knowledge', serverUrl] as const

const STATUS_BADGE: Record<string, string> = {
  pending: 'adm-badge-neutral',
  processing: 'adm-badge-ai',
  completed: 'adm-badge-success',
  failed: 'adm-badge-danger',
}

const STATUS_KEYS: Record<string, string> = {
  pending: 'admin.kbStatusPending',
  processing: 'admin.kbStatusProcessing',
  completed: 'admin.kbStatusCompleted',
  failed: 'admin.kbStatusFailed',
}

const TEMPLATES = [
  { nameKey: 'admin.tplCompany', file: 'company-info.md', descKey: 'admin.tplCompanyDesc' },
  { nameKey: 'admin.tplProduct', file: 'product-faq.md', descKey: 'admin.tplProductDesc' },
  { nameKey: 'admin.tplReturn', file: 'return-policy.md', descKey: 'admin.tplReturnDesc' },
  { nameKey: 'admin.tplGeneral', file: 'general-faq.md', descKey: 'admin.tplGeneralDesc' },
]

/** Knowledge Base (RAG) — upload, edit, view, delete documents, and search test. */
export function KnowledgeBasePage() {
  const { t } = useTranslation()
  const { serverUrl } = useAuth()
  const queryClient = useQueryClient()
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [title, setTitle] = useState('')
  const [uploading, setUploading] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [noticeKind, setNoticeKind] = useState<'ok' | 'err'>('ok')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<KnowledgeSearchResult[] | null>(null)
  const [searching, setSearching] = useState(false)

  // View / edit state — content is fetched per document via GET /:id.
  const [viewing, setViewing] = useState<KnowledgeDocument | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editFile, setEditFile] = useState<File | null>(null)
  const [loadingDoc, setLoadingDoc] = useState(false)
  const [savingEdit, setSavingEdit] = useState(false)
  const editFileRef = useRef<HTMLInputElement | null>(null)

  const { data: documents, isLoading } = useQuery<KnowledgeDocument[]>({
    queryKey: kbKey(serverUrl),
    queryFn: () => authFetchJson<KnowledgeDocument[]>(`${serverUrl}/ai/knowledge/documents`),
  })

  const invalidate = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: kbKey(serverUrl) })
  }, [queryClient, serverUrl])

  const notify = useCallback((m: string, kind: 'ok' | 'err' = 'ok') => {
    setNotice(m)
    setNoticeKind(kind)
    setTimeout(() => setNotice(null), 5000)
  }, [])

  const upload = useCallback(
    async (file: File) => {
      setUploading(true)
      try {
        const formData = new FormData()
        formData.append('file', file)
        if (title.trim()) formData.append('title', title.trim())
        const res = await authFetch(`${serverUrl}/ai/knowledge/documents`, {
          method: 'POST',
          body: formData,
        })
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { message?: string }
          throw new Error(body.message ?? `Upload failed (${res.status})`)
        }
        setTitle('')
        invalidate()
        notify(t('admin.kbUploadedNotice'))
      } catch (e) {
        notify(e instanceof Error ? e.message : 'Upload failed', 'err')
      } finally {
        setUploading(false)
        if (fileRef.current) fileRef.current.value = ''
      }
    },
    [invalidate, notify, serverUrl, t, title],
  )

  const remove = useCallback(
    async (id: string) => {
      if (!confirm(t('admin.kbDeleteConfirm'))) return
      await authFetchJson(`${serverUrl}/ai/knowledge/documents/${id}`, { method: 'DELETE' })
      invalidate()
      notify(t('admin.kbDeletedNotice'))
    },
    [invalidate, notify, serverUrl, t],
  )

  /** Fetch full content for a document (list responses omit it). */
  const fetchDocument = useCallback(
    async (id: string): Promise<KnowledgeDocument> => {
      const cached = documents?.find((d) => d.id === id)
      if (cached?.content) return cached
      return authFetchJson<KnowledgeDocument>(`${serverUrl}/ai/knowledge/documents/${id}`)
    },
    [documents, serverUrl],
  )

  const openView = useCallback(
    async (id: string) => {
      setLoadingDoc(true)
      try {
        setViewing(await fetchDocument(id))
      } catch (e) {
        notify(e instanceof Error ? e.message : 'Failed to load document', 'err')
      } finally {
        setLoadingDoc(false)
      }
    },
    [fetchDocument, notify],
  )

  const openEdit = useCallback(
    async (doc: KnowledgeDocument) => {
      setEditingId(doc.id)
      setEditTitle(doc.title)
      setEditContent('')
      setEditFile(null)
      if (editFileRef.current) editFileRef.current.value = ''
      setLoadingDoc(true)
      try {
        const full = await fetchDocument(doc.id)
        setEditContent(full.content ?? '')
      } catch (e) {
        notify(e instanceof Error ? e.message : 'Failed to load document content', 'err')
      } finally {
        setLoadingDoc(false)
      }
    },
    [fetchDocument, notify],
  )

  const cancelEdit = useCallback(() => {
    setEditingId(null)
    setEditTitle('')
    setEditContent('')
    setEditFile(null)
    if (editFileRef.current) editFileRef.current.value = ''
  }, [])

  const saveEdit = useCallback(async () => {
    if (!editingId) return
    setSavingEdit(true)
    try {
      const formData = new FormData()
      if (editFile) formData.append('file', editFile)
      if (editTitle.trim()) formData.append('title', editTitle.trim())
      if (!editFile && editContent) formData.append('content', editContent)
      const res = await authFetch(`${serverUrl}/ai/knowledge/documents/${editingId}`, {
        method: 'PATCH',
        body: formData,
      })
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { message?: string }
        throw new Error(body.message ?? `Update failed (${res.status})`)
      }
      cancelEdit()
      invalidate()
      notify(t('admin.kbUpdatedNotice'))
    } catch (e) {
      notify(e instanceof Error ? e.message : 'Update failed', 'err')
    } finally {
      setSavingEdit(false)
    }
  }, [cancelEdit, editContent, editFile, editTitle, editingId, invalidate, notify, serverUrl, t])

  const search = useCallback(async () => {
    const q = searchQuery.trim()
    if (!q) return
    setSearching(true)
    try {
      const res = await authFetch(`${serverUrl}/ai/knowledge/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, topK: 5 }),
      })
      setSearchResults(res.ok ? ((await res.json()) as KnowledgeSearchResult[]) : null)
    } finally {
      setSearching(false)
    }
  }, [searchQuery, serverUrl])

  return (
    <div>
      <div className="adm-page-head">
        <div>
          <h1 className="adm-page-title">{t('admin.knowledgeBase')}</h1>
          <p className="adm-page-sub">{t('admin.kbSub')}</p>
        </div>
      </div>

      {notice && (
        <div
          className="adm-card"
          style={{
            borderColor: noticeKind === 'ok' ? '#a7f3d0' : '#fecaca',
            background: noticeKind === 'ok' ? '#ecfdf5' : '#fef2f2',
            marginBottom: 14,
          }}
        >
          <span style={{ color: noticeKind === 'ok' ? '#065f46' : '#991b1b', fontSize: 13 }}>{notice}</span>
        </div>
      )}

      <div className="adm-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginBottom: 16 }}>
        <div className="adm-card">
          <h2 className="adm-card-title">{t('admin.kbUpload')}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <label className="adm-label">{t('admin.kbTitleOptional')}</label>
              <input className="adm-input" style={{ width: '100%' }} value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('admin.kbTitlePlaceholder')} />
            </div>
            <button
              type="button"
              className="adm-btn"
              style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              <FileUp size={14} /> {uploading ? t('admin.uploading') : t('admin.chooseFile')}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".txt,.md,.pdf,.docx,.csv,text/plain,text/markdown,text/csv,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) void upload(file)
              }}
            />
            <span className="adm-muted" style={{ fontSize: 12 }}>
              {t('admin.kbFileHint')} {uploading && <span className="adm-spinner" style={{ width: 12, height: 12, verticalAlign: '-2px', marginLeft: 6 }} />}
            </span>
          </div>
        </div>

        <div className="adm-card">
          <h2 className="adm-card-title">{t('admin.kbFaqTemplates')}</h2>
          <p className="adm-muted" style={{ fontSize: 12, marginTop: -6, marginBottom: 10 }}>
            {t('admin.kbTemplateHelp')}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {TEMPLATES.map((tp) => (
              <a
                key={tp.file}
                href={`${serverUrl}/rag-templates/${tp.file}`}
                target="_blank"
                rel="noreferrer"
                className="adm-btn"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, padding: '10px 12px', textAlign: 'left', textDecoration: 'none' }}
                title={t(tp.descKey)}
              >
                <span style={{ fontSize: 13, fontWeight: 650 }}>📄 {t(tp.nameKey)}</span>
                <span className="adm-muted" style={{ fontSize: 11 }}>{t(tp.descKey)}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="adm-card">
          <h2 className="adm-card-title">{t('admin.kbTestSearch')}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="adm-row">
              <input
                className="adm-input"
                style={{ flex: 1 }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && void search()}
                placeholder={t('admin.kbSearchPlaceholder')}
              />
              <button type="button" className="adm-btn adm-btn-primary" onClick={() => void search()} disabled={searching || !searchQuery.trim()}>
                <Search size={14} /> {t('admin.search')}
              </button>
            </div>
            {searchResults && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {searchResults.length === 0 && <span className="adm-muted" style={{ fontSize: 12.5 }}>{t('admin.kbNoChunks')}</span>}
                {searchResults.map((r) => (
                  <div key={r.id} className="adm-card" style={{ padding: 10, background: 'var(--adm-accent-soft)', borderColor: 'transparent' }}>
                    <div className="adm-muted adm-mono" style={{ fontSize: 11, marginBottom: 4 }}>
                      {t('admin.chunkScore', { index: r.chunkIndex, score: (r.score * 100).toFixed(1) })}
                    </div>
                    <span style={{ fontSize: 12.5 }}>{r.content.length > 220 ? `${r.content.slice(0, 220)}…` : r.content}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {editingId && (
        <div className="adm-card" style={{ marginBottom: 16 }}>
          <div className="adm-flex-between" style={{ marginBottom: 10 }}>
            <h2 className="adm-card-title" style={{ margin: 0 }}>{t('admin.kbEdit')}</h2>
            <button type="button" className="adm-btn adm-btn-sm" onClick={cancelEdit} disabled={savingEdit}>
              <X size={13} /> {t('common.close')}
            </button>
          </div>
          <div className="adm-grid adm-grid-4">
            <div>
              <label className="adm-label">{t('admin.title')}</label>
              <input className="adm-input" style={{ width: '100%' }} value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </div>
            <div>
              <label className="adm-label">{t('admin.kbReplace')}</label>
              <div className="adm-row">
                <button type="button" className="adm-btn" onClick={() => editFileRef.current?.click()}>
                  {editFile ? editFile.name : t('admin.chooseFile')}
                </button>
                {editFile && (
                  <button type="button" className="adm-btn adm-btn-sm" onClick={() => { setEditFile(null); if (editFileRef.current) editFileRef.current.value = '' }}>
                    <X size={13} />
                  </button>
                )}
                <input
                  ref={editFileRef}
                  type="file"
                  accept=".txt,.md,.pdf,.docx,.csv,text/plain,text/markdown,text/csv,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  style={{ display: 'none' }}
                  onChange={(e) => setEditFile(e.target.files?.[0] ?? null)}
                />
              </div>
              {!editFile && <span className="adm-muted" style={{ fontSize: 11 }}>{t('admin.kbEditing')}</span>}
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <label className="adm-label">{t('admin.content')} {loadingDoc && <span className="adm-spinner" style={{ width: 11, height: 11, verticalAlign: '-1px', marginLeft: 6 }} />}</label>
            <textarea
              className="adm-textarea adm-mono"
              style={{ width: '100%', minHeight: 180 }}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              disabled={loadingDoc}
              placeholder={loadingDoc ? t('admin.loadingContent') : ''}
            />
          </div>
          <div className="adm-row" style={{ marginTop: 10 }}>
            <button type="button" className="adm-btn adm-btn-primary" onClick={() => void saveEdit()} disabled={savingEdit || loadingDoc}>
              {savingEdit ? t('admin.saving') : t('admin.saveChanges')}
            </button>
            <button type="button" className="adm-btn" onClick={cancelEdit} disabled={savingEdit}>{t('common.cancel')}</button>
          </div>
        </div>
      )}

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>{t('admin.title')}</th>
              <th>{t('admin.kbFile')}</th>
              <th>{t('admin.kbSize')}</th>
              <th>{t('admin.kbChunks')}</th>
              <th>{t('admin.embedding')}</th>
              <th>{t('admin.kbUploaded')}</th>
              <th></th>
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
              (documents ?? []).map((d) => (
                <tr key={d.id}>
                  <td><strong>{d.title}</strong></td>
                  <td className="adm-muted">{d.fileName}</td>
                  <td className="adm-muted">{formatBytes(d.fileSize)}</td>
                  <td className="adm-muted">{d.chunkCount}</td>
                  <td>
                    <span className={`adm-badge ${STATUS_BADGE[d.embeddingStatus] ?? 'adm-badge-neutral'}`}>
                      {t(STATUS_KEYS[d.embeddingStatus] ?? 'common.unknown')}
                    </span>
                    {d.embeddingStatus === 'failed' && d.errorMessage && (
                      <div className="adm-muted" style={{ fontSize: 11, marginTop: 3 }}>{d.errorMessage}</div>
                    )}
                  </td>
                  <td className="adm-muted">{new Date(d.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="adm-row" style={{ gap: 4 }}>
                      <button className="adm-btn adm-btn-sm" title={t('admin.kbViewContent')} onClick={() => void openView(d.id)}>
                        <Eye size={14} /> {t('admin.view')}
                      </button>
                      <button className="adm-btn adm-btn-sm" title={t('common.edit')} onClick={() => void openEdit(d)}>
                        <Pencil size={14} /> {t('common.edit')}
                      </button>
                      <button className="adm-btn adm-btn-sm" title={t('common.delete')} onClick={() => void remove(d.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
            {(documents ?? []).length === 0 && !isLoading && (
              <tr>
                <td colSpan={7}>
                  <div className="adm-empty">
                    <FileUp size={20} style={{ display: 'block', margin: '0 auto 8px', opacity: 0.5 }} />
                    {t('admin.kbNoDocuments')}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View modal */}
      {viewing && (
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
          onClick={() => setViewing(null)}
        >
          <div
            className="adm-card"
            style={{ maxWidth: 680, width: '100%', maxHeight: '80vh', display: 'flex', flexDirection: 'column', padding: 18 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="adm-flex-between" style={{ marginBottom: 10 }}>
              <div>
                <h2 className="adm-card-title" style={{ margin: 0 }}>{viewing.title}</h2>
                <div className="adm-muted" style={{ fontSize: 11, marginTop: 2 }}>
                  {viewing.fileName} · {formatBytes(viewing.fileSize)} · {viewing.chunkCount} chunks · {t(STATUS_KEYS[viewing.embeddingStatus] ?? 'common.unknown')}
                </div>
              </div>
              <button type="button" className="adm-btn adm-btn-sm" onClick={() => setViewing(null)}>
                <X size={13} /> {t('common.close')}
              </button>
            </div>
            <pre
              className="adm-mono"
              style={{
                flex: 1,
                minHeight: 0,
                overflow: 'auto',
                background: '#f8fafc',
                border: '1px solid var(--adm-border, #e2e8f0)',
                borderRadius: 10,
                padding: 12,
                fontSize: 12.5,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {viewing.content || '(empty)'}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
