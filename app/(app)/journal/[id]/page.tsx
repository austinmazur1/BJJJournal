import { getJournalEntry } from "@/lib/journalStore"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  JournalEntryType,
  JournalEntryGiNoGi,
  JournalEntryArea,
  JournalEntryFeeling,
} from "@/lib/models/JournalEntry"
import { deleteJournalEntry } from "@/lib/journalStore"

export default async function JournalEntryPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = await params
  const session = await getServerSession(authOptions)

  // TODO: Add authorization check - verify user owns this entry

  const journalEntry = await getJournalEntry(id)

  // Format the date nicely
  const entryDate = new Date(journalEntry.date)
  const formattedDate = entryDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Get type-specific styling
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case JournalEntryType.CLASS:
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case JournalEntryType.OPEN_MAT:
        return "bg-purple-100 text-purple-800 hover:bg-purple-100"
      case JournalEntryType.OTHER:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const getGiNogiBadgeColor = (style: string) => {
    return style === JournalEntryGiNoGi.GI
      ? "bg-white text-gray-800 border border-gray-300 hover:bg-white"
      : "bg-gray-800 text-white hover:bg-gray-800"
  }

  const getFeelingEmoji = (feeling?: string) => {
    switch (feeling) {
      case JournalEntryFeeling.ENERGIZED:
        return "⚡"
      case JournalEntryFeeling.TIRED:
        return "😴"
      case JournalEntryFeeling.FOCUSED:
        return "🎯"
      case JournalEntryFeeling.SORE:
        return "💪"
      default:
        return "📝"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/journal"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Journal
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 bg-gradient-to-br from-blue-50 to-white p-6">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={getTypeBadgeColor(journalEntry.type)}>
                {journalEntry.type}
              </Badge>
              <Badge className={getGiNogiBadgeColor(journalEntry.giNoGi)}>
                {journalEntry.giNoGi}
              </Badge>
              <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                {journalEntry.duration} min
              </Badge>
              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                {journalEntry.area}
              </Badge>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {formattedDate}
            </h1>

            <div className="space-y-1 text-gray-700">
              <p className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="font-medium">Training at:</span>
                <span className="ml-2">{journalEntry.location}</span>
              </p>

              {journalEntry.professor && (
                <p className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="font-medium">Instructor:</span>
                  <span className="ml-2">{journalEntry.professor}</span>
                </p>
              )}

              {journalEntry.feeling && (
                <p className="flex items-center">
                  <span className="text-xl mr-2">
                    {getFeelingEmoji(journalEntry.feeling)}
                  </span>
                  <span className="font-medium">Feeling:</span>
                  <span className="ml-2">{journalEntry.feeling}</span>
                </p>
              )}
            </div>
          </div>

          <div className="p-6 space-y-6">
            {journalEntry.partners && journalEntry.partners.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="text-xl mr-2">👥</span>
                  Training Partners
                </h2>
                <div className="flex flex-wrap gap-2">
                  {journalEntry.partners.map((partner, index) => (
                    <Badge
                      key={index}
                      className="bg-blue-50 text-blue-700 hover:bg-blue-50 text-sm px-3 py-1"
                    >
                      {partner}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <span className="text-xl mr-2">📝</span>
                Session Notes
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {journalEntry.depthNotes}
                </p>
              </div>
            </section>

            {journalEntry.questions && journalEntry.questions.trim() && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="text-xl mr-2">❓</span>
                  Questions & Things to Ask
                </h2>
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {journalEntry.questions}
                  </p>
                </div>
              </section>
            )}

            {journalEntry.workOn && journalEntry.workOn.trim() && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="text-xl mr-2">🎯</span>
                  What to Work On Next
                </h2>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {journalEntry.workOn}
                  </p>
                </div>
              </section>
            )}

            {journalEntry.otherNotes && journalEntry.otherNotes.trim() && (
              <section>
                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="text-xl mr-2">📌</span>
                  Additional Notes
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {journalEntry.otherNotes}
                  </p>
                </div>
              </section>
            )}
          </div>

          {/* TODO: Make a client component and add a popup to confirm deletion */}
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
              <p className="text-sm text-gray-500">
                Created {new Date(journalEntry.createdAt).toLocaleDateString()}
                {journalEntry.updatedAt !== journalEntry.createdAt && (
                  <span>
                    {" "}
                    • Updated{" "}
                    {new Date(journalEntry.updatedAt).toLocaleDateString()}
                  </span>
                )}
              </p>
              <div className="flex gap-3 w-full sm:w-auto">
                <Link href={`/journal/${id}/edit`} className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                  Edit
                </Link>
                <button className="flex-1 sm:flex-none px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}