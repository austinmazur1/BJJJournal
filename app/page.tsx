import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SignOutButton } from "@/components/auth-buttons";
import { findUserById, type StoredUser } from "@/lib/userStore";
import OnboardingGuard from "@/components/OnboardingGuard";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  // Get user profile data
  let userProfile: StoredUser | null = null;
  if (session?.user?.id) {
    try {
      userProfile = await findUserById(session.user.id) || null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }

  return (
    <OnboardingGuard userProfile={userProfile}>
      <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
          <div className="flex flex-col gap-4 items-center sm:items-start">
            {session?.user?.image ? (
              <Image
                className="rounded-full"
                src={session?.user?.image}
                alt={session?.user?.name ?? "User avatar"}
                width={48}
                height={48}
              />
            ) : null}
            <div className="text-center sm:text-left">
              <p className="text-sm text-gray-600">Signed in as {session?.user?.email ?? session?.user?.name}</p>
              {userProfile && (
                <div className="mt-2 text-sm text-gray-800">
                  <p><strong>Belt:</strong> {userProfile.beltLevel} {userProfile.beltStripe !== 'None' ? `(${userProfile.beltStripe} stripe${userProfile.beltStripe !== 'One' ? 's' : ''})` : ''}</p>
                  <p><strong>Training at:</strong> {userProfile.trainingLocation}</p>
                </div>
              )}
            </div>
            <SignOutButton />
          </div>
          
          <div className="mt-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to your BJJ Journal!</h1>
            <p className="text-gray-600 mb-6">
              Start tracking your training sessions, techniques, and progress.
            </p>
            
            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <a
                href="/journal/new"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Journal Entry
              </a>
              <a
                href="/journal"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Entries
              </a>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                🥋 Your profile is set up and ready! You can now start creating journal entries to track your BJJ journey.
              </p>
            </div>
          </div>
        </main>
      </div>
    </OnboardingGuard>
  );
}