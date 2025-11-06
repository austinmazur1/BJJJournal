"use client";

import { StoredUser } from "@/lib/userStore";
import { Award, MapPin, Home, BookOpen, UserCog, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
export default function DropdownMenu({ userProfile, setShowUserMenu }: { userProfile: StoredUser; setShowUserMenu: (show: boolean) => void }) {
  const getBeltDisplay = () => {
    if (!userProfile?.beltLevel) return null;
    const stripeText =
      userProfile.beltStripe && userProfile.beltStripe !== "None"
        ? ` • ${userProfile.beltStripe} Stripe${
            userProfile.beltStripe !== "One" ? "s" : ""
          }`
        : "";
    return `${userProfile.beltLevel}${stripeText}`;
  };

  return (
    <div className="absolute right-0 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg z-50">
      <div className="border-b border-gray-100 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
          <p className="text-sm font-semibold text-gray-900">
            {userProfile.name ?? "User"}
          </p>
          <p className="text-xs text-gray-500">{userProfile.email}</p>
          </div>
          <ThemeToggle />
        </div>
        {getBeltDisplay() && (
          <div className="flex items-center gap-1.5 border-t border-gray-100 pt-2 text-xs text-gray-600">
            <Award className="h-3.5 w-3.5 text-gray-400" />
            <span>{getBeltDisplay()}</span>
          </div>
        )}
        {userProfile?.trainingLocation && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-600">
            <MapPin className="h-3.5 w-3.5 text-gray-400" />
            <span className="truncate">{userProfile.trainingLocation}</span>
          </div>
        )}
      </div>
      <div className="py-1">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
          onClick={() => setShowUserMenu(false)}
        >
          <Home className="h-4 w-4" />
          Dashboard
        </Link>
        <Link
          href="/journal"
          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
          onClick={() => setShowUserMenu(false)}
        >
          <BookOpen className="h-4 w-4" />
          My Journal
        </Link>
        <Link
          href="/profile"
          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
          onClick={() => setShowUserMenu(false)}
        >
          <UserCog className="h-4 w-4" />
          Profile
        </Link>
      </div>
      <div className="border-t border-gray-100 py-1">
        <button
          onClick={() => {
            setShowUserMenu(false);
            signOut({ callbackUrl: "/signin" });
          }}
          className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
