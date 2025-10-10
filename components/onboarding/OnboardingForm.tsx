"use client"

import { useState } from "react"
import { UserBeltLevel, BeltStripe } from "@/lib/models/User"

interface OnboardingFormData {
  beltLevel: UserBeltLevel
  beltStripe: BeltStripe
  trainingLocation: string
}

interface OnboardingFormProps {
  onSubmit: (data: OnboardingFormData) => Promise<void>
  isLoading?: boolean
}

export function OnboardingForm({ onSubmit, isLoading = false }: OnboardingFormProps) {
  const [formData, setFormData] = useState<OnboardingFormData>({
    beltLevel: UserBeltLevel.WHITE,
    beltStripe: BeltStripe.NONE,
    trainingLocation: "",
  })
  const [errors, setErrors] = useState<Partial<OnboardingFormData>>({})

  const handleInputChange = (
    field: keyof OnboardingFormData,
    value: string
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<OnboardingFormData> = {}

    if (!formData.trainingLocation.trim()) {
      newErrors.trainingLocation = "Training location is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Onboarding submission error:", error)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Complete Your Profile
      </h2>
      <p className="text-gray-600 text-center mb-6">
        Help us personalize your BJJ journal experience
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Belt Level */}
        <div>
          <label htmlFor="beltLevel" className="block text-sm font-medium text-gray-700 mb-2">
            Current Belt Level
          </label>
          <select
            id="beltLevel"
            value={formData.beltLevel}
            onChange={(e) => handleInputChange("beltLevel", e.target.value as UserBeltLevel)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.values(UserBeltLevel).map((level) => (
              <option key={level} value={level}>
                {level} Belt
              </option>
            ))}
          </select>
        </div>

        {/* Belt Stripe */}
        <div>
          <label htmlFor="beltStripe" className="block text-sm font-medium text-gray-700 mb-2">
            Current Stripe Level
          </label>
          <select
            id="beltStripe"
            value={formData.beltStripe}
            onChange={(e) => handleInputChange("beltStripe", e.target.value as BeltStripe)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.values(BeltStripe).map((stripe) => (
              <option key={stripe} value={stripe}>
                {stripe === BeltStripe.NONE ? "No Stripes" : `${stripe} Stripe${stripe !== BeltStripe.ONE ? "s" : ""}`}
              </option>
            ))}
          </select>
        </div>

        {/* Training Location */}
        <div>
          <label htmlFor="trainingLocation" className="block text-sm font-medium text-gray-700 mb-2">
            Training Location/Gym
          </label>
          <input
            type="text"
            id="trainingLocation"
            value={formData.trainingLocation}
            onChange={(e) => handleInputChange("trainingLocation", e.target.value)}
            placeholder="e.g., Gracie Barra Downtown, Alliance BJJ..."
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.trainingLocation ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.trainingLocation && (
            <p className="mt-1 text-sm text-red-600">{errors.trainingLocation}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Completing Profile..." : "Complete Profile"}
        </button>
      </form>
    </div>
  )
}
