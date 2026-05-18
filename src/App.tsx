import { useEffect } from 'react'

import { SettingsDialog } from '@/components/layout/SettingsDialog'
import { Topbar } from '@/components/layout/Topbar'
import { CaptureOverlay } from '@/components/overlays/CaptureOverlay'
import { FocusDetailOverlay } from '@/components/overlays/FocusDetailOverlay'
import { HabitDetailOverlay } from '@/components/overlays/HabitDetailOverlay'
import { NowView } from '@/components/views/NowView'
import { WhatView } from '@/components/views/WhatView'
import { WhoView } from '@/components/views/WhoView'
import { useDailyReset } from '@/hooks/useDailyReset'
import { useKeyboard } from '@/hooks/useKeyboard'
import { useCompassStore } from '@/store/useCompassStore'
import { useThemeStore } from '@/store/useThemeStore'

export function App() {
  const view = useCompassStore((s) => s.view)
  const { settingsOpen, setSettingsOpen } = useCompassStore()
  const theme = useThemeStore((s) => s.theme)
  useKeyboard()
  useDailyReset()

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  return (
    <div className="app">
      <Topbar />
      {view === 'now' && <NowView />}
      {view === 'what' && <WhatView />}
      {view === 'who' && <WhoView />}
      <CaptureOverlay />
      <FocusDetailOverlay />
      <HabitDetailOverlay />
      <SettingsDialog open={settingsOpen} onClose={() => { setSettingsOpen(false) }} />
    </div>
  )
}
