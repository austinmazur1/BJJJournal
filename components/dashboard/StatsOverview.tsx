"use client";

import type { ComprehensiveStats } from "@/lib/journalStore";
import type { StatKey, StatConfig } from "@/types/stats";
import { STAT_DEFINITIONS } from "@/types/stats";
import { useStatsPreferences } from "@/hooks/useStatsPreferences";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChartPieSeparatorNone } from "../charts/GivsNoGiPieChart";
import { ChartBarMixed } from "../charts/StatsBarChart";
import { ChartLineDefault } from "../charts/StatsLineChart";

interface StatsOverviewProps {
  stats: ComprehensiveStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const { enabledStats } = useStatsPreferences();

  const visibleStats = STAT_DEFINITIONS.filter((def) =>
    enabledStats.includes(def.key)
  );

  const renderStatValue = (statKey: StatKey) => {
    switch (statKey) {
      case "totalSessions":
        return (
          <p className="text-3xl font-bold text-primary">
            {stats.totalSessions}
          </p>
        );
      case "totalTimeTrained":
        return (
          <p className="text-3xl font-bold text-primary">
            {stats.totalTimeTrained}
          </p>
        );
      case "sessionsThisMonth":
        return (
          <p className="text-3xl font-bold text-primary">
            {stats.sessionsThisMonth}
          </p>
        );
    }
  };

  const getStatConfig = (key: StatKey): StatConfig | undefined => {
    return STAT_DEFINITIONS.find((stat) => stat.key === key);
  };

  return (
    <div>
      {visibleStats.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No stats enabled. Click &quot;Customize&quot; to add stats!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleStats.map((stat) => {
            const statKey = stat.key
            const config = getStatConfig(stat.key);
            switch (statKey) {
              case "mostCommonArea":
                return stats.mostCommonArea ? (
                  <ChartBarMixed
                    title="Most Common Area"
                    description="Top 5 areas trained"
                    key={statKey}
                    data={stats.top5areas}
                  />
                ) : (
                  <p className="text-lg text-gray-400">No data</p>
                );
              case "mostCommonPartner":
                return stats.mostCommonPartner ? (
                  <ChartBarMixed
                    title="Frequent Training Partners"
                    description="Top 5 partners"
                    key={statKey}
                    data={stats.top5partners}
                  />
                ) : (
                  <p className="text-lg text-gray-400">No data</p>
                );
              case "giVsNoGi":
                return stats.giVsNoGi ? (
                  <ChartPieSeparatorNone key={statKey} value={stats.giVsNoGi} />
                ) : (
                  <p className="text-lg text-gray-400">No data</p>
                );
              case "trainingFrequency":
                return stats.trainingFrequency ? (
                  <ChartLineDefault
                    title="Training Frequency"
                    description="Training frequency per month"
                    key={statKey}
                    data={stats.sessionsPerMonthArray}
                  />
                ) : (
                  <p className="text-lg text-gray-400">No data</p>
                );
            }
            if (!config) return null;
            return (
              <Card key={stat.key}>
                <CardHeader>
                  <CardTitle>{config.label}</CardTitle>
                  <CardDescription>{renderStatValue(stat.key)}</CardDescription>
                  <CardAction>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm text-primary-foreground">
                            {config.description}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardAction>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
