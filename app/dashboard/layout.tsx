import type { ReactNode } from "react"

import { requireDashboardUser } from "@/lib/session"
import { DashboardSidebar } from "@/app/dashboard/Sidebar"
import { DashboardHeader } from "@/app/dashboard/Header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const user = await requireDashboardUser()

  return (
    <div className="dark min-h-svh bg-background text-foreground">
      <SidebarProvider>
        <DashboardSidebar user={user} />
        <SidebarInset className="bg-panel">
          <DashboardHeader user={user} />
          <main className="flex min-h-svh flex-1 flex-col gap-4 p-4 md:gap-5 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
