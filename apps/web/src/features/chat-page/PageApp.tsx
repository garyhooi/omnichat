// =============================================================================
// PageApp — the React root rendered inside <omnichat-chat-page>.
// Full-viewport chat: the same ChatPanel as the widget, plus OS-level image
// drag-and-drop onto the page.
// =============================================================================

import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ImagePlus } from 'lucide-react'
import { I18nScope } from '../../shared/components/I18nScope'
import { useApplyUiLang } from '../../shared/hooks/useUiLang'
import { useChatSession } from '../chat/hooks/useChatSession'
import { ChatPanel } from '../chat/components/ChatPanel'
import {
  PAGE_MUTED_KEY,
  PAGE_TRANSLATE_LANG_KEY,
} from '../../shared/lib/storage'

export interface PageAppProps {
  serverUrl: string
  bubbleColor?: string
  externalToken?: string
  /** Optional UI language (element [lang] attribute); default English. */
  lang?: string
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

export function PageApp({ serverUrl, bubbleColor, externalToken, lang }: PageAppProps) {
  const { t } = useTranslation()
  const [dropActive, setDropActive] = useState(false)
  const dropDepthRef = useRef(0)
  const openRef = useRef(true)

  const session = useChatSession({
    serverUrl,
    externalToken,
    storageKeys: {
      mutedKey: PAGE_MUTED_KEY,
      translateLangKey: PAGE_TRANSLATE_LANG_KEY,
      autoTranslateKey: 'omnichat_visitor_auto_translate',
    },
    getPanelOpen: () => openRef.current,
  })

  // Admin-controlled visitor UI language (site config → Widget Setup).
  useApplyUiLang(lang, session.siteConfig?.visitorLanguage)

  const accentColor = session.siteConfig?.bubbleColor || bubbleColor || '#4f46e5'

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      dropDepthRef.current = 0
      setDropActive(false)
      const file = e.dataTransfer.files?.[0]
      if (file && file.type.startsWith('image/')) {
        void session.uploadImage(file)
      }
    },
    [session],
  )

  return (
    <div
      className="oc-page-root"
      onDragEnter={(e) => {
        e.preventDefault()
        dropDepthRef.current += 1
        setDropActive(true)
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={(e) => {
        e.preventDefault()
        dropDepthRef.current -= 1
        if (dropDepthRef.current <= 0) setDropActive(false)
      }}
      onDrop={handleDrop}
    >
      <ChatPanel
        session={session}
        serverUrl={serverUrl}
        accentColor={accentColor}
        title={session.siteConfig?.siteName}
      />
      {dropActive && (
        <div className="oc-drop-overlay">
          <div className="oc-drop-overlay-inner">
            <ImagePlus size={30} style={{ display: 'block', margin: '0 auto 10px' }} />
            {t('visitor.dropToSend')}
            <small>{t('visitor.dropHint')}</small>
          </div>
        </div>
      )}
    </div>
  )
}

export function PageRoot(props: PageAppProps) {
  return (
    <I18nScope lang={props.lang}>
      <QueryClientProvider client={queryClient}>
        <PageApp {...props} />
      </QueryClientProvider>
    </I18nScope>
  )
}
