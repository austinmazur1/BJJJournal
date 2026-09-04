import {
  JournalEntryFeeling,
  JournalEntryGiNoGi,
  JournalEntryType,
} from "../models/JournalEntry";

export const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case JournalEntryType.CLASS:
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/50";
    case JournalEntryType.OPEN_MAT:
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/50";
    case JournalEntryType.OTHER:
      return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700/50";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700/50";
  }
};

export const getFeelingEmoji = (feeling?: string) => {
  switch (feeling) {
    case JournalEntryFeeling.ENERGIZED:
      return "⚡";
    case JournalEntryFeeling.TIRED:
      return "😴";
    case JournalEntryFeeling.FOCUSED:
      return "🎯";
    case JournalEntryFeeling.SORE:
      return "🤕";
    default:
      return "📝";
  }
};

export const getGiNoGiBadgeColor = (giNoGi: JournalEntryGiNoGi) => {
  return giNoGi === JournalEntryGiNoGi.GI
    ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/50"
    : "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-800/50";
};

export const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatJournalGridDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const truncateNotes = (notes: string) => {
  return notes.length > 120 ? notes.substring(0, 120) + "..." : notes;
};

export const getGiNoGiGradientClass = (giNoGi: JournalEntryGiNoGi) => {
  return giNoGi === JournalEntryGiNoGi.GI
    ? "bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100"
    : "bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100";
};

export const getJournalEntryTypeBadgeColor = (type: JournalEntryType) => {
  return type === JournalEntryType.CLASS
    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/50"
    : type === JournalEntryType.OPEN_MAT
    ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/50"
    : "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700/50";
};
