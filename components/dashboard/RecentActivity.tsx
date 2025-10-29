"use client"

import Link from "next/link"
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { SerializedJournalEntry } from "@/lib/journalStore"

interface RecentActivityProps {
  entries: SerializedJournalEntry[]
}

export function RecentActivity({ entries }: RecentActivityProps) {
  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest training sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No recent entries yet</p>
            <Link
              href="/journal/new"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Create your first entry
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    // Check if it's today
    if (date.toDateString() === today.toDateString()) {
      return "Today"
    }
    // Check if it's yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    }
    // Otherwise format normally
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    })
  }

  const getFeelingEmoji = (feeling?: string) => {
    switch (feeling) {
      case "Energized": return "💪"
      case "Tired": return "😴"
      case "Focused": return "🎯"
      case "Sore": return "🤕"
      default: return ""
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "Class":
        return "bg-green-100 text-green-800 border-green-200"
      case "Open Mat":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest training sessions</CardDescription>
          </div>
          {entries.length > 0 && (
            <Link
              href="/journal"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {entries.map((entry) => (
            <Link
              key={entry._id}
              href={`/journal/${entry._id}`}
              className="block p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Date and Type */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">{formatDate(entry.date)}</span>
                    </div>
                    <Badge variant="outline" className={`text-xs ${getTypeBadgeColor(entry.type)}`}>
                      {entry.type}
                    </Badge>
                    {entry.feeling && (
                      <span className="text-xs text-gray-500">
                        {getFeelingEmoji(entry.feeling)} {entry.feeling}
                      </span>
                    )}
                  </div>

                  {/* Duration and Location */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{entry.duration} min</span>
                    </div>
                    {entry.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="truncate">{entry.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Gi/NoGi and Area */}
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        entry.giNoGi === "Gi"
                          ? "bg-blue-100 text-blue-800 border-blue-300 text-xs"
                          : "bg-purple-100 text-purple-800 border-purple-300 text-xs"
                      }
                    >
                      {entry.giNoGi}
                    </Badge>
                    {entry.area && (
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 text-xs">
                        {entry.area}
                      </Badge>
                    )}
                  </div>

                  {/* Notes Preview */}
                  {entry.depthNotes && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {entry.depthNotes}
                    </p>
                  )}
                </div>

                {/* Arrow Icon */}
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}