import { z } from "zod"
import { UserBeltLevel, BeltStripe } from "../models/User"

export const profileInformationValidation = z.object({
  name: z.string().optional(),
  beltLevel: z.enum(Object.values(UserBeltLevel)).optional(),
  beltStripe: z.enum(Object.values(BeltStripe)).optional(),
  trainingLocation: z.string().optional(),
})

export type ProfileInformationValidation = z.infer<typeof profileInformationValidation>