interface SheetCloseProps {
  onClose: () => void
  onDelete?: () => void
}

export function SheetClose({ onClose, onDelete }: SheetCloseProps) {
  return (
    <div className="sheet-close-bar">
      {onDelete && (
        <button className="sheet-close-delete" onClick={onDelete} aria-label="Delete">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path d="M1.5 3h10M4.5 3V2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M5.5 6v4M7.5 6v4M2.5 3l.6 7.1A1 1 0 0 0 4.1 11h4.8a1 1 0 0 0 1-.9L10.5 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
      <button className="sheet-close-btn" onClick={onClose} aria-label="Close">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  )
}
