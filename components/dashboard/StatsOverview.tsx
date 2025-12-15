"use client";

import type { ComprehensiveStats } from "@/lib/journalStore";
import type { StatKey, StatConfig } from "@/types/stats";
import { STAT_DEFINITIONS } from "@/types/stats";
import { useStatsPreferences } from "@/hooks/useStatsPreferences";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StatsOverviewProps {
  stats: ComprehensiveStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const { enabledStats } = useStatsPreferences();

  const visibleStats = STAT_DEFINITIONS.filter((def) => enabledStats.includes(def.key));

  const renderStatValue = (statKey: StatKey) => {
    switch (statKey) {
      case "totalSessions":
        return (
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalSessions}
          </p>
        );
      case "totalTimeTrained":
        return (
          <p className="text-3xl font-bold text-purple-600">
            {stats.totalTimeTrained}
          </p>
        );
      case "sessionsThisMonth":
        return (
          <p className="text-3xl font-bold text-green-600">
            {stats.sessionsThisMonth}
          </p>
        );
      case "giVsNoGi":
        return (
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {stats.giVsNoGi.gi} / {stats.giVsNoGi.noGi}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.giVsNoGi.percentage.gi}% Gi ·{" "}
              {stats.giVsNoGi.percentage.noGi}% NoGi
            </p>
          </div>
        );
      case "mostCommonPartner":
        return stats.mostCommonPartner ? (
          <div className="text-center">
            <p className="text-2xl font-bold text-teal-600">
              {stats.mostCommonPartner.name}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.mostCommonPartner.count} sessions
            </p>
          </div>
        ) : (
          <p className="text-lg text-gray-400">No data</p>
        );
      case "mostCommonArea":
        return stats.mostCommonArea ? (
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-600">
              {stats.mostCommonArea.area}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.mostCommonArea.count} times
            </p>
          </div>
        ) : (
          <p className="text-lg text-gray-400">No data</p>
        );
      case "trainingFrequency":
        return (
          <p className="text-3xl font-bold text-pink-600">
            {stats.trainingFrequency}
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
            No stats enabled. Click "Customize" to add stats!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleStats.map((stat) => {
            const config = getStatConfig(stat.key);
            if (!config) return null;

            return (
              <Card key={stat.key}>
                <CardHeader>
                  <CardTitle>
                    {config.label}
                  </CardTitle>
                  <CardDescription>
                  {renderStatValue(stat.key)}
                  </CardDescription>
                  <CardAction>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-sm text-primary-foreground">{config.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardAction>
                </CardHeader>
                {/* <CardContent>
                  {renderStatValue(stat.key)}
                </CardContent> */}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
