import { Schema, model, models } from "mongoose"

export type UserDocument = {
  _id: string
  email: string
  name?: string
  image?: string | null
  passwordHash?: string | null
  emailVerified?: Date | null
}

const UserSchema = new Schema<UserDocument>(
  {
    _id: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String },
    image: { type: String, default: null },
    passwordHash: { type: String, default: null },
    emailVerified: { type: Date, default: null },
  },
  { timestamps: true, _id: false }
)

export const UserModel = models.User || model<UserDocument>("User", UserSchema)


