import { useCompassStore } from '@/store/useCompassStore'

export function CaptureFab() {
  const { setCaptureOpen, inboxOpen } = useCompassStore()

  if (inboxOpen) return null

  return (
    <button
      className="capture-fab"
      onClick={() => { setCaptureOpen(true) }}
      aria-label="Capture"
    >
      <svg width="18" height="18" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </button>
  )
}
