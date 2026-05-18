import { useEffect, useRef, useState } from 'react'

import { useCompassStore } from '@/store/useCompassStore'

function formatAge(isoString: string): string {
  const diffMs = Date.now() - new Date(isoString).getTime()
  const m = Math.floor(diffMs / 60000)
  if (m < 60) return `${String(m)}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${String(h)}h ago`
  return `${String(Math.floor(h / 24))}d ago`
}

export function InboxOverlay() {
  const { inboxOpen, setInboxOpen, captures, focuses, habits, routeCapture, createAndRoute } = useCompassStore()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  const unprocessed = captures.filter((c) => !c.processed)

  useEffect(() => {
    const id = setTimeout(() => {
      if (inboxOpen) {
        setSelectedId(unprocessed[0]?.id ?? null)
        setQuery('')
        searchRef.current?.focus()
      } else {
        setSelectedId(null)
        setQuery('')
      }
    }, 0)
    return () => { clearTimeout(id) }
    // intentionally only reset on open/close, not on every capture change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inboxOpen])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && inboxOpen) setInboxOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey) }
  }, [inboxOpen, setInboxOpen])

  const selected = unprocessed.find((c) => c.id === selectedId) ?? null

  const activeFocuses = focuses.filter((f) => f.status === 'active')
  const activeHabits = habits.filter((h) => h.status === 'active')
  const q = query.toLowerCase()
  const filteredFocuses = q
    ? activeFocuses.filter((f) => f.name.toLowerCase().includes(q))
    : activeFocuses
  const filteredHabits = q
    ? activeHabits.filter((h) => h.name.toLowerCase().includes(q))
    : activeHabits

  function selectCapture(id: string) {
    setSelectedId(id)
    setQuery('')
    setTimeout(() => { searchRef.current?.focus() }, 40)
  }

  function handleRoute(routedTo: string) {
    if (!selected) return
    routeCapture(selected.id, routedTo)
    setQuery('')
    const remaining = unprocessed.filter((c) => c.id !== selected.id)
    setSelectedId(remaining[0]?.id ?? null)
    setTimeout(() => { searchRef.current?.focus() }, 40)
  }

  function handleCreate(type: 'focus' | 'habit') {
    if (!selected || !query.trim()) return
    createAndRoute(selected.id, type, query.trim())
    setQuery('')
    const remaining = unprocessed.filter((c) => c.id !== selected.id)
    setSelectedId(remaining[0]?.id ?? null)
    setTimeout(() => { searchRef.current?.focus() }, 40)
  }

  return (
    <div className={`ibx-overlay${inboxOpen ? ' open' : ''}`} onClick={() => { setInboxOpen(false) }}>
      <div className="ibx-card" onClick={(e) => { e.stopPropagation() }}>

        {/* Left pane — capture list */}
        <div className="ibx-pane-list">
          <div className="ibx-pane-hd">
            <span>Inbox</span>
            {unprocessed.length > 0 && (
              <span className="ibx-count">{unprocessed.length}</span>
            )}
          </div>
          <div className="ibx-items">
            {unprocessed.length === 0 ? (
              <div className="ibx-empty">All clear · nothing to route</div>
            ) : (
              unprocessed.map((c) => (
                <button
                  key={c.id}
                  className={`ibx-item${selectedId === c.id ? ' sel' : ''}`}
                  onClick={() => { selectCapture(c.id) }}
                >
                  <span className="ibx-item-age">{formatAge(c.createdAt)}</span>
                  <span className="ibx-item-text">{c.text}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right pane — route panel */}
        <div className="ibx-pane-route">
          {selected ? (
            <>
              <div className="ibx-pane-hd">
                <span>Route</span>
              </div>
              <div className="ibx-cap-preview">{selected.text}</div>
              <div className="ibx-sep" />
              <div className="ibx-search-lbl">Tag to focus or habit</div>
              <div className="ibx-search-wrap">
                <svg className="ibx-search-icon" width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                  <circle cx="4.5" cy="4.5" r="3.5" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M7.5 7.5L10 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                <input
                  ref={searchRef}
                  className="ibx-search"
                  type="text"
                  placeholder="search…"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value) }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') { setQuery(''); e.stopPropagation() }
                  }}
                />
                {query && (
                  <button
                    className="ibx-search-clear"
                    onClick={() => { setQuery(''); searchRef.current?.focus() }}
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="ibx-results">
                {filteredFocuses.length > 0 && (
                  <>
                    <div className="ibx-sect-lbl">Focuses</div>
                    {filteredFocuses.map((f) => (
                      <button
                        key={f.id}
                        className="ibx-result-row"
                        onClick={() => { handleRoute(f.id) }}
                      >
                        <span className={`ibx-result-dot ibx-dot-${f.color}`} />
                        <span className="ibx-result-name">{f.name}</span>
                        <span className="ibx-result-hint">→ task</span>
                      </button>
                    ))}
                  </>
                )}
                {filteredHabits.length > 0 && (
                  <>
                    <div className="ibx-sect-lbl">Habits</div>
                    {filteredHabits.map((h) => (
                      <button
                        key={h.id}
                        className="ibx-result-row"
                        onClick={() => { handleRoute(h.id) }}
                      >
                        <span className="ibx-result-dot ibx-dot-habit" />
                        <span className="ibx-result-name">{h.name}</span>
                        <span className="ibx-result-hint">→ note</span>
                      </button>
                    ))}
                  </>
                )}
                {filteredFocuses.length === 0 && filteredHabits.length === 0 && (
                  q ? (
                    <>
                      <div className="ibx-no-results">No matches for "{q}"</div>
                      <div className="ibx-create-row">
                        <button className="ibx-create-btn" onClick={() => { handleCreate('focus') }}>
                          <span className="ibx-create-dot ibx-dot-green" />
                          Create New Focus — <span className="ibx-create-name">{query.trim()}</span>
                        </button>
                        <button className="ibx-create-btn" onClick={() => { handleCreate('habit') }}>
                          <span className="ibx-create-dot ibx-dot-habit" />
                          Create New Habit — <span className="ibx-create-name">{query.trim()}</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="ibx-no-results">No active focuses or habits</div>
                  )
                )}
              </div>
            </>
          ) : (
            <div className="ibx-no-selection">
              {unprocessed.length === 0 ? (
                <>
                  <div className="ibx-done-icon">✓</div>
                  <div>Nothing left to route</div>
                </>
              ) : (
                <div>Select a capture to route it</div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
