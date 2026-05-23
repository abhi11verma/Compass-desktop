import { useEffect } from 'react'

import { BottomTabBar } from '@/components/layout/BottomTabBar'
import { CaptureFab } from '@/components/layout/CaptureFab'
import { SearchFab } from '@/components/layout/SearchFab'
import { SettingsDialog } from '@/components/layout/SettingsDialog'
import { Topbar } from '@/components/layout/Topbar'
import { ViewSlider } from '@/components/layout/ViewSlider'
import { CaptureOverlay } from '@/components/overlays/CaptureOverlay'
import { FocusDetailOverlay } from '@/components/overlays/FocusDetailOverlay'
import { HabitDetailOverlay } from '@/components/overlays/HabitDetailOverlay'
import { InboxOverlay } from '@/components/overlays/InboxOverlay'
import { PrincipleDetailOverlay } from '@/components/overlays/PrincipleDetailOverlay'
import { ValueDetailOverlay } from '@/components/overlays/ValueDetailOverlay'
import { useDailyReset } from '@/hooks/useDailyReset'
import { useKeyboard } from '@/hooks/useKeyboard'
import { useCompassStore } from '@/store/useCompassStore'
import { useThemeStore } from '@/store/useThemeStore'

export function App() {
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
      <ViewSlider />
      <CaptureOverlay />
      <FocusDetailOverlay />
      <HabitDetailOverlay />
      <ValueDetailOverlay />
      <PrincipleDetailOverlay />
      <InboxOverlay />
      <SettingsDialog open={settingsOpen} onClose={() => { setSettingsOpen(false) }} />
      <BottomTabBar />
      <CaptureFab />
      <SearchFab />
    </div>
  )
}

