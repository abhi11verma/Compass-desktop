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

export type Task = {
  id: string
  text: string
  done: boolean
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
  color: 'green' | 'indigo' | 'amber'
  status: 'active' | 'trying' | 'parked'
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
  values: Value[]
  principles: Principle[]
  focuses: Focus[]
  habits: Habit[]
  reminders: Reminder[]
  captures: Capture[]

  setView: (view: View) => void
  setCaptureOpen: (open: boolean) => void
  toggleHabit: (id: string) => void
  dismissReminder: (id: string) => void
  addCapture: (text: string, routedTo: string | null) => void
  resetDailyHabits: () => void
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
    id: 'f1', name: 'Building health', color: 'green', status: 'active', daysActive: 14,
    process: 'Morning walk daily · no phone first hour · cook at home 5×',
    streakDays: [1, 0, 1, 2, 2, 3, 3],
    tasks: [
      { id: 't1', text: 'Schedule physio appointment', done: false },
      { id: 't2', text: 'Buy blender', done: false },
    ],
    captures: [
      { id: 'c1', text: 'Try cold shower protocol', routedTo: 'f1', createdAt: new Date().toISOString(), processed: false },
      { id: 'c2', text: 'Look into creatine', routedTo: 'f1', createdAt: new Date().toISOString(), processed: false },
    ],
  },
  {
    id: 'f2', name: 'Writing the essay', color: 'indigo', status: 'active', daysActive: 6,
    process: 'One session daily · draft first, shape later',
    streakDays: [0, 0, 1, 2, 2, 3, 3],
    tasks: [
      { id: 't3', text: 'Finish intro section', done: false },
      { id: 't4', text: 'Find 2 more citations', done: false },
      { id: 't5', text: 'Send draft to Priya', done: false },
    ],
    captures: [
      { id: 'c3', text: 'Add Bailey quote to section 3', routedTo: 'f2', createdAt: new Date().toISOString(), processed: false },
    ],
  },
  {
    id: 'f3', name: 'Learning AI', color: 'amber', status: 'trying', daysActive: 3,
    process: 'One chapter or tutorial daily · ends in 11 days',
    streakDays: [0, 0, 0, 2, 2, 3, 3],
    tasks: [
      { id: 't6', text: 'Complete transformer architecture chapter', done: false },
    ],
    captures: [],
  },
  {
    id: 'f4', name: 'Portuguese', color: 'indigo', status: 'parked', daysActive: 0,
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
      values: SEED_VALUES,
      principles: SEED_PRINCIPLES,
      focuses: SEED_FOCUSES,
      habits: SEED_HABITS,
      reminders: SEED_REMINDERS,
      captures: SEED_CAPTURES,

      setView: (view) => set({ view }),
      setCaptureOpen: (open) => set({ captureOpen: open }),

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

      addCapture: (text, routedTo) =>
        set((state) => ({
          captures: [
            ...state.captures,
            {
              id: `cap-${Date.now()}`,
              text,
              routedTo,
              createdAt: new Date().toISOString(),
              processed: false,
            },
          ],
        })),

      resetDailyHabits: () =>
        set((state) => ({
          habits: state.habits.map((h) => ({ ...h, completedToday: false })),
        })),
    }),
    { name: 'compass-store' }
  )
)
