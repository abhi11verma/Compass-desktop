import { useCompassStore } from '@/store/useCompassStore'
import { formatTopbarDate } from '@/lib/dates'

export function Topbar() {
  const { view, setView, captures, setCaptureOpen } = useCompassStore()
  const unrouted = captures.filter((c) => !c.processed).length

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="app-brand">
          <span className="app-name">compass</span>
          <span className="topbar-date">{formatTopbarDate()}</span>
        </div>
      </div>

      <div className="seg">
        <button className={`seg-btn${view === 'now' ? ' active' : ''}`} onClick={() => setView('now')}>Now</button>
        <button className={`seg-btn${view === 'what' ? ' active' : ''}`} onClick={() => setView('what')}>What</button>
        <button className={`seg-btn${view === 'who' ? ' active' : ''}`} onClick={() => setView('who')}>Who</button>
      </div>

      <div className="topbar-right">
        {unrouted > 0 && (
          <div className="inbox-pill">
            <div className="inbox-dot">{unrouted}</div>
            <span>to route</span>
          </div>
        )}
        <button className="cap-btn" onClick={() => setCaptureOpen(true)}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          capture
          <span className="cap-kbd">C</span>
        </button>
      </div>
    </div>
  )
}
