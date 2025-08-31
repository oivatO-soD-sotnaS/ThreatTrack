"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts"

type Gauge = { name: string; value: number } // 0..100

const config = {
  value: { label: "Índice de risco", color: "var(--chart-2)" },
} satisfies ChartConfig

export function RiskGaugeRadial({ value }: { value: number }) {
  const data: Gauge[] = [
    { name: "Risco", value: Math.max(0, Math.min(100, value)) },
  ]
  return (
    <Card className="bg-card/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Índice de risco (agora)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={config}
          className="w-full flex items-center justify-center"
        >
          <RadialBarChart
            width={240}
            height={180}
            cx={120}
            cy={100}
            innerRadius={60}
            outerRadius={80}
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar
              dataKey="value"
              background={{ fill: "hsl(var(--muted))" }}
              fill="var(--color-value)"
              cornerRadius={8}
            />
          </RadialBarChart>
        </ChartContainer>
        <div className="text-center -mt-10 text-2xl font-semibold">
          {value.toFixed(0)}%
        </div>
        <p className="text-xs text-muted-foreground text-center mt-1">
          meta &lt; 40%
        </p>
      </CardContent>
    </Card>
  )
}
