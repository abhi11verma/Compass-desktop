import { useEffect, useRef, useState } from 'react'

import { AndroidInstallSheet, IOSInstallSheet } from '@/components/PwaInstallPrompt'
import { usePwaInstall } from '@/hooks/usePwaInstall'
import { setDeferredPrompt, setShowAndroid, setShowIOS } from '@/lib/pwaInstall'
import { useCompassStore } from '@/store/useCompassStore'
import { useThemeStore } from '@/store/useThemeStore'

interface SettingsDialogProps {
  open: boolean
  onClose: () => void
}

export function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const { theme, setTheme, analyticsEnabled, setAnalyticsEnabled } = useThemeStore()
  const { resetCompass, clearData } = useCompassStore()
  const { deferredPrompt, showIOS, showAndroid, isIOS, isInstalled } = usePwaInstall()
  const overlayRef = useRef<HTMLDivElement>(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const isTauri = '__TAURI_INTERNALS__' in window

  const showInstallSection = !isInstalled && !isTauri

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (confirmReset) { setConfirmReset(false); return }
        if (confirmClear) { setConfirmClear(false); return }
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey) }
  }, [open, onClose, confirmReset])

  useEffect(() => {
    if (!open) { setConfirmReset(false); setConfirmClear(false) }
  }, [open])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) { onClose() }
  }

  function handleReset() {
    resetCompass()
    setConfirmReset(false)
    onClose()
  }

  function handleClear() {
    clearData()
    setConfirmClear(false)
    onClose()
  }

  return (
    <>
      <div
        ref={overlayRef}
        className={`settings-overlay-bg${open ? ' open' : ''}`}
        onClick={handleBackdropClick}
        aria-modal="true"
        role="dialog"
        aria-label="Settings"
      >
      <div className="settings-overlay">
        <div className="settings-hd">
          <span className="settings-title">Settings</span>
          <button className="settings-close" onClick={onClose} aria-label="Close settings">×</button>
        </div>

        <div className="settings-section-lbl">Appearance</div>

        <div className="settings-row">
          <div>
            <div className="settings-row-label">Theme</div>
            <div className="settings-row-sub">Choose your preferred color scheme</div>
          </div>
          <div className="theme-toggle" role="group" aria-label="Theme selector">
            <button
              className={`theme-opt${theme === 'dark' ? ' active' : ''}`}
              onClick={() => { setTheme('dark') }}
              aria-pressed={theme === 'dark'}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
              Dark
            </button>
            <button
              className={`theme-opt${theme === 'light' ? ' active' : ''}`}
              onClick={() => { setTheme('light') }}
              aria-pressed={theme === 'light'}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
              Light
            </button>
          </div>
        </div>

        <div className="settings-sep" />

        <div className="settings-shortcuts-section">
          <div className="settings-section-lbl">Keyboard shortcuts</div>
          <div className="settings-row">
            <div className="settings-row-label">Capture</div>
            <span className="cap-kbd" style={{ fontSize: '10px' }}>C</span>
          </div>
          <div className="settings-row">
            <div className="settings-row-label">Now view</div>
            <span className="cap-kbd" style={{ fontSize: '10px' }}>1</span>
          </div>
          <div className="settings-row">
            <div className="settings-row-label">What view</div>
            <span className="cap-kbd" style={{ fontSize: '10px' }}>2</span>
          </div>
          <div className="settings-row">
            <div className="settings-row-label">Who view</div>
            <span className="cap-kbd" style={{ fontSize: '10px' }}>3</span>
          </div>
          <div className="settings-sep" />
        </div>

        {showInstallSection && (
          <>
            <div className="settings-section-lbl">Install</div>
            <div className="settings-row settings-row-install">
              <div className="settings-install-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2v9M5.5 7.5 9 11l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 13v1.5A1.5 1.5 0 003.5 16h11a1.5 1.5 0 001.5-1.5V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div className="settings-row-label">
                  {isIOS ? 'Install on iPhone / iPad' : 'Install App'}
                </div>
                <div className="settings-row-sub">
                  {isIOS
                    ? 'Add to your home screen via Safari'
                    : 'Add Compass to your home screen or desktop'}
                </div>
              </div>
              {isIOS ? (
                <button className="settings-install-btn" onClick={() => { setShowIOS(true) }}>
                  Install
                </button>
              ) : deferredPrompt ? (
                <button
                  className="settings-install-btn"
                  onClick={() => { void deferredPrompt.prompt(); setDeferredPrompt(null) }}
                >
                  Install
                </button>
              ) : (
                <button className="settings-install-btn" onClick={() => { setShowAndroid(true) }}>
                  Install
                </button>
              )}
            </div>
            <div className="settings-sep" />
          </>
        )}

        {!isTauri && (
          <>
            <div className="settings-section-lbl">Privacy</div>
            <div className="settings-row">
              <div>
                <div className="settings-row-label">Share analytics</div>
                <div className="settings-row-sub">Helps us improve Compass. No personal data is collected or shared.</div>
              </div>
              <label className="settings-toggle" aria-label="Share analytics">
                <input
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={(e) => { setAnalyticsEnabled(e.target.checked) }}
                />
                <span className="settings-toggle-track" />
              </label>
            </div>

            <div className="settings-sep" />
          </>
        )}

        <div className="settings-section-lbl">Data</div>
        <div className="settings-row settings-row-danger">
          <div>
            <div className="settings-row-label">Reset Compass</div>
            <div className="settings-row-sub">Restore all data to the demo state</div>
          </div>
          {confirmReset ? (
            <div className="settings-reset-confirm">
              <span className="settings-reset-msg">This will erase all your data.</span>
              <button className="settings-reset-yes" onClick={handleReset}>Confirm</button>
              <button className="settings-reset-no" onClick={() => { setConfirmReset(false) }}>Cancel</button>
            </div>
          ) : (
            <button className="settings-reset-btn" onClick={() => { setConfirmReset(true) }}>
              Reset
            </button>
          )}
        </div>
        <div className="settings-row settings-row-danger">
          <div>
            <div className="settings-row-label">Clear Data</div>
            <div className="settings-row-sub">Delete everything and start with a blank slate</div>
          </div>
          {confirmClear ? (
            <div className="settings-reset-confirm">
              <span className="settings-reset-msg">This will erase all your data.</span>
              <button className="settings-reset-yes" onClick={handleClear}>Confirm</button>
              <button className="settings-reset-no" onClick={() => { setConfirmClear(false) }}>Cancel</button>
            </div>
          ) : (
            <button className="settings-reset-btn" onClick={() => { setConfirmClear(true) }}>
              Clear
            </button>
          )}
        </div>
      </div>
      </div>
      {showIOS && <IOSInstallSheet onDismiss={() => { setShowIOS(false) }} />}
      {showAndroid && <AndroidInstallSheet onDismiss={() => { setShowAndroid(false) }} />}
    </>
  )
}
