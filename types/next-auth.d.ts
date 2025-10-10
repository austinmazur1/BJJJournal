import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    id?: string
  }

  interface Session {
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      onboardingCompleted?: boolean
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    provider?: string
    picture?: string
    onboardingCompleted?: boolean
  }
}