// =============================================================================
// Admin portal root — provider tree shared by the <omnichat-admin-portal>
// custom element and the dev harness.
// =============================================================================

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nScope } from '../shared/components/I18nScope'
import { AuthProvider } from './auth'
import { AdminApp } from './App'
import { AccentProvider } from './accent'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: false },
  },
})

export interface AdminRootProps {
  /** Server URL from the element's server-url attribute (optional). */
  serverUrl?: string
  /** Optional UI language (element [lang] attribute); default English. */
  lang?: string
}

export function AdminRoot({ serverUrl, lang }: AdminRootProps) {
  return (
    <I18nScope lang={lang}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider initialServerUrl={serverUrl}>
          {/* Theme all buttons/highlights with the site's bubble color. */}
          <AccentProvider serverUrl={serverUrl ?? ''}>
            <AdminApp lang={lang} />
          </AccentProvider>
        </AuthProvider>
      </QueryClientProvider>
    </I18nScope>
  )
}
