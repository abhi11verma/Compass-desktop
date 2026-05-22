import { useEffect, useRef, useState } from 'react'

import { isHabitDone, useCompassStore } from '@/store/useCompassStore'
import { useNow } from '@/hooks/useNow'

const DONE_LINGER_MS = 500  // checkmark visible before animation starts
const DISMISS_MS     = 350  // CSS animation duration

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
  const { habits, toggleHabit } = useCompassStore()
  const now = useNow()
  const [dismissing, setDismissing] = useState<Set<string>>(new Set())
  const timerIds = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const ids = timerIds.current
    return () => { ids.forEach(clearTimeout) }
  }, [])

  const activeHabits = habits.filter((h) => h.status === 'active')

  // Show undone habits + habits mid-dismiss-animation (so animation can play out)
  const visibleHabits = activeHabits.filter(
    (h) => dismissing.has(h.id) || !isHabitDone(h, now)
  )

  if (visibleHabits.length === 0) return null

  function handleHabitClick(id: string) {
    const habit = habits.find((h) => h.id === id)
    if (!habit || isHabitDone(habit, now) || dismissing.has(id)) return

    toggleHabit(id)

    // Add to dismissing immediately so the filter keeps it in the DOM.
    // CSS animation-delay handles the linger; animation-fill-mode:both
    // holds opacity:1 during the delay so it stays visible with the checkmark.
    setDismissing((prev) => new Set([...prev, id]))

    const t = setTimeout(() => {
      setDismissing((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, DONE_LINGER_MS + DISMISS_MS)

    timerIds.current.push(t)
  }

  return (
    <div className="col-tray">
      <TrayCard label="Habits">
        {visibleHabits.map((h) => {
          const done = isHabitDone(h, now)
          const isDismissing = dismissing.has(h.id)
          return (
            <div
              className={`h-row h-row--clickable${isDismissing ? ' h-row--dismissing' : ''}`}
              key={h.id}
              onClick={() => { handleHabitClick(h.id) }}
            >
              <div className={`hck${done ? ' done' : ''}`} />
              <div className="h-info">
                <div className={`h-name${done ? ' done' : ''}`}>{h.name}</div>
                <div className="h-streak">{h.streakCount}d streak</div>
              </div>
            </div>
          )
        })}
      </TrayCard>
    </div>
  )
}
