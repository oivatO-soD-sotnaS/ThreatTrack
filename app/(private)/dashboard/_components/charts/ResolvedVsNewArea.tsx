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
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts"
import { ChartCard } from "../ChartCard";

type P = { date: string; novos: number; resolvidos: number }
const config = {
  novos: { label: "Novos", color: "var(--chart-4)" },
  resolvidos: { label: "Resolvidos", color: "var(--chart-1)" },
} satisfies ChartConfig

export function ResolvedVsNewArea({ data }: { data: P[] }) {
  return (
    <ChartCard title="Novos × Resolvidos (semanal)" height="md">
      <div className="chart-fill h-full">
        <ChartContainer config={config} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tickMargin={8}
              />
              <YAxis
                allowDecimals={false}
                width={36}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                type="monotone"
                dataKey="novos"
                stroke="var(--color-novos)"
                fill="var(--color-novos)"
                fillOpacity={0.25}
              />
              <Area
                type="monotone"
                dataKey="resolvidos"
                stroke="var(--color-resolvidos)"
                fill="var(--color-resolvidos)"
                fillOpacity={0.35}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </ChartCard>
  )
}
