"use client"

import { authClient } from "@/lib/auth-client"
import type { Role } from "@/lib/navigation"

/**
 * Reads the better-auth client session and derives whether the visitor is a
 * signed-in job seeker — the only role allowed to save or apply to jobs.
 */
export function useSeekerSession() {
  const session = authClient.useSession()
  const user = session.data?.user
  const isAuthenticated = !!user
  const role = (user?.role as Role | undefined) ?? "seeker"
  const isSeeker = isAuthenticated && role === "seeker"

  return {
    user,
    session,
    isAuthenticated,
    role,
    isSeeker,
    /** True only when signed in AND role === "seeker". */
    canSaveApply: isSeeker,
  }
}
