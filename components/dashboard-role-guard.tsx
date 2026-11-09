"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

import { dashboardRootForRole, type Role } from "@/lib/navigation"

interface DashboardRoleGuardProps {
  /** Role of the signed-in user (read from the session server-side). */
  userRole: Role
  children: React.ReactNode
}

/**
 * Client guard that keeps a user inside their own dashboard section.
 *
 * - A seeker may only be under `/dashboard/seeker`
 * - A recruiter may only be under `/dashboard/recruiter`
 * - An admin may only be under `/dashboard/admin`
 *
 * The generic `/dashboard` route is left alone: `app/dashboard/page.tsx`
 * already redirects it to the matching role section server-side.
 */
export function DashboardRoleGuard({
  userRole,
  children,
}: DashboardRoleGuardProps) {
  const pathname = usePathname()
  const router = useRouter()
  const root = dashboardRootForRole(userRole)

  useEffect(() => {
    // Already in the right section (or on the generic /dashboard redirect page).
    if (pathname === "/dashboard") return
    if (pathname === root || pathname.startsWith(`${root}/`)) return

    // Wrong role section: kick the user back to their own dashboard root.
    router.push(root)
  }, [pathname, userRole, router, root])

  return <>{children}</>
}
