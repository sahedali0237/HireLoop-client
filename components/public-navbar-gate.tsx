"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

/**
 * Hides the public marketing navbar inside the admin-only area
 * (the dashboard renders its own top bar per the Hireloop 2.0 design)
 * and on the Stripe-style checkout page, which renders its own header.
 */
export function PublicNavbarGate({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  if (pathname.startsWith("/dashboard") || pathname === "/checkout") return null
  return <>{children}</>
}
