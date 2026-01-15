"use client"

import Link from "next/link"
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SerializedJournalEntry } from "@/types/journalEntries"

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
            <p className="text-muted-foreground mb-4">No recent entries yet</p>
            <Link
              href="/journal/new"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 font-medium"
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
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/50"
      case "Open Mat":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/50"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700/50"
    }
  }

  const getGiNoGiBadgeColor = (giNoGi: string) => {
    return giNoGi === "Gi"
      ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/50"
      : "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-800/50"
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
              className="text-sm text-primary hover:text-primary/80 font-medium"
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
              className="block p-4 rounded-lg border border-border hover:border-primary hover:bg-accent transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Date and Type */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1.5 text-sm text-primary">
                      <Calendar className="h-4 w-4" />
                      <span className="font-semibold">{formatDate(entry.date)}</span>
                    </div>
                    <Badge variant="outline" className={`text-xs ${getTypeBadgeColor(entry.type)}`}>
                      {entry.type}
                    </Badge>
                    {entry.feeling && (
                      <span className="text-xs text-muted-foreground">
                        {getFeelingEmoji(entry.feeling)} {entry.feeling}
                      </span>
                    )}
                  </div>

                  {/* Duration and Location */}
                  <div className="flex items-center gap-4 text-sm mb-2">
                    <div className="flex items-center gap-1.5 text-primary font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{entry.duration} min</span>
                    </div>
                    {entry.location && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="truncate">{entry.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Gi/NoGi and Area */}
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${getGiNoGiBadgeColor(entry.giNoGi)}`}
                    >
                      {entry.giNoGi}
                    </Badge>
                    {entry.area && (
                      <Badge 
                        variant="outline" 
                        className="text-xs bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700/50"
                      > 
                        {entry.area}
                      </Badge>
                    )}
                  </div>

                  {/* Notes Preview */}
                  {entry.depthNotes && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {entry.depthNotes}
                    </p>
                  )}
                </div>

                {/* Arrow Icon */}
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}