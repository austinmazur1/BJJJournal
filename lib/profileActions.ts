"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { findUserById, updateProfile } from "@/lib/userStore"
import { ProfileInformationValidation, profileInformationValidation } from "@/lib/validations/profileInformation"
import { revalidatePath } from "next/cache"
import { ValidationError } from "@/lib/errors"
import { getJournalEntries } from "./journalStore"

export async function updateProfileAction(data: ProfileInformationValidation) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized: You must be signed in to update your profile")
  }

  const validationResult = profileInformationValidation.safeParse(data)
  if (!validationResult.success) {
    throw new ValidationError(
      'Validation failed',
      { errors: validationResult.error }
    )
  }
  
  try {
    const updatedUser = await updateProfile(session.user.id, validationResult.data)
    
    // Revalidate the profile page to show updated data
    revalidatePath("/profile")
    revalidatePath("/") // Also revalidate home page where profile is shown
    
    return {
      success: true,
      user: updatedUser,
    }
  } catch (error) {
    console.error("Error updating profile:", error)
    throw error instanceof Error 
      ? error 
      : new Error("Failed to update profile")
  }
}