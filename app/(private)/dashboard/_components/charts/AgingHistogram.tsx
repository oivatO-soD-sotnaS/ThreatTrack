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
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts"

type Bucket = { bucket: string; backlog: number; kanban: number }

const config = {
  backlog: { label: "Backlog", color: "var(--chart-2)" },
  kanban: { label: "Kanban", color: "var(--chart-1)" },
} satisfies ChartConfig

export function AgingHistogram({ data }: { data: Bucket[] }) {
  return (
    <Card className="bg-card/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Aging dos cards</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="min-h-[260px] w-full">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="bucket" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="backlog" fill="var(--color-backlog)" />
            <Bar dataKey="kanban" fill="var(--color-kanban)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
