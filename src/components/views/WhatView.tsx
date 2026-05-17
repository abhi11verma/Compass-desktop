import { useCompassStore, type Focus } from '@/store/useCompassStore'

const DOT_COLOR: Record<Focus['color'], string> = {
  green: '#3A8F68',
  indigo: '#5C6DC4',
  amber: '#B8772A',
}

function HabitDot({ level }: { level: number }) {
  const cls = level === 0 ? 'hd' : level === 1 ? 'hd on' : level === 2 ? 'hd hi' : 'hd ful'
  return <div className={cls} />
}

export function WhatView() {
  const { focuses, habits } = useCompassStore()

  const active = focuses.filter((f) => f.status !== 'parked')
  const parked = focuses.filter((f) => f.status === 'parked')
  const activeSummary = `${active.length} active${parked.length > 0 ? ` · ${parked.length} parked` : ''}`

  return (
    <div className="what-view">
      <div>
        <div className="list-hd">
          Focuses
          <span className="list-hd-ct">{activeSummary}</span>
        </div>
        <div className="list-card">
          {active.map((f) => (
            <div className="l-row" key={f.id}>
              <div className="l-dot" style={{ background: DOT_COLOR[f.color] }} />
              <div className="l-body">
                <div className="l-name">{f.name}</div>
                <div className="l-sub">{f.process}</div>
              </div>
              <div className="l-right">
                {f.status === 'trying' ? (
                  <span className="chip chip-warn">Trying</span>
                ) : (
                  <span className="chip">{f.tasks.length} {f.tasks.length === 1 ? 'task' : 'tasks'}</span>
                )}
                <span className="l-age">{f.daysActive}d</span>
              </div>
            </div>
          ))}
          {parked.map((f) => (
            <div className="l-row" key={f.id}>
              <div className="l-dot" style={{ background: 'rgba(255,255,255,0.12)' }} />
              <div className="l-body">
                <div className="l-name" style={{ color: 'var(--ink-3)' }}>{f.name}</div>
                <div className="l-sub">{f.process}</div>
              </div>
              <div className="l-right">
                <span className="chip">Parked</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="list-hd">
          Habits
          <span className="list-hd-ct">{habits.length} active</span>
        </div>
        <div className="list-card">
          {habits.map((h) => {
            // Build 14-day display: streak days are lit, rest empty
            const displayDots = Array(14).fill(0).map((_, i) => {
              const daysAgo = 13 - i
              if (daysAgo < h.streakCount) return daysAgo < 3 ? 3 : daysAgo < 6 ? 2 : 1
              return 0
            })
            return (
              <div className="hl-row" key={h.id}>
                <div className="hl-body">
                  <div className="hl-name">{h.name}</div>
                  <div className="hl-dots">
                    {displayDots.map((level, i) => (
                      <HabitDot key={i} level={level} />
                    ))}
                  </div>
                </div>
                <span className="hl-streak">{h.streakCount}d</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
