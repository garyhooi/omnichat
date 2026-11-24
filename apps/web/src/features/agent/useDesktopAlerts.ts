// =============================================================================
// Operator state for the browser-native alerts toggle: permission, opt-in
// preference and the toggle itself. Rendering surfaces only need `enabled`
// (is the icon "on") and `toggle` (wire it to the button's click).
//
// Permission is requested inside the click handler — browsers only show the
// prompt in response to a gesture, and a denied permission cannot be re-asked
// from script, so the surfaces show the `blocked` hint instead.
// =============================================================================

import { useCallback, useEffect, useState } from 'react'
import {
  desktopAlertPermission,
  desktopAlertsSupported,
  isDesktopAlertsEnabled,
  requestDesktopAlerts,
  setDesktopAlertsEnabled,
  type DesktopAlertPermission,
} from '../../shared/lib/desktopAlerts'

export interface DesktopAlertsState {
  supported: boolean
  permission: DesktopAlertPermission
  /** Opted in AND permitted — a banner will actually appear. */
  enabled: boolean
  /** Permission was refused; only the browser's site settings can undo it. */
  blocked: boolean
  toggle: () => Promise<void>
}

export function useDesktopAlerts(): DesktopAlertsState {
  const supported = desktopAlertsSupported()
  const [permission, setPermission] = useState<DesktopAlertPermission>(desktopAlertPermission)
  const [enabled, setEnabled] = useState<boolean>(isDesktopAlertsEnabled)

  // The operator can revoke the permission from the browser UI while the page
  // is open; re-read it whenever they come back to the tab.
  useEffect(() => {
    const refresh = () => {
      setPermission(desktopAlertPermission())
      setEnabled(isDesktopAlertsEnabled())
    }
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])

  const toggle = useCallback(async () => {
    if (!supported) return
    if (enabled) {
      setDesktopAlertsEnabled(false)
      setEnabled(false)
      return
    }
    let next = desktopAlertPermission()
    if (next === 'default') next = await requestDesktopAlerts()
    setPermission(next)
    if (next === 'granted') {
      setDesktopAlertsEnabled(true)
      setEnabled(true)
    }
  }, [enabled, supported])

  return { supported, permission, enabled, blocked: permission === 'denied', toggle }
}
