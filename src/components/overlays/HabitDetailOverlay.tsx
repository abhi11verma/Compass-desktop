import { useEffect, useRef, useState } from 'react'

import { useCompassStore, type HabitStatus } from '@/store/useCompassStore'

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

function StreakDots({ streakCount }: { streakCount: number }) {
  const dots = Array(14).fill(0).map((_, i) => {
    const daysAgo = 13 - i
    if (daysAgo < streakCount) return daysAgo < 3 ? 3 : daysAgo < 6 ? 2 : 1
    return 0
  })
  return (
    <div className="hbd-streak-dots">
      {dots.map((level, i) => {
        const cls = level === 0 ? 'hd' : level === 1 ? 'hd on' : level === 2 ? 'hd hi' : 'hd ful'
        return <div key={i} className={cls} />
      })}
    </div>
  )
}

export function HabitDetailOverlay() {
  const {
    habits,
    habitDetailId,
    openHabitDetail,
    toggleHabit,
    updateHabit,
    deleteHabit,
  } = useCompassStore()

  const habit = habits.find((h) => h.id === habitDetailId) ?? null
  const isOpen = habit !== null

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
        </div>

        <div className="fd-sep" />

        {/* Streak section */}
        <div className="fd-sect-lbl">Streak</div>
        <div className="hbd-streak-row">
          <div className="hbd-streak-info">
            <span className="hbd-streak-count">{habit.streakCount}</span>
            <span className="hbd-streak-unit">day streak</span>
          </div>
          <StreakDots streakCount={habit.streakCount} />
        </div>

        {/* Mark done button */}
        <button
          className={`hbd-done-btn${habit.completedToday ? ' done' : ''}`}
          onClick={() => { toggleHabit(habit.id) }}
        >
          {habit.completedToday ? (
            <>
              <CheckIcon />
              Done today — tap to undo
            </>
          ) : (
            'Mark as done today'
          )}
        </button>

        <div className="fd-foot">
          <span className="fd-hint">esc to close · click outside to dismiss</span>
        </div>
      </div>
    </div>
  )
}
