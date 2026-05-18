import { useState } from 'react'

import { isHabitDone, useCompassStore } from '@/store/useCompassStore'
import { useNow } from '@/hooks/useNow'

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
  const { habits, reminders, toggleHabit, dismissReminder, openHabitDetail } = useCompassStore()
  const now = useNow()
  const activeHabits = habits.filter((h) => h.status === 'active')
  const activeReminders = reminders.filter((r) => !r.dismissed)

  return (
    <div className="col-tray">
      <TrayCard label="Habits">
        {activeHabits.map((h) => {
          const done = isHabitDone(h, now)
          return (
            <div className="h-row" key={h.id}>
              <div
                className={`hck${done ? ' done' : ''}`}
                onClick={() => { toggleHabit(h.id) }}
              />
              <div className="h-info" onClick={() => { openHabitDetail(h.id) }}>
                <div className={`h-name${done ? ' done' : ''}`}>{h.name}</div>
                <div className="h-streak">{h.streakCount}d streak</div>
              </div>
            </div>
          )
        })}
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
