import { useCompassStore } from '@/store/useCompassStore'
import { useKeyboard } from '@/hooks/useKeyboard'
import { useDailyReset } from '@/hooks/useDailyReset'
import { Topbar } from '@/components/layout/Topbar'
import { NowView } from '@/components/views/NowView'
import { WhatView } from '@/components/views/WhatView'
import { WhoView } from '@/components/views/WhoView'
import { CaptureOverlay } from '@/components/overlays/CaptureOverlay'

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
    </div>
  )
}
