import { z } from "zod"
import { JournalEntryArea, JournalEntryFeeling, JournalEntryGiNoGi, JournalEntryType } from "../models/JournalEntry"

export const journalEntryValidation = z.object({
  date: z.date(),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  type: z.enum(Object.values(JournalEntryType) as [JournalEntryType, ...JournalEntryType[]]),
  giNoGi: z.enum(Object.values(JournalEntryGiNoGi) as [JournalEntryGiNoGi, ...JournalEntryGiNoGi[]]),
  area: z.enum(Object.values(JournalEntryArea) as [JournalEntryArea, ...JournalEntryArea[]]),
  feeling: z.enum(Object.values(JournalEntryFeeling) as [JournalEntryFeeling, ...JournalEntryFeeling[]]).optional(),
  questions: z.string(),
  location: z.string().min(1, "Training location is required"),
  professor: z.string(),
  depthNotes: z.string().min(1, "Session notes are required"),
  otherNotes: z.string(),
  workOn: z.string(),
  partners: z.array(z.string()),
})

export const journalEntryUpdateValidation = journalEntryValidation.extend({
  id: z.string(),
})

export type JournalEntryValidation = z.infer<typeof journalEntryValidation>
export type JournalEntryUpdateValidation = z.infer<typeof journalEntryUpdateValidation>