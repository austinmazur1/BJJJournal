import { NextResponse } from "next/server"
import { createUser, findUserByEmail, hashPassword } from "@/lib/userStore"
import { handleApiError } from "@/lib/errorHandler"
import { ValidationError, ConflictError } from "@/lib/errors"

export async function POST(req: Request) {
  try {
    let body
    try {
      body = await req.json()
    } catch {
      throw new ValidationError('Invalid JSON in request body')
    }

    const email = String(body.email ?? "").toLowerCase()
    const password = String(body.password ?? "")
    const name = body.name ? String(body.name) : undefined

    // Validate required fields
    const missingFields = []
    if (!email) missingFields.push('email')
    if (!password) missingFields.push('password')

    if (missingFields.length > 0) {
      throw new ValidationError('Missing required fields', { fields: missingFields })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new ValidationError('Invalid email format')
    }

    // Validate password strength
    if (password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters long')
    }

    // Check if user already exists
    if (await findUserByEmail(email)) {
      throw new ConflictError("User already exists")
    }
    
    // Hash password and create user
    const passwordHash = await hashPassword(password)
    const user = await createUser({ email, name, passwordHash, onboardingCompleted: false })
    
    return NextResponse.json({ 
      id: user.id, 
      email: user.email, 
      name: user.name 
    }, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}


