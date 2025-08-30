import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./_components/layout/app-sidebar"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { forbidden } from "next/navigation"
import Header from "./_components/layout/header"

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) return forbidden()

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="overflow-hidden bg-card">
                <main>
                    <Header />
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}