import { useRegisterSW } from "virtual:pwa-register/react"

export function PwaUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  if (!needRefresh) return null

  return (
    <div className="pwa-update-prompt">
      <span>A new version is available.</span>
      <div className="pwa-update-actions">
        <button
          className="pwa-update-btn pwa-update-btn--primary"
          onClick={() => { void updateServiceWorker(true) }}
        >
          Update
        </button>
        <button
          className="pwa-update-btn pwa-update-btn--ghost"
          onClick={() => { setNeedRefresh(false) }}
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}
