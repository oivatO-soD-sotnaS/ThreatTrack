"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts"

type Row = { team: string; kev: number; other: number }

const config = {
  kev: { label: "KEV", color: "var(--chart-1)" },
  other: { label: "Outras", color: "var(--chart-3)" },
} satisfies ChartConfig

export function RiskByTeamStackedBar({ data }: { data: Row[] }) {
  return (
    <Card className="bg-card/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">
          Risco agregado por time (stacked)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="min-h-[300px] w-full">
          <BarChart data={data} margin={{ left: 8, right: 8 }}>
            <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="team" axisLine={false} tickLine={false} />
            <YAxis width={44} tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="kev" stackId="1" fill="var(--color-kev)" />
            <Bar dataKey="other" stackId="1" fill="var(--color-other)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
