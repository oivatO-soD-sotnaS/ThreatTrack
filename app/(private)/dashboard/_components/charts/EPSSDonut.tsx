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
import { PieChart, Pie, Cell } from "recharts"

type Slice = { bucket: string; value: number }

const config = {
  a: { label: "≥ 0.90", color: "var(--chart-1)" },
  b: { label: "0.70–0.89", color: "var(--chart-2)" },
  c: { label: "0.40–0.69", color: "var(--chart-3)" },
  d: { label: "0.10–0.39", color: "var(--chart-4)" },
  e: { label: "< 0.10", color: "var(--chart-5)" },
} satisfies ChartConfig

export function EPSSDonut({ data }: { data: Slice[] }) {
  const mapped = data.map((s, i) => ({
    ...s,
    key: ["a", "b", "c", "d", "e"][i],
  }))
  return (
    <Card className="bg-card/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Distribuição de EPSS</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="min-h-[240px] w-full">
          <PieChart>
            <Pie
              data={mapped}
              dataKey="value"
              nameKey="bucket"
              innerRadius={60}
              outerRadius={84}
            >
              {mapped.map((s) => (
                <Cell key={s.bucket} fill={`var(--color-${s.key})`} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
