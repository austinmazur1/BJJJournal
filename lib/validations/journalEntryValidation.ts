import { z } from "zod"
import { JournalEntryArea, JournalEntryFeeling, JournalEntryGiNoGi, JournalEntryType } from "../models/JournalEntry"

export const journalEntryValidation = z.object({
  date: z.date(),
  duration: z.number().min(1),
  type: z.enum(Object.values(JournalEntryType)),
  giNoGi: z.enum(Object.values(JournalEntryGiNoGi)),
  area: z.enum(Object.values(JournalEntryArea)),
  feeling: z.enum(Object.values(JournalEntryFeeling)).optional(),
  questions: z.string(),
  location: z.string(),
  professor: z.string(),
  depthNotes: z.string(),
  otherNotes: z.string(),
  workOn: z.string(),
  partners: z.array(z.string()),
}).refine((data) => {
  if (data.partners.length > 0) {
    return data.partners.every((partner) => typeof partner === "string")
  }
  return true
}, {
  message: "Partners must be an array of strings",
})

export const journalEntryUpdateValidation = journalEntryValidation.extend({
  id: z.string(),
})

export type JournalEntryValidation = z.infer<typeof journalEntryValidation>
export type JournalEntryUpdateValidation = z.infer<typeof journalEntryUpdateValidation>