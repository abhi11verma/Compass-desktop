import { useRef, useState } from 'react'

import { useCompassStore, type Focus } from '@/store/useCompassStore'

const DOT_COLOR: Record<Focus['color'], string> = {
  green:  '#3A8F68',
  indigo: '#5C6DC4',
  amber:  '#B8772A',
  rose:   '#B85870',
  teal:   '#3A9190',
}

function AddFocusForm({ onClose }: { onClose: () => void }) {
  const { addFocus } = useCompassStore()
  const [name, setName] = useState('')
  const [process, setProcess] = useState('')
  const nameRef = useRef<HTMLInputElement>(null)

  function handleSave() {
    const trimmed = name.trim()
    if (!trimmed) return
    addFocus(trimmed, process.trim())
    onClose()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') onClose()
  }

  return (
    <div className="add-form">
      <input
        ref={nameRef}
        autoFocus
        className="add-form-input"
        placeholder="Focus name"
        value={name}
        onChange={(e) => { setName(e.target.value) }}
        onKeyDown={handleKeyDown}
      />
      <input
        className="add-form-input sub"
        placeholder="How will you work on it? (optional)"
        value={process}
        onChange={(e) => { setProcess(e.target.value) }}
        onKeyDown={handleKeyDown}
      />
      <div className="add-form-foot">
        <button className="add-form-save" onClick={handleSave}>Add</button>
        <button className="add-form-cancel" onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
}

function AddHabitForm({ onClose }: { onClose: () => void }) {
  const { addHabit } = useCompassStore()
  const [name, setName] = useState('')

  function handleSave() {
    const trimmed = name.trim()
    if (!trimmed) return
    addHabit(trimmed)
    onClose()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') onClose()
  }

  return (
    <div className="add-form">
      <input
        autoFocus
        className="add-form-input"
        placeholder="Habit name"
        value={name}
        onChange={(e) => { setName(e.target.value) }}
        onKeyDown={handleKeyDown}
      />
      <div className="add-form-foot">
        <button className="add-form-save" onClick={handleSave}>Add</button>
        <button className="add-form-cancel" onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
}

export function WhatView() {
  const { focuses, habits, openFocusDetail, openHabitDetail } = useCompassStore()
  const [addingFocus, setAddingFocus] = useState(false)
  const [addingHabit, setAddingHabit] = useState(false)

  const active = focuses.filter((f) => f.status !== 'parked')
  const parked = focuses.filter((f) => f.status === 'parked')
  const activeSummary = `${active.length.toString()} active${parked.length > 0 ? ` · ${parked.length.toString()} parked` : ''}`

  const activeHabits = habits.filter((h) => h.status === 'active')
  const parkedHabits = habits.filter((h) => h.status === 'parked')
  const completeHabits = habits.filter((h) => h.status === 'complete')
  const habitSummary = [
    activeHabits.length > 0 && `${activeHabits.length.toString()} active`,
    parkedHabits.length > 0 && `${parkedHabits.length.toString()} parked`,
    completeHabits.length > 0 && `${completeHabits.length.toString()} complete`,
  ].filter(Boolean).join(' · ') || '0 active'

  return (
    <div className="what-view">
      <div className="what-col what-col-focus">
        <div className="list-hd">
          Focuses
          <span className="list-hd-ct">{activeSummary}</span>
        </div>
        <div className="list-card">
          <div className="list-items">
            {active.map((f) => (
              <div className="l-row" key={f.id} onClick={() => { openFocusDetail(f.id) }}>
                <div className="l-dot" style={{ background: DOT_COLOR[f.color] }} />
                <div className="l-body">
                  <div className="l-name">{f.name}</div>
                  <div className="l-sub">{f.process}</div>
                  {f.tags.length > 0 && (
                    <div className="l-tags">
                      {f.tags.map((t) => <span className="chip chip-tag" key={t}>{t}</span>)}
                    </div>
                  )}
                </div>
                <div className="l-right">
                  <span className={`chip${f.status === 'active' ? ' chip-status-active' : ' chip-status-parked'}`}>
                    {f.status === 'active' ? 'Active' : 'Parked'}
                  </span>
                  <span className="l-age">{f.daysActive}d</span>
                </div>
              </div>
            ))}
            {parked.map((f) => (
              <div className="l-row" key={f.id} onClick={() => { openFocusDetail(f.id) }}>
                <div className="l-dot" style={{ background: 'rgba(255,255,255,0.22)' }} />
                <div className="l-body">
                  <div className="l-name" style={{ color: 'var(--ink-2)' }}>{f.name}</div>
                  <div className="l-sub">{f.process}</div>
                  {f.tags.length > 0 && (
                    <div className="l-tags">
                      {f.tags.map((t) => <span className="chip chip-tag" key={t}>{t}</span>)}
                    </div>
                  )}
                </div>
                <div className="l-right">
                  <span className="chip chip-status-parked">Parked</span>
                </div>
              </div>
            ))}
          </div>
          {addingFocus ? (
            <AddFocusForm onClose={() => { setAddingFocus(false) }} />
          ) : (
            <button className="add-btn" onClick={() => { setAddingFocus(true) }}>
              <span className="add-btn-icon">+</span> Add focus
            </button>
          )}
        </div>
      </div>

      <div className="what-col what-col-habits">
        <div className="list-hd">
          Habits
          <span className="list-hd-ct">{habitSummary}</span>
        </div>
        <div className="list-card">
          <div className="list-items">
            {habits.map((h) => {
              const displayDots = Array(14).fill(0).map((_, i) => {
                const daysAgo = 13 - i
                if (daysAgo < h.streakCount) return daysAgo < 3 ? 3 : daysAgo < 6 ? 2 : 1
                return 0
              })
              const isComplete = h.status === 'complete'
              const isParked = h.status === 'parked'
              return (
                <div
                  className="hl-row hl-row-clickable"
                  key={h.id}
                  onClick={() => { openHabitDetail(h.id) }}
                >
                  <div className="hl-body">
                    <div className="hl-name-row">
                      <span className={`hl-name${isComplete || isParked ? ' hl-name-muted' : ''}`}>{h.name}</span>
                      {h.tags.length > 0 && (
                        <div className="hl-chips">
                          {h.tags.map((t) => <span className="chip chip-tag" key={t}>{t}</span>)}
                        </div>
                      )}
                    </div>
                    {!isComplete && (
                      <div className="hl-dots">
                        {displayDots.map((level, i) => {
                          const cls = level === 0 ? 'hd' : level === 1 ? 'hd on' : level === 2 ? 'hd hi' : 'hd ful'
                          return <div key={i} className={cls} />
                        })}
                      </div>
                    )}
                  </div>
                  <div className="l-right">
                    <span className={
                      isComplete ? 'chip chip-status-complete' :
                      isParked ? 'chip chip-status-parked' :
                      'chip chip-status-active'
                    }>
                      {h.status === 'active' ? 'Active' : h.status === 'parked' ? 'Parked' : 'Complete'}
                    </span>
                    {!isComplete && <span className="hl-streak">{h.streakCount}d</span>}
                  </div>
                </div>
              )
            })}
          </div>
          {addingHabit ? (
            <AddHabitForm onClose={() => { setAddingHabit(false) }} />
          ) : (
            <button className="add-btn" onClick={() => { setAddingHabit(true) }}>
              <span className="add-btn-icon">+</span> Add habit
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
