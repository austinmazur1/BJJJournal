import { JournalForm } from "@/components/journal/JournalForm"
import { createJournalEntryAction } from "@/lib/journalStore"
import Link from "next/link"

export default function NewJournalEntryPage() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4 w-fit"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-primary">New Journal Entry</h1>
          <p className="text-muted-foreground mt-2">
            Record your training session details and insights
          </p>
        </div>
        <JournalForm serverAction={createJournalEntryAction} />
      </div>
    </div>
  )
}
