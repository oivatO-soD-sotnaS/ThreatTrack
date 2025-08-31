/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  ScatterChart,
  Scatter,
  CartesianGrid,
  XAxis,
  YAxis,
  ZAxis,
  ResponsiveContainer,
} from "recharts"
import { ChartCard } from "../ChartCard"

type Row = {
  severity: "low" | "medium" | "high" | "critical"
  priority: "baixa" | "moderada" | "alta" | "extrema"
  count: number
}

const config = {
  count: { label: "Qtde", color: "var(--chart-5)" },
} satisfies ChartConfig
const sevIdx = (s: Row["severity"]) =>
  ({ low: 1, medium: 2, high: 3, critical: 4 }[s])
const priIdx = (p: Row["priority"]) =>
  ({ baixa: 1, moderada: 2, alta: 3, extrema: 4 }[p])

export function PrioritySeverityMatrix({ data }: { data: Row[] }) {
  const mapped = data.map((d) => ({
    x: sevIdx(d.severity),
    y: priIdx(d.priority),
    z: d.count,
    severity: d.severity,
    priority: d.priority,
  }))
  return (
    <ChartCard title="Matriz Prioridade × Severidade" height="lg">
      <div className="chart-fill h-full">
        <ChartContainer config={config} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ left: 8, right: 8 }}>
              <CartesianGrid stroke="hsl(var(--border))" />
              <XAxis
                type="number"
                dataKey="x"
                tickFormatter={(v) =>
                  ["", "Low", "Medium", "High", "Critical"][v]
                }
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="number"
                dataKey="y"
                tickFormatter={(v) =>
                  ["", "Baixa", "Moderada", "Alta", "Extrema"][v]
                }
                tickLine={false}
                axisLine={false}
              />
              <ZAxis dataKey="z" range={[60, 220]} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(v: any, name, { payload }) =>
                      name === "z"
                        ? `${v} cards`
                        : `${payload.severity} / ${payload.priority}`
                    }
                  />
                }
              />
              <Scatter data={mapped} fill="var(--color-count)" />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </ChartCard>
  )
}
