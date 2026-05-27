import { useEffect } from 'react'

import { useCompassStore } from '@/store/useCompassStore'

function pushSentinel() {
  history.pushState({ compass: true }, '')
}

export function useBackHandler() {
  const {
    view,
    setView,
    captureOpen, setCaptureOpen,
    inboxOpen, setInboxOpen,
    focusDetailId, openFocusDetail,
    habitDetailId, openHabitDetail,
    valueDetailId, openValueDetail,
    principleDetailId, openPrincipleDetail,
  } = useCompassStore()

  useEffect(() => {
    pushSentinel()
  }, [])

  useEffect(() => {
    function onPopState() {
      if (captureOpen) {
        setCaptureOpen(false)
      } else if (focusDetailId !== null) {
        openFocusDetail(null)
      } else if (habitDetailId !== null) {
        openHabitDetail(null)
      } else if (valueDetailId !== null) {
        openValueDetail(null)
      } else if (principleDetailId !== null) {
        openPrincipleDetail(null)
      } else if (inboxOpen) {
        setInboxOpen(false)
      } else if (view !== 'now') {
        setView('now')
      }
      pushSentinel()
    }

    window.addEventListener('popstate', onPopState)
    return () => { window.removeEventListener('popstate', onPopState) }
  }, [
    view, setView,
    captureOpen, setCaptureOpen,
    inboxOpen, setInboxOpen,
    focusDetailId, openFocusDetail,
    habitDetailId, openHabitDetail,
    valueDetailId, openValueDetail,
    principleDetailId, openPrincipleDetail,
  ])
}
