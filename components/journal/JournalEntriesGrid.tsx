"use client";

import Link from "next/link";
import { SerializedJournalEntry } from "@/types/journalEntries";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User, Users } from "lucide-react";
import {
  getFeelingEmoji,
  formatJournalGridDate,
  truncateNotes,
  getJournalEntryTypeBadgeColor,
} from "@/lib/utils/journalElementsStyling";
import {
  JournalEntryType,
} from "@/lib/models/JournalEntry";
import { filterJournalEntries } from "@/lib/utils/filterJournalEntries";
import { useJournalFilters } from "@/hooks/useJournalFilters";
import { useMemo } from "react";

interface JournalEntriesGridProps {
  entries: SerializedJournalEntry[];
}

export function JournalEntriesGrid({ entries }: JournalEntriesGridProps) {
  const { filters } = useJournalFilters();

  const filteredEntries = useMemo(() => {
    return filterJournalEntries(entries, filters);
  }, [entries, filters]);

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center max-w-md">
          <h3 className="text-2xl font-semibold text-primary mb-2">
            No Journal Entries Yet
          </h3>
          <p className="text-muted-foreground mb-6">
            Start documenting your BJJ journey! Create your first entry to track
            your progress.
          </p>
          <Link
            href="/journal/new"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Create First Entry
          </Link>
        </div>
      </div>
    );
  }

  if (filteredEntries.length === 0 && entries.length > 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center max-w-md">
          <h3 className="text-2xl font-semibold text-primary mb-2">
            No Entries Match Your Filters
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria to see more results.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="my-4 text-sm text-muted-foreground">
        Showing {filteredEntries.length} of {entries.length}{" "}
        {entries.length === 1 ? "entry" : "entries"}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEntries.map((entry) => (
          <JournalEntryCard key={entry._id} entry={entry} />
        ))}
      </div>
    </>
  );
}

function JournalEntryCard({ entry }: { entry: SerializedJournalEntry }) {
  return (
    <Link href={`/journal/${entry._id}`} className="group">
      <Card
        className={`border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer h-full`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 text-sm text-secondary-foreground">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">
                {formatJournalGridDate(new Date(entry.date))}
              </span>
            </div>
            <Badge
              variant="outline"
              className={
                entry.giNoGi === "Gi"
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/50 font-semibold"
                  : "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-800/50 font-semibold"
              }
            >
              {entry.giNoGi}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <Badge
              variant="outline"
              className={getJournalEntryTypeBadgeColor(
                entry.type as JournalEntryType
              )}
            >
              {entry.type}
            </Badge>
            <Badge
              variant="outline"
              className="bg-amber-50 text-amber-700 border-amber-200"
            >
              {entry.area}
            </Badge>
            {entry.feeling && (
              <Badge
                variant="outline"
                className="bg-slate-50 text-slate-700 border-slate-200"
              >
                {getFeelingEmoji(entry.feeling)} {entry.feeling}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{entry.duration} minutes</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="bg-card backdrop-blur-sm rounded-lg p-3 border border-border">
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {truncateNotes(entry.depthNotes)}
            </p>
          </div>

          <div className="space-y-2">
            {entry.location && (
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-1">{entry.location}</span>
              </div>
            )}
            {entry.professor && (
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-1">{entry.professor}</span>
              </div>
            )}
            {entry.partners && entry.partners.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 flex-shrink-0" />
                <span>
                  {entry.partners.length} training partner
                  {entry.partners.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground group-hover:text-primary transition-colors text-right">
              Click to view full entry →
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
