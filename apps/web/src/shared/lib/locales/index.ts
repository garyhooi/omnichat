// =============================================================================
// Locale registry — resources for all 20 UI languages.
// Supported values === the AI-translate language list (see translationCache.ts):
// en zh-Hans zh-Hant ja ko fr de it es pt nl pl tr ar ru th vi id ms hi
// =============================================================================
import { en } from './en'
import { zhHans, zhHant } from './zh'
import { ja, ko } from './east'
import { fr, de, it, es, pt } from './euro1'
import { nl, pl, tr, ru } from './euro2'
import { ar, th, vi, id, ms, hi } from './sea'

export type UILocale = Record<string, string>

export const resources: Record<string, { translation: UILocale }> = {
  en: { translation: en },
  'zh-Hans': { translation: zhHans },
  'zh-Hant': { translation: zhHant },
  ja: { translation: ja },
  ko: { translation: ko },
  fr: { translation: fr },
  de: { translation: de },
  it: { translation: it },
  es: { translation: es },
  pt: { translation: pt },
  nl: { translation: nl },
  pl: { translation: pl },
  tr: { translation: tr },
  ar: { translation: ar },
  ru: { translation: ru },
  th: { translation: th },
  vi: { translation: vi },
  id: { translation: id },
  ms: { translation: ms },
  hi: { translation: hi },
}
