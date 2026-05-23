import { useCompassStore } from '@/store/useCompassStore'

export function LeftColumn() {
  const { values, principles, openPrincipleDetail, setSettingsOpen } = useCompassStore()
  const visibleValues = values.filter((v) => !v.hidden)
  const activePrinciples = principles.filter((p) => p.status === 'active')

  return (
    <div className="col-who">
      <div className="col-who-scroll">
        {visibleValues.length > 0 && (
          <div className="who-card">
            <div className="who-card-lbl">Values</div>
            {visibleValues.map((v) => (
              <div className="val-row" key={v.id}>{v.name}</div>
            ))}
          </div>
        )}

        {activePrinciples.length > 0 && (
          <div className="who-card">
            <div className="who-card-lbl">Principles</div>
            {activePrinciples.map((p) => (
              <div
                className="prin-row prin-row-click"
                key={p.id}
                onClick={() => { openPrincipleDetail(p.id) }}
              >
                <div className="prin-cue">{p.cue}</div>
                <div className="prin-meta">
                  <span className="prin-age">{p.daysActive}d</span>
                  {p.tags.map((t) => (
                    <span key={t} className="chip chip-tag prin-tag">#{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="col-who-foot">
        <button className="settings-btn" onClick={() => { setSettingsOpen(true) }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          Settings
        </button>
      </div>
    </div>
  )
}
