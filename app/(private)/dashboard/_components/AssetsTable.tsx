"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

type Row = {
  asset: string
  riskSum: number
  crit: number
  internet: boolean
  cards: number
}
const pct = (n: number) => `${(n * 100).toFixed(0)}%`

export function AssetsTable({ rows }: { rows: Row[] }) {
  return (
    <Card className="bg-card/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">
          Ativos mais críticos (risco agregado)
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-muted-foreground">
            <tr className="text-left">
              <th className="py-2">Ativo</th>
              <th className="py-2">Risco Σ</th>
              <th className="py-2">Criticidade</th>
              <th className="py-2">Internet</th>
              <th className="py-2">Cards</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.asset} className="border-t border-border/60">
                <td className="py-2 font-mono">{r.asset}</td>
                <td className="py-2">{r.riskSum.toFixed(2)}</td>
                <td className="py-2">{pct(r.crit)}</td>
                <td className="py-2">{r.internet ? "Sim" : "Não"}</td>
                <td className="py-2">{r.cards}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
