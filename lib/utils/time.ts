export function formatDuration(minutes: number): string {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    let str = ""
    if (h > 0) str += `${h}h `
    if (m > 0 || h === 0) str += `${m}m`
    return str.trim()
  }