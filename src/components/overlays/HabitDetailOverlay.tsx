import { useEffect, useRef, useState } from 'react'

import { useCompassStore, type HabitStatus, type HabitFrequency, isHabitDone } from '@/store/useCompassStore'
import { useNow } from '@/hooks/useNow'

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.5 3h10M4.5 3V2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M5.5 6v4M7.5 6v4M2.5 3l.6 7.1A1 1 0 0 0 4.1 11h4.8a1 1 0 0 0 1-.9L10.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 5.5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function parseTags(raw: string): string[] {
  return raw
    .split(/\s+/)
    .filter((t) => t.startsWith('#'))
    .map((t) => t.slice(1))
    .filter(Boolean)
}

function autoResize(el: HTMLTextAreaElement) {
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight.toString()}px`
}

function StreakDots({ history }: { history: string[] }) {
  const historySet = new Set(history)
  return (
    <div className="hbd-streak-dots">
      {Array.from({ length: 14 }, (_, i) => {
        const daysAgo = 13 - i
        const d = new Date()
        d.setDate(d.getDate() - daysAgo)
        const done = historySet.has(d.toISOString().slice(0, 10))
        const cls = !done ? 'hd' : daysAgo === 0 ? 'hd ful' : daysAgo <= 3 ? 'hd hi' : 'hd on'
        return <div key={i} className={cls} />
      })}
    </div>
  )
}

export function HabitDetailOverlay() {
  const {
    habits,
    captures,
    habitDetailId,
    openHabitDetail,
    toggleHabit,
    updateHabit,
    updateCapture,
    deleteHabit,
  } = useCompassStore()

  const habit = habits.find((h) => h.id === habitDetailId) ?? null
  const isOpen = habit !== null
  const habitCaptures = habit ? captures.filter((c) => c.routedTo === habit.id) : []
  const now = useNow()
  const done = habit ? isHabitDone(habit, now) : false

  const [editingCaptureId, setEditingCaptureId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')

  const [nameVal, setNameVal] = useState('')
  const [detailsVal, setDetailsVal] = useState('')
  const [tagsText, setTagsText] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const detailsRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (habit) {
      setNameVal(habit.name)
      setDetailsVal(habit.details)
      setTagsText(habit.tags.length > 0 ? habit.tags.map((t) => `#${t}`).join(' ') : '')
      setConfirmDelete(false)
      setTimeout(() => {
        if (detailsRef.current) autoResize(detailsRef.current)
      }, 0)
    }
    // intentionally only reset when the selected habit ID changes, not on every habit update
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habitDetailId])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (confirmDelete) { setConfirmDelete(false); return }
        if (isOpen) openHabitDetail(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey) }
  }, [isOpen, confirmDelete, openHabitDetail])

  function saveName() {
    const trimmed = nameVal.trim()
    if (habit) updateHabit(habit.id, { name: trimmed || habit.name })
  }

  function saveDetails() {
    if (habit) updateHabit(habit.id, { details: detailsVal.trim() })
  }

  function saveTags() {
    if (habit) updateHabit(habit.id, { tags: parseTags(tagsText) })
  }

  if (!habit) return <div className="fd-overlay" />

  const statusClass =
    habit.status === 'active' ? 'hbd-status-active' :
    habit.status === 'parked' ? 'hbd-status-parked' :
    'hbd-status-complete'

  return (
    <div className={`fd-overlay${isOpen ? ' open' : ''}`} onClick={() => { openHabitDetail(null) }}>
      <div className="fd-card hbd-card" onClick={(e) => { e.stopPropagation() }}>

        {/* Header */}
        <div className="fd-hd">
          <div className="hbd-icon">◎</div>
          <input
            className="fd-field fd-field-name"
            value={nameVal}
            onChange={(e) => { setNameVal(e.target.value) }}
            onBlur={saveName}
            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
          />
          <button className="fd-del-btn" title="Delete habit" onClick={() => { setConfirmDelete(true) }}>
            <TrashIcon />
          </button>
        </div>

        {/* Confirm delete */}
        {confirmDelete && (
          <div className="fd-confirm">
            <span className="fd-confirm-msg">Delete this habit permanently?</span>
            <button className="fd-confirm-yes" onClick={() => { deleteHabit(habit.id) }}>Delete</button>
            <button className="fd-confirm-no" onClick={() => { setConfirmDelete(false) }}>Cancel</button>
          </div>
        )}

        {/* Details */}
        <textarea
          ref={detailsRef}
          className="fd-field fd-field-process"
          placeholder="Add details about this habit…"
          value={detailsVal}
          rows={1}
          onChange={(e) => { setDetailsVal(e.target.value); autoResize(e.currentTarget) }}
          onBlur={saveDetails}
        />

        <div className="fd-meta">
          {/* Status */}
          <div className="fd-meta-row">
            <span className="fd-meta-lbl">Status</span>
            <select
              className={`fd-status-select ${statusClass}`}
              value={habit.status}
              onChange={(e) => { updateHabit(habit.id, { status: e.target.value as HabitStatus }) }}
            >
              <option value="active">Active</option>
              <option value="parked">Parked</option>
              <option value="complete">Complete</option>
            </select>
          </div>

          {/* Tags */}
          <div className="fd-meta-row">
            <span className="fd-meta-lbl">Tags</span>
            <input
              className="fd-tags-input"
              placeholder="#add #tags"
              value={tagsText}
              onChange={(e) => { setTagsText(e.target.value) }}
              onBlur={saveTags}
              onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
            />
          </div>

          {/* Frequency */}
          <div className="fd-meta-row">
            <span className="fd-meta-lbl">Every</span>
            <select
              className="hbd-freq-select"
              value={habit.frequency}
              onChange={(e) => { updateHabit(habit.id, { frequency: e.target.value as HabitFrequency }) }}
            >
              <option value="hourly">Hour</option>
              <option value="daily">Day</option>
              <option value="weekly">Week</option>
            </select>
          </div>
        </div>

        <div className="fd-sep" />

        {/* Linked captures */}
        {habitCaptures.length > 0 && (
          <>
            <div className="fd-sect-lbl">Notes</div>
            <div className="hbd-captures">
              {habitCaptures.map((c) => (
                <div key={c.id} className="hbd-capture-row">
                  {editingCaptureId === c.id ? (
                    <textarea
                      className="hbd-capture-edit"
                      value={editingText}
                      rows={1}
                      autoFocus
                      onChange={(e) => { setEditingText(e.target.value); autoResize(e.currentTarget) }}
                      onFocus={(e) => { const len = e.target.value.length; e.target.setSelectionRange(len, len) }}
                      onBlur={() => {
                        const trimmed = editingText.trim()
                        if (trimmed) updateCapture(c.id, trimmed)
                        setEditingCaptureId(null)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.currentTarget.blur() }
                        if (e.key === 'Escape') { setEditingCaptureId(null) }
                      }}
                    />
                  ) : (
                    <span
                      className="hbd-capture-text"
                      onClick={() => { setEditingCaptureId(c.id); setEditingText(c.text) }}
                    >
                      {c.text}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="fd-sep" />
          </>
        )}

        {/* Streak section */}
        <div className="fd-sect-lbl">Streak</div>
        <div className="hbd-streak-row">
          <div className="hbd-streak-info">
            <span className="hbd-streak-count">{habit.streakCount}</span>
            <span className="hbd-streak-unit">day streak</span>
          </div>
          <StreakDots history={habit.history} />
        </div>

        {/* Mark done button */}
        <button
          className={`hbd-done-btn${done ? ' done' : ''}`}
          onClick={() => { toggleHabit(habit.id) }}
        >
          {done ? (
            <>
              <CheckIcon />
              Done — tap to undo
            </>
          ) : (
            'Mark as done'
          )}
        </button>

        <div className="fd-foot">
          <span className="fd-hint">esc to close · click outside to dismiss</span>
        </div>
      </div>
    </div>
  )
}
