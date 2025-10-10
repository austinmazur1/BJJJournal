'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { StoredUser } from "@/lib/userStore"

interface OnboardingGuardProps {
  children: React.ReactNode
  userProfile: StoredUser | null
}

export default function OnboardingGuard({ children, userProfile }: OnboardingGuardProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (session && userProfile && !userProfile.onboardingCompleted) {
      router.push("/onboarding")
    } else {
      setIsChecking(false)
    }
  }, [session, userProfile, router])

  // Show loading or nothing while checking
  if (isChecking) {
    return <div>Loading...</div>
  }

  return <>{children}</>
}
