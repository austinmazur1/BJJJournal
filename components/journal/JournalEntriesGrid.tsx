"use client"

import Link from "next/link"
import { SerializedJournalEntry } from "@/lib/journalStore"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, User, Users } from "lucide-react"

interface JournalEntriesGridProps {
  entries: SerializedJournalEntry[]
}

export function JournalEntriesGrid({ entries }: JournalEntriesGridProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center max-w-md">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            No Journal Entries Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start documenting your BJJ journey! Create your first entry to track your progress.
          </p>
          <Link
            href="/journal/new"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Create First Entry
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {entries.map((entry) => (
        <JournalEntryCard key={entry._id} entry={entry} />
      ))}
    </div>
  )
}

function JournalEntryCard({ entry }: { entry: SerializedJournalEntry }) {
  const gradientClass = entry.giNoGi === "Gi" 
    ? "bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100" 
    : "bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100"
  
  const typeBadgeColor = entry.type === "Class" 
    ? "bg-green-100 text-green-800 border-green-200" 
    : entry.type === "Open Mat"
    ? "bg-orange-100 text-orange-800 border-orange-200"
    : "bg-gray-100 text-gray-800 border-gray-200"

  const getFeelingEmoji = (feeling?: string) => {
    switch (feeling) {
      case "Energized": return "💪"
      case "Tired": return "😴"
      case "Focused": return "🎯"
      case "Sore": return "🤕"
      default: return ""
    }
  }

  // Format date nicely. TODO: Move to a separate file
  const formattedDate = new Date(entry.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  })

  // Truncate depth notes for preview. TODO: Move to a separate file
  const truncatedNotes = entry.depthNotes.length > 120 
    ? entry.depthNotes.substring(0, 120) + "..." 
    : entry.depthNotes

  return (
    <Link href={`/journal/${entry._id}`} className="group">
      <Card className={`${gradientClass} border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer h-full`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">{formattedDate}</span>
            </div>
            <Badge 
              variant="outline" 
              className={entry.giNoGi === "Gi" 
                ? "bg-blue-100 text-blue-800 border-blue-300 font-semibold" 
                : "bg-purple-100 text-purple-800 border-purple-300 font-semibold"
              }
            >
              {entry.giNoGi}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline" className={typeBadgeColor}>
              {entry.type}
            </Badge>
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
              {entry.area}
            </Badge>
            {entry.feeling && (
              <Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-200">
                {getFeelingEmoji(entry.feeling)} {entry.feeling}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{entry.duration} minutes</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50">
            <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">
              {truncatedNotes}
            </p>
          </div>

          <div className="space-y-2">
            {entry.location && (
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-1">{entry.location}</span>
              </div>
            )}
            {entry.professor && (
              <div className="flex items-start gap-2 text-sm text-gray-700">
                <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-1">{entry.professor}</span>
              </div>
            )}
            {entry.partners && entry.partners.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Users className="h-4 w-4 flex-shrink-0" />
                <span>{entry.partners.length} training partner{entry.partners.length !== 1 ? "s" : ""}</span>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-gray-200/50">
            <p className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors text-right">
              Click to view full entry →
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

