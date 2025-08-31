"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts"
import { ChartCard } from "../ChartCard";

type Row = { team: string; kev: number; other: number }
const config = {
  kev: { label: "KEV", color: "var(--chart-1)" },
  other: { label: "Outras", color: "var(--chart-3)" },
} satisfies ChartConfig

export function RiskByTeamStackedBar({ data }: { data: Row[] }) {
  return (
    <ChartCard title="Risco agregado por time (stacked)" height="md">
      <div className="chart-fill h-full">
        <ChartContainer config={config} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: 8, right: 8 }}>
              <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="team" axisLine={false} tickLine={false} />
              <YAxis width={44} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="kev" stackId="1" fill="var(--color-kev)" />
              <Bar dataKey="other" stackId="1" fill="var(--color-other)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </ChartCard>
  )
}
