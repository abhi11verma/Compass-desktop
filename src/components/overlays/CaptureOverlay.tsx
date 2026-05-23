import { useRef, useState, useEffect } from 'react'

import { SheetClose } from '@/components/layout/SheetClose'
import { useCompassStore } from '@/store/useCompassStore'

type CreateAsType = 'habit' | 'focus' | 'principle' | 'value'

const CREATE_AS_OPTIONS: { type: CreateAsType; label: string }[] = [
  { type: 'habit', label: 'Habit' },
  { type: 'focus', label: 'Focus' },
  { type: 'principle', label: 'Principle' },
  { type: 'value', label: 'Value' },
]

export function CaptureOverlay() {
  const { captureOpen, setCaptureOpen, focuses, addCapture, addFocus, addHabit, addPrinciple, addValue } =
    useCompassStore()
  const [text, setText] = useState('')
  const [selectedFocus, setSelectedFocus] = useState<string | null>(null)
  const [createAs, setCreateAs] = useState<CreateAsType | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const activeFocuses = focuses.filter((f) => f.status !== 'parked')

  useEffect(() => {
    if (captureOpen) {
      setTimeout(() => textareaRef.current?.focus(), 60)
    } else {
      setText('')
      setSelectedFocus(null)
      setCreateAs(null)
    }
  }, [captureOpen])

  function handleFocusPillClick(id: string) {
    setSelectedFocus(selectedFocus === id ? null : id)
    setCreateAs(null)
  }

  function handleCreateAsPillClick(type: CreateAsType) {
    setCreateAs(createAs === type ? null : type)
    setSelectedFocus(null)
  }

  function handleSave() {
    const trimmed = text.trim()
    if (trimmed) {
      if (createAs) {
        addCapture(trimmed, null, true)
        if (createAs === 'habit') addHabit(trimmed)
        else if (createAs === 'focus') addFocus(trimmed, '')
        else if (createAs === 'principle') addPrinciple(trimmed)
        else addValue(trimmed)
      } else {
        addCapture(trimmed, selectedFocus)
      }
    }
    setCaptureOpen(false)
  }

  function handleOverlayClick() {
    setCaptureOpen(false)
  }

  return (
    <div className={`cap-overlay${captureOpen ? ' open' : ''}`} onClick={handleOverlayClick}>
      <div className="cap-card" onClick={(e) => e.stopPropagation()}>
        <SheetClose onClose={() => { setCaptureOpen(false) }} />
        <div className="cap-lbl">Capture</div>
        <textarea
          ref={textareaRef}
          className="cap-input"
          placeholder="What's on your mind…"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSave()
          }}
        />
        <div className="cap-div" />
        <div className="cap-rlbl">Route to focus</div>
        <div className="rpills">
          {activeFocuses.map((f) => (
            <button
              key={f.id}
              className={`rpill${selectedFocus === f.id ? ' sel' : ''}`}
              onClick={() => handleFocusPillClick(f.id)}
            >
              {f.name}
            </button>
          ))}
          <button
            className={`rpill${selectedFocus === 'inbox' ? ' sel' : ''}`}
            onClick={() => handleFocusPillClick('inbox')}
          >
            General inbox
          </button>
        </div>
        <div className="cap-rlbl" style={{ marginTop: 12 }}>Create as</div>
        <div className="rpills">
          {CREATE_AS_OPTIONS.map(({ type, label }) => (
            <button
              key={type}
              className={`rpill${createAs === type ? ' sel' : ''}`}
              onClick={() => handleCreateAsPillClick(type)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="cap-foot">
          <span className="cap-hint">esc to dismiss</span>
          <button className="cap-save" onClick={handleSave}>Save →</button>
        </div>
      </div>
    </div>
  )
}
