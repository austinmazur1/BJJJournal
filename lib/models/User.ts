import { Schema, model, models, Types } from "mongoose"
import { JournalEntryDocument } from "./JournalEntry"

export enum UserBeltLevel {
  WHITE = "White",
  BLUE = "Blue",
  PURPLE = "Purple",
  BROWN = "Brown",
  BLACK = "Black"
}

export enum BeltStripe {
  NONE = "None",
  ONE = "One",
  TWO = "Two",
  THREE = "Three",
  FOUR = "Four"
}

export type UserDocument = {
  _id: Types.ObjectId
  email: string
  name?: string
  image?: string | null
  passwordHash?: string | null
  emailVerified?: Date | null
  journalEntries?: JournalEntryDocument[]
  beltLevel?: UserBeltLevel
  beltStripe?: BeltStripe
  trainingLocation?: string
  onboardingCompleted: boolean
}

const UserSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String },
    image: { type: String, default: null },
    passwordHash: { type: String, default: null },
    emailVerified: { type: Date, default: null },
    journalEntries: { type: [Schema.Types.ObjectId], ref: "JournalEntry" },
    beltLevel: { type: String, enum: Object.values(UserBeltLevel) },
    beltStripe: { type: String, enum: Object.values(BeltStripe) },
    trainingLocation: { type: String },
    onboardingCompleted: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
)

export const UserModel = models?.User || model<UserDocument>("User", UserSchema)


