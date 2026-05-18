import { useEffect } from 'react'
import { useCompassStore } from '@/store/useCompassStore'

export function useKeyboard() {
  const { captureOpen, setCaptureOpen, setView } = useCompassStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable

      if (e.key === 'Escape' && captureOpen) {
        setCaptureOpen(false)
        return
      }
      if (isTyping) return
      if (e.key === 'c' && !captureOpen) {
        setCaptureOpen(true)
      }
      if (e.key === '1') setView('now')
      if (e.key === '2') setView('what')
      if (e.key === '3') setView('who')
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [captureOpen, setCaptureOpen, setView])
}
