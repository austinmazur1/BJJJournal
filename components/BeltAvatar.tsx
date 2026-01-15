"use client";

import { UserBeltLevel } from "@/lib/models/User";
import { getBeltBorderColor } from "@/lib/utils/beltColors";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface BeltAvatarProps {
  beltLevel?: UserBeltLevel;
  name?: string | null;
  image?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

export function BeltAvatar({
  beltLevel,
  name,
  image,
  size = "md",
  className,
}: BeltAvatarProps) {
  const borderColor = getBeltBorderColor(beltLevel);
  const sizeClass = sizeClasses[size];

  const getInitials = () => {
    if (name) return name[0]?.toUpperCase();
    return "U";
  };

  return (
    <div
      className={cn(
        "relative rounded-full overflow-visible",
        sizeClass,
        className
      )}
      style={{
        border: `3px solid ${borderColor}`,
      }}
    >
      <div className="absolute inset-0 rounded-full overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
        {image ? (
          <Image
            width={100}
            height={100}
            src={image}
            alt={name || "Avatar"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white font-semibold bg-gradient-to-br from-blue-500 to-purple-600">
            {getInitials()}
          </div>
        )}
      </div>
    </div>
  );
}
