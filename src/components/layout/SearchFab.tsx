import { useEffect, useRef, useState } from 'react'

import { useCompassStore } from '@/store/useCompassStore'

export function SearchFab() {
  const {
    view, searchQuery, setSearchQuery,
    captureOpen, inboxOpen, focusDetailId, habitDetailId, valueDetailId, principleDetailId,
  } = useCompassStore()
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const anyOverlayOpen = captureOpen || inboxOpen || focusDetailId !== null || habitDetailId !== null || valueDetailId !== null || principleDetailId !== null
  const showFab = (view === 'what' || view === 'who') && !anyOverlayOpen

  useEffect(() => {
    if (open) {
      setTimeout(() => { inputRef.current?.focus() }, 50)
    }
  }, [open])

  // Close overlay when view changes away
  useEffect(() => {
    if (view !== 'what' && view !== 'who') {
      setTimeout(() => {
        setOpen(false)
        setSearchQuery('')
      }, 0)
    }
  }, [view, setSearchQuery])

  function handleClose() {
    setOpen(false)
    setSearchQuery('')
  }

  if (!showFab) return null

  return (
    <>
      <button
        className={`search-fab${searchQuery ? ' search-fab--active' : ''}`}
        onClick={() => { setOpen(true) }}
        aria-label="Search"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.6"/>
          <path d="M12 12L16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <>
          <div className="search-fab-backdrop" onClick={handleClose} />
          <div className="search-fab-bar">
            <svg className="search-fab-bar-icon" width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.6"/>
              <path d="M12 12L16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            <input
              ref={inputRef}
              className="search-fab-input"
              type="text"
              placeholder="search…"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value) }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') handleClose()
              }}
            />
            <button
              className="search-fab-close"
              onClick={handleClose}
              aria-label="Close search"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </>
      )}
    </>
  )
}
