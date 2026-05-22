import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Value = {
  id: string
  name: string
  description: string
  note: string
  hidden: boolean
}

export type Principle = {
  id: string
  cue: string
  daysActive: number
  tags: string[]
  status: 'active' | 'queue' | 'retired'
}

export type TaskStatus = 'backlog' | 'todo' | 'inprogress' | 'done' | 'parked'

export type Task = {
  id: string
  text: string
  status: TaskStatus
}

export type Capture = {
  id: string
  text: string
  routedTo: string | null
  createdAt: string
  processed: boolean
}

export type Focus = {
  id: string
  name: string
  process: string
  tags: string[]
  color: 'green' | 'indigo' | 'amber' | 'rose' | 'teal'
  status: 'active' | 'parked'
  daysActive: number
  streakDays: number[]
  tasks: Task[]
  captures: Capture[]
}

export type HabitStatus = 'active' | 'parked' | 'complete'
export type HabitFrequency = 'hourly' | 'daily' | 'weekly'

export type Habit = {
  id: string
  name: string
  details: string
  tags: string[]
  status: HabitStatus
  frequency: HabitFrequency
  streakCount: number
  completedToday: boolean
  lastCompletedAt: string | null
  history: string[]
}

function mondayOf(d: Date): number {
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + diff).getTime()
}

export function isHabitDone(h: Habit, now: number = Date.now()): boolean {
  if (h.frequency === 'hourly') {
    if (!h.lastCompletedAt) return false
    return (now - new Date(h.lastCompletedAt).getTime()) < 60 * 60 * 1000
  }
  if (h.frequency === 'weekly') {
    if (!h.lastCompletedAt) return false
    return mondayOf(new Date(h.lastCompletedAt)) === mondayOf(new Date(now))
  }
  return h.completedToday
}

type View = 'now' | 'what' | 'who'

interface CompassState {
  view: View
  captureOpen: boolean
  inboxOpen: boolean
  settingsOpen: boolean
  focusDetailId: string | null
  habitDetailId: string | null
  valueDetailId: string | null
  principleDetailId: string | null
  searchQuery: string
  values: Value[]
  principles: Principle[]
  focuses: Focus[]
  habits: Habit[]
  captures: Capture[]

  setView: (view: View) => void
  setCaptureOpen: (open: boolean) => void
  setInboxOpen: (open: boolean) => void
  setSettingsOpen: (open: boolean) => void
  openFocusDetail: (id: string | null) => void
  openHabitDetail: (id: string | null) => void
  openValueDetail: (id: string | null) => void
  openPrincipleDetail: (id: string | null) => void
  setSearchQuery: (q: string) => void
  toggleHabit: (id: string) => void
  addCapture: (text: string, routedTo: string | null, processed?: boolean) => void
  routeCapture: (captureId: string, routedTo: string) => void
  updateCapture: (captureId: string, text: string) => void
  createAndRoute: (captureId: string, type: 'focus' | 'habit', name: string) => void
  resetDailyHabits: () => void
  addFocus: (name: string, process: string) => void
  updateFocus: (id: string, updates: { name?: string; process?: string; tags?: string[]; status?: Focus['status']; color?: Focus['color'] }) => void
  deleteFocus: (id: string) => void
  addTask: (focusId: string, text: string) => void
  updateTaskStatus: (focusId: string, taskId: string, status: TaskStatus) => void
  deleteTask: (focusId: string, taskId: string) => void
  updateTask: (focusId: string, taskId: string, text: string) => void
  addHabit: (name: string) => void
  updateHabit: (id: string, updates: { name?: string; details?: string; tags?: string[]; status?: HabitStatus; frequency?: HabitFrequency }) => void
  deleteHabit: (id: string) => void
  addPrinciple: (cue: string) => void
  updatePrinciple: (id: string, updates: { cue?: string; tags?: string[]; status?: Principle['status'] }) => void
  deletePrinciple: (id: string) => void
  addValue: (name: string) => void
  updateValue: (id: string, updates: { name?: string; description?: string; note?: string; hidden?: boolean }) => void
  deleteValue: (id: string) => void
  resetCompass: () => void
  clearData: () => void
}

function dateStr(daysAgo: number): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().slice(0, 10)
}

function seedHistory(days: number, includeToday: boolean): string[] {
  const start = includeToday ? 0 : 1
  return Array.from({ length: days }, (_, i) => dateStr(start + i))
}

function calcStreak(history: string[]): number {
  if (history.length === 0) return 0
  const today = dateStr(0)
  const yesterday = dateStr(1)
  const sorted = [...new Set(history)].sort().reverse()
  if (sorted[0] !== today && sorted[0] !== yesterday) return 0
  let streak = 0
  let expected = sorted[0]
  for (const date of sorted) {
    if (date !== expected) break
    streak++
    const prev = new Date(expected)
    prev.setDate(prev.getDate() - 1)
    expected = prev.toISOString().slice(0, 10)
  }
  return streak
}

const SEED_VALUES: Value[] = [
  { id: 'v1', name: 'Self-direction', description: 'Going your own way · thinking your own thoughts', note: '', hidden: false },
  { id: 'v2', name: 'Pleasure', description: 'Sensory enjoyment · savoring experience', note: '', hidden: false },
  { id: 'v3', name: 'Benevolence', description: 'Kindness · serving those close to you', note: '', hidden: false },
]

const SEED_PRINCIPLES: Principle[] = [
  { id: 'p1', cue: 'Talk slower than feels natural.', daysActive: 18, tags: [], status: 'active' },
  { id: 'p2', cue: "Respond, don't react.", daysActive: 9, tags: [], status: 'active' },
  { id: 'p3', cue: 'Ask one more question before offering an opinion.', daysActive: 4, tags: [], status: 'active' },
  { id: 'p4', cue: 'Listen more than you speak in group settings.', daysActive: 0, tags: [], status: 'queue' },
  { id: 'p5', cue: 'Start tasks before you feel ready.', daysActive: 0, tags: [], status: 'queue' },
]

const SEED_FOCUSES: Focus[] = [
  {
    id: 'f1', name: 'Building health', color: 'green', status: 'active', daysActive: 14, tags: [],
    process: 'Morning walk daily · no phone first hour · cook at home 5×',
    streakDays: [1, 0, 1, 2, 2, 3, 3],
    tasks: [
      { id: 't1', text: 'Schedule physio appointment', status: 'todo' },
      { id: 't2', text: 'Buy blender', status: 'backlog' },
    ],
    captures: [
      { id: 'c1', text: 'Try cold shower protocol', routedTo: 'f1', createdAt: new Date().toISOString(), processed: false },
      { id: 'c2', text: 'Look into creatine', routedTo: 'f1', createdAt: new Date().toISOString(), processed: false },
    ],
  },
  {
    id: 'f2', name: 'Writing the essay', color: 'indigo', status: 'active', daysActive: 6, tags: [],
    process: 'One session daily · draft first, shape later',
    streakDays: [0, 0, 1, 2, 2, 3, 3],
    tasks: [
      { id: 't3', text: 'Finish intro section', status: 'inprogress' },
      { id: 't4', text: 'Find 2 more citations', status: 'todo' },
      { id: 't5', text: 'Send draft to Priya', status: 'backlog' },
    ],
    captures: [
      { id: 'c3', text: 'Add Bailey quote to section 3', routedTo: 'f2', createdAt: new Date().toISOString(), processed: false },
    ],
  },
  {
    id: 'f3', name: 'Learning AI', color: 'amber', status: 'active', daysActive: 3, tags: ['Trying'],
    process: 'One chapter or tutorial daily · ends in 11 days',
    streakDays: [0, 0, 0, 2, 2, 3, 3],
    tasks: [
      { id: 't6', text: 'Complete transformer architecture chapter', status: 'todo' },
    ],
    captures: [],
  },
  {
    id: 'f4', name: 'Portuguese', color: 'indigo', status: 'parked', daysActive: 0, tags: [],
    process: 'Parked — revisit when travel comes up',
    streakDays: [0, 0, 0, 0, 0, 0, 0],
    tasks: [],
    captures: [],
  },
]

const SEED_HABITS: Habit[] = [
  { id: 'h1', name: 'Morning walk', details: 'Walk for at least 20 minutes outdoors before breakfast.', tags: ['health'], status: 'active', frequency: 'daily', streakCount: 12, completedToday: true, lastCompletedAt: new Date().toISOString(), history: seedHistory(12, true) },
  { id: 'h2', name: 'Meditation · 10 min', details: '', tags: [], status: 'active', frequency: 'daily', streakCount: 5, completedToday: false, lastCompletedAt: null, history: seedHistory(5, false) },
  { id: 'h3', name: 'Read before sleep', details: 'Any book, at least 10 pages.', tags: [], status: 'active', frequency: 'daily', streakCount: 3, completedToday: false, lastCompletedAt: null, history: seedHistory(3, false) },
]

const SEED_CAPTURES: Capture[] = [
  { id: 'cap1', text: 'Try cold shower protocol', routedTo: 'f1', createdAt: new Date().toISOString(), processed: false },
  { id: 'cap2', text: 'Look into creatine', routedTo: 'f1', createdAt: new Date().toISOString(), processed: false },
  { id: 'cap3', text: 'Add Bailey quote to section 3', routedTo: 'f2', createdAt: new Date().toISOString(), processed: false },
  { id: 'cap4', text: 'What are RLHF alternatives?', routedTo: null, createdAt: new Date().toISOString(), processed: false },
]

export const useCompassStore = create<CompassState>()(
  persist(
    (set) => ({
      view: 'now',
      captureOpen: false,
      inboxOpen: false,
      settingsOpen: false,
      focusDetailId: null,
      habitDetailId: null,
      valueDetailId: null,
      principleDetailId: null,
      searchQuery: '',
      values: SEED_VALUES,
      principles: SEED_PRINCIPLES,
      focuses: SEED_FOCUSES,
      habits: SEED_HABITS,
      captures: SEED_CAPTURES,

      setView: (view) => set({ view }),
      setCaptureOpen: (open) => set({ captureOpen: open }),
      setInboxOpen: (open) => set({ inboxOpen: open }),
      setSettingsOpen: (open) => set({ settingsOpen: open }),
      openFocusDetail: (id) => set({ focusDetailId: id }),
      openHabitDetail: (id) => set({ habitDetailId: id }),
      openValueDetail: (id) => set({ valueDetailId: id }),
      openPrincipleDetail: (id) => set({ principleDetailId: id }),
      setSearchQuery: (q) => set({ searchQuery: q }),

      toggleHabit: (id) =>
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id !== id) return h
            const now = Date.now()
            const completing = !isHabitDone(h, now)
            const today = dateStr(0)
            const newHistory = completing
              ? [...h.history.filter((d) => d !== today), today]
              : h.history.filter((d) => d !== today)
            return {
              ...h,
              completedToday: completing,
              lastCompletedAt: completing ? new Date().toISOString() : null,
              history: newHistory,
              streakCount: calcStreak(newHistory),
            }
          }),
        })),


      addCapture: (text, routedTo, processed = false) =>
        set((state) => {
          const isFocusRoute = routedTo !== null && routedTo !== 'inbox'
          const newTask: Task = { id: `t-${String(Date.now())}`, text, status: 'backlog' }
          return {
            captures: [
              ...state.captures,
              {
                id: `cap-${String(Date.now())}`,
                text,
                routedTo,
                createdAt: new Date().toISOString(),
                processed: isFocusRoute ? true : processed,
              },
            ],
            focuses: isFocusRoute
              ? state.focuses.map((f) =>
                  f.id === routedTo ? { ...f, tasks: [...f.tasks, newTask] } : f
                )
              : state.focuses,
          }
        }),

      routeCapture: (captureId, routedTo) =>
        set((state) => {
          const capture = state.captures.find((c) => c.id === captureId)
          if (!capture) return state
          const isFocus = state.focuses.some((f) => f.id === routedTo)
          const newTask: Task = { id: `t-${String(Date.now())}`, text: capture.text, status: 'backlog' }
          return {
            captures: state.captures.map((c) =>
              c.id === captureId ? { ...c, routedTo, processed: true } : c
            ),
            focuses: isFocus
              ? state.focuses.map((f) =>
                  f.id === routedTo ? { ...f, tasks: [...f.tasks, newTask] } : f
                )
              : state.focuses,
          }
        }),

      updateCapture: (captureId, text) =>
        set((state) => ({
          captures: state.captures.map((c) =>
            c.id === captureId ? { ...c, text } : c
          ),
        })),

      createAndRoute: (captureId, type, name) =>
        set((state) => {
          const capture = state.captures.find((c) => c.id === captureId)
          if (!capture) return state
          const ts = String(Date.now())
          if (type === 'focus') {
            const newId = `f-${ts}`
            const newTask: Task = { id: `t-${ts}`, text: capture.text, status: 'backlog' }
            const newFocus: Focus = {
              id: newId, name, process: '', tags: [], color: 'green',
              status: 'active', daysActive: 0, streakDays: [], tasks: [newTask], captures: [],
            }
            return {
              focuses: [...state.focuses, newFocus],
              captures: state.captures.map((c) =>
                c.id === captureId ? { ...c, routedTo: newId, processed: true } : c
              ),
            }
          } else {
            const newId = `h-${ts}`
            const newHabit: Habit = {
              id: newId, name, details: '', tags: [], status: 'active', frequency: 'daily',
              streakCount: 0, completedToday: false, lastCompletedAt: null, history: [],
            }
            return {
              habits: [...state.habits, newHabit],
              captures: state.captures.map((c) =>
                c.id === captureId ? { ...c, routedTo: newId, processed: true } : c
              ),
            }
          }
        }),

      resetDailyHabits: () =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.frequency === 'daily' ? { ...h, completedToday: false, lastCompletedAt: null } : h
          ),
        })),

      addFocus: (name, process) =>
        set((state) => ({
          focuses: [
            ...state.focuses,
            {
              id: `f-${String(Date.now())}`,
              name,
              process,
              tags: [],
              color: 'green',
              status: 'active',
              daysActive: 0,
              streakDays: [],
              tasks: [],
              captures: [],
            },
          ],
        })),

      updateFocus: (id, updates) =>
        set((state) => ({
          focuses: state.focuses.map((f) =>
            f.id === id ? { ...f, ...updates } : f
          ),
        })),

      deleteFocus: (id) =>
        set((state) => ({
          focuses: state.focuses.filter((f) => f.id !== id),
          focusDetailId: null,
        })),

      addTask: (focusId, text) =>
        set((state) => ({
          focuses: state.focuses.map((f) =>
            f.id === focusId
              ? { ...f, tasks: [...f.tasks, { id: `t-${String(Date.now())}`, text, status: 'backlog' }] }
              : f
          ),
        })),

      updateTaskStatus: (focusId, taskId, status) =>
        set((state) => ({
          focuses: state.focuses.map((f) =>
            f.id === focusId
              ? { ...f, tasks: f.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)) }
              : f
          ),
        })),

      deleteTask: (focusId, taskId) =>
        set((state) => ({
          focuses: state.focuses.map((f) =>
            f.id === focusId
              ? { ...f, tasks: f.tasks.filter((t) => t.id !== taskId) }
              : f
          ),
        })),

      updateTask: (focusId, taskId, text) =>
        set((state) => ({
          focuses: state.focuses.map((f) =>
            f.id === focusId
              ? { ...f, tasks: f.tasks.map((t) => (t.id === taskId ? { ...t, text } : t)) }
              : f
          ),
        })),

      addHabit: (name) =>
        set((state) => ({
          habits: [
            ...state.habits,
            { id: `h-${String(Date.now())}`, name, details: '', tags: [], status: 'active', frequency: 'daily', streakCount: 0, completedToday: false, lastCompletedAt: null, history: [] },
          ],
        })),

      updateHabit: (id, updates) =>
        set((state) => ({
          habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
        })),

      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
          habitDetailId: null,
        })),

      addPrinciple: (cue) =>
        set((state) => ({
          principles: [
            ...state.principles,
            { id: `p-${String(Date.now())}`, cue, daysActive: 0, tags: [], status: 'queue' },
          ],
        })),

      updatePrinciple: (id, updates) =>
        set((state) => ({
          principles: state.principles.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),

      deletePrinciple: (id) =>
        set((state) => ({
          principles: state.principles.filter((p) => p.id !== id),
          principleDetailId: null,
        })),

      addValue: (name) =>
        set((state) => ({
          values: [
            ...state.values,
            { id: `v-${String(Date.now())}`, name, description: '', note: '', hidden: false },
          ],
        })),

      updateValue: (id, updates) =>
        set((state) => ({
          values: state.values.map((v) => (v.id === id ? { ...v, ...updates } : v)),
        })),

      deleteValue: (id) =>
        set((state) => ({
          values: state.values.filter((v) => v.id !== id),
          valueDetailId: null,
        })),

      resetCompass: () =>
        set({
          view: 'now',
          focusDetailId: null,
          habitDetailId: null,
          valueDetailId: null,
          principleDetailId: null,
          captureOpen: false,
          inboxOpen: false,
          values: SEED_VALUES,
          principles: SEED_PRINCIPLES,
          focuses: SEED_FOCUSES,
          habits: SEED_HABITS,
          captures: SEED_CAPTURES,
        }),

      clearData: () =>
        set({
          view: 'now',
          focusDetailId: null,
          habitDetailId: null,
          valueDetailId: null,
          principleDetailId: null,
          captureOpen: false,
          inboxOpen: false,
          values: [],
          principles: [],
          focuses: [],
          habits: [],
          captures: [],
        }),
    }),
    { name: 'compass-store-v5', partialize: (state) => { const { searchQuery: _sq, ...rest } = state; return rest } }
  )
)
