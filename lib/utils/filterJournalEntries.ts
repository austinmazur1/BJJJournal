import { SerializedJournalEntry } from "@/types/journalEntries"
import { JournalFilters } from "@/hooks/useJournalFilters"

export function filterJournalEntries(
  entries: SerializedJournalEntry[],
  filters: JournalFilters
): SerializedJournalEntry[] {
  let filtered = [...entries]

  // Search filter (searches multiple fields)
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter((entry) => {
      return (
        entry.depthNotes?.toLowerCase().includes(searchLower) ||
        entry.otherNotes?.toLowerCase().includes(searchLower) ||
        entry.location?.toLowerCase().includes(searchLower) ||
        entry.professor?.toLowerCase().includes(searchLower) ||
        entry.partners?.some((partner) => partner.toLowerCase().includes(searchLower)) ||
        entry.workOn?.toLowerCase().includes(searchLower)
      )
    })
  }

  if (filters.type && filters.type !== "all") {
    filtered = filtered.filter((entry) => entry.type === filters.type)
  }

  if (filters.giNoGi && filters.giNoGi !== "all") {
    filtered = filtered.filter((entry) => entry.giNoGi === filters.giNoGi)
  }

  if (filters.area && filters.area !== "all") {
    filtered = filtered.filter((entry) => entry.area === filters.area)
  }

  if (filters.feeling && filters.feeling !== "all") {
    filtered = filtered.filter((entry) => entry.feeling === filters.feeling)
  }

  filtered.sort((a, b) => {
    switch (filters.sort) {
      case "date-desc":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "date-asc":
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case "duration-desc":
        return b.duration - a.duration
      case "duration-asc":
        return a.duration - b.duration
      default:
        return 0
    }
  })

  return filtered
}