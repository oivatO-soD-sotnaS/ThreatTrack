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
import { AreaChart, Area, Line, CartesianGrid, XAxis, YAxis } from "recharts"

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
  // garante o campo total para tooltips/legenda se vier faltando
  const prepared = data.map((d) => ({
    ...d,
    total: d.total ?? d.kev + d.other,
  }))

  return (
    <Card className="bg-card/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">
          Risco agregado ao longo do tempo (↓ conforme resoluções)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="min-h-[300px] w-full">
          <AreaChart
            accessibilityLayer
            data={prepared}
            margin={{ left: 8, right: 8 }}
          >
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
                  formatter={(v: any, name) =>
                    name === "total" ? v.toFixed(2) : v
                  }
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            {/* stacked áreas: KEV + Outras */}
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
            {/* linha pontilhada de projeção (what-if) */}
            <Line
              type="monotone"
              dataKey="proj"
              stroke="var(--color-proj)"
              strokeDasharray="6 6"
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
        <p className="text-xs text-muted-foreground mt-2">
          *Índice composto (ex.: soma ponderada por prioridade, criticidade e
          exposição). Concluir cards de alto peso (p.ex. KEV) derruba a curva
          mais.
        </p>
      </CardContent>
    </Card>
  )
}
