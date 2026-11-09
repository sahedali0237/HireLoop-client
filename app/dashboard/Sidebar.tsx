"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { LogOut, Moon, Sun } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { useTheme } from "@/components/theme-provider"
import {
  chromeForRole,
  navItemsForRole,
  type SessionUser,
} from "@/lib/navigation"
import { initials } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { cn } from "cn"

export function DashboardSidebar({ user }: { user: SessionUser }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const chrome = chromeForRole(user.role)
  const items = navItemsForRole(user.role)

  const { setTheme, resolvedTheme } = useTheme()
  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  const handleLogOut = async () => {
    setIsSigningOut(true)
    try {
      await authClient.signOut()
      router.push("/")
    } catch {
      setIsSigningOut(false)
    }
  }

  return (
    <Sidebar collapsible="icon" className="border-t-0 border-b-0 border-l-0">
      {/* Brand */}
      <SidebarHeader className="gap-2 p-3 pb-2">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md px-1 py-1 outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
        >
          <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-background">
            <Image
              src="/images/logo.png"
              alt="HireLoop"
              width={32}
              height={32}
              className="size-8"
            />
          </span>
          <span className="grid min-w-0 flex-1 leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-semibold text-sidebar-foreground">
              HireLoop
            </span>
            <span className="truncate text-xs text-sidebar-foreground/55">
              {chrome.subtitle}
            </span>
          </span>
        </Link>

        {/* Identity card (Avatar · Name · Role · Plan badge) */}
        <div className="flex items-center gap-2.5 rounded-lg bg-card p-2.5 group-data-[collapsible=icon]:hidden">
          <Avatar className="size-10 shrink-0 border border-sidebar-border">
            {user.image ? (
              <AvatarImage src={user.image} alt={user.name} />
            ) : null}
            <AvatarFallback className="rounded-md bg-muted text-xs font-semibold text-foreground">
              {initials(user.name, user.email) || "HL"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-foreground">
              {user.name || user.email}
            </div>
            <div className="truncate text-xs text-muted-foreground">
              {chrome.label}
            </div>
            <span className="mt-1 inline-flex items-center rounded-full bg-brand/15 px-2 py-0.5 text-[11px] font-semibold text-brand-soft">
              {chrome.badge}
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* Role-based navigation */}
      <SidebarContent className="px-3">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === item.href
                    : pathname.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={isActive}
                      tooltip={item.label}
                      className={cn(
                        "relative h-8.5 gap-2.5 rounded-md px-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors outline-none",
                        "hover:bg-sidebar-accent hover:text-sidebar-foreground data-[active=true]:bg-muted data-[active=true]:text-foreground"
                      )}
                    >
                      {isActive ? (
                        <span
                          aria-hidden
                          className="absolute top-1/2 -left-3 h-4 w-0.75 -translate-y-1/2 rounded-r-full bg-brand"
                        />
                      ) : null}
                      <item.icon className="size-4! shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer: CTA + user card + logout */}
      <SidebarFooter className="gap-2 p-3">
        {chrome.cta ? (
          <Button
            nativeButton={false}
            render={
              <Link
                href={chrome.cta.href}
                className="group-data-[collapsible=icon]:hidden"
              />
            }
            className="h-10 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {chrome.cta.label}
          </Button>
        ) : null}

        {/* Theme toggle */}
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Switch theme"
                  onClick={toggleTheme}
                  className="h-8"
                >
                  {resolvedTheme === "dark" ? (
                    <Sun className="size-4 shrink-0" />
                  ) : (
                    <Moon className="size-4 shrink-0" />
                  )}
                  <span className="group-data-[collapsible=icon]:hidden">
                    Theme
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="flex items-center gap-2.5 rounded-lg bg-card p-2 group-data-[collapsible=icon]:hidden">
          <Avatar className="size-8 shrink-0">
            {user.image ? (
              <AvatarImage src={user.image} alt={user.name} />
            ) : null}
            <AvatarFallback className="rounded-md bg-muted text-[11px] font-semibold">
              {initials(user.name, user.email) || "HL"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-xs font-semibold text-foreground">
              {user.name || user.email}
            </div>
            <div className="truncate text-xs text-tertiary">{chrome.badge}</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogOut}
            disabled={isSigningOut}
            aria-label="Log out"
            className="size-7 shrink-0 rounded-md text-muted-foreground hover:text-destructive"
          >
            <LogOut className="size-4!" />
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
