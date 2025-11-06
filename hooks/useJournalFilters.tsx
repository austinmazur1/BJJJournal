"use client";

import { useQueryStates, parseAsString, parseAsStringEnum } from "nuqs";

export type SortOption =
  | "date-desc"
  | "date-asc"
  | "duration-desc"
  | "duration-asc";

export interface JournalFilters {
  search: string;
  type: string;
  giNoGi: string;
  area: string;
  feeling: string;
  sort: SortOption;
}

export function useJournalFilters() {
  const [filters, setFilters] = useQueryStates({
    search: parseAsString.withDefault("").withOptions({
      history: "push",
    }),
    type: parseAsString.withDefault("all"),
    giNoGi: parseAsString.withDefault("all"),
    area: parseAsString.withDefault("all"),
    feeling: parseAsString.withDefault("all"),
    sort: parseAsStringEnum([
      "date-desc",
      "date-asc",
      "duration-desc",
      "duration-asc",
    ]).withDefault("date-desc"),
  });

  return {
    filters: filters as JournalFilters,
    setFilters,
  };
}
