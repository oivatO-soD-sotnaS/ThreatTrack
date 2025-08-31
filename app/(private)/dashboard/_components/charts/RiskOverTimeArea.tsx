/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts"
import { ChartCard } from "../ChartCard"

type Point = {
  date: string
  kev: number
  other: number
  total?: number
  proj?: number
}

const config = {
  kev: { label: "KEV", color: "var(--chart-1)" },
  other: { label: "Outras", color: "var(--chart-3)" },
  proj: { label: "Projeção", color: "var(--muted-foreground)" },
} satisfies ChartConfig

export function RiskOverTimeArea({ data }: { data: Point[] }) {
  const prepared = data.map((d) => ({
    ...d,
    total: d.total ?? d.kev + d.other,
  }))
  return (
    <ChartCard title="Risco agregado ao longo do tempo" height="lg">
      <div className="chart-fill h-full">
        <ChartContainer config={config} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={prepared} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tickMargin={8}
              />
              <YAxis width={44} tickLine={false} axisLine={false} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(v: any) =>
                      typeof v === "number" ? v.toFixed(2) : v
                    }
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                type="monotone"
                dataKey="kev"
                stackId="1"
                stroke="var(--color-kev)"
                fill="var(--color-kev)"
                fillOpacity={0.35}
              />
              <Area
                type="monotone"
                dataKey="other"
                stackId="1"
                stroke="var(--color-other)"
                fill="var(--color-other)"
                fillOpacity={0.35}
              />
              <Line
                type="monotone"
                dataKey="proj"
                stroke="var(--color-proj)"
                strokeDasharray="6 6"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </ChartCard>
  )
}
