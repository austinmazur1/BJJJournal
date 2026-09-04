import { UserBeltLevel, BeltStripe } from "@/lib/models/User"

export const BELT_COLORS: Record<UserBeltLevel, string> = {
  [UserBeltLevel.WHITE]: "#FFFFFF",
  [UserBeltLevel.BLUE]: "#0066CC", // Deep blue
  [UserBeltLevel.PURPLE]: "#7B2CBF", // Purple
  [UserBeltLevel.BROWN]: "#8B4513", // Saddle brown
  [UserBeltLevel.BLACK]: "#000000", // Black
}

export const BELT_BORDER_COLORS: Record<UserBeltLevel, string> = {
  [UserBeltLevel.WHITE]: "#E5E7EB", // Gray border for white belt
  [UserBeltLevel.BLUE]: "#0066CC",
  [UserBeltLevel.PURPLE]: "#7B2CBF",
  [UserBeltLevel.BROWN]: "#8B4513",
  [UserBeltLevel.BLACK]: "#000000",
}

export function getBeltColor(beltLevel?: UserBeltLevel): string {
  return beltLevel ? BELT_COLORS[beltLevel] : "#6B7280" // Default gray
}

export function getBeltBorderColor(beltLevel?: UserBeltLevel): string {
  return beltLevel ? BELT_BORDER_COLORS[beltLevel] : "#E5E7EB"
}

export function getStripeCount(stripe?: BeltStripe): number {
  if (!stripe || stripe === BeltStripe.NONE) return 0
  const stripeMap: Record<BeltStripe, number> = {
    [BeltStripe.NONE]: 0,
    [BeltStripe.ONE]: 1,
    [BeltStripe.TWO]: 2,
    [BeltStripe.THREE]: 3,
    [BeltStripe.FOUR]: 4,
  }
  return stripeMap[stripe]
}