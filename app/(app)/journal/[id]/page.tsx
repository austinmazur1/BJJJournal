import { getJournalEntry } from "@/lib/journalStore";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { JournalEntryGiNoGi } from "@/lib/models/JournalEntry";
import JournalDetailFooter from "@/components/journal/JournalDetailFooter";
import {
  getTypeBadgeColor,
  getFeelingEmoji,
  getGiNoGiBadgeColor,
  formatDate,
} from "@/lib/utils/journalElementsStyling";
import { cn } from "@/lib/utils";
import { ArrowLeft, MapPin, User, Users, FileText, HelpCircle, Target, StickyNote } from "lucide-react";

export default async function JournalEntryPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const journalEntry = await getJournalEntry(id);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/journal"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Journal
          </Link>
        </div>

        <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="border-b border-border p-6">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={cn(getTypeBadgeColor(journalEntry.type), "hover:cursor-default")}>
                {journalEntry.type}
              </Badge>
              <Badge
                className={cn(getGiNoGiBadgeColor(
                  journalEntry.giNoGi as JournalEntryGiNoGi
                ), "hover:cursor-default")}
              >
                {journalEntry.giNoGi}
              </Badge>
              <Badge className="bg-card-foreground text-primary-foreground hover:bg-card-foreground/50 hover:cursor-default">
                {journalEntry.duration} min
              </Badge>
              <Badge className="bg-card-foreground text-primary-foreground hover:bg-card-foreground/50 hover:cursor-default">
                {journalEntry.area}
              </Badge>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">
              {formatDate(new Date(journalEntry.date))}
            </h1>

            <div className="space-y-1 text-secondary-foreground">
              <p className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-muted-foreground" />
                <span className="font-medium">Training at:</span>
                <span className="ml-2">{journalEntry.location}</span>
              </p>

              {journalEntry.professor && (
                <p className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-muted-foreground" />
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
                <h2 className="text-lg font-semibold text-primary mb-3 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-gray-600" />
                  Training Partners
                </h2>
                <div className="flex flex-wrap gap-2">
                  {journalEntry.partners.map((partner, index) => (
                    <Badge
                      key={index}
                      className="bg-card-foreground text-primary-foreground hover:bg-card-foreground/50 text-sm px-3 py-1"
                    >
                      {partner}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-lg font-semibold text-primary mb-3 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-muted-foreground" />
                Session Notes
              </h2>
              <div className="bg-card text-primary-foreground rounded-lg p-4 border border-border">
                <p className="text-secondary-foreground leading-relaxed whitespace-pre-wrap">
                  {journalEntry.depthNotes}
                </p>
              </div>
            </section>

            {journalEntry.questions && journalEntry.questions.trim() && (
              <section>
                <h2 className="text-lg font-semibold text-primary mb-3 flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2 text-muted-foreground" />
                  Questions & Things to Ask
                </h2>
                <div className="bg-card text-primary-foreground rounded-lg p-4 border border-border">
                  <p className="text-secondary-foreground leading-relaxed whitespace-pre-wrap">
                    {journalEntry.questions}
                  </p>
                </div>
              </section>
            )}

            {journalEntry.workOn && journalEntry.workOn.trim() && (
              <section>
                <h2 className="text-lg font-semibold text-primary mb-3 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-muted-foreground" />
                  What to Work On Next
                </h2>
                <div className="bg-card text-primary-foreground rounded-lg p-4 border border-border">
                  <p className="text-secondary-foreground leading-relaxed whitespace-pre-wrap">
                    {journalEntry.workOn}
                  </p>
                </div>
              </section>
            )}

            {journalEntry.otherNotes && journalEntry.otherNotes.trim() && (
              <section>
                <h2 className="text-lg font-semibold text-primary mb-3 flex items-center">
                  <StickyNote className="w-5 h-5 mr-2 text-muted-foreground" />
                  Additional Notes
                </h2>
                <div className="bg-card text-primary-foreground rounded-lg p-4 border border-border">
                  <p className="text-secondary-foreground leading-relaxed whitespace-pre-wrap">
                    {journalEntry.otherNotes}
                  </p>
                </div>
              </section>
            )}
          </div>
          <JournalDetailFooter journalEntry={journalEntry} />
        </div>
      </div>
    </div>
  );
}
