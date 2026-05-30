import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PwaInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault()
      setPromptEvent(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    return () => { window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt) }
  }, [])

  if (!promptEvent) return null

  return (
    <div className="pwa-update-prompt">
      <span>Install Compass on your device.</span>
      <div className="pwa-update-actions">
        <button
          className="pwa-update-btn pwa-update-btn--primary"
          onClick={() => { void promptEvent.prompt(); setPromptEvent(null) }}
        >
          Install
        </button>
        <button
          className="pwa-update-btn pwa-update-btn--ghost"
          onClick={() => { setPromptEvent(null) }}
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}
