import { Topbar } from '@/components/layout/Topbar'
import { CaptureOverlay } from '@/components/overlays/CaptureOverlay'
import { FocusDetailOverlay } from '@/components/overlays/FocusDetailOverlay'
import { NowView } from '@/components/views/NowView'
import { WhatView } from '@/components/views/WhatView'
import { WhoView } from '@/components/views/WhoView'
import { useDailyReset } from '@/hooks/useDailyReset'
import { useKeyboard } from '@/hooks/useKeyboard'
import { useCompassStore } from '@/store/useCompassStore'

export function App() {
  const view = useCompassStore((s) => s.view)
  useKeyboard()
  useDailyReset()

  return (
    <div className="app">
      <Topbar />
      {view === 'now' && <NowView />}
      {view === 'what' && <WhatView />}
      {view === 'who' && <WhoView />}
      <CaptureOverlay />
      <FocusDetailOverlay />
    </div>
  )
}
