/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { AreaChart, Area, CartesianGrid, XAxis, YAxis } from "recharts"

type Item = {
  date: string
  planejado: number
  em_processo: number
  concluido: number
}

const config = {
  planejado: { label: "Planejado", color: "var(--chart-2)" },
  em_processo: { label: "Em processo", color: "var(--chart-3)" },
  concluido: { label: "Concluído", color: "var(--chart-4)" },
} satisfies ChartConfig

export function CFDArea({ data }: { data: Item[] }) {
  return (
    <Card className="bg-card/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Cumulative Flow Diagram (CFD)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="min-h-[260px] w-full">
          <AreaChart data={data} stackOffset="expand">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis
              tickFormatter={(v) => `${Math.round(v * 100)}%`}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(v: any) => `${Math.round(v * 100)}%`}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              type="monotone"
              dataKey="planejado"
              stackId="1"
              stroke="var(--color-planejado)"
              fill="var(--color-planejado)"
            />
            <Area
              type="monotone"
              dataKey="em_processo"
              stackId="1"
              stroke="var(--color-em_processo)"
              fill="var(--color-em_processo)"
            />
            <Area
              type="monotone"
              dataKey="concluido"
              stackId="1"
              stroke="var(--color-concluido)"
              fill="var(--color-concluido)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
