// =============================================================================
// Drag-and-drop image upload for chat rooms — drop anywhere on the panel,
// overlay feedback, first image file wins. Mirrors the legacy drag overlay.
// =============================================================================

import { useCallback, useRef, useState } from 'react'

export function useImageDrop(onImage: (file: File) => void, enabled = true) {
  const [dragging, setDragging] = useState(false)
  // dragenter/dragleave fire per nested element — count depth so the overlay
  // only hides once the drag actually leaves the panel.
  const depthRef = useRef(0)

  const hasFiles = (e: React.DragEvent): boolean =>
    Array.from(e.dataTransfer?.types ?? []).includes('Files')

  const onDragEnter = useCallback(
    (e: React.DragEvent) => {
      if (!enabled || !hasFiles(e)) return
      e.preventDefault()
      depthRef.current += 1
      setDragging(true)
    },
    [enabled],
  )

  const onDragOver = useCallback(
    (e: React.DragEvent) => {
      if (!enabled || !hasFiles(e)) return
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    [enabled],
  )

  const onDragLeave = useCallback(
    (e: React.DragEvent) => {
      if (!enabled || !hasFiles(e)) return
      e.preventDefault()
      depthRef.current = Math.max(0, depthRef.current - 1)
      if (depthRef.current === 0) setDragging(false)
    },
    [enabled],
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      if (!enabled) return
      e.preventDefault()
      depthRef.current = 0
      setDragging(false)
      const image = Array.from(e.dataTransfer?.files ?? []).find((f) =>
        f.type.startsWith('image/'),
      )
      if (image) onImage(image)
    },
    [enabled, onImage],
  )

  return { dragging, onDragEnter, onDragOver, onDragLeave, onDrop }
}
