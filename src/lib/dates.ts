export function formatTopbarDate(): string {
  const d = new Date()
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
  return `${days[d.getDay()]} · ${months[d.getMonth()]} ${d.getDate()}`
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}
