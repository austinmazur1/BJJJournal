"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { BeltAvatar } from "@/components/BeltAvatar";
import type { StoredUser } from "@/lib/userStore";
import { MapPin, Award } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userProfile, setUserProfile] = useState<StoredUser | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/profile`)
        .then((res) => res.json())
        .then((data) => {
          if (data.user) setUserProfile(data.user);
        })
        .catch(() => {
        });
    }
  }, [session?.user?.id]);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  const getBeltDisplay = () => {
    console.log("userProfile", userProfile);
    if (!userProfile?.beltLevel) return null;
    const stripeText =
      userProfile.beltStripe && userProfile.beltStripe !== "None"
        ? ` • ${userProfile.beltStripe} Stripe${userProfile.beltStripe !== "One" ? "s" : ""}`
        : "";
    return `${userProfile.beltLevel}${stripeText}`;
  };

  console.log("getBeltDisplay", getBeltDisplay());

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg">
            <span className="text-xl font-bold text-white">🥋</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">BJJ Journal</span>
            <span className="text-xs text-gray-500">Track Your Journey</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-blue-600 ${
              isActive("/") ? "text-blue-600" : "text-gray-700"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/journal"
            className={`text-sm font-medium transition-colors hover:text-blue-600 ${
              isActive("/journal") ? "text-blue-600" : "text-gray-700"
            }`}
          >
            Journal
          </Link>
          <Link
            href="/journal/new"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Entry
          </Link>
        </nav>

        {session?.user && (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 rounded-full hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <BeltAvatar
                beltLevel={userProfile?.beltLevel}
                name={session.user.name}
                image={session.user.image}
                size="md"
              />
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {session.user.name ?? session.user.email}
              </span>
              <svg
                className={`hidden sm:block h-4 w-4 text-gray-500 transition-transform ${
                  showUserMenu ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                
                {/* Menu */}
                <div className="absolute right-0 mt-2 w-64 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {session.user.name ?? "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                      </div>
                    </div>
                    
                    {getBeltDisplay() && (
                      <div className="flex items-center gap-2 text-xs text-gray-600 pt-2 border-t border-gray-100">
                        <Award className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                        <span>{getBeltDisplay()}</span>
                      </div>
                    )}
                    
                    {userProfile?.trainingLocation && (
                      <div className="flex items-center gap-2 text-xs text-gray-600 mt-2">
                        <MapPin className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{userProfile.trainingLocation}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="py-1">
                    <Link
                      href="/"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Dashboard
                    </Link>
                    <Link
                      href="/journal"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      My Journal
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile Settings
                    </Link>
                  </div>

                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        signOut({ callbackUrl: "/signin" });
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}