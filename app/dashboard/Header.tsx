"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Bell, ChevronsUpDown, LogOut, Search, Settings } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { chromeForRole, type SessionUser } from "@/lib/navigation"
import { initials } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DashboardHeader({ user }: { user: SessionUser }) {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)
  const chrome = chromeForRole(user.role)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await authClient.signOut()
      router.push("/")
    } catch {
      setIsSigningOut(false)
    }
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-panel px-4 md:h-16 md:px-6">
      {/* Mobile: sidebar toggle + brand */}
      <SidebarTrigger aria-label="Toggle sidebar" className="md:hidden" />
      <Link
        href="/dashboard"
        aria-label="HireLoop dashboard"
        className="md:hidden"
      >
        <Image
          src="/logos/Icon.png"
          alt="H"
          width={28}
          height={28}
          className="size-7 rounded-lg"
        />
      </Link>

      {/* Search */}
      <div className="relative flex min-w-0 flex-1 items-center">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-3 size-4 shrink-0 text-tertiary"
        />
        <Input
          type="search"
          placeholder={chrome.searchPlaceholder}
          aria-label="Search"
          className="h-10 rounded-lg border-border bg-input pl-9 text-sm placeholder:text-tertiary/70 focus-visible:border-border focus-visible:ring-2 focus-visible:ring-brand/50 max-sm:h-9 max-sm:pl-8"
        />
      </div>

      {/* Right cluster: actions + profile */}
      <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative size-9 rounded-lg text-muted-foreground hover:bg-accent"
        >
          <Bell className="size-4!" />
          <span
            aria-hidden
            className="absolute top-2 right-2 size-1.5 rounded-full bg-brand-soft ring-2 ring-panel"
          />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Quick settings"
          className="hidden size-9 rounded-lg text-muted-foreground hover:bg-accent sm:inline-flex"
        >
          <Settings className="size-4!" />
        </Button>
        <Separator
          orientation="vertical"
          className="hidden h-5! self-center sm:block"
        />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="h-9 gap-2 rounded-lg px-1.5 outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-brand/50 md:px-2"
                aria-label="Open user menu"
              />
            }
          >
            <Avatar className="size-7 shrink-0">
              {user.image ? (
                <AvatarImage src={user.image} alt={user.name} />
              ) : null}
              <AvatarFallback className="rounded-md bg-muted text-[11px] font-semibold">
                {initials(user.name, user.email) || "HL"}
              </AvatarFallback>
            </Avatar>
            <span className="hidden min-w-0 flex-col items-start leading-tight sm:flex">
              <span className="max-w-40 truncate text-xs font-semibold text-foreground">
                {user.name || user.email}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {chrome.label}
              </span>
            </span>
            <ChevronsUpDown
              aria-hidden
              className="hidden size-3.5 text-muted-foreground sm:block"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-64 rounded-lg border-border bg-popover p-1.5"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-2">
                <div className="truncate text-sm font-semibold text-foreground">
                  {user.name || user.email}
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  {user.email}
                </div>
                <span className="mt-1.5 inline-flex items-center rounded-full bg-brand/15 px-2 py-0.5 text-[11px] font-semibold text-brand-soft">
                  {chrome.badge}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                render={<Link href="/dashboard" />}
                className="gap-2.5 rounded-md py-2 text-sm"
              >
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                render={<Link href={settingsHrefForRole(user.role)} />}
                className="gap-2.5 rounded-md py-2 text-sm"
              >
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="gap-2.5 rounded-md py-2 text-sm text-destructive focus:text-destructive"
            >
              <LogOut className="size-4!" />
              {isSigningOut ? "Signing out..." : "Sign out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

function settingsHrefForRole(role: SessionUser["role"]): string {
  switch (role) {
    case "admin":
      return "/dashboard/admin/settings"
    case "recruiter":
      return "/dashboard/recruiter/settings"
    default:
      return "/dashboard/seeker/settings"
  }
}
