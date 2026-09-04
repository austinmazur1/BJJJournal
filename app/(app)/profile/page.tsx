import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { findUserById } from "@/lib/userStore"
import { ProfileForm } from "@/components/profile/ProfileForm"
import { redirect } from "next/navigation"
import { updateProfileAction, deleteAccountAction } from "@/lib/profileActions"

export default async function ProfileSettingsPage() {
  const session = await getServerSession(authOptions) 

  if (!session?.user?.id) {
    redirect("/signin")
  }

  const user = await findUserById(session.user.id)

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">User not found</h1>
          <p className="text-gray-600 mt-2">Please sign in again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Profile
            </h1>
            <p className="text-lg text-gray-600">
              Manage your account information and preferences
            </p>
          </div>
          <ProfileForm user={user} onUpdate={updateProfileAction} onDelete={deleteAccountAction} />
        </div>
      </div>
    </div>
  );
}
