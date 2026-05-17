import { useCompassStore, type Focus, type TaskStatus } from '@/store/useCompassStore'

const COLOR_CLASS: Record<Focus['color'], string> = {
  green: 'fb-g',
  indigo: 'fb-i',
  amber: 'fb-a',
}

const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  backlog: '·',
  todo: '○',
  inprogress: '◑',
  done: '●',
  parked: '–',
}

const TASK_STATUS_CLASS: Record<TaskStatus, string> = {
  backlog: 'ft-s-backlog',
  todo: 'ft-s-todo',
  inprogress: 'ft-s-inprogress',
  done: 'ft-s-done',
  parked: 'ft-s-parked',
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
        const topTasks = f.tasks.filter((t) => t.status !== 'done' && t.status !== 'parked').slice(0, 3)
        return (
          <div className="focus-card" key={f.id} onClick={() => { openFocusDetail(f.id) }}>
            <div className={`f-bar ${COLOR_CLASS[f.color]}`} />
            <div className="f-body">
              <div className="f-name">{f.name}</div>
              <div className="f-proc">{f.process}</div>

              {topTasks.length > 0 && (
                <div className="f-tasks">
                  {topTasks.map((t) => (
                    <div className="ft-row" key={t.id}>
                      <span className={`ft-status ${TASK_STATUS_CLASS[t.status]}`}>{TASK_STATUS_LABEL[t.status]}</span>
                      <span className="ft-text">{t.text}</span>
                    </div>
                  ))}
                </div>
              )}

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
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
