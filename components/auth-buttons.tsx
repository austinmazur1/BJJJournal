"use client"

import { signIn, signOut } from "next-auth/react"

export function SignInButton() {
  return (
    <button
      className="rounded border px-3 py-1"
      onClick={() => signIn("google")}
    >
      Sign in with Google
    </button>
  )
}

export function SignOutButton() {
  return (
    <button
      className="rounded border px-3 py-1"
      onClick={() => signOut()}
    >
      Sign out
    </button>
  )
}