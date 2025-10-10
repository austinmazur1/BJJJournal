"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"

export default function SignInForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const search = useSearchParams()
  const callbackUrl = search.get("callbackUrl") ?? "/"

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const res = await signIn("credentials", {
      email,
      password,
      callbackUrl,
      redirect: true,
    })
    if (res?.error) setError("Invalid credentials")
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded px-3 py-2"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border rounded px-3 py-2"
        required
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button type="submit" className="rounded border px-3 py-2">Sign in</button>
    </form>
  )
}


