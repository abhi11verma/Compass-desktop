import { useEffect, useRef, useState } from 'react'

import { SheetClose } from '@/components/layout/SheetClose'
import { useCompassStore } from '@/store/useCompassStore'

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.5 3h10M4.5 3V2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M5.5 6v4M7.5 6v4M2.5 3l.6 7.1A1 1 0 0 0 4.1 11h4.8a1 1 0 0 0 1-.9L10.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function autoResize(el: HTMLTextAreaElement) {
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight.toString()}px`
}

export function ValueDetailOverlay() {
  const { values, valueDetailId, openValueDetail, updateValue, deleteValue } = useCompassStore()

  const value = values.find((v) => v.id === valueDetailId) ?? null
  const isOpen = value !== null

  const [nameVal, setNameVal] = useState('')
  const [descVal, setDescVal] = useState('')
  const [noteVal, setNoteVal] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const descRef = useRef<HTMLTextAreaElement>(null)
  const noteRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (value) {
      setNameVal(value.name)
      setDescVal(value.description)
      setNoteVal(value.note)
      setConfirmDelete(false)
      setTimeout(() => {
        if (descRef.current) autoResize(descRef.current)
        if (noteRef.current) autoResize(noteRef.current)
      }, 0)
    }
    // only reset when selected value ID changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueDetailId])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (confirmDelete) { setConfirmDelete(false); return }
        if (isOpen) openValueDetail(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey) }
  }, [isOpen, confirmDelete, openValueDetail])

  function saveName() {
    const trimmed = nameVal.trim()
    if (value) updateValue(value.id, { name: trimmed || value.name })
  }

  function saveDesc() {
    if (value) updateValue(value.id, { description: descVal.trim() })
  }

  function saveNote() {
    if (value) updateValue(value.id, { note: noteVal.trim() })
  }

  if (!value) return <div className="fd-overlay" />

  return (
    <div className={`fd-overlay${isOpen ? ' open' : ''}`} onClick={() => { openValueDetail(null) }}>
      <div className="fd-card vd-card" onClick={(e) => { e.stopPropagation() }}>
        <SheetClose onClose={() => { openValueDetail(null) }} onDelete={() => { setConfirmDelete(true) }} />

        {/* Header */}
        <div className="fd-hd">
          <div className="vd-icon">◈</div>
          <input
            className="fd-field fd-field-name"
            value={nameVal}
            onChange={(e) => { setNameVal(e.target.value) }}
            onBlur={saveName}
            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
          />
          <button className="fd-del-btn" title="Delete value" onClick={() => { setConfirmDelete(true) }}>
            <TrashIcon />
          </button>
        </div>

        {/* Confirm delete */}
        {confirmDelete && (
          <div className="fd-confirm">
            <span className="fd-confirm-msg">Delete this value permanently?</span>
            <button className="fd-confirm-yes" onClick={() => { deleteValue(value.id) }}>Delete</button>
            <button className="fd-confirm-no" onClick={() => { setConfirmDelete(false) }}>Cancel</button>
          </div>
        )}

        {/* Description */}
        <textarea
          ref={descRef}
          className="fd-field fd-field-process"
          placeholder="Short description of this value…"
          value={descVal}
          rows={1}
          onChange={(e) => { setDescVal(e.target.value); autoResize(e.currentTarget) }}
          onBlur={saveDesc}
        />

        <div className="fd-meta">
          {/* Visibility toggle */}
          <div className="vd-meta-row">
            <span className="vd-meta-lbl">Visibility</span>
            <button
              className="vd-vis-toggle"
              onClick={() => { updateValue(value.id, { hidden: !value.hidden }) }}
            >
              {value.hidden ? 'Hidden' : 'Show'}
            </button>
          </div>
        </div>

        <div className="fd-sep" />

        {/* Note */}
        <div className="fd-sect-lbl">Note</div>
        <textarea
          ref={noteRef}
          className="fd-field vd-note"
          placeholder="Any personal thoughts or context about this value…"
          value={noteVal}
          rows={2}
          onChange={(e) => { setNoteVal(e.target.value); autoResize(e.currentTarget) }}
          onBlur={saveNote}
        />

        <div className="fd-foot">
          <span className="fd-hint">esc to close · click outside to dismiss</span>
        </div>
      </div>
    </div>
  )
}
