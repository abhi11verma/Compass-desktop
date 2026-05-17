import { useEffect } from 'react'
import { useCompassStore } from '@/store/useCompassStore'

const LAST_RESET_KEY = 'compass-last-reset'

export function useDailyReset() {
  const resetDailyHabits = useCompassStore((s) => s.resetDailyHabits)

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    const lastReset = localStorage.getItem(LAST_RESET_KEY)

    if (lastReset !== today) {
      resetDailyHabits()
      localStorage.setItem(LAST_RESET_KEY, today)
    }

    // Check again at midnight
    const now = new Date()
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime()

    const timer = setTimeout(() => {
      resetDailyHabits()
      localStorage.setItem(LAST_RESET_KEY, new Date().toISOString().slice(0, 10))
    }, msUntilMidnight)

    return () => clearTimeout(timer)
  }, [resetDailyHabits])
}
