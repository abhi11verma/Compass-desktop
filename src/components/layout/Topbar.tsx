import { useRef } from 'react'

import { formatTopbarDate } from '@/lib/dates'
import { useCompassStore } from '@/store/useCompassStore'

export function Topbar() {
  const { view, setView, captures, setCaptureOpen, setInboxOpen, searchQuery, setSearchQuery } = useCompassStore()
  const unrouted = captures.filter((c) => !c.processed).length
  const showSearch = view === 'what' || view === 'who'
  const searchRef = useRef<HTMLInputElement>(null)

  return (
    <div className="topbar" data-tauri-drag-region>
      <div className="topbar-left">
        <div className="app-brand">
          <span className="app-name">compass</span>
          <span className="topbar-date">{formatTopbarDate()}</span>
        </div>
      </div>

      <div className="seg">
        <button className={`seg-btn${view === 'now' ? ' active' : ''}`} onClick={() => { setView('now') }}>Now</button>
        <button className={`seg-btn${view === 'what' ? ' active' : ''}`} onClick={() => { setView('what') }}>What</button>
        <button className={`seg-btn${view === 'who' ? ' active' : ''}`} onClick={() => { setView('who') }}>Who</button>
      </div>

      <div className="topbar-right">
        {showSearch && (
          <div className="topbar-search-wrap">
            <svg className="topbar-search-icon" width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
              <circle cx="4.5" cy="4.5" r="3.5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M7.5 7.5L10 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <input
              ref={searchRef}
              className="topbar-search"
              type="text"
              placeholder="search…"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value) }}
              onKeyDown={(e) => { if (e.key === 'Escape') { setSearchQuery(''); searchRef.current?.blur() } }}
            />
            {searchQuery && (
              <button className="topbar-search-clear" onClick={() => { setSearchQuery(''); searchRef.current?.focus() }} aria-label="Clear search">
                ×
              </button>
            )}
          </div>
        )}
        {unrouted > 0 && (
          <button className="inbox-pill" onClick={() => { setInboxOpen(true) }}>
            <div className="inbox-dot">{unrouted}</div>
            <span>to route</span>
          </button>
        )}
        <button className="cap-btn" onClick={() => { setCaptureOpen(true) }}>
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
