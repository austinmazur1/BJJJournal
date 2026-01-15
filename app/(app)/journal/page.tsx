import { getJournalEntries } from "@/lib/journalStore"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { findUserById } from "@/lib/userStore"
import { JournalEntriesGrid } from "@/components/journal/JournalEntriesGrid"
import Link from "next/link"
import { Plus } from "lucide-react"
import JournalFilters from "@/components/journal/JournalFilters"

export default async function JournalEntriesPage() {
  const session = await getServerSession(authOptions)
  const user = await findUserById(session?.user?.id || "")
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">User not found</h1>
          <p className="text-gray-600 mt-2">Please sign in again</p>
        </div>
      </div>
    )
  }

  const journalEntries = await getJournalEntries(user)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">
                My Journal Entries
              </h1>
              <p className="text-muted-foreground">
                {journalEntries.length === 0 
                  ? "Start documenting your BJJ journey" 
                  : `${journalEntries.length} ${journalEntries.length === 1 ? "entry" : "entries"} recorded`
                }
              </p>
            </div>
            <Link
              href="/journal/new"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm hover:shadow-md"
            >
              <Plus className="h-5 w-5" />
              New Entry
            </Link>
          </div>
        </div>
        <JournalFilters />
        <JournalEntriesGrid entries={journalEntries} />
      </div>
    </div>
  );
}
