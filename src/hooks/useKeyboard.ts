import { useEffect } from 'react'
import { useCompassStore } from '@/store/useCompassStore'

export function useKeyboard() {
  const { captureOpen, setCaptureOpen } = useCompassStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable

      if (e.key === 'Escape' && captureOpen) {
        setCaptureOpen(false)
        return
      }
      if (e.key === 'c' && !captureOpen && !isTyping) {
        setCaptureOpen(true)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [captureOpen, setCaptureOpen])
}
