export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'compass-install-dismissed'
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000

interface InstallState {
  deferredPrompt: BeforeInstallPromptEvent | null
  showIOS: boolean
}

const _state: InstallState = { deferredPrompt: null, showIOS: false }
const _listeners = new Set<() => void>()

function emit() { _listeners.forEach(fn => fn()) }

export function setDeferredPrompt(p: BeforeInstallPromptEvent | null) {
  _state.deferredPrompt = p
  emit()
}

export function setShowIOS(v: boolean) {
  _state.showIOS = v
  emit()
}

export function getInstallState(): InstallState {
  return { ..._state }
}

export function subscribeInstall(fn: () => void): () => void {
  _listeners.add(fn)
  return () => { _listeners.delete(fn) }
}

export function checkIsIOS(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

export function checkIsStandalone(): boolean {
  if (window.matchMedia('(display-mode: standalone)').matches) return true
  const nav = navigator as Navigator & { standalone?: boolean }
  return nav.standalone === true
}

export function wasDismissedRecently(): boolean {
  try {
    const ts = localStorage.getItem(DISMISS_KEY)
    if (!ts) return false
    return Date.now() - Number(ts) < COOLDOWN_MS
  } catch { return false }
}

export function saveDismiss() {
  try { localStorage.setItem(DISMISS_KEY, String(Date.now())) } catch { /* ignore */ }
}
