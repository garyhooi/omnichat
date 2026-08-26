// =============================================================================
// Widget position & drag — ports the legacy widget's free-positioning:
//   - bubble: fixed px coords, persisted as "xy:x,y" in localStorage
//   - panel: anchored independently, draggable by its header, persisted
// Both clamp to the viewport; small screens use full-size positioning.
// =============================================================================

import { useCallback, useEffect, useRef, useState } from 'react'

export const WIDGET_MARGIN = 12
export const DESKTOP_PANEL_GAP = 16
export const MOBILE_PANEL_MARGIN = 12
export const PANEL_WIDTH = 380
export const PANEL_HEIGHT = 600

export interface Point {
  x: number
  y: number
}

export function bubbleDiameter(size: string | undefined): number {
  if (size === 'small') return 48
  if (size === 'large') return 64
  return 56
}

export function isSmallScreen(width: number): boolean {
  return width <= 640
}

function formatPosition(p: Point): string {
  return `xy:${Math.round(p.x)},${Math.round(p.y)}`
}

export function parsePosition(value?: string | null): Point | null {
  if (!value?.startsWith('xy:')) return null
  const [xRaw, yRaw] = value.slice(3).split(',')
  const x = Number.parseInt(xRaw ?? '', 10)
  const y = Number.parseInt(yRaw ?? '', 10)
  if (Number.isNaN(x) || Number.isNaN(y)) return null
  return { x, y }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export interface UseWidgetPositionOptions {
  serverUrl: string
  /** Fallback corner: 'bottom-right' | 'bottom-left' (element attribute). */
  defaultPosition?: string
  bubbleSize?: string
  /** localStorage key prefixes (visitor widget vs agent widget). */
  positionKeyPrefix?: string
  panelAnchorKeyPrefix?: string
}

export interface WidgetPosition {
  bubble: Point
  panel: Point
  viewport: { width: number; height: number }
  isSmall: boolean
  /** True when the visitor has previously dragged the panel (anchor persisted). */
  hasSavedPanel: boolean
  startBubbleDrag: (e: React.PointerEvent) => void
  startPanelDrag: (e: React.PointerEvent) => void
  /** Move the panel anchor without persisting (first-open initialization). */
  setPanelPosition: (p: Point) => void
  /** True right after a drag ended in a move — suppress the follow-up click. */
  suppressClick: () => boolean
}

function getLegacyPosition(corner: string | undefined, vw: number, vh: number, diameter: number): Point {
  const y = vh - diameter - 20
  if (corner === 'bottom-left') return { x: 20, y }
  return { x: vw - diameter - 20, y }
}

export function useWidgetPosition({
  serverUrl,
  defaultPosition,
  bubbleSize,
  positionKeyPrefix = 'omnichat_widget_position_',
  panelAnchorKeyPrefix = 'omnichat_client_panel_anchor_',
}: UseWidgetPositionOptions): WidgetPosition {
  const [viewport, setViewport] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }))
  const [bubble, setBubble] = useState<Point | null>(null)
  const [panel, setPanel] = useState<Point | null>(null)
  const [hasSavedPanel, setHasSavedPanel] = useState(false)
  const lastDragMovedAtRef = useRef(0)
  // Latest positions — read by the drag listeners so they never capture a
  // stale render's closure (the listeners are registered once per drag).
  const bubbleRef = useRef<Point | null>(null)
  const panelRef = useRef<Point | null>(null)
  useEffect(() => {
    bubbleRef.current = bubble
  }, [bubble])
  useEffect(() => {
    panelRef.current = panel
  }, [panel])
  const dragRef = useRef<{
    pointerId: number
    startX: number
    startY: number
    originX: number
    originY: number
    target: 'bubble' | 'panel'
    moved: boolean
  } | null>(null)

  const diameter = bubbleDiameter(bubbleSize)
  const isSmall = viewport.width <= 640
  const bubbleKey = `${positionKeyPrefix}${encodeURIComponent(serverUrl)}`
  const panelKey = `${panelAnchorKeyPrefix}${encodeURIComponent(serverUrl)}`

  // Initialize once viewport is known (after first paint).
  useEffect(() => {
    const savedBubble = parsePosition(localStorage.getItem(bubbleKey))
    setBubble(
      savedBubble ??
        getLegacyPosition(defaultPosition, viewport.width, viewport.height, diameter),
    )
    const savedPanel = parsePosition(localStorage.getItem(panelKey))
    if (savedPanel) {
      setPanel(savedPanel)
      setHasSavedPanel(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bubbleKey, panelKey])

  useEffect(() => {
    const onResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Keep the bubble in-bounds when the viewport shrinks.
  useEffect(() => {
    if (!bubble) return
    setBubble((p) => (p ? clampPoint(p, viewport, diameter) : p))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewport, diameter])

  const clampBubble = useCallback(
    (p: Point) => {
      const maxX = Math.max(WIDGET_MARGIN, viewport.width - diameter - WIDGET_MARGIN)
      const maxY = Math.max(WIDGET_MARGIN, viewport.height - diameter - WIDGET_MARGIN)
      return { x: clamp(Math.round(p.x), WIDGET_MARGIN, maxX), y: clamp(Math.round(p.y), WIDGET_MARGIN, maxY) }
    },
    [viewport, diameter],
  )

  const clampPanel = useCallback(
    (p: Point) => {
      const w = Math.min(PANEL_WIDTH, Math.max(280, viewport.width - WIDGET_MARGIN * 2))
      const h = Math.min(PANEL_HEIGHT, Math.max(320, viewport.height - WIDGET_MARGIN * 2))
      const maxX = Math.max(0, viewport.width - w)
      const maxY = Math.max(0, viewport.height - h)
      return { x: clamp(Math.round(p.x), 0, maxX), y: clamp(Math.round(p.y), 0, maxY) }
    },
    [viewport],
  )

  const startDrag = useCallback(
    (e: React.PointerEvent, target: 'bubble' | 'panel') => {
      if (e.button !== 0 && e.pointerType !== 'touch') return
      // Never hijack pointerdowns meant for interactive elements — the header's
      // mute/translate/close buttons must keep clean clicks (preventDefault on
      // pointerdown can swallow them, especially on touch devices).
      const interactive = (e.target as HTMLElement | null)?.closest('button, a, input, textarea, select')
      if (interactive && interactive !== e.currentTarget) return
      const origin = target === 'bubble' ? bubble : panel
      if (!origin) return
      dragRef.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        originX: origin.x,
        originY: origin.y,
        target,
        moved: false,
      }
      window.addEventListener('pointermove', onDragMove)
      window.addEventListener('pointerup', stopDrag)
      window.addEventListener('pointercancel', stopDrag)
      e.preventDefault()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bubble, panel],
  )

  const onDragMove = useCallback(
    (e: PointerEvent) => {
      const drag = dragRef.current
      if (!drag || drag.pointerId !== e.pointerId) return
      const dx = e.clientX - drag.startX
      const dy = e.clientY - drag.startY
      if (!drag.moved && Math.hypot(dx, dy) > 4) drag.moved = true
      const next = { x: drag.originX + dx, y: drag.originY + dy }
      if (drag.target === 'bubble') setBubble(clampBubble(next))
      else setPanel(clampPanel(next))
    },
    [clampBubble, clampPanel],
  )

  const stopDrag = useCallback(
    (e: PointerEvent) => {
      const drag = dragRef.current
      if (!drag || drag.pointerId !== e.pointerId) return
      dragRef.current = null
      window.removeEventListener('pointermove', onDragMove)
      window.removeEventListener('pointerup', stopDrag)
      window.removeEventListener('pointercancel', stopDrag)
      if (!drag.moved) return // click, not drag
      lastDragMovedAtRef.current = performance.now()
      if (drag.target === 'bubble' && bubbleRef.current) {
        localStorage.setItem(bubbleKey, formatPosition(bubbleRef.current))
      } else if (drag.target === 'panel' && panelRef.current) {
        localStorage.setItem(panelKey, formatPosition(panelRef.current))
        setHasSavedPanel(true)
      }
    },
    // Listeners are bound per drag — only the keys/stable callbacks matter here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bubbleKey, panelKey, onDragMove],
  )

  const suppressClick = useCallback(() => {
    if (performance.now() - lastDragMovedAtRef.current < 250) {
      lastDragMovedAtRef.current = 0
      return true
    }
    return false
  }, [])

  const setPanelPosition = useCallback(
    (p: Point) => setPanel(clampPanel(p)),
    [clampPanel],
  )

  const startBubbleDrag = useCallback((e: React.PointerEvent) => startDrag(e, 'bubble'), [startDrag])
  const startPanelDrag = useCallback((e: React.PointerEvent) => startDrag(e, 'panel'), [startDrag])

  return {
    bubble: bubble ?? getLegacyPosition(defaultPosition, viewport.width, viewport.height, diameter),
    panel: panel ?? { x: 0, y: 0 },
    viewport,
    isSmall,
    hasSavedPanel,
    startBubbleDrag,
    startPanelDrag,
    setPanelPosition,
    suppressClick,
  }
}

function clampPoint(p: Point, viewport: { width: number; height: number }, diameter: number): Point {
  const maxX = Math.max(WIDGET_MARGIN, viewport.width - diameter - WIDGET_MARGIN)
  const maxY = Math.max(WIDGET_MARGIN, viewport.height - diameter - WIDGET_MARGIN)
  return { x: clamp(p.x, WIDGET_MARGIN, maxX), y: clamp(p.y, WIDGET_MARGIN, maxY) }
}
