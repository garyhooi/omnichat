import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Star } from 'lucide-react'

export interface ReviewFormProps {
  submitted: boolean
  onSubmit: (rating: number, review?: string) => void
  onSkip?: () => void
}

/**
 * Post-chat rating — 5 stars + optional comment, shown after the
 * conversation is resolved (matches the legacy widget).
 */
export function ReviewForm({ submitted, onSubmit, onSkip }: ReviewFormProps) {
  const { t } = useTranslation()
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')

  const labels = [
    t('visitor.veryPoor'),
    t('visitor.poor'),
    t('visitor.okay'),
    t('visitor.good'),
    t('visitor.excellent'),
  ]

  if (submitted) {
    return (
      <div className="oc-review">
        <h3>{t('visitor.thankYou')}</h3>
        <p>{t('visitor.feedbackThanks')}</p>
      </div>
    )
  }

  const active = hover || rating

  return (
    <div className="oc-review">
      <h3>{t('visitor.howWasChat')}</h3>
      <p>{t('visitor.rateExperience')}</p>

      <div className="oc-stars" role="radiogroup" aria-label={t('visitor.ratingLabel')}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={rating === n}
            aria-label={t('visitor.ratingAria', { n, s: n > 1 ? 's' : '', label: labels[n - 1] })}
            className={`oc-star ${n <= active ? 'oc-filled' : ''}`}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(n)}
          >
            <Star size={26} fill={n <= active ? '#f59e0b' : 'none'} />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={t('visitor.reviewPlaceholder')}
        maxLength={500}
        aria-label={t('visitor.reviewComment')}
      />

      <button
        type="button"
        className="oc-review-submit"
        disabled={rating === 0}
        onClick={() => onSubmit(rating, comment.trim() || undefined)}
      >
        {t('visitor.submitReview')}
      </button>

      {onSkip && (
        <button type="button" className="oc-translate-btn" onClick={onSkip} style={{ marginLeft: 0 }}>
          {t('visitor.skip')}
        </button>
      )}
    </div>
  )
}
