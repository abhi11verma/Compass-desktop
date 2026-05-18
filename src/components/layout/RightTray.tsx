import { useState } from 'react'

import { useCompassStore } from '@/store/useCompassStore'

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 12 12" fill="none"
      style={{ transition: 'transform 0.2s', transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }}
      aria-hidden="true"
    >
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

interface TrayCardProps {
  label: string
  defaultOpen?: boolean
  children: React.ReactNode
}

function TrayCard({ label, defaultOpen = true, children }: TrayCardProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="tcard">
      <button className="tcard-lbl tcard-lbl-btn" onClick={() => { setOpen((o) => !o) }}>
        {label}
        <ChevronIcon open={open} />
      </button>
      {open && children}
    </div>
  )
}

export function RightTray() {
  const { habits, reminders, toggleHabit, dismissReminder } = useCompassStore()
  const activeReminders = reminders.filter((r) => !r.dismissed)

  return (
    <div className="col-tray">
      <TrayCard label="Habits">
        {habits.map((h) => (
          <div className="h-row" key={h.id} onClick={() => { toggleHabit(h.id) }}>
            <div className={`hck${h.completedToday ? ' done' : ''}`} />
            <div className="h-info">
              <div className={`h-name${h.completedToday ? ' done' : ''}`}>{h.name}</div>
              <div className="h-streak">{h.streakCount}d streak</div>
            </div>
          </div>
        ))}
      </TrayCard>

      {activeReminders.length > 0 && (
        <TrayCard label="Reminders">
          {activeReminders.map((r) => (
            <div className="r-row" key={r.id}>
              <span className="r-time">{r.time}</span>
              <span className="r-text">{r.text}</span>
              <button
                className="r-x"
                aria-label="Dismiss"
                onClick={() => { dismissReminder(r.id) }}
              >
                ×
              </button>
            </div>
          ))}
        </TrayCard>
      )}
    </div>
  )
}
