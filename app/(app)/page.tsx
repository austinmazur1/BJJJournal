import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { findUserById, type StoredUser } from "@/lib/userStore";
import OnboardingGuard from "@/components/OnboardingGuard";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import Link from "next/link";
import { getComprehensiveStatistics, getRecentJournalEntries } from "@/lib/journalStore";
import { Plus } from "lucide-react";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  let userProfile: StoredUser | null = null;
  if (session?.user?.id) {
    try {
      userProfile = await findUserById(session.user.id) || null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  }

  const stats = await getComprehensiveStatistics(userProfile!);
  const recentEntries = userProfile 
  ? await getRecentJournalEntries(userProfile, 5)
  : [];

  return (
    <OnboardingGuard userProfile={userProfile}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <StatsOverview stats={stats} />
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <RecentActivity entries={recentEntries} />
            </div>
          </div>
        </div>
        {/* Floating Action Button for Mobile */}
        <Link
          href="/journal/new"
          className="fixed bottom-6 right-6 sm:hidden h-14 w-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 flex items-center justify-center transition-all hover:scale-110 z-50"
          aria-label="New Entry"
        >
          <Plus className="h-6 w-6" />
        </Link>
      </div>
    </OnboardingGuard>
  );
}