"use client";

import { StoredUser } from "@/lib/userStore";
import { Award, MapPin, Home, BookOpen, UserCog, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { Separator } from "@/components/ui/separator";
export default function DropdownMenu({
  userProfile,
  setShowUserMenu,
}: {
  userProfile: StoredUser;
  setShowUserMenu: (show: boolean) => void;
}) {
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
    <div className="absolute right-0 mt-2 w-64 rounded-lg border border-border bg-card shadow-lg z-50">
      <div>
        <div className="mb-3 flex items-center justify-between p-4 pb-0">
          <div>
            <p className="text-sm font-semibold text-secondary-foreground">
              {userProfile.name ?? "User"}
            </p>
            <p className="text-xs text-muted-foreground">{userProfile.email}</p>
          </div>
          <ThemeToggle />
        </div>
        <Separator />
        <div className="px-4 py-2">
          {getBeltDisplay() && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Award className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{getBeltDisplay()}</span>
            </div>
          )}
          {userProfile?.trainingLocation && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="truncate">{userProfile.trainingLocation}</span>
            </div>
          )}
        </div>
      </div>
      <Separator />
      <div>
        <Link
          href="/"
          className="flex items-center gap-2.5 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent"
          onClick={() => setShowUserMenu(false)}
        >
          <Home className="h-4 w-4" />
          Dashboard
        </Link>
        <Link
          href="/journal"
          className="flex items-center gap-2.5 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent"
          onClick={() => setShowUserMenu(false)}
        >
          <BookOpen className="h-4 w-4" />
          My Journal
        </Link>
        <Link
          href="/profile"
          className="flex items-center gap-2.5 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent"
          onClick={() => setShowUserMenu(false)}
        >
          <UserCog className="h-4 w-4" />
          Profile
        </Link>
      </div>
      <Separator />
      <div>
        <button
          onClick={() => {
            setShowUserMenu(false);
            signOut({ callbackUrl: "/signin" });
          }}
          className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-destructive transition-colors hover:bg-accent"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
