import {
  JournalEntryFeeling,
  JournalEntryGiNoGi,
  JournalEntryType,
} from "../models/JournalEntry";

export const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case JournalEntryType.CLASS:
      return "bg-blue-100 text-blue-800 hover:bg-blue-100";
    case JournalEntryType.OPEN_MAT:
      return "bg-purple-100 text-purple-800 hover:bg-purple-100";
    case JournalEntryType.OTHER:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100";
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
    ? "bg-white text-gray-800 border border-gray-300 hover:bg-white"
    : "bg-gray-800 text-white hover:bg-gray-800";
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
    ? "bg-green-100 text-green-800 border-green-200"
    : type === JournalEntryType.OPEN_MAT
    ? "bg-orange-100 text-orange-800 border-orange-200"
    : "bg-gray-100 text-gray-800 border-gray-200";
};
