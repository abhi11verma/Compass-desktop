import { useEffect, useRef, useState } from 'react'

import { SheetClose } from '@/components/layout/SheetClose'
import { useCompassStore, type Principle } from '@/store/useCompassStore'

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.5 3h10M4.5 3V2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M5.5 6v4M7.5 6v4M2.5 3l.6 7.1A1 1 0 0 0 4.1 11h4.8a1 1 0 0 0 1-.9L10.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
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

export function PrincipleDetailOverlay() {
  const {
    principles,
    principleDetailId,
    openPrincipleDetail,
    updatePrinciple,
    deletePrinciple,
  } = useCompassStore()

  const principle = principles.find((p) => p.id === principleDetailId) ?? null
  const isOpen = principle !== null

  const [cueVal, setCueVal] = useState('')
  const [tagsText, setTagsText] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const cueRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (principle) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCueVal(principle.cue)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTagsText(principle.tags.length > 0 ? principle.tags.map((t) => `#${t}`).join(' ') : '')
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConfirmDelete(false)
      setTimeout(() => {
        if (cueRef.current) autoResize(cueRef.current)
      }, 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [principleDetailId])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (confirmDelete) { setConfirmDelete(false); return }
        if (isOpen) openPrincipleDetail(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey) }
  }, [isOpen, confirmDelete, openPrincipleDetail])

  function saveCue() {
    const trimmed = cueVal.trim()
    if (principle) updatePrinciple(principle.id, { cue: trimmed || principle.cue })
  }

  function saveTags() {
    if (principle) updatePrinciple(principle.id, { tags: parseTags(tagsText) })
  }

  if (!principle) return <div className="fd-overlay" />

  const statusClass =
    principle.status === 'active' ? 'pd-status-active' : 'pd-status-queue'

  return (
    <div className={`fd-overlay${isOpen ? ' open' : ''}`} onClick={() => { openPrincipleDetail(null) }}>
      <div className="fd-card pd-card" onClick={(e) => { e.stopPropagation() }}>
        <SheetClose onClose={() => { openPrincipleDetail(null) }} onDelete={() => { setConfirmDelete(true) }} />

        {/* Header */}
        <div className="fd-hd">
          <div className="pd-icon">◈</div>
          <textarea
            ref={cueRef}
            className="fd-field fd-field-name pd-cue-field"
            value={cueVal}
            rows={1}
            onChange={(e) => { setCueVal(e.target.value); autoResize(e.currentTarget) }}
            onBlur={saveCue}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.currentTarget.blur() } }}
          />
          <button className="fd-del-btn" title="Delete principle" onClick={() => { setConfirmDelete(true) }}>
            <TrashIcon />
          </button>
        </div>

        {/* Confirm delete */}
        {confirmDelete && (
          <div className="fd-confirm">
            <span className="fd-confirm-msg">Delete this principle permanently?</span>
            <button className="fd-confirm-yes" onClick={() => { deletePrinciple(principle.id) }}>Delete</button>
            <button className="fd-confirm-no" onClick={() => { setConfirmDelete(false) }}>Cancel</button>
          </div>
        )}

        <div className="fd-meta">
          {/* Status */}
          <div className="fd-meta-row">
            <span className="fd-meta-lbl">Status</span>
            <select
              className={`fd-status-select ${statusClass}`}
              value={principle.status}
              onChange={(e) => { updatePrinciple(principle.id, { status: e.target.value as Principle['status'] }) }}
            >
              <option value="active">Active</option>
              <option value="queue">Queue</option>
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

        {/* Days active */}
        <div className="pd-days-row">
          <span className="pd-days-lbl">Days active</span>
          <span className="pd-days-val">{principle.daysActive}</span>
        </div>

        <div className="fd-foot">
          <span className="fd-hint">esc to close · click outside to dismiss</span>
        </div>
      </div>
    </div>
  )
}
