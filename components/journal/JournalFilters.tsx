"use client";

import {
  JournalEntryType,
  JournalEntryGiNoGi,
  JournalEntryArea,
  JournalEntryFeeling,
} from "@/lib/models/JournalEntry";
import { Input } from "../ui/input";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Search } from "lucide-react";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { useJournalFilters } from "@/hooks/useJournalFilters";
import { Label } from "../ui/label";

export default function JournalFilters() {
  const { filters, setFilters } = useJournalFilters();

  const clearFilters = () => {
    setFilters({
      search: "",
      type: "all",
      giNoGi: "all",
      area: "all",
      feeling: "all",
      sort: "date-desc",
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.type !== "all" ||
    filters.giNoGi !== "all" ||
    filters.area !== "all" ||
    filters.feeling !== "all";

  return (
    <div className="pb-4 border-b border-gray-200">
      <div className="flex flex-row items-end gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by notes, location, professor, or partners..."
            value={filters.search ?? ""}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="pl-10 pr-10"
          />
          {filters.search && (
            <button
              onClick={() => setFilters({ search: "" })}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-col">
          <Label className="mb-1.5">Type</Label>
          <Select
            value={filters.type ?? "all"}
            onValueChange={(value) => setFilters({ type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.values(JournalEntryType).map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col">
          <Label className="mb-1.5">Gi/No Gi</Label>
          <Select
            value={filters.giNoGi ?? "all"}
            onValueChange={(value) => setFilters({ giNoGi: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {Object.values(JournalEntryGiNoGi).map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col">
          <Label className="mb-1.5">Area</Label>
          <Select
            value={filters.area ?? "all"}
            onValueChange={(value) => setFilters({ area: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Areas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              {Object.values(JournalEntryArea).map((area) => (
                <SelectItem key={area} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col">
          <Label className="mb-1.5">Feeling</Label>
          <Select
            value={filters.feeling ?? "all"}
            onValueChange={(value) => setFilters({ feeling: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Feelings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Feelings</SelectItem>
              {Object.values(JournalEntryFeeling).map((feeling) => (
                <SelectItem key={feeling} value={feeling}>
                  {feeling}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label className="whitespace-nowrap">Sort by:</Label>
          <Select
            value={filters.sort ?? "date-desc"}
            onValueChange={(value) =>
              setFilters({
                sort: value as
                  | "date-desc"
                  | "date-asc"
                  | "duration-desc"
                  | "duration-asc",
              })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Date (Newest First)</SelectItem>
              <SelectItem value="date-asc">Date (Oldest First)</SelectItem>
              <SelectItem value="duration-desc">Duration (Longest)</SelectItem>
              <SelectItem value="duration-asc">Duration (Shortest)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
