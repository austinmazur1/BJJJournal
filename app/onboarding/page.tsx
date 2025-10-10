"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { OnboardingForm } from "@/components/onboarding/OnboardingForm"
import { UserBeltLevel, BeltStripe } from "@/lib/models/User"

interface OnboardingFormData {
  beltLevel: UserBeltLevel
  beltStripe: BeltStripe
  trainingLocation: string
}

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (data: OnboardingFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to complete onboarding")
      }

      // Redirect to main app after successful onboarding
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to BJJ Journal
          </h1>
          <p className="text-gray-600">
            Let&apos;s set up your training profile
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}
        
        <OnboardingForm onSubmit={handleSubmit} isLoading={isLoading} />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            This information helps us personalize your journal experience and track your progress.
          </p>
        </div>
      </div>
    </div>
  )
}
