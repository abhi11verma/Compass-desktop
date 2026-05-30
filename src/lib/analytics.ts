import { useThemeStore } from '@/store/useThemeStore'

type EventName =
  | 'view_change'
  | 'capture_opened'
  | 'capture_routed'
  | 'focus_added'
  | 'habit_added'
  | 'habit_checked'
  | 'value_added'
  | 'principle_added'
  | 'pwa_install'

interface EventParams {
  view_change: { view: string }
  capture_opened: Record<string, never>
  capture_routed: { routed_to: 'existing' | 'new' }
  focus_added: Record<string, never>
  habit_added: Record<string, never>
  habit_checked: Record<string, never>
  value_added: Record<string, never>
  principle_added: Record<string, never>
  pwa_install: Record<string, never>
}

export function track<E extends EventName>(event: E, params?: EventParams[E]): void {
  if (!useThemeStore.getState().analyticsEnabled) return
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', event, params ?? {})
  }
}
