import { Schema, model, models, Types } from "mongoose"
import { UserDocument } from "./User"

export enum JournalEntryType {
  CLASS = "Class",
  OPEN_MAT = "Open Mat",
  OTHER = "Other"
}

export enum JournalEntryGiNoGi {
  GI = "Gi",
  NO_GI = "No Gi"
}

export enum JournalEntryFeeling {
  ENERGIZED = "Energized",
  TIRED = "Tired",
  FOCUSED = "Focused",
  SORE = "Sore"
}

export enum JournalEntryArea {
  GUARD = "Guard",
  PASS = "Pass",
  TAKEDOWN = "Takedown",
  SUBMISSION = "Submission",
  ESCAPES = "Escapes",
  OTHER = "Other"
}

export type JournalEntryDocument = {
  _id?: Types.ObjectId
  userId: Schema.Types.ObjectId | UserDocument
  date: Date
  duration: number
  type: JournalEntryType
  giNoGi: JournalEntryGiNoGi
  area: JournalEntryArea
  feeling: JournalEntryFeeling
  questions: string
  location: string
  professor: string
  depthNotes: string
  otherNotes: string
  workOn: string
  partners: string[]
}

const JournalEntrySchema = new Schema<JournalEntryDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true },
    type: { 
      type: String, 
      required: true,
      enum: Object.values(JournalEntryType)
    },
    giNoGi: { 
      type: String, 
      required: true,
      enum: Object.values(JournalEntryGiNoGi)
    },
    area: { 
      type: String, 
      required: true,
      enum: Object.values(JournalEntryArea)
    },
    feeling: { 
      type: String, 
      enum: Object.values(JournalEntryFeeling)
    },
    questions: { type: String },
    location: { type: String, required: true },
    professor: { type: String },
    depthNotes: { type: String, required: true },
    otherNotes: { type: String },
    workOn: { type: String },
    partners: { type: [String] },
  },
  { timestamps: true }
)

export const JournalEntryModel = models?.JournalEntry || model<JournalEntryDocument>("JournalEntry", JournalEntrySchema)


