"use client"

import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"


const chartConfig = {
  gi: {
    label: "Gi",
    color: "var(--chart-1)",
  },
  other: {
    label: "No Gi",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function ChartPieSeparatorNone({ value }: { value: { gi: number, noGi: number } | null }) {
    if (!value) return null;
    const data = [
        { name: "Gi", value: value.gi, fill: "var(--chart-1)" },
        { name: "No Gi", value: value.noGi, fill: "var(--chart-2)" },
    ]
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Gi vs No Gi</CardTitle>
        <CardDescription>Total Gi vs No Gi sessions</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              stroke="0"
            />
            {/* <ChartLegend 
            content={<ChartLegendContent nameKey="label" />}
            className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            /> */}
          </PieChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  )
}
