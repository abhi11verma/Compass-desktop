import { useEffect, useRef } from 'react'

import { useThemeStore } from '@/store/useThemeStore'

interface SettingsDialogProps {
  open: boolean
  onClose: () => void
}

export function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const { theme, setTheme } = useThemeStore()
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose() }
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey) }
  }, [open, onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) { onClose() }
  }

  return (
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
      </div>
    </div>
  )
}
