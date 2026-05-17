import { useCompassStore } from '@/store/useCompassStore'

export function WhoView() {
  const { values, principles } = useCompassStore()

  const active = principles.filter((p) => p.status === 'active')
  const queued = principles.filter((p) => p.status === 'queue')
  const summary = `${active.length} active · ${queued.length} queued`

  return (
    <div className="who-view">
      <div>
        <div className="list-hd">Values</div>
        <div className="list-card">
          {values.map((v) => (
            <div className="vf-row" key={v.id}>
              <div className="vf-name">{v.name}</div>
              <div className="vf-desc">{v.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="list-hd">
          Principles
          <span className="list-hd-ct">{summary}</span>
        </div>
        <div className="list-card">
          {active.map((p) => (
            <div className="pf-row" key={p.id}>
              <div className="pf-body">
                <div className="pf-cue">{p.cue}</div>
                <div className="pf-age">{p.daysActive}d active</div>
              </div>
              <span className="pf-badge pf-active">active</span>
            </div>
          ))}
          {queued.map((p) => (
            <div className="pf-row" key={p.id}>
              <div className="pf-body">
                <div className="pf-cue">{p.cue}</div>
                <div className="pf-age">In queue</div>
              </div>
              <span className="pf-badge pf-queue">queue</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
