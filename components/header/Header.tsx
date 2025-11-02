"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BeltAvatar } from "@/components/BeltAvatar";
import type { StoredUser } from "@/lib/userStore";
import { ChevronDown, Plus } from "lucide-react";
import DropdownMenu from "@/components/header/DropdownMenu";

export default function Header({ userProfile }: { userProfile: StoredUser | null }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
            <span className="text-lg">🥋</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold text-gray-900">BJJ Journal</span>
            <span className="text-[10px] leading-none text-gray-500">Track Your Journey</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              isActive("/") ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/journal"
            className={`text-sm font-medium transition-colors ${
              isActive("/journal") ? "text-gray-900" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Journal
          </Link>
          <Link
            href="/journal/new"
            className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-3.5 w-3.5" />
            New Entry
          </Link>
        </nav>

        {session?.user && (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 rounded-lg px-1.5 py-1 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <BeltAvatar
                beltLevel={userProfile?.beltLevel}
                name={session.user.name}
                image={session.user.image}
                size="md"
              />
              <span className="hidden text-sm font-medium text-gray-700 sm:block">
                {session.user.name ?? session.user.email}
              </span>
              <ChevronDown
                className={`hidden h-4 w-4 text-gray-400 transition-transform sm:block ${
                  showUserMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                {userProfile && <DropdownMenu userProfile={userProfile} setShowUserMenu={setShowUserMenu} />}                
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}