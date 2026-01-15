import mongoose from "mongoose"

declare global {
  var __mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined
}

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not set in environment variables")
}

export async function connectMongoose(): Promise<typeof mongoose> {
  if (!global.__mongoose) {
    global.__mongoose = { conn: null, promise: null }
  }
  const cached = global.__mongoose
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!, {
      dbName: process.env.MONGODB_DB || undefined,
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}


