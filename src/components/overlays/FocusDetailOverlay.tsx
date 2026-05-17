import { useEffect, useRef, useState } from 'react'

import { useCompassStore, type Focus, type TaskStatus } from '@/store/useCompassStore'

const DOT_COLOR: Record<Focus['color'], string> = {
  green:  '#3A8F68',
  indigo: '#5C6DC4',
  amber:  '#B8772A',
  rose:   '#B85870',
  teal:   '#3A9190',
}

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'todo', label: 'Todo' },
  { value: 'inprogress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
  { value: 'parked', label: 'Parked' },
]

const STATUS_CLASS: Record<TaskStatus, string> = {
  backlog: 'tds-backlog',
  todo: 'tds-todo',
  inprogress: 'tds-inprogress',
  done: 'tds-done',
  parked: 'tds-parked',
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.5 3h10M4.5 3V2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M5.5 6v4M7.5 6v4M2.5 3l.6 7.1A1 1 0 0 0 4.1 11h4.8a1 1 0 0 0 1-.9L10.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function parseTags(raw: string): string[] {
  return raw
    .split(/\s+/)
    .filter((t) => t.startsWith('#'))
    .map((t) => t.slice(1))
    .filter(Boolean)
}

function autoResize(el: HTMLTextAreaElement) {
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight.toString()}px`
}

export function FocusDetailOverlay() {
  const {
    focuses,
    focusDetailId,
    openFocusDetail,
    updateFocus,
    deleteFocus,
    addTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
  } = useCompassStore()

  const focus = focuses.find((f) => f.id === focusDetailId) ?? null
  const isOpen = focus !== null

  const [nameVal, setNameVal] = useState('')
  const [processVal, setProcessVal] = useState('')
  const [tagsText, setTagsText] = useState('')
  const [newTask, setNewTask] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editingTaskVal, setEditingTaskVal] = useState('')
  const [colorPickerOpen, setColorPickerOpen] = useState(false)

  const processRef = useRef<HTMLTextAreaElement>(null)
  const addTaskRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (focus) {
      setNameVal(focus.name)
      setProcessVal(focus.process)
      setTagsText(focus.tags.length > 0 ? focus.tags.map((t) => `#${t}`).join(' ') : '')
      setNewTask('')
      setConfirmDelete(false)
      setColorPickerOpen(false)
      setTimeout(() => {
        if (processRef.current) autoResize(processRef.current)
      }, 0)
    }
  }, [focusDetailId])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (confirmDelete) { setConfirmDelete(false); return }
        if (isOpen) openFocusDetail(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey) }
  }, [isOpen, confirmDelete, openFocusDetail])

  function saveName() {
    const trimmed = nameVal.trim()
    if (focus) updateFocus(focus.id, { name: trimmed || focus.name })
  }

  function saveProcess() {
    if (focus) updateFocus(focus.id, { process: processVal.trim() })
  }

  function saveTags() {
    if (focus) updateFocus(focus.id, { tags: parseTags(tagsText) })
  }

  function handleAddTask() {
    const trimmed = newTask.trim()
    if (trimmed && focus) {
      addTask(focus.id, trimmed)
      setNewTask('')
    }
  }

  if (!focus) return <div className="fd-overlay" />

  return (
    <div className={`fd-overlay${isOpen ? ' open' : ''}`} onClick={() => { openFocusDetail(null) }}>
      <div className="fd-card" onClick={(e) => { e.stopPropagation() }}>

        {/* Name row */}
        <div className="fd-hd">
          <div className="fd-dot-wrap">
            <div
              className="fd-dot fd-dot-btn"
              style={{ background: DOT_COLOR[focus.color] }}
              onClick={() => { setColorPickerOpen((o) => !o) }}
              title="Change color"
            />
            {colorPickerOpen && (
              <div className="fd-color-picker">
                {(Object.entries(DOT_COLOR) as [Focus['color'], string][]).map(([c, hex]) => (
                  <div
                    key={c}
                    className={`fd-color-swatch${focus.color === c ? ' active' : ''}`}
                    style={{ background: hex }}
                    onClick={() => { updateFocus(focus.id, { color: c }); setColorPickerOpen(false) }}
                  />
                ))}
              </div>
            )}
          </div>
          <input
            className="fd-field fd-field-name"
            value={nameVal}
            onChange={(e) => { setNameVal(e.target.value) }}
            onBlur={saveName}
            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
          />
          <button className="fd-del-btn" title="Delete focus" onClick={() => { setConfirmDelete(true) }}>
            <TrashIcon />
          </button>
        </div>

        {/* Confirm delete */}
        {confirmDelete && (
          <div className="fd-confirm">
            <span className="fd-confirm-msg">Delete this focus and all its tasks?</span>
            <button className="fd-confirm-yes" onClick={() => { deleteFocus(focus.id) }}>Delete</button>
            <button className="fd-confirm-no" onClick={() => { setConfirmDelete(false) }}>Cancel</button>
          </div>
        )}

        {/* Process */}
        <textarea
          ref={processRef}
          className="fd-field fd-field-process"
          placeholder="How will you work on it…"
          value={processVal}
          rows={1}
          onChange={(e) => { setProcessVal(e.target.value); autoResize(e.currentTarget) }}
          onBlur={saveProcess}
        />

        <div className="fd-meta">
          {/* Status */}
          <div className="fd-meta-row">
            <span className="fd-meta-lbl">Status</span>
            <select
              className={`fd-status-select${focus.status === 'parked' ? ' parked' : ''}`}
              value={focus.status}
              onChange={(e) => { updateFocus(focus.id, { status: e.target.value as Focus['status'] }) }}
            >
              <option value="active">Active</option>
              <option value="parked">Parked</option>
            </select>
          </div>

          {/* Tags */}
          <div className="fd-meta-row">
            <span className="fd-meta-lbl">Tags</span>
            <input
              className="fd-tags-input"
              placeholder="#add #tags"
              value={tagsText}
              onChange={(e) => { setTagsText(e.target.value) }}
              onBlur={saveTags}
              onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
            />
          </div>
        </div>

        <div className="fd-sep" />

        {/* Tasks */}
        <div className="fd-sect-lbl">Tasks</div>

        <div className="fd-tasks">
          {focus.tasks.map((task) => (
            <div className="td-row" key={task.id}>
              {editingTaskId === task.id ? (
                <input
                  autoFocus
                  className="td-edit-input"
                  value={editingTaskVal}
                  onChange={(e) => { setEditingTaskVal(e.target.value) }}
                  onBlur={() => {
                    const trimmed = editingTaskVal.trim()
                    if (trimmed) updateTask(focus.id, task.id, trimmed)
                    setEditingTaskId(null)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.currentTarget.blur()
                    if (e.key === 'Escape') { setEditingTaskId(null) }
                  }}
                />
              ) : (
                <span
                  className={`td-text${task.status === 'done' ? ' done' : ''}`}
                  onClick={() => { setEditingTaskId(task.id); setEditingTaskVal(task.text) }}
                >
                  {task.text}
                </span>
              )}
              <select
                className={`td-status-select ${STATUS_CLASS[task.status]}`}
                value={task.status}
                onChange={(e) => { updateTaskStatus(focus.id, task.id, e.target.value as TaskStatus) }}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <button className="td-del" onClick={() => { deleteTask(focus.id, task.id) }}>×</button>
            </div>
          ))}

          {focus.tasks.length === 0 && (
            <div className="td-empty">No tasks yet</div>
          )}

          <input
            ref={addTaskRef}
            className="td-add-input"
            placeholder="Add a task…"
            value={newTask}
            onChange={(e) => { setNewTask(e.target.value) }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddTask()
              if (e.key === 'Escape') { setNewTask(''); addTaskRef.current?.blur() }
            }}
          />
        </div>

        <div className="fd-foot">
          <span className="fd-hint">esc to close · click outside to dismiss</span>
        </div>
      </div>
    </div>
  )
}
