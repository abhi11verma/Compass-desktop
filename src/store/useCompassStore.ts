import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Value = {
  id: string
  name: string
  description: string
}

export type Principle = {
  id: string
  cue: string
  daysActive: number
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

export type Habit = {
  id: string
  name: string
  streakCount: number
  completedToday: boolean
  history: string[]
}

export type Reminder = {
  id: string
  text: string
  time: string
  dismissed: boolean
}

type View = 'now' | 'what' | 'who'

interface CompassState {
  view: View
  captureOpen: boolean
  settingsOpen: boolean
  focusDetailId: string | null
  values: Value[]
  principles: Principle[]
  focuses: Focus[]
  habits: Habit[]
  reminders: Reminder[]
  captures: Capture[]

  setView: (view: View) => void
  setCaptureOpen: (open: boolean) => void
  setSettingsOpen: (open: boolean) => void
  openFocusDetail: (id: string | null) => void
  toggleHabit: (id: string) => void
  dismissReminder: (id: string) => void
  addCapture: (text: string, routedTo: string | null, processed?: boolean) => void
  resetDailyHabits: () => void
  addFocus: (name: string, process: string) => void
  updateFocus: (id: string, updates: { name?: string; process?: string; tags?: string[]; status?: Focus['status']; color?: Focus['color'] }) => void
  deleteFocus: (id: string) => void
  addTask: (focusId: string, text: string) => void
  updateTaskStatus: (focusId: string, taskId: string, status: TaskStatus) => void
  deleteTask: (focusId: string, taskId: string) => void
  updateTask: (focusId: string, taskId: string, text: string) => void
  addHabit: (name: string) => void
  addPrinciple: (cue: string) => void
  addValue: (name: string) => void
}

const SEED_VALUES: Value[] = [
  { id: 'v1', name: 'Self-direction', description: 'Going your own way · thinking your own thoughts' },
  { id: 'v2', name: 'Pleasure', description: 'Sensory enjoyment · savoring experience' },
  { id: 'v3', name: 'Benevolence', description: 'Kindness · serving those close to you' },
]

const SEED_PRINCIPLES: Principle[] = [
  { id: 'p1', cue: 'Talk slower than feels natural.', daysActive: 18, status: 'active' },
  { id: 'p2', cue: "Respond, don't react.", daysActive: 9, status: 'active' },
  { id: 'p3', cue: 'Ask one more question before offering an opinion.', daysActive: 4, status: 'active' },
  { id: 'p4', cue: 'Listen more than you speak in group settings.', daysActive: 0, status: 'queue' },
  { id: 'p5', cue: 'Start tasks before you feel ready.', daysActive: 0, status: 'queue' },
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
  { id: 'h1', name: 'Morning walk', streakCount: 12, completedToday: true, history: [] },
  { id: 'h2', name: 'Meditation · 10 min', streakCount: 5, completedToday: false, history: [] },
  { id: 'h3', name: 'Read before sleep', streakCount: 3, completedToday: false, history: [] },
]

const SEED_REMINDERS: Reminder[] = [
  { id: 'r1', text: 'Call Dr. Mehta re: bloodwork', time: '10a', dismissed: false },
  { id: 'r2', text: 'Cook dal — ingredients ready', time: '6p', dismissed: false },
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
      settingsOpen: false,
      focusDetailId: null,
      values: SEED_VALUES,
      principles: SEED_PRINCIPLES,
      focuses: SEED_FOCUSES,
      habits: SEED_HABITS,
      reminders: SEED_REMINDERS,
      captures: SEED_CAPTURES,

      setView: (view) => set({ view }),
      setCaptureOpen: (open) => set({ captureOpen: open }),
      setSettingsOpen: (open) => set({ settingsOpen: open }),
      openFocusDetail: (id) => set({ focusDetailId: id }),

      toggleHabit: (id) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id
              ? {
                  ...h,
                  completedToday: !h.completedToday,
                  streakCount: !h.completedToday ? h.streakCount + 1 : Math.max(0, h.streakCount - 1),
                }
              : h
          ),
        })),

      dismissReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id ? { ...r, dismissed: true } : r
          ),
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

      resetDailyHabits: () =>
        set((state) => ({
          habits: state.habits.map((h) => ({ ...h, completedToday: false })),
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
            { id: `h-${String(Date.now())}`, name, streakCount: 0, completedToday: false, history: [] },
          ],
        })),

      addPrinciple: (cue) =>
        set((state) => ({
          principles: [
            ...state.principles,
            { id: `p-${String(Date.now())}`, cue, daysActive: 0, status: 'queue' },
          ],
        })),

      addValue: (name) =>
        set((state) => ({
          values: [
            ...state.values,
            { id: `v-${String(Date.now())}`, name, description: '' },
          ],
        })),
    }),
    { name: 'compass-store-v2' }
  )
)
