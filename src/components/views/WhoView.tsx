import { useCompassStore } from '@/store/useCompassStore'

export function WhoView() {
  const { values, principles, searchQuery } = useCompassStore()

  const q = searchQuery.toLowerCase().trim()

  const filteredValues = q
    ? values.filter((v) => v.name.toLowerCase().includes(q) || v.description.toLowerCase().includes(q))
    : values

  const filteredPrinciples = q
    ? principles.filter((p) => p.cue.toLowerCase().includes(q))
    : principles

  const active = filteredPrinciples.filter((p) => p.status === 'active')
  const queued = filteredPrinciples.filter((p) => p.status === 'queue')
  const summary = `${active.length.toString()} active · ${queued.length.toString()} queued`

  return (
    <div className="who-view">
      <div>
        <div className="list-hd">Values</div>
        <div className="list-card">
          {filteredValues.map((v) => (
            <div className="vf-row" key={v.id}>
              <div className="vf-name">{v.name}</div>
              <div className="vf-desc">{v.description}</div>
            </div>
          ))}
          {q && filteredValues.length === 0 && (
            <div className="list-empty">No values match "{q}"</div>
          )}
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
          {q && filteredPrinciples.length === 0 && (
            <div className="list-empty">No principles match "{q}"</div>
          )}
        </div>
      </div>
    </div>
  )
}
