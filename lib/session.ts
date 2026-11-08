import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { isRole, type SessionUser } from "@/lib/navigation"

const SIGN_IN_PATH = "/signIn"

/**
 * Reads the Better Auth session on the server (RSC-safe) and normalizes the
 * user to the dashboard `SessionUser` shape. Returns `null` when signed out.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  const user = session?.user
  if (!user) return null

  return {
    id: user.id,
    name: user.name ?? "",
    email: user.email ?? "",
    image: user.image ?? null,
    role:
      typeof user.role === "string" && isRole(user.role) ? user.role : "seeker",
  }
}

/** Route guard for every `/dashboard` page: redirects unauthenticated visitors to sign-in. */
export async function requireDashboardUser(): Promise<SessionUser> {
  const user = await getSessionUser()
  if (!user) redirect(SIGN_IN_PATH)
  return user
}
