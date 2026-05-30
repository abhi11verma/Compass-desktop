import { useEffect } from 'react'

import { useCompassStore } from '@/store/useCompassStore'

function pushSentinel() {
  history.pushState({ compass: true }, '', location.href)
}

export function useBackHandler() {
  useEffect(() => {
    pushSentinel()

    function onPopState() {
      const s = useCompassStore.getState()

      if (s.captureOpen) {
        s.setCaptureOpen(false)
      } else if (s.focusDetailId !== null) {
        s.openFocusDetail(null)
      } else if (s.habitDetailId !== null) {
        s.openHabitDetail(null)
      } else if (s.valueDetailId !== null) {
        s.openValueDetail(null)
      } else if (s.principleDetailId !== null) {
        s.openPrincipleDetail(null)
      } else if (s.inboxOpen) {
        s.setInboxOpen(false)
      } else if (s.view !== 'now') {
        s.setView('now')
      }

      pushSentinel()
    }

    window.addEventListener('popstate', onPopState)
    return () => { window.removeEventListener('popstate', onPopState) }
  }, [])
}
