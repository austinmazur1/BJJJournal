"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"

export default function SignUpForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const search = useSearchParams()
  const callbackUrl = search.get("callbackUrl") ?? "/"

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? "Registration failed")
      }
      // Auto sign-in with credentials
      const signInRes = await signIn("credentials", {
        email,
        password,
        callbackUrl,
        redirect: false,
      })
      if (signInRes?.error) throw new Error("Auto sign-in failed")
      router.push(callbackUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded px-3 py-2"
      />
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
      <button disabled={loading} type="submit" className="rounded border px-3 py-2">
        {loading ? "Creating..." : "Create account"}
      </button>
    </form>
  )
}


