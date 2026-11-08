import {
  Archive,
  Banknote,
  Bookmark,
  Briefcase,
  Building2,
  CalendarClock,
  FileText,
  Trophy,
  Users,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { requireDashboardUser } from "@/lib/session"
import { type Role } from "@/lib/navigation"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/* Role-aware dashboard home.                                          */
/* Data below is static placeholder content mirroring the Figma        */
/* `Seeker / Dashboard`, `Recruiter / Dashboard` and `Admin /          */
/* Dashboard Overview` frames — swap for real queries per role.        */
/* ------------------------------------------------------------------ */

interface StatCard {
  readonly label: string
  readonly value: string
  readonly icon: LucideIcon
}

interface ActivityItem {
  readonly title: string
  readonly timestamp: string
}

const STATS: Record<Role, readonly StatCard[]> = {
  seeker: [
    { label: "Saved Jobs", value: "12", icon: Bookmark },
    { label: "Applications Submitted", value: "24", icon: FileText },
    { label: "Interviews Scheduled", value: "3", icon: CalendarClock },
    { label: "Offers Received", value: "1", icon: Trophy },
  ],
  recruiter: [
    { label: "Total Job Posts", value: "48", icon: Briefcase },
    { label: "Total Applicants", value: "1,284", icon: Users },
    { label: "Active Jobs", value: "12", icon: Building2 },
    { label: "Jobs Closed", value: "9", icon: Archive },
  ],
  admin: [
    { label: "Total Users", value: "1,382", icon: Users },
    { label: "Total Companies", value: "217", icon: Building2 },
    { label: "Total Jobs Posted", value: "486", icon: Briefcase },
    { label: "Platform Revenue", value: "$94.2k", icon: Banknote },
  ],
}

const ACTIVITY: Record<Role, readonly ActivityItem[]> = {
  seeker: [
    {
      title:
        "Application for Senior Product Designer at TechFlow updated to 'Under Review'.",
      timestamp: "2 hours ago",
    },
    {
      title:
        "New job alert: Lead Frontend Engineer at FinGrid matches your profile.",
      timestamp: "5 hours ago",
    },
    {
      title:
        "You have a new message from Sarah Jenkins (Hiring Manager at CloudOps).",
      timestamp: "1 day ago",
    },
  ],
  recruiter: [
    {
      title: "Maya Chen applied to Senior Frontend Engineer at TechFlow Inc.",
      timestamp: "45 minutes ago",
    },
    {
      title:
        "Your posting 'Staff Data Scientist' was shortlisted by 8 applicants.",
      timestamp: "3 hours ago",
    },
    {
      title:
        "Company profile approved — TechFlow Inc. is now publicly visible.",
      timestamp: "Yesterday",
    },
  ],
  admin: [
    {
      title: "Northwind Labs submitted a company registration for review.",
      timestamp: "1 hour ago",
    },
    {
      title: "New recruiter plan subscription: Enterprise ($149/mo).",
      timestamp: "4 hours ago",
    },
    {
      title: "3 job posts were flagged for moderation in Software Development.",
      timestamp: "Yesterday",
    },
  ],
}

export default async function DashboardPage() {
  const user = await requireDashboardUser()
  const stats = STATS[user.role]
  const activity = ACTIVITY[user.role]

  return (
    <div className="mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-5">
      {/* Welcome header */}
      <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
        Welcome back,{" "}
        <span className="text-brand-soft">
          {firstName(user.name, user.email)}
        </span>
      </h1>

      {/* Stats row */}
      <section
        aria-label="Key metrics"
        className={cn(
          "grid gap-3",
          stats.length === 5
            ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-5"
            : "grid-cols-2 lg:grid-cols-4"
        )}
      >
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="flex flex-col justify-between gap-5 rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted/60">
                <stat.icon className="!size-3.5" aria-hidden />
              </span>
              <span className="truncate font-medium">{stat.label}</span>
            </div>
            <div className="text-2xl font-semibold text-foreground tabular-nums md:text-3xl">
              {stat.value}
            </div>
          </article>
        ))}
      </section>

      {/* Recent activity */}
      <section
        aria-label="Recent activity"
        className="flex flex-col gap-2 rounded-xl border border-border bg-card"
      >
        <div className="flex items-center justify-between p-4 pb-2">
          <h2 className="text-sm font-semibold text-foreground">
            {activityHeading(user.role)}
          </h2>
        </div>
        <ul className="flex flex-col divide-y divide-border">
          {activity.map((item) => (
            <li key={item.title} className="flex items-start gap-3 p-4 py-3">
              <span
                aria-hidden
                className="mt-0.5 size-2 shrink-0 rounded-full bg-brand-soft"
              />
              <p className="min-w-0 flex-1 text-sm leading-relaxed text-foreground/90">
                {item.title}
              </p>
              <time className="shrink-0 text-xs text-tertiary">
                {item.timestamp}
              </time>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function activityHeading(role: Role): string {
  const heading: Record<Role, string> = {
    seeker: "Recent Activity",
    recruiter: "Recent Applications",
    admin: "Recent Payments & Registrations",
  }
  return heading[role]
}

function firstName(name: string, email: string): string {
  const source = name || email
  return source.split(" ")[0] ?? source
}
