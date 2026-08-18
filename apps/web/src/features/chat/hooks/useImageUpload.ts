// =============================================================================
// Image upload — processes the file client-side (compress JPG/PNG/WebP to
// 1200px/0.8 like the legacy widget; pass HEIC through — the server converts),
// uploads to POST /upload with the rotating upload token, then sends the
// resulting URLs as an image message.
// =============================================================================

import { useCallback, useRef, useState } from 'react'
import { UPLOAD_MAX_BYTES } from '../types'

export interface ImageUploadResult {
  uploading: boolean
  error: string | null
  uploadImage: (file: File) => Promise<boolean>
}

export interface UseImageUploadOptions {
  serverUrl: string
  conversationId: string | null
  /** Rotating upload token from the query cache (upload_token event). */
  uploadToken: string | null
  /** Called with server-absolute URLs after a successful upload + message send. */
  onUploaded?: (attachmentUrl: string, thumbnailUrl: string) => void
  /** The server rotates the token after each upload — persist it here. */
  onTokenRotated?: (token: string) => void
}

function isHeicFile(file: File): boolean {
  const type = file.type.toLowerCase()
  return type === 'image/heic' || type === 'image/heif' || /\.(heic|heif)$/i.test(file.name)
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Invalid image file'))
    }
    img.src = url
  })
}

/** Draw the image into a canvas scaled to maxDim, export as WebP at quality. */
async function compressImage(file: File, maxDim = 1200, quality = 0.8): Promise<File> {
  const img = await loadImage(file)
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
  const w = Math.max(1, Math.round(img.width * scale))
  const h = Math.max(1, Math.round(img.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas unavailable')
  ctx.drawImage(img, 0, 0, w, h)
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/webp', quality),
  )
  if (!blob) throw new Error('Compression failed')
  return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' })
}

export function useImageUpload({ serverUrl, conversationId, uploadToken, onUploaded, onTokenRotated }: UseImageUploadOptions) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const tokenRef = useRef(uploadToken)
  tokenRef.current = uploadToken

  const uploadImage = useCallback(
    async (file: File): Promise<boolean> => {
      if (!conversationId) return false
      if (file.size > UPLOAD_MAX_BYTES) {
        setError('Image must be 5MB or smaller.')
        return false
      }
      setUploading(true)
      setError(null)

      let processed: File
      try {
        if (isHeicFile(file)) {
          processed = file // backend converts HEIC/HEIF
        } else if (file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
          processed = await compressImage(file)
        } else {
          throw new Error('Unsupported format: use JPG, PNG, WEBP, HEIC')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to process image.')
        setUploading(false)
        return false
      }

      try {
        const formData = new FormData()
        formData.append('file', processed)
        formData.append('conversationId', conversationId)

        const headers: HeadersInit = {}
        if (tokenRef.current) headers['Authorization'] = tokenRef.current

        const res = await fetch(`${serverUrl}/upload`, {
          method: 'POST',
          headers,
          body: formData,
        })
        if (!res.ok) throw new Error('Upload failed')

        const data = (await res.json()) as {
          url: string
          thumbnailUrl?: string
          uploadToken?: string
        }
        const attachmentUrl = `${serverUrl}${data.url}`
        const thumbnailUrl = `${serverUrl}${data.thumbnailUrl || data.url}`
        if (data.uploadToken) {
          // Server rotated the token so the visitor can keep uploading.
          tokenRef.current = data.uploadToken
          onTokenRotated?.(data.uploadToken)
        }
        onUploaded?.(attachmentUrl, thumbnailUrl)
        return true
      } catch (err) {
        console.error('Upload error:', err)
        setError('Failed to upload image. Please try again.')
        return false
      } finally {
        setUploading(false)
      }
    },
    [conversationId, onTokenRotated, onUploaded, serverUrl],
  )

  return { uploading, error, uploadImage, clearError: () => setError(null) }
}
