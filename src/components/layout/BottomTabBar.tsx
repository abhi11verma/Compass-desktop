import { useCompassStore } from '@/store/useCompassStore'

export function BottomTabBar() {
  const { view, setView } = useCompassStore()

  return (
    <nav className="bottom-tabs">
      {(['now', 'what', 'who'] as const).map((v) => (
        <button
          key={v}
          className={`bottom-tab${view === v ? ' active' : ''}`}
          onClick={() => { setView(v) }}
        >
          {v.charAt(0).toUpperCase() + v.slice(1)}
        </button>
      ))}
    </nav>
  )
}
