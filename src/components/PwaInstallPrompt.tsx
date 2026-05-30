import { useEffect, useState } from 'react'

const DISMISS_KEY = 'compass-install-dismissed'
const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function checkIsIOS(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

function checkIsStandalone(): boolean {
  if (window.matchMedia('(display-mode: standalone)').matches) return true
  const nav = navigator as Navigator & { standalone?: boolean }
  return nav.standalone === true
}

function wasDismissedRecently(): boolean {
  try {
    const ts = localStorage.getItem(DISMISS_KEY)
    if (!ts) return false
    return Date.now() - Number(ts) < COOLDOWN_MS
  } catch {
    return false
  }
}

function saveDismiss() {
  try { localStorage.setItem(DISMISS_KEY, String(Date.now())) } catch { /* ignore */ }
}

function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 13V3M6 7l4-4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 13v4a1 1 0 001 1h12a1 1 0 001-1v-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  )
}

function AddIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2.5" y="2.5" width="15" height="15" rx="3.5" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M10 7v6M7 10h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  )
}

export function PwaInstallPrompt() {
  const [androidPrompt, setAndroidPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showIOS, setShowIOS] = useState(false)

  useEffect(() => {
    if (checkIsStandalone() || wasDismissedRecently()) return

    if (checkIsIOS()) {
      const t = setTimeout(() => { setShowIOS(true) }, 2500)
      return () => { clearTimeout(t) }
    }

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault()
      setAndroidPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    return () => { window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt) }
  }, [])

  function dismiss() {
    saveDismiss()
    setAndroidPrompt(null)
    setShowIOS(false)
  }

  if (androidPrompt) {
    return (
      <div className="pwa-update-prompt">
        <span>Install Compass on your device.</span>
        <div className="pwa-update-actions">
          <button
            className="pwa-update-btn pwa-update-btn--primary"
            onClick={() => { void androidPrompt.prompt(); dismiss() }}
          >
            Install
          </button>
          <button className="pwa-update-btn pwa-update-btn--ghost" onClick={dismiss}>
            Dismiss
          </button>
        </div>
      </div>
    )
  }

  if (showIOS) {
    return (
      <div className="pwa-ios-backdrop" onClick={dismiss}>
        <div className="pwa-ios-sheet" onClick={(e) => { e.stopPropagation() }}>
          <div className="pwa-ios-handle" />
          <div className="pwa-ios-title">Install Compass</div>
          <div className="pwa-ios-subtitle">
            Add to your home screen for the full app experience — no App Store needed.
          </div>
          <div className="pwa-ios-steps">
            <div className="pwa-ios-step">
              <div className="pwa-ios-step-icon"><ShareIcon /></div>
              <div className="pwa-ios-step-text">
                <span className="pwa-ios-step-num">1</span>
                Tap the <strong>Share</strong> button in Safari's toolbar
              </div>
            </div>
            <div className="pwa-ios-step">
              <div className="pwa-ios-step-icon"><AddIcon /></div>
              <div className="pwa-ios-step-text">
                <span className="pwa-ios-step-num">2</span>
                Tap <strong>Add to Home Screen</strong>
              </div>
            </div>
          </div>
          <button className="pwa-ios-dismiss" onClick={dismiss}>Maybe later</button>
        </div>
      </div>
    )
  }

  return null
}
