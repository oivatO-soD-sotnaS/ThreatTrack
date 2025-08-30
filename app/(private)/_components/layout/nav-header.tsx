"use client"

import * as React from "react"
import { ShieldAlert } from "lucide-react"
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavHeader() {
  const { open } = useSidebar()
  
  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center text-primary">
        <ShieldAlert className="size-9 fill-foreground text-primary" />
        <span className={`font-extrabold ${open ? '' : 'hidden'}`}>Threat Track</span>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
