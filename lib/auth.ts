import type { NextAuthOptions } from "next-auth"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import { mongoClientPromise } from "@/lib/mongodb"
import GoogleProvider from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { findUserByEmail, verifyPassword } from "@/lib/userStore"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().toLowerCase()
        const password = credentials?.password?.toString() ?? ""

        if (!email || !password) return null

        const user = await findUserByEmail(email)

        if (!user) return null

        const ok = await verifyPassword(password, user.passwordHash)

        if (!ok) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image ?? undefined,
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  adapter: MongoDBAdapter(mongoClientPromise, {
    databaseName: process.env.MONGODB_DB,
  }),
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = (user as { id?: string }).id ?? token.sub
        token.email = user.email ?? token.email
        token.name = user.name ?? token.name
        // Get onboarding status from database
        if (token.id) {
          try {
            const { findUserById } = await import("@/lib/userStore")
            const dbUser = await findUserById(token.id)
            token.onboardingCompleted = dbUser?.onboardingCompleted ?? false
          } catch (error) {
            console.error("Error fetching user onboarding status:", error)
            token.onboardingCompleted = false
          }
        }
      }
      if (account && profile) {
        token.provider = account.provider
        token.picture = (profile as { picture?: string }).picture
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token as { id?: string }).id
        session.user.email = token.email as string | null
        session.user.name = token.name as string | null
        session.user.image = (token as { picture?: string }).picture ?? null
        session.user.onboardingCompleted = (token as { onboardingCompleted?: boolean }).onboardingCompleted ?? false
      }
      return session
    },
  },
}