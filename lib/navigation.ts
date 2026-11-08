/**
 * HireLoop dashboard navigation model.
 *
 * Single source of truth for the user-role union typed from the design system
 * (`Hireloop 2.0` Figma file: sidebar `Role=Seeker|Recruiter|Admin` variants)
 * and the role-based navigation requirements in `Project requirements.md`.
 *
 * Keep this module client-safe (no server imports) so both RSC layouts and
 * client components can consume it.
 */

import {
  LayoutDashboard,
  Briefcase,
  Bookmark,
  FileText,
  Wallet,
  Settings,
  Building2,
  Users,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type Role = "seeker" | "recruiter" | "admin"

export const ROLES = [
  "seeker",
  "recruiter",
  "admin",
] as const satisfies readonly Role[]

export function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value)
}

/** Minimal, serialized snapshot of the Better Auth session used across the dashboard. */
export interface SessionUser {
  readonly id: string
  readonly name: string
  readonly email: string
  readonly image: string | null
  readonly role: Role
}

/** A single sidebar navigation destination. */
export interface NavItem {
  readonly label: string
  readonly href: string
  readonly icon: LucideIcon
}

/** Role-specific chrome copy and layout accents derived from the Figma sidebar variants. */
export interface RoleChrome {
  /** Human-readable role label shown in the header and identity card. */
  readonly label: string
  /** Sidebar tagline rendered under the logo. */
  readonly subtitle: string
  /** Identity-card plan/team badge text. */
  readonly badge: string
  /** Topbar search placeholder. */
  readonly searchPlaceholder: string
  /** Optional full-width white CTA pinned above the sidebar footer user card. */
  readonly cta?: NavItem
}

/**
 * Role-based navigation per sidebar variant:
 *  - Seeker:   Dashboard, Jobs, Saved Jobs, Applications, Billing, Settings
 *  - Recruiter: Dashboard, My Company, Manage Jobs, Applications, Settings
 *  - Admin:    Dashboard, Users, Companies, Jobs, Payments, Settings
 */
export const ROLE_NAVIGATION: Record<Role, readonly NavItem[]> = {
  seeker: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Jobs", href: "/dashboard/seeker/jobs", icon: Briefcase },
    { label: "Saved Jobs", href: "/dashboard/seeker/saved", icon: Bookmark },
    {
      label: "Applications",
      href: "/dashboard/seeker/applications",
      icon: FileText,
    },
    { label: "Billing", href: "/dashboard/seeker/billing", icon: Wallet },
    { label: "Settings", href: "/dashboard/seeker/settings", icon: Settings },
  ],
  recruiter: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    {
      label: "My Company",
      href: "/dashboard/recruiter/company",
      icon: Building2,
    },
    {
      label: "Manage Jobs",
      href: "/dashboard/recruiter/jobs",
      icon: Briefcase,
    },
    {
      label: "Applications",
      href: "/dashboard/recruiter/applications",
      icon: FileText,
    },
    {
      label: "Settings",
      href: "/dashboard/recruiter/settings",
      icon: Settings,
    },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Companies", href: "/dashboard/admin/companies", icon: Building2 },
    { label: "Jobs", href: "/dashboard/admin/jobs", icon: Briefcase },
    { label: "Payments", href: "/dashboard/admin/payments", icon: Wallet },
    { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
  ],
} as const

export const ROLE_CHROME: Record<Role, RoleChrome> = {
  seeker: {
    label: "Job Seeker",
    subtitle: "Seeker Portal",
    badge: "Free Plan",
    searchPlaceholder: "Search for opportunities...",
    cta: { label: "Upgrade Plan", href: "/pricing", icon: Briefcase },
  },
  recruiter: {
    label: "Recruiter",
    subtitle: "Recruiter Portal",
    badge: "Free Plan",
    searchPlaceholder: "Search applications, jobs, or talent...",
    cta: {
      label: "Post a Job",
      href: "/dashboard/recruiter/jobs/new",
      icon: Briefcase,
    },
  },
  admin: {
    label: "Admin",
    subtitle: "Admin Console",
    badge: "Staff Member",
    searchPlaceholder: "Search users, companies, or jobs...",
  },
} as const

export function navItemsForRole(role: Role): readonly NavItem[] {
  return ROLE_NAVIGATION[role]
}

export function chromeForRole(role: Role): RoleChrome {
  return ROLE_CHROME[role]
}
