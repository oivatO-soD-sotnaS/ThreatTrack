"use client"

import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts"
import { ChartCard } from "../ChartCard";

type Props = { value: number; target?: number; maxSize?: number }

function riskColor(v: number) {
  const n = Math.max(0, Math.min(100, v))
  const hue = (120 * (100 - n)) / 100
  return `hsl(${hue} 85% 55%)`
}
function riskLabel(v: number) {
  if (v < 40) return "Baixo"
  if (v < 70) return "Moderado"
  if (v < 85) return "Alto"
  return "Crítico"
}

const config = { value: { label: "Índice de risco" } } satisfies ChartConfig

export function RiskGaugeRadial({ value, target = 40, maxSize = 320 }: Props) {
  const v = Math.max(0, Math.min(100, value))
  const color = riskColor(v)
  const label = riskLabel(v)
  const chartData = [{ name: "risco", value: v }]

  return (
    <ChartCard title="Índice de risco (agora)" height="sm">
      <ChartContainer config={config} className="h-full w-full">
        <div
          className="relative mx-auto h-full w-full"
          style={{ maxWidth: maxSize }}
        >
          <div className="relative aspect-square h-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius="68%"
                outerRadius="88%"
                barSize={18}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <defs>
                  <linearGradient
                    id="risk-gradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={color} stopOpacity={0.95} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <RadialBar
                  dataKey="value"
                  cornerRadius={18}
                  fill="url(#risk-gradient)"
                  background={{ fill: "hsl(var(--muted))", fillOpacity: 0.22 }}
                />
              </RadialBarChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-semibold leading-none">
                  {v.toFixed(0)}%
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {label} • meta &lt; {target}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </ChartContainer>

      <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <i
            className="h-2.5 w-2.5 rounded-full inline-block"
            style={{ background: "hsl(120 70% 40%)" }}
          />
          Baixo
        </span>
        <span className="inline-flex items-center gap-1">
          <i
            className="h-2.5 w-2.5 rounded-full inline-block"
            style={{ background: "hsl(60 90% 50%)" }}
          />
          Moderado
        </span>
        <span className="inline-flex items-center gap-1">
          <i
            className="h-2.5 w-2.5 rounded-full inline-block"
            style={{ background: "hsl(30 95% 50%)" }}
          />
          Alto
        </span>
        <span className="inline-flex items-center gap-1">
          <i
            className="h-2.5 w-2.5 rounded-full inline-block"
            style={{ background: "hsl(0 85% 50%)" }}
          />
          Crítico
        </span>
      </div>
    </ChartCard>
  )
}
