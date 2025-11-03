"use client"

import { Settings2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ComprehensiveStats } from "@/lib/journalStore"
import type { StatKey, StatConfig } from "@/types/stats"
import { STAT_DEFINITIONS } from "@/types/stats"
import { useStatsPreferences } from "@/hooks/useStatsPreferences"
import { useEffect, useState, useTransition } from "react"

interface StatsOverviewProps {
  stats: ComprehensiveStats
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const { enabledStats, updateEnabledStats, isLoading } = useStatsPreferences()
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [localEnabled, setLocalEnabled] = useState<StatKey[]>(enabledStats)

  // Sync local state when enabledStats changes from localStorage
  useEffect(() => {
    setLocalEnabled(enabledStats)
  }, [enabledStats])

  const handleSave = () => {
    startTransition(() => {
      updateEnabledStats(localEnabled)
      setIsEditing(false)
    })
  }

  const handleToggle = (statKey: StatKey) => {
    setLocalEnabled((prev) => {
      if (prev.includes(statKey)) {
        return prev.filter((key) => key !== statKey)
      } else {
        return [...prev, statKey]
      }
    })
  }

  const handleCancel = () => {
    setLocalEnabled(enabledStats)
    setIsEditing(false)
  }

  const renderStatValue = (statKey: StatKey) => {
    switch (statKey) {
      case 'totalSessions':
        return <p className="text-3xl font-bold text-blue-600">{stats.totalSessions}</p>
      case 'totalTimeTrained':
        return <p className="text-3xl font-bold text-purple-600">{stats.totalTimeTrained}</p>
      case 'sessionsThisMonth':
        return <p className="text-3xl font-bold text-green-600">{stats.sessionsThisMonth}</p>
      case 'sessionsThisWeek':
        return <p className="text-3xl font-bold text-indigo-600">{stats.sessionsThisWeek}</p>
      case 'averageDuration':
        return <p className="text-3xl font-bold text-orange-600">{stats.averageDuration}</p>
      case 'giVsNoGi':
        return (
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.giVsNoGi.gi} / {stats.giVsNoGi.noGi}</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.giVsNoGi.percentage.gi}% Gi · {stats.giVsNoGi.percentage.noGi}% NoGi
            </p>
          </div>
        )
      case 'mostCommonPartner':
        return stats.mostCommonPartner ? (
          <div className="text-center">
            <p className="text-2xl font-bold text-teal-600">{stats.mostCommonPartner.name}</p>
            <p className="text-xs text-gray-500 mt-1">{stats.mostCommonPartner.count} sessions</p>
          </div>
        ) : (
          <p className="text-lg text-gray-400">No data</p>
        )
      case 'mostCommonPartnerThisMonth':
        return stats.mostCommonPartnerThisMonth ? (
          <div className="text-center">
            <p className="text-2xl font-bold text-cyan-600">{stats.mostCommonPartnerThisMonth.name}</p>
            <p className="text-xs text-gray-500 mt-1">{stats.mostCommonPartnerThisMonth.count} sessions</p>
          </div>
        ) : (
          <p className="text-lg text-gray-400">No data</p>
        )
      case 'mostCommonArea':
        return stats.mostCommonArea ? (
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-600">{stats.mostCommonArea.area}</p>
            <p className="text-xs text-gray-500 mt-1">{stats.mostCommonArea.count} times</p>
          </div>
        ) : (
          <p className="text-lg text-gray-400">No data</p>
        )
      case 'trainingFrequency':
        return <p className="text-3xl font-bold text-pink-600">{stats.trainingFrequency}</p>
      case 'mostCommonType':
        return stats.mostCommonType ? (
          <div className="text-center">
            <p className="text-2xl font-bold text-rose-600">{stats.mostCommonType.type}</p>
            <p className="text-xs text-gray-500 mt-1">{stats.mostCommonType.count} sessions</p>
          </div>
        ) : (
          <p className="text-lg text-gray-400">No data</p>
        )
      case 'favoriteLocation':
        return stats.favoriteLocation ? (
          <div className="text-center">
            <p className="text-xl font-bold text-emerald-600">{stats.favoriteLocation.location}</p>
            <p className="text-xs text-gray-500 mt-1">{stats.favoriteLocation.count} times</p>
          </div>
        ) : (
          <p className="text-lg text-gray-400">No data</p>
        )
      case 'mostCommonProfessor':
        return stats.mostCommonProfessor ? (
          <div className="text-center">
            <p className="text-xl font-bold text-violet-600">{stats.mostCommonProfessor.professor}</p>
            <p className="text-xs text-gray-500 mt-1">{stats.mostCommonProfessor.count} sessions</p>
          </div>
        ) : (
          <p className="text-lg text-gray-400">No data</p>
        )
      case 'trainingStreak':
        return <p className="text-3xl font-bold text-red-600">{stats.trainingStreak}</p>
      default:
        return null
    }
  }

  const getStatConfig = (key: StatKey): StatConfig | undefined => {
    return STAT_DEFINITIONS.find((stat) => stat.key === key)
  }

  const visibleStats = STAT_DEFINITIONS.filter((def) => 
    isEditing 
      ? localEnabled.includes(def.key)
      : enabledStats.includes(def.key)
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your Training Stats</CardTitle>
            <CardDescription>
              Track your progress and training insights
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
            disabled={isPending}
            className="gap-2"
          >
            <Settings2 className="size-4" />
            {isEditing ? "Cancel" : "Customize"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Toggle stats to show/hide them on your dashboard
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
              {STAT_DEFINITIONS.map((stat) => {
                const isEnabled = localEnabled.includes(stat.key)
                return (
                  <button
                    key={stat.key}
                    onClick={() => handleToggle(stat.key)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      isEnabled
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{stat.label}</span>
                      {isEnabled ? (
                        <Eye className="size-4 text-blue-600" />
                      ) : (
                        <EyeOff className="size-4 text-gray-400" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </button>
                )
              })}
            </div>
            <div className="flex gap-3 mt-4">
              <Button onClick={handleSave} disabled={isPending} className="flex-1">
                {isPending ? "Saving..." : "Save Preferences"}
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={isPending}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {!isEditing && (
          <>
            {visibleStats.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No stats enabled. Click "Customize" to add stats!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleStats.map((stat) => {
                  const config = getStatConfig(stat.key)
                  if (!config) return null
                  
                  return (
                    <div
                      key={stat.key}
                      className="text-center p-4 bg-gray-50 rounded-lg"
                    >
                      {renderStatValue(stat.key)}
                      <p className="text-sm text-gray-600 mt-1">{config.label}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}