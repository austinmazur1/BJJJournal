import crypto from "crypto"
import { connectMongoose } from "@/lib/db"
import { UserModel } from "@/lib/models/User"
import type { UserDocument } from "@/lib/models/User"

export type StoredUser = {
  id: string
  email: string
  name?: string
  passwordHash?: string // format: algorithm:salt:hash
  image?: string | null
}

export async function findUserByEmail(email: string): Promise<StoredUser | undefined> {
  await connectMongoose()
  const doc = await UserModel.findOne({ email: email.toLowerCase() }).lean<UserDocument | null>() 
  if (!doc) return undefined
  return {
    id: doc._id,
    email: doc.email,
    name: doc.name,
    passwordHash: doc.passwordHash ?? undefined,
    image: doc.image ?? null,
  }
}

export async function createUser(user: Omit<StoredUser, "id">): Promise<StoredUser> {
  await connectMongoose()
  const existing = await UserModel.findOne({ email: user.email.toLowerCase() }).lean()
  if (existing) {
    throw new Error("User already exists")
  }
  const id = crypto.randomUUID()
  const created = await UserModel.create({
    _id: id,
    email: user.email.toLowerCase(),
    name: user.name,
    image: user.image ?? null,
    passwordHash: user.passwordHash ?? null,
  })
  return {
    id: created._id,
    email: created.email,
    name: created.name,
    passwordHash: created.passwordHash ?? undefined,
    image: created.image ?? null,
  }
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex")
  const derivedKey = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, dk) => (err ? reject(err) : resolve(dk as Buffer)))
  })
  return `scrypt:${salt}:${derivedKey.toString("hex")}`
}

export async function verifyPassword(password: string, passwordHash?: string): Promise<boolean> {
  if (!passwordHash) return false
  const [algorithm, salt, storedHex] = passwordHash.split(":")
  if (algorithm !== "scrypt" || !salt || !storedHex) return false
  const derivedKey = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, dk) => (err ? reject(err) : resolve(dk as Buffer)))
  })
  return crypto.timingSafeEqual(Buffer.from(storedHex, "hex"), derivedKey)
}

