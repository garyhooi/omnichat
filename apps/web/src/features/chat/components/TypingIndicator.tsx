import { useTranslation } from 'react-i18next'

export function TypingIndicator({ label }: { label?: string }) {
  const { t } = useTranslation()
  return (
    <div className="oc-msg-row oc-from-agent">
      <div className="oc-msg-body">
        <span className="oc-sender-label">{label ?? t('common.agent')}</span>
        <div className="oc-bubble oc-typing" aria-label={t('visitor.typingAria')}>
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  )
}
