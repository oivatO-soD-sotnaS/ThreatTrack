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
import { ScatterChart, Scatter, CartesianGrid, XAxis, YAxis } from "recharts"

type P = { id: string; cvss: number; epss: number; kev: boolean; title: string }

const config = {
  kev: { label: "KEV", color: "var(--chart-1)" },
  other: { label: "Outras", color: "var(--chart-3)" },
} satisfies ChartConfig

export function CVSSxEPSSScatter({ data }: { data: P[] }) {
  const kevData = data.filter((d) => d.kev)
  const otherData = data.filter((d) => !d.kev)
  return (
    <Card className="bg-card/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">CVSS × EPSS (KEV vs Outras)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="min-h-[260px] w-full">
          <ScatterChart margin={{ left: 8, right: 8 }}>
            <CartesianGrid stroke="hsl(var(--border))" />
            <XAxis
              type="number"
              dataKey="cvss"
              domain={[0, 10]}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="number"
              dataKey="epss"
              domain={[0, 1]}
              tickFormatter={(v) => `${Math.round(v * 100)}%`}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent nameKey="title" />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Scatter name="KEV" data={kevData} fill="var(--color-kev)" />
            <Scatter name="Outras" data={otherData} fill="var(--color-other)" />
          </ScatterChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
