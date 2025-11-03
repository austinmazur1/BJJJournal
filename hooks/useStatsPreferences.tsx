"use client"

import { useState, useEffect } from "react"
import type { StatKey } from "@/types/stats"
import { DEFAULT_ENABLED_STATS } from "@/types/stats"

const STORAGE_KEY = "bjj-journal-stats-preferences"

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

export function useStatsPreferences() {
  const [enabledStats, setEnabledStats] = useState<StatKey[]>(DEFAULT_ENABLED_STATS)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = getFromStorage()
    if (stored) {
      setEnabledStats(stored)
    }
    setIsLoading(false)
  }, [])

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

  return {
    enabledStats,
    updateEnabledStats,
    toggleStat,
    isLoading,
  }
}