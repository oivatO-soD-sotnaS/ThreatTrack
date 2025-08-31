"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowUpRight, AlertTriangle } from "lucide-react"

type Funnel = {
  novo: number
  em_triagem: number
  promovidosSemana: number
  descartadosSemana: number
}
const fmt = (n: number) => new Intl.NumberFormat("pt-BR").format(n)

export function BacklogFunnel({ data }: { data: Funnel }) {
  const total = data.novo + data.em_triagem
  const wNovo = total ? (data.novo / total) * 100 : 0
  const wTri = total ? (data.em_triagem / total) * 100 : 0
  return (
    <Card className="bg-card/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Funil do Backlog</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs text-muted-foreground">Entrada → Triagem</div>
        <div className="w-full h-3 rounded-full bg-muted/60 overflow-hidden">
          <div
            className="h-3 bg-[var(--chart-2)]"
            style={{ width: `${wNovo}%` }}
          />
          <div
            className="h-3 bg-[var(--chart-1)]"
            style={{ width: `${wTri}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span>
            Novo: <strong>{fmt(data.novo)}</strong>
          </span>
          <span>
            Em triagem: <strong>{fmt(data.em_triagem)}</strong>
          </span>
        </div>
        <Separator className="bg-border/60" />
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1">
            <ArrowUpRight className="w-4 h-4 text-primary" /> Promovidos (7d)
          </span>
          <span className="font-semibold">{fmt(data.promovidosSemana)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1">
            <AlertTriangle className="w-4 h-4 text-destructive" /> Descartados
            (7d)
          </span>
          <span className="font-semibold">{fmt(data.descartadosSemana)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
