import { useRef, useState, useEffect } from 'react'
import { useCompassStore } from '@/store/useCompassStore'

export function CaptureOverlay() {
  const { captureOpen, setCaptureOpen, focuses, addCapture } = useCompassStore()
  const [text, setText] = useState('')
  const [selectedFocus, setSelectedFocus] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const activeFocuses = focuses.filter((f) => f.status !== 'parked')

  useEffect(() => {
    if (captureOpen) {
      setTimeout(() => textareaRef.current?.focus(), 60)
    } else {
      setText('')
      setSelectedFocus(null)
    }
  }, [captureOpen])

  function handleSave() {
    const trimmed = text.trim()
    if (trimmed) {
      addCapture(trimmed, selectedFocus)
    }
    setCaptureOpen(false)
  }

  function handleOverlayClick() {
    setCaptureOpen(false)
  }

  return (
    <div className={`cap-overlay${captureOpen ? ' open' : ''}`} onClick={handleOverlayClick}>
      <div className="cap-card" onClick={(e) => e.stopPropagation()}>
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
              onClick={() => setSelectedFocus(selectedFocus === f.id ? null : f.id)}
            >
              {f.name}
            </button>
          ))}
          <button
            className={`rpill${selectedFocus === 'inbox' ? ' sel' : ''}`}
            onClick={() => setSelectedFocus(selectedFocus === 'inbox' ? null : 'inbox')}
          >
            General inbox
          </button>
        </div>
        <div className="cap-foot">
          <span className="cap-hint">esc to dismiss</span>
          <button className="cap-save" onClick={handleSave}>Save →</button>
        </div>
      </div>
    </div>
  )
}
