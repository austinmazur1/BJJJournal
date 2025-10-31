import { JournalForm } from "@/components/journal/JournalForm"
import { updateJournalEntryAction, getJournalEntry } from "@/lib/journalStore"
import Link from "next/link"

export default async function JournalEntryEditPage({ params }: { params: { id: string } }) {
    const { id } = await params
    const journalEntry = await getJournalEntry(id)

    return (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <Link
                href="/journal"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4 w-fit"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Journal
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Edit Journal Entry</h1>
              <p className="text-gray-600 mt-2">
                Edit your training session details and insights
              </p>
            </div>
    
            <JournalForm serverAction={updateJournalEntryAction} journalEntry={journalEntry} />
          </div>
        </div>
      )
}