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

import { ArrowLeft, MapPin, User, Users, FileText, HelpCircle, Target, StickyNote } from "lucide-react";

export default async function JournalEntryPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const journalEntry = await getJournalEntry(id);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/journal"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Journal
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 bg-gradient-to-br from-blue-50 to-white p-6">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={getTypeBadgeColor(journalEntry.type)}>
                {journalEntry.type}
              </Badge>
              <Badge
                className={getGiNoGiBadgeColor(
                  journalEntry.giNoGi as JournalEntryGiNoGi
                )}
              >
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
              {formatDate(new Date(journalEntry.date))}
            </h1>

            <div className="space-y-1 text-gray-700">
              <p className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                <span className="font-medium">Training at:</span>
                <span className="ml-2">{journalEntry.location}</span>
              </p>

              {journalEntry.professor && (
                <p className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-gray-500" />
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
                  <Users className="w-5 h-5 mr-2 text-gray-600" />
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
                <FileText className="w-5 h-5 mr-2 text-gray-600" />
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
                  <HelpCircle className="w-5 h-5 mr-2 text-gray-600" />
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
                  <Target className="w-5 h-5 mr-2 text-gray-600" />
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
                  <StickyNote className="w-5 h-5 mr-2 text-gray-600" />
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
          <JournalDetailFooter journalEntry={journalEntry} />
        </div>
      </div>
    </div>
  );
}
