"use client";

import { Button } from "../ui/button";
import { SerializedJournalEntry } from "@/types/journalEntries";
import { useRouter } from "next/navigation";
import AlertDialog from "../AlertDialog";
import { deleteJournalEntry } from "@/lib/journalStore";
import { Trash2 } from "lucide-react";

export default function JournalDetailFooter({
  journalEntry,
}: {
  journalEntry: SerializedJournalEntry;
}) {
  const router = useRouter();
  const { _id, createdAt, updatedAt } = journalEntry;
  return (
    <div className="border-t border-border p-6">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <p className="text-sm text-gray-500">
          Created {new Date(createdAt).toLocaleDateString()}
          {updatedAt !== createdAt && (
            <span>
              {" "}
              • Updated {new Date(journalEntry.updatedAt).toLocaleDateString()}
            </span>
          )}
        </p>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button
            variant={"outline"}
            onClick={() => router.push(`/journal/${_id}/edit`)}
          >
            Edit
          </Button>
          <AlertDialog
            title="Delete Journal Entry"
            description="Are you sure you want to delete this journal entry?"
            onConfirm={() => deleteJournalEntry(_id)}
            trigger={<Button variant={"destructive"}>Delete</Button>}
            confirmButtonText="Delete"
            confirmButtonVariant="destructive"
            confirmButtonIcon={<Trash2 className="h-4 w-4" />}
          />
        </div>
      </div>
    </div>
  );
}
