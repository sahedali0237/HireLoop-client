"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

/**
 * Hides the public marketing navbar inside the admin-only area
 * (the dashboard renders its own top bar per the Hireloop 2.0 design).
 */
export function PublicNavbarGate({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  if (pathname.startsWith("/dashboard")) return null
  return <>{children}</>
}
