import { NextResponse } from "next/server"
import { createUser, findUserByEmail, hashPassword } from "@/lib/userStore"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = String(body.email ?? "").toLowerCase()
    const password = String(body.password ?? "")
    const name = body.name ? String(body.name) : undefined

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    if (await findUserByEmail(email)) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }
    
    const passwordHash = await hashPassword(password)
    const user = await createUser({ email, name, passwordHash })
    return NextResponse.json({ id: user.id, email: user.email, name: user.name }, { status: 201 })
  } catch (e) {
    console.error("Registration error:", e)
    return NextResponse.json({ error: e instanceof Error ? e.message : "Invalid request" }, { status: 400 })
  }
}


