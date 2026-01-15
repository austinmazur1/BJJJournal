"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import type { StatKey } from "@/types/stats"
import { DEFAULT_ENABLED_STATS } from "@/types/stats"

const STORAGE_KEY = "bjj-journal-stats-preferences"

// Define the context shape
interface StatsPreferencesContextType {
  enabledStats: StatKey[]
  updateEnabledStats: (stats: StatKey[]) => void
  toggleStat: (statKey: StatKey) => void
  isLoading: boolean
}

const StatsPreferencesContext = createContext<StatsPreferencesContextType | undefined>(undefined)

function getFromStorage(): StatKey[] | null {
  if (typeof window === "undefined") return null
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (error) {
    console.error("Failed to load stats preferences:", error)
  }
  return null
}

function saveToStorage(stats: StatKey[]): void {
  if (typeof window === "undefined") return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  } catch (error) {
    console.error("Failed to save stats preferences:", error)
  }
}

export function StatsPreferencesProvider({ children }: { children: ReactNode }) {
  const [enabledStats, setEnabledStats] = useState<StatKey[]>(DEFAULT_ENABLED_STATS)
  const [isLoading, setIsLoading] = useState(true)

  // Load from storage on mount
  useEffect(() => {
    const stored = getFromStorage()
    if (stored) {
      setEnabledStats(stored)
    }
    setIsLoading(false)
  }, [])

  // Save to storage whenever enabledStats changes
  useEffect(() => {
    if (!isLoading) {
      saveToStorage(enabledStats)
    }
  }, [enabledStats, isLoading])

  const updateEnabledStats = (stats: StatKey[]) => {
    setEnabledStats(stats)
  }

  const toggleStat = (statKey: StatKey) => {
    setEnabledStats((prev) => {
      const updated = prev.includes(statKey)
        ? prev.filter((key) => key !== statKey)
        : [...prev, statKey]
      return updated
    })
  }

  return (
    <StatsPreferencesContext.Provider 
      value={{ 
        enabledStats, 
        updateEnabledStats, 
        toggleStat, 
        isLoading 
      }}
    >
      {children}
    </StatsPreferencesContext.Provider>
  )
}

// The hook now consumes the context instead of creating new state
export function useStatsPreferences() {
  const context = useContext(StatsPreferencesContext)
  if (context === undefined) {
    throw new Error("useStatsPreferences must be used within a StatsPreferencesProvider")
  }
  return context
}
