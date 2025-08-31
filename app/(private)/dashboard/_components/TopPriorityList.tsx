"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe } from "lucide-react"

type Item = {
  id: string
  title: string
  score: number
  level: "extrema" | "alta" | "moderada" | "baixa"
  kev: boolean
  internet: boolean
  sla: string
}
const pct = (n: number) => `${(n * 100).toFixed(0)}%`

export function TopPriorityList({ items }: { items: Item[] }) {
  return (
    <Card className="bg-card/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Top-10 por prioridade</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((it) => (
          <div key={it.id} className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="truncate">{it.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="capitalize">
                  {it.level}
                </Badge>
                {it.kev && (
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    KEV
                  </Badge>
                )}
                {it.internet && (
                  <Badge variant="secondary" className="gap-1">
                    <Globe className="w-3 h-3" /> internet-facing
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold">{pct(it.score)}</div>
              <div className="text-xs text-muted-foreground">
                SLA {new Date(it.sla).toLocaleDateString("pt-BR")}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
