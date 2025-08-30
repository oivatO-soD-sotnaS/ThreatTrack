"use client"

import { SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from 'next/navigation'
import { SlashIcon } from 'lucide-react'
import ScoreBadge from './user-score'

export default function Header() {
    const path = (usePathname()).split('/').filter(path => !!path)

    return (
        <header className='h-16 w-full bg-secondary flex items-center justify-between px-6'>
            <div className='flex items-center gap-2'>
                <SidebarTrigger />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbSeparator>
                            <SlashIcon />
                        </BreadcrumbSeparator>
                        {path.map((p, index) => {
                            const link = path.filter((p, i) => i <= index).join("/")
                            return (
                                <React.Fragment key={index}>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href={"/"+link}>{p}</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator>
                                        <SlashIcon />
                                    </BreadcrumbSeparator>
                                </React.Fragment>
                            )}
                        )}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <ScoreBadge />
        </header>
    )
}
