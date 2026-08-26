import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'

export interface LightboxProps {
  url: string
  onClose: () => void
}

/** Fullscreen image viewer overlaid on the chat panel. */
export function Lightbox({ url, onClose }: LightboxProps) {
  const { t } = useTranslation()
  return (
    <div className="oc-lightbox" onClick={onClose} role="dialog" aria-modal="true" aria-label={t('visitor.lightboxLabel')}>
      <button type="button" className="oc-lightbox-close" onClick={onClose} aria-label={t('visitor.closePreview')}>
        <X size={18} />
      </button>
      <img src={url} alt={t('visitor.attachment')} onClick={(e) => e.stopPropagation()} />
    </div>
  )
}
