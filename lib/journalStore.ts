"use server";
import { JournalEntryModel } from "@/lib/models/JournalEntry";
import { connectMongoose } from "./db";
import { StoredUser } from "./userStore";
import { UserModel } from "./models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { NotFoundError } from "@/lib/errors";
import { JournalEntryValidation, JournalEntryUpdateValidation } from "@/lib/validations/journalEntryValidation";
import { JournalEntryGiNoGi } from "@/lib/models/JournalEntry";
import { formatDuration } from "@/lib/utils/time";
import { SerializedJournalEntry } from "@/types/journalEntries";


const serializeJournalEntry = (journalEntry: any): SerializedJournalEntry => {
  return {
    _id: journalEntry._id.toString(),
    userId: journalEntry.userId.toString(),
    date: journalEntry.date.toISOString(),
    duration: journalEntry.duration,
    type: journalEntry.type,
    giNoGi: journalEntry.giNoGi,
    area: journalEntry.area,
    feeling: journalEntry.feeling,
    questions: journalEntry.questions,
    location: journalEntry.location,
    professor: journalEntry.professor,
    depthNotes: journalEntry.depthNotes,
    otherNotes: journalEntry.otherNotes,
    workOn: journalEntry.workOn,
    partners: journalEntry.partners || [],
    createdAt: journalEntry.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: journalEntry.updatedAt?.toISOString() || new Date().toISOString(),
  };
};

export const deleteJournalEntry = async (journalId: string) => {
  await connectMongoose();
  if (!journalId) {
    throw new NotFoundError("Journal");
  }
  await JournalEntryModel.findByIdAndDelete(journalId);
  revalidatePath("/journal");
  redirect("/journal");
};

export const updateJournalEntryAction = async (formData: JournalEntryUpdateValidation) => {
  await connectMongoose();
  if (!formData.id) {
    throw new NotFoundError("Journal");
  }
  await JournalEntryModel.findByIdAndUpdate(formData.id, {
    ...formData,
    date: new Date(formData.date),
  });
  revalidatePath("/journal");
  redirect("/journal");
};

export const getJournalEntry = async (
  journalId: string
): Promise<SerializedJournalEntry> => {
  await connectMongoose();
  const journalEntry = (await JournalEntryModel.findById(
    journalId
  ).lean()) as any;
  if (!journalEntry) {
    throw new NotFoundError("Journal");
  }

  return serializeJournalEntry(journalEntry);
};

export const getJournalEntries = async (
  user: StoredUser
): Promise<SerializedJournalEntry[]> => {
  await connectMongoose();
  const journalEntries = await JournalEntryModel.find({ userId: user.id })
    .sort({ date: -1 })
    .lean();

  return journalEntries.map((entry: any) => serializeJournalEntry(entry));
};

export const getRecentJournalEntries = async (
  user: StoredUser,
  limit: number = 5
): Promise<SerializedJournalEntry[]> => {
  await connectMongoose();
  const journalEntries = await JournalEntryModel.find({ userId: user.id })
    .sort({ date: -1 })
    .limit(limit)
    .lean();

  return journalEntries.map((entry: any) => serializeJournalEntry(entry));
};

export async function createJournalEntryAction(formData: JournalEntryValidation) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error(
      "Unauthorized: You must be signed in to create journal entries"
    );
  }

  try {
    await connectMongoose();

    const journalEntry = {
      userId: session.user.id,
      date: formData.date,
      duration: formData.duration,
      type: formData.type,
      giNoGi: formData.giNoGi,
      area: formData.area,
      feeling: formData.feeling,
      questions: formData.questions,
      location: formData.location,
      professor: formData.professor,
      depthNotes: formData.depthNotes,
      otherNotes: formData.otherNotes,
      workOn: formData.workOn,
      partners: formData.partners || [],
    };

    const newJournalEntry = await JournalEntryModel.create(journalEntry);

    // Update user's journal entries array
    await UserModel.findByIdAndUpdate(session.user.id, {
      $push: { journalEntries: newJournalEntry._id },
    });

    revalidatePath("/");
    revalidatePath("/journal");
  } catch (error) {
    console.error("Error creating journal entry:", error);
    throw new Error("Failed to create journal entry. Please try again.");
  }

  redirect("/journal");
}

export async function getStatistics(user: StoredUser) {
  await connectMongoose();
  const journalEntries = await JournalEntryModel.find({ userId: user.id })
    .sort({ date: -1 })
    .lean();

  const totalTimeTrained = journalEntries.map((data) => data.duration).reduce((acc, curr) => acc + curr, 0);  

  const totalTimeTrainedReadable = formatDuration(totalTimeTrained);
  const totalSessions = journalEntries.length;

  const month = new Date().getMonth();
  const thisMonth = journalEntries.filter((entry) => entry.date.getMonth() === month).length;
  return {
    totalSessions,
    totalTimeTrained: totalTimeTrainedReadable,
    thisMonth,
  }
}

export interface ComprehensiveStats {
  totalSessions: number
  totalTimeTrained: string
  sessionsThisMonth: number
  sessionsThisWeek: number
  averageDuration: string
  giVsNoGi: {
    gi: number
    noGi: number
    percentage: { gi: number; noGi: number }
  }
  mostCommonPartner: { name: string; count: number } | null
  mostCommonPartnerThisMonth: { name: string; count: number } | null
  mostCommonArea: { area: string; count: number } | null
  trainingFrequency: number // sessions per week
  mostCommonType: { type: string; count: number } | null
  favoriteLocation: { location: string; count: number } | null
  mostCommonProfessor: { professor: string; count: number } | null
  trainingStreak: number // consecutive weeks
}

export async function getComprehensiveStatistics(user: StoredUser): Promise<ComprehensiveStats> {
  await connectMongoose()
  const journalEntries = await JournalEntryModel.find({ userId: user.id })
    .sort({ date: -1 })
    .lean()

  const totalSessions = journalEntries.length
  const totalTimeMinutes = journalEntries.reduce((acc, curr) => acc + (curr.duration || 0), 0)
  const totalTimeTrained = formatDuration(totalTimeMinutes)
  const averageDurationMinutes = totalSessions > 0 ? totalTimeMinutes / totalSessions : 0
  const averageDuration = formatDuration(Math.round(averageDurationMinutes))

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const startOfMonth = new Date(currentYear, currentMonth, 1)
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay()) // Start of week (Sunday)
  startOfWeek.setHours(0, 0, 0, 0)

  const sessionsThisMonth = journalEntries.filter(
    (entry) => entry.date >= startOfMonth
  ).length

  const sessionsThisWeek = journalEntries.filter(
    (entry) => entry.date >= startOfWeek
  ).length

  const giCount = journalEntries.filter((e) => e.giNoGi === JournalEntryGiNoGi.GI).length
  const noGiCount = journalEntries.filter((e) => e.giNoGi === JournalEntryGiNoGi.NO_GI).length
  const totalGiNoGi = giCount + noGiCount
  const giVsNoGi = {
    gi: giCount,
    noGi: noGiCount,
    percentage: {
      gi: totalGiNoGi > 0 ? Math.round((giCount / totalGiNoGi) * 100) : 0,
      noGi: totalGiNoGi > 0 ? Math.round((noGiCount / totalGiNoGi) * 100) : 0,
    },
  }

  // Most common partner (all time)
  const partnerCounts: Record<string, number> = {}
  journalEntries.forEach((entry) => {
    if (entry.partners && Array.isArray(entry.partners)) {
      entry.partners.forEach((partner) => {
        if (partner && partner.trim()) {
          partnerCounts[partner.trim()] = (partnerCounts[partner.trim()] || 0) + 1
        }
      })
    }
  })
  const mostCommonPartner = Object.entries(partnerCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)[0] || null

  // Most common partner this month
  const monthPartnerCounts: Record<string, number> = {}
  journalEntries
    .filter((entry) => entry.date >= startOfMonth)
    .forEach((entry) => {
      if (entry.partners && Array.isArray(entry.partners)) {
        entry.partners.forEach((partner) => {
          if (partner && partner.trim()) {
            monthPartnerCounts[partner.trim()] = (monthPartnerCounts[partner.trim()] || 0) + 1
          }
        })
      }
    })
  const mostCommonPartnerThisMonth = Object.entries(monthPartnerCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)[0] || null

  const areaCounts: Record<string, number> = {}
  journalEntries.forEach((entry) => {
    if (entry.area) {
      areaCounts[entry.area] = (areaCounts[entry.area] || 0) + 1
    }
  })
  const mostCommonArea = Object.entries(areaCounts)
    .map(([area, count]) => ({ area, count }))
    .sort((a, b) => b.count - a.count)[0] || null

  if (journalEntries.length === 0) {
    return {
      totalSessions: 0,
      totalTimeTrained: "0m",
      sessionsThisMonth: 0,
      sessionsThisWeek: 0,
      averageDuration: "0m",
      giVsNoGi: { gi: 0, noGi: 0, percentage: { gi: 0, noGi: 0 } },
      mostCommonPartner: null,
      mostCommonPartnerThisMonth: null,
      mostCommonArea: null,
      trainingFrequency: 0,
      mostCommonType: null,
      favoriteLocation: null,
      mostCommonProfessor: null,
      trainingStreak: 0,
    }
  }

  const firstEntry = journalEntries[journalEntries.length - 1]
  const daysSinceFirst = Math.max(
    1,
    Math.floor((now.getTime() - firstEntry.date.getTime()) / (1000 * 60 * 60 * 24))
  )
  const weeksSinceFirst = daysSinceFirst / 7
  const trainingFrequency = weeksSinceFirst > 0 ? Math.round((totalSessions / weeksSinceFirst) * 10) / 10 : 0

  const typeCounts: Record<string, number> = {}
  journalEntries.forEach((entry) => {
    if (entry.type) {
      typeCounts[entry.type] = (typeCounts[entry.type] || 0) + 1
    }
  })
  const mostCommonType = Object.entries(typeCounts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)[0] || null

  const locationCounts: Record<string, number> = {}
  journalEntries.forEach((entry) => {
    if (entry.location) {
      locationCounts[entry.location] = (locationCounts[entry.location] || 0) + 1
    }
  })
  const favoriteLocation = Object.entries(locationCounts)
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count)[0] || null

  const professorCounts: Record<string, number> = {}
  journalEntries.forEach((entry) => {
    if (entry.professor && entry.professor.trim()) {
      professorCounts[entry.professor.trim()] = (professorCounts[entry.professor.trim()] || 0) + 1
    }
  })
  const mostCommonProfessor = Object.entries(professorCounts)
    .map(([professor, count]) => ({ professor, count }))
    .sort((a, b) => b.count - a.count)[0] || null

  let streak = 0
  const sessionsByWeek: Set<string> = new Set()
  journalEntries.forEach((entry) => {
    const week = getWeekKey(entry.date)
    sessionsByWeek.add(week)
  })
  
  const weeks = Array.from(sessionsByWeek).sort().reverse()
  for (const week of weeks) {
    const weekDate = parseWeekKey(week)
    const weeksAgo = Math.floor((now.getTime() - weekDate.getTime()) / (1000 * 60 * 60 * 24 * 7))
    if (weeksAgo === streak) {
      streak++
    } else {
      break
    }
  }

  return {
    totalSessions,
    totalTimeTrained,
    sessionsThisMonth,
    sessionsThisWeek,
    averageDuration,
    giVsNoGi,
    mostCommonPartner,
    mostCommonPartnerThisMonth,
    mostCommonArea,
    trainingFrequency,
    mostCommonType,
    favoriteLocation,
    mostCommonProfessor,
    trainingStreak: streak,
  }
}

function getWeekKey(date: Date): string {
  const d = new Date(date)
  const year = d.getFullYear()
  const week = getWeekNumber(d)
  return `${year}-W${week.toString().padStart(2, "0")}`
}

function parseWeekKey(weekKey: string): Date {
  const [year, week] = weekKey.split("-W").map(Number)
  const jan4 = new Date(year, 0, 4)
  const jan4Day = jan4.getDay() || 7
  const weekStart = new Date(year, 0, 4 + (week - 1) * 7 - jan4Day + 1)
  return weekStart
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}