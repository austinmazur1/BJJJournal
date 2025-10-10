import { MongoClient } from "mongodb"

declare global {
  // eslint-disable-next-line no-var
  var __mongoClient: { client: MongoClient | null; promise: Promise<MongoClient> | null } | undefined
}

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not set in environment variables")
}

export async function getMongoClient(): Promise<MongoClient> {
  if (!global.__mongoClient) {
    global.__mongoClient = { client: null, promise: null }
  }
  const cached = global.__mongoClient
  if (cached.client) return cached.client
  if (!cached.promise) {
    cached.promise = new MongoClient(MONGODB_URI!, {
      appName: process.env.NEXT_PUBLIC_APP_NAME || "bjj-journal",
    }).connect()
  }
  cached.client = await cached.promise
  return cached.client
}

export const mongoClientPromise: Promise<MongoClient> = getMongoClient()


