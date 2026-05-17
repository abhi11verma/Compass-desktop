import { useCompassStore, type Focus } from '@/store/useCompassStore'

const COLOR_CLASS: Record<Focus['color'], string> = {
  green: 'fb-g',
  indigo: 'fb-i',
  amber: 'fb-a',
}

function StreakDots({ days }: { days: number[] }) {
  return (
    <div className="streak">
      {days.map((d, i) => (
        <div key={i} className={`sd${d === 1 ? ' s1' : d === 2 ? ' s2' : d === 3 ? ' s3' : ''}`} />
      ))}
    </div>
  )
}

export function MiddleColumn() {
  const { focuses, openFocusDetail } = useCompassStore()
  const active = focuses.filter((f) => f.status !== 'parked')

  return (
    <div className="col-mid">
      <div className="sec-hd">
        <span className="sec-hd-lbl">Focuses</span>
        <span className="sec-hd-ct">{active.length}</span>
      </div>

      {active.map((f) => {
        const taskCount = f.tasks.length
        const captureCount = f.captures.length
        return (
          <div className="focus-card" key={f.id} onClick={() => { openFocusDetail(f.id) }}>
            <div className={`f-bar ${COLOR_CLASS[f.color]}`} />
            <div className="f-body">
              <div className="f-name">{f.name}</div>
              <div className="f-proc">{f.process}</div>
              <div className="f-foot">
                <span className="chip">{taskCount} {taskCount === 1 ? 'task' : 'tasks'}</span>
                {captureCount > 0 && (
                  <span className="chip chip-info">{captureCount} {captureCount === 1 ? 'capture' : 'captures'}</span>
                )}
                {f.tags.length > 0 ? (
                  f.tags.map((t) => <span className="chip chip-tag" key={t}>{t}</span>)
                ) : f.status === 'trying' && (
                  <span className="chip chip-warn">Trying</span>
                )}
                <StreakDots days={f.streakDays} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
