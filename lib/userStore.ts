import bcrypt from "bcryptjs"
import { connectMongoose } from "@/lib/db"
import { UserModel, UserBeltLevel, BeltStripe } from "@/lib/models/User"
import type { UserDocument } from "@/lib/models/User"
import { ConflictError, NotFoundError, ValidationError } from "@/lib/errors"

export type StoredUser = {
  id: string
  email: string
  name?: string
  passwordHash?: string
  image?: string | null
  onboardingCompleted: boolean
  beltLevel?: UserBeltLevel
  beltStripe?: BeltStripe
  trainingLocation?: string
}

export function mapUserDocumentToStoredUser(doc: UserDocument): StoredUser { 
  return {
    id: doc._id.toString(),
    email: doc.email,
    name: doc.name,
    passwordHash: doc.passwordHash ?? undefined,
    image: doc.image ?? null,
    onboardingCompleted: doc.onboardingCompleted,
    beltLevel: doc.beltLevel,
    beltStripe: doc.beltStripe,
    trainingLocation: doc.trainingLocation,
  }
}

export async function findUserByEmail(email: string): Promise<StoredUser | undefined> {
  await connectMongoose()
  const doc = await UserModel.findOne({ email: email.toLowerCase() }).lean<UserDocument | null>() 
  if (!doc) return undefined
  return mapUserDocumentToStoredUser(doc)
}

export async function createUser(user: Omit<StoredUser, "id">): Promise<StoredUser> {
  await connectMongoose()
  const existing = await UserModel.findOne({ email: user.email.toLowerCase() }).lean()
  if (existing) {
    throw new ConflictError("User already exists")
  }
  const created = await UserModel.create({
    email: user.email.toLowerCase(),
    name: user.name,
    image: user.image ?? null,
    passwordHash: user.passwordHash ?? null,
  })
  return mapUserDocumentToStoredUser(created)
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

export async function verifyPassword(password: string, passwordHash?: string): Promise<boolean> {
  if (!passwordHash) return false
  return await bcrypt.compare(password, passwordHash)
}

export async function findUserById(id: string): Promise<StoredUser | undefined> {
  await connectMongoose()
  const doc = await UserModel.findById(id).lean<UserDocument | null>()
  if (!doc) return undefined
  return mapUserDocumentToStoredUser(doc)
}

export async function completeOnboarding(
  userId: string,
  data: {
    beltLevel: UserBeltLevel
    beltStripe: BeltStripe
    trainingLocation: string
  }
): Promise<StoredUser> {
  await connectMongoose()
  const updated = await UserModel.findByIdAndUpdate(
    userId,
    {
      beltLevel: data.beltLevel,
      beltStripe: data.beltStripe,
      trainingLocation: data.trainingLocation,
      onboardingCompleted: true,
    },
    { new: true }
  ).lean<UserDocument>()

  if (!updated) {
    throw new NotFoundError("User")
  }

  return mapUserDocumentToStoredUser(updated)
}

