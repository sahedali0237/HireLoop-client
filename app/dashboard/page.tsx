"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FiLogOut, FiUser, FiMail, FiShield } from "react-icons/fi"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const session = authClient.useSession()
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await authClient.signOut()
      router.push("/")
    } catch {
      setIsSigningOut(false)
    }
  }

  if (session.isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    )
  }

  if (!session.data?.user) {
    return <Link href="/signIn">Not signed in — sign in here</Link>
  }

  const user = session.data.user
  const role = typeof user.role === "string" ? user.role : "seeker"

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-16 items-center justify-between border-b border-border px-4 px-lg-8">
        <Link href="/" className="font-semibold text-primary">
          HireLoop
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Browse Jobs
          </Link>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted text-xs text-muted-foreground uppercase tracking-wider">
            <FiShield size={12} />
            {role}
          </div>
        </div>
      </div>

      <main className="max-w-md mx-auto pt-8 px-4 px-lg-8">
        <div className="rounded-xl border border-input bg-card p-6 shadow-sm">
          <h2 className="mb-1 text-xl font-semibold">Dashboard</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Welcome back, <span className="font-medium">{user.name ?? user.email}</span>.
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
              <FiUser className="size-4 text-muted-foreground" />
              <div>
                <div className="text-xs font-medium text-foreground">Full Name</div>
                <div className="text-xs text-muted-foreground">
                  {user.name ?? "—"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
              <FiMail className="size-4 text-muted-foreground" />
              <div>
                <div className="text-xs font-medium text-foreground">Email</div>
                <div className="text-xs text-muted-foreground truncate max-w-xs">
                  {user.email ?? "—"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
              <FiShield className="size-4 text-muted-foreground" />
              <div>
                <div className="text-xs font-medium text-foreground">Role</div>
                <div className="text-xs text-muted-foreground capitalize">
                  {role}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2">
            <Button
              onClick={handleSignOut}
              disabled={isSigningOut}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <FiLogOut className="size-4" /> Sign out
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
