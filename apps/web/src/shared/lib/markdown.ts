// =============================================================================
// Markdown rendering — marked + DOMPurify with an explicit tag/attr whitelist.
// Mirrors the legacy Vue utils/markdown.ts exactly.
// =============================================================================

import { marked } from 'marked'
import DOMPurify from 'dompurify'

const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'b', 'em', 'i', 'code', 'pre', 'ul', 'ol', 'li',
  'blockquote', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr',
  'table', 'thead', 'tbody', 'tr', 'th', 'td', 'del', 'sup', 'sub', 'span',
]

const ALLOWED_ATTR = ['href', 'target', 'rel', 'class']

marked.setOptions({ breaks: true, gfm: true })

export function renderMarkdown(content: string): string {
  const raw = marked.parse(content, { async: false }) as string
  return DOMPurify.sanitize(raw, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  })
}
