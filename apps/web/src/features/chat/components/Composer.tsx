import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ImagePlus, Send, X } from 'lucide-react'

export interface ComposerSuggestion {
  label: string
  content: string
}

export interface ComposerProps {
  maxChars: number
  disabled?: boolean
  placeholder?: string
  uploading?: boolean
  /** Transient server error (message_error) to surface above the input. */
  error?: string | null
  /** Slash-command suggestions (quick replies): shown when text starts with "/". */
  suggestions?: ComposerSuggestion[]
  onSend: (text: string) => void
  onAttach?: (file: File) => void
  onTypingStart?: () => void
  onTypingStop?: () => void
  onDismissError?: () => void
}

const TYPING_IDLE_MS = 2000

/**
 * Message input — auto-resizing textarea, character counter (turns red over
 * the limit), image attach, Enter-to-send, debounced typing indicators, and
 * optional slash-command suggestions.
 */
export function Composer({
  maxChars,
  disabled,
  placeholder,
  uploading,
  error,
  suggestions,
  onSend,
  onAttach,
  onTypingStart,
  onTypingStop,
  onDismissError,
}: ComposerProps) {
  const { t } = useTranslation()
  const effectivePlaceholder = placeholder || t('visitor.typeMessage')
  const [text, setText] = useState('')
  const [wordLimitError, setWordLimitError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [activeSuggestion, setActiveSuggestion] = useState(0)

  const overLimit = text.length > maxChars

  const matchingSuggestions = useMemo(() => {
    if (!suggestions?.length || !text.startsWith('/')) return []
    const q = text.slice(1).toLowerCase()
    return suggestions.filter(
      (s) => !q || s.label.toLowerCase().includes(q) || s.content.toLowerCase().includes(q),
    )
  }, [suggestions, text])

  const showSuggestions = matchingSuggestions.length > 0

  // Auto-resize the textarea to its content.
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 110)}px`
  }, [text])

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    }
  }, [])

  const fireTypingStop = useCallback(() => {
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    typingTimerRef.current = null
    onTypingStop?.()
  }, [onTypingStop])

  const handleInput = useCallback(
    (value: string) => {
      setText(value)
      setActiveSuggestion(0)
      if (!value.trim()) {
        fireTypingStop()
        return
      }
      onTypingStart?.()
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
      typingTimerRef.current = setTimeout(() => {
        onTypingStop?.()
        typingTimerRef.current = null
      }, TYPING_IDLE_MS)
    },
    [fireTypingStop, onTypingStart, onTypingStop],
  )

  const submit = useCallback(() => {
    const value = text.trim()
    if (!value || overLimit) {
      if (overLimit) {
        setWordLimitError(t('common.tooLong', { current: text.length, max: maxChars }))
        setTimeout(() => setWordLimitError(null), 4000)
      }
      return
    }
    fireTypingStop()
    onSend(value)
    setText('')
  }, [fireTypingStop, maxChars, onSend, overLimit, text])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (showSuggestions) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setActiveSuggestion((i) => (i + 1) % matchingSuggestions.length)
          return
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          setActiveSuggestion((i) => (i - 1 + matchingSuggestions.length) % matchingSuggestions.length)
          return
        }
        if (e.key === 'Enter' || e.key === 'Tab') {
          const pick = matchingSuggestions[activeSuggestion]
          if (pick) {
            e.preventDefault()
            setText(pick.content)
            setActiveSuggestion(0)
            return
          }
        }
        if (e.key === 'Escape') {
          setActiveSuggestion(0)
          return
        }
      }
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        submit()
      }
    },
    [activeSuggestion, matchingSuggestions, showSuggestions, submit],
  )

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (file && onAttach) onAttach(file)
      if (fileInputRef.current) fileInputRef.current.value = ''
    },
    [onAttach],
  )

  const showError = error || wordLimitError

  return (
    <div className="oc-composer" style={{ position: 'relative' }}>
      {showSuggestions && (
        <div className="oc-suggest" role="listbox">
          {matchingSuggestions.map((s, i) => (
            <button
              key={s.label + i}
              type="button"
              role="option"
              aria-selected={i === activeSuggestion}
              className={`oc-suggest-item ${i === activeSuggestion ? 'oc-active' : ''}`}
              onMouseEnter={() => setActiveSuggestion(i)}
              onClick={() => {
                setText(s.content)
                setActiveSuggestion(0)
                textareaRef.current?.focus()
              }}
            >
              <strong>{s.label}</strong>
              <span>{s.content.length > 60 ? `${s.content.slice(0, 60)}…` : s.content}</span>
            </button>
          ))}
        </div>
      )}
      <div className="oc-composer-inner">
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          placeholder={effectivePlaceholder}
          disabled={disabled}
          onChange={(e) => handleInput(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label={t('visitor.messageAria')}
        />
        <div className="oc-composer-actions">
          {onAttach && (
            <>
              <button
                type="button"
                className="oc-icon-btn"
                title={t('visitor.attachImage')}
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || uploading}
              >
                <ImagePlus size={18} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="oc-file-input"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </>
          )}
          <button
            type="button"
            className="oc-send-btn"
            onClick={submit}
            disabled={disabled || !text.trim() || overLimit}
            aria-label={t('visitor.sendMessage')}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
      <div className="oc-composer-foot">
        {showError ? (
          <span className="oc-composer-error">
            {showError}
            {onDismissError && (
              <button
                type="button"
                className="oc-translate-btn"
                onClick={onDismissError}
                aria-label={t('visitor.dismissError')}
              >
                <X size={11} style={{ display: 'inline', verticalAlign: '-1px' }} />
              </button>
            )}
          </span>
        ) : uploading ? (
          <span className="oc-uploading">
            <span className="oc-spinner" /> {t('visitor.uploadingImage')}
          </span>
        ) : (
          <span />
        )}
        <span className={`oc-char-count ${overLimit ? 'oc-over' : ''}`}>
          {text.length > maxChars - 20 ? `${text.length}/${maxChars}` : ''}
        </span>
      </div>
    </div>
  )
}
