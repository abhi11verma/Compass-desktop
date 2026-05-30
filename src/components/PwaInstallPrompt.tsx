import { useEffect, useState } from 'react'

import { usePwaInstall } from '@/hooks/usePwaInstall'
import {
  type BeforeInstallPromptEvent,
  checkIsIOS,
  checkIsStandalone,
  saveDismiss,
  setDeferredPrompt,
  setShowIOS,
  wasDismissedRecently,
} from '@/lib/pwaInstall'

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

export function IOSInstallSheet({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="pwa-ios-backdrop" onClick={onDismiss}>
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
        <button className="pwa-ios-dismiss" onClick={onDismiss}>Maybe later</button>
      </div>
    </div>
  )
}

export function PwaInstallPrompt() {
  const { deferredPrompt, showIOS } = usePwaInstall()
  const [autoBanner, setAutoBanner] = useState(false)

  useEffect(() => {
    if (checkIsStandalone() || wasDismissedRecently()) return

    if (checkIsIOS()) {
      const t = setTimeout(() => { setShowIOS(true) }, 2500)
      return () => { clearTimeout(t) }
    }

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setAutoBanner(true)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    return () => { window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt) }
  }, [])

  function dismiss() {
    saveDismiss()
    setAutoBanner(false)
    setShowIOS(false)
  }

  if (autoBanner && deferredPrompt) {
    return (
      <div className="pwa-update-prompt">
        <span>Install Compass on your device.</span>
        <div className="pwa-update-actions">
          <button
            className="pwa-update-btn pwa-update-btn--primary"
            onClick={() => { void deferredPrompt.prompt(); setDeferredPrompt(null); dismiss() }}
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
    return <IOSInstallSheet onDismiss={dismiss} />
  }

  return null
}
