import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { completeOnboarding } from "@/lib/userStore"
import { UserBeltLevel, BeltStripe } from "@/lib/models/User"
import { handleApiError } from "@/lib/errorHandler"
import { AuthenticationError, ValidationError } from "@/lib/errors"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      throw new AuthenticationError()
    }

    let body
    try {
      body = await request.json()
    } catch {
      throw new ValidationError('Invalid JSON in request body')
    }

    const { beltLevel, beltStripe, trainingLocation } = body

    // Validate required fields
    const missingFields = []
    if (!beltLevel) missingFields.push('beltLevel')
    if (!beltStripe) missingFields.push('beltStripe')
    if (!trainingLocation) missingFields.push('trainingLocation')

    if (missingFields.length > 0) {
      throw new ValidationError('Missing required fields', { fields: missingFields })
    }

    // Validate enum values
    if (!Object.values(UserBeltLevel).includes(beltLevel)) {
      throw new ValidationError('Invalid belt level', { 
        validValues: Object.values(UserBeltLevel) 
      })
    }

    if (!Object.values(BeltStripe).includes(beltStripe)) {
      throw new ValidationError('Invalid belt stripe', { 
        validValues: Object.values(BeltStripe) 
      })
    }

    // Complete onboarding (will throw NotFoundError if user doesn't exist)
    const updatedUser = await completeOnboarding(session.user.id, {
      beltLevel,
      beltStripe,
      trainingLocation,
    })

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        onboardingCompleted: updatedUser.onboardingCompleted,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
