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

export default function Header() {
    const path = (usePathname()).split('/').filter(path => !!path)

    return (
        <header className='h-16 w-full bg-primary/60 flex items-center justify-between px-6'>
            <div className='flex items-center gap-2'>
                <SidebarTrigger />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbSeparator />
                        {path.map((p, index) => {
                            const link = path.filter((p, i) => i <= index).join("/")
                            return (
                                <React.Fragment key={index}>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink href={"/"+link}>{p}</BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                </React.Fragment>
                            )}
                        )}
                    </BreadcrumbList>
                    </Breadcrumb>
            </div>
        </header>
    )
}
