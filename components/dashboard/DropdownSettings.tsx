"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { STAT_DEFINITIONS, StatKey } from "@/types/stats"
import { useStatsPreferences } from "@/hooks/useStatsPreferences"

const stats = STAT_DEFINITIONS.map((stat) => stat.key)

export function DropdownMenuCheckboxes() {
  const { enabledStats, toggleStat } = useStatsPreferences()
  const handleToggle = (stat: StatKey) => {
    toggleStat(stat)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Customize</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Stats</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {stats.map((stat) => {
            const statDefinition = STAT_DEFINITIONS.find((s) => s.key === stat)
            return (
                <DropdownMenuCheckboxItem
                    key={stat}
                    checked={enabledStats.includes(stat)}
                    onCheckedChange={() => handleToggle(stat)}
                >
                    {statDefinition?.label}
                </DropdownMenuCheckboxItem>
            )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
