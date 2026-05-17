import { useCompassStore } from '@/store/useCompassStore'

export function RightTray() {
  const { habits, reminders, toggleHabit, dismissReminder } = useCompassStore()
  const activeReminders = reminders.filter((r) => !r.dismissed)

  return (
    <div className="col-tray">
      <div className="tcard">
        <div className="tcard-lbl">Habits</div>
        {habits.map((h) => (
          <div className="h-row" key={h.id} onClick={() => toggleHabit(h.id)}>
            <div className={`hck${h.completedToday ? ' done' : ''}`} />
            <div className="h-info">
              <div className={`h-name${h.completedToday ? ' done' : ''}`}>{h.name}</div>
              <div className="h-streak">{h.streakCount}d streak</div>
            </div>
          </div>
        ))}
      </div>

      {activeReminders.length > 0 && (
        <div className="tcard">
          <div className="tcard-lbl">Reminders</div>
          {activeReminders.map((r) => (
            <div className="r-row" key={r.id}>
              <span className="r-time">{r.time}</span>
              <span className="r-text">{r.text}</span>
              <button
                className="r-x"
                aria-label="Dismiss"
                onClick={() => dismissReminder(r.id)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
