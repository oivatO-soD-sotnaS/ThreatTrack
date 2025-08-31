/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils" // se não tiver, troque por simples concatenação

type Props = {
  title: string
  height?: "sm" | "md" | "lg" | number // usa tokens ou px direto
  right?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export function ChartCard({
  title,
  height = "md",
  right,
  children,
  className,
}: Props) {
  const inlineHeight =
    typeof height === "number"
      ? { ["--card-h" as any]: `${height}px` }
      : undefined

  const hClass =
    typeof height === "string"
      ? {
          sm: "var(--card-h-sm)",
          md: "var(--card-h-md)",
          lg: "var(--card-h-lg)",
        }[height]
      : "var(--card-h)"

  return (
    <Card
      className={cn("bg-card/80 h-[--card-h] flex flex-col", className)}
      style={{ ["--card-h" as any]: hClass, ...inlineHeight }}
    >
      <CardHeader className="pb-2 flex items-center justify-between">
        <CardTitle className="text-sm">{title}</CardTitle>
        {right}
      </CardHeader>
      <CardContent className="flex-1 min-h-0 p-4">
        {/* região de gráfico precisa preencher a altura */}
        <div className="h-full">{children}</div>
      </CardContent>
    </Card>
  )
}
