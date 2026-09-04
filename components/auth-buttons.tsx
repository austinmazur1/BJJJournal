"use client"

import { signIn, signOut } from "next-auth/react"

export function SignInButton() {
  return (
    <button
      className="rounded border px-3 py-1 bg-primary text-primary-foreground hover:bg-primary/90 hover:cursor-pointer"
      onClick={() => signIn("google")}
    >
      Sign in with Google
    </button>
  )
}

export function SignOutButton() {
  return (
    <button
      className="rounded border px-3 py-1 bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:cursor-pointer"
      onClick={() => signOut()}
    >
      Sign out
    </button>
  )
}