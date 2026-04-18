import { marked } from 'marked'
import DOMPurify from 'dompurify'

// Configure marked for chat messages — compact output
marked.setOptions({
  breaks: true, // Convert \n to <br>
  gfm: true, // GitHub Flavored Markdown
})

/**
 * Render markdown content to sanitized HTML for chat messages.
 * Returns safe HTML string suitable for v-html.
 */
export function renderMarkdown(content: string): string {
  if (!content) return ''

  // Parse markdown to HTML
  const rawHtml = marked.parse(content, { async: false }) as string

  // Sanitize to prevent XSS
  const clean = DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'code', 'pre',
      'ul', 'ol', 'li', 'blockquote', 'a', 'h1', 'h2', 'h3',
      'h4', 'h5', 'h6', 'hr', 'table', 'thead', 'tbody', 'tr',
      'th', 'td', 'del', 'sup', 'sub', 'span',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  })

  return clean
}
