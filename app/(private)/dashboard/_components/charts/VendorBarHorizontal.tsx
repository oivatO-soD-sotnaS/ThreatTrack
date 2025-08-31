"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts"

type Item = { vendor: string; count: number }
const config = {
  count: { label: "Vulns", color: "var(--chart-2)" },
} satisfies ChartConfig

export function VendorBarHorizontal({ data }: { data: Item[] }) {
  return (
    <Card className="bg-card/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Hotspots por Vendor</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="min-h-[280px] w-full">
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid stroke="hsl(var(--border))" vertical={false} />
            <XAxis type="number" axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="vendor"
              width={100}
              axisLine={false}
              tickLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
