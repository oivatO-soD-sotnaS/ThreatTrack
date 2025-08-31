"use client"

import * as React from "react"
import { Separator } from "@/components/ui/separator"

export function Section({
  title,
  children,
  right,
}: {
  title: string
  children: React.ReactNode
  right?: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {right}
      </div>
      <Separator className="bg-border/60" />
      {children}
    </div>
  )
}
