"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  ArrowRight,
  Banknote,
  Bookmark,
  Briefcase,
  Check,
  Clock,
  ExternalLink,
  Heart,
  Laptop,
  MapPin,
  PiggyBank,
  Sun,
} from "lucide-react"

import { fetchJob, type Job } from "@/lib/jobs"
import {
  DEMO_JOB_DETAIL,
  DEMO_COMPANY_OVERVIEW,
  type DemoJob,
} from "@/lib/demo-jobs"
import { cn } from "@/lib/utils"
import { useSaveApplyGuard } from "@/hooks/use-save-apply-guard"

function formatSalaryCompact(value?: string | number) {
  const n = typeof value === "string" ? Number(value) : value
  if (!n || Number.isNaN(n)) return null
  return `$${Math.round(n / 1000)}k`
}

const BENEFIT_ICONS = [Heart, PiggyBank, Laptop, Sun]

/* ------------------------------------------------------------------ */
/* Shared pieces                                                       */
/* ------------------------------------------------------------------ */
function BentoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col rounded-xl border border-white/[0.07] bg-[#141418] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.035)]">
      {icon}
      <span className="mt-4 text-[13px] leading-5 font-medium tracking-[-0.005em] text-[#a0a0ab] uppercase">
        {label}
      </span>
      <span className="mt-1 truncate text-[16px] leading-[27px] font-semibold text-[#ededef]">
        {value}
      </span>
    </div>
  )
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-[30px]">
      <span
        className="mt-2 size-1.5 shrink-0 rounded-full bg-white"
        aria-hidden
      />
      <span className="text-[13px] leading-5 tracking-[-0.005em] text-[#a0a0ab]">
        {children}
      </span>
    </li>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[22px] leading-7 font-semibold tracking-[-0.018em] text-[#ededef]">
      {children}
    </h3>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function JobDetailPage({
  params,
}: {
  params: Promise<{ jobId?: string; id?: string; _id?: string }>
}) {
  // Works whether the route folder is [jobId], [id] or [_id]
  const resolvedParams = use(params)
  const jobId =
    resolvedParams.jobId ?? resolvedParams.id ?? resolvedParams._id ?? ""
  const [job, setJob] = useState<Job | null>(null)
  const [demoMode, setDemoMode] = useState(false)
  const [loading, setLoading] = useState(() => Boolean(jobId))
  const [error, setError] = useState("")
  const [saved, setSaved] = useState(false)
  const router = useRouter()
  const { requireSeeker, canSaveApply } = useSaveApplyGuard()

  useEffect(() => {
    let ignore = false
    ;(async () => {
      setLoading(true)
      setError("")
      try {
        const data = await fetchJob(jobId)
        if (!ignore) {
          setJob(data)
          setDemoMode(false)
        }
      } catch {
        if (!ignore) {
          // API unreachable → show the design demo job so the page can be
          // reviewed pixel-perfect against the Figma frame.
          setJob(DEMO_JOB_DETAIL)
          setDemoMode(true)
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    })()

    return () => {
      ignore = true
    }
  }, [jobId])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080a] font-body">
        <div className="mx-auto max-w-[1240px] px-6 pt-6 pb-24">
          <div className="h-[155px] animate-pulse rounded-xl bg-[#141418]" />
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[121px] animate-pulse rounded-xl bg-[#141418]"
              />
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-6 lg:flex-row">
            <div className="h-[900px] flex-1 animate-pulse rounded-xl bg-[#141418]" />
            <div className="h-[520px] w-full animate-pulse rounded-xl bg-[#141418] lg:w-[397px]" />
          </div>
        </div>
      </div>
    )
  }

  if (error && !job) {
    return (
      <div className="min-h-screen bg-[#08080a] font-body">
        <div className="mx-auto max-w-[1240px] px-6 pt-24 pb-24 text-center">
          <div className="rounded-md border border-red-500/20 bg-red-500/10 p-3 text-sm font-medium text-red-400">
            {error}
          </div>
          <Link
            href="/jobs"
            className="mt-6 inline-flex h-[47px] items-center rounded-lg bg-[#fafafa] px-4 text-[16px] font-medium text-[#0b0b0c]"
          >
            Back to Browse Jobs
          </Link>
        </div>
      </div>
    )
  }

  if (!job) return null

  const demo = job as DemoJob
  const logo = demo.logo ?? DEMO_COMPANY_OVERVIEW.logo
  const cover = demo.cover ?? DEMO_COMPANY_OVERVIEW.cover
  const salary =
    job.salaryMin || job.salaryMax
      ? `${formatSalaryCompact(job.salaryMin) ?? "—"} – ${formatSalaryCompact(job.salaryMax) ?? "—"}`
      : "—"
  const jobType = job.jobType || job.employmentType || "—"
  const location = job.location || "—"
  const experience = job.experience || "Not specified"
  const applicationEmail = job.applicationEmail

  return (
    <div className="min-h-screen bg-[#08080a] font-body">
      <div className="mx-auto max-w-[1240px] px-6 pt-6 pb-24">
        {/* Header Section */}
        <section className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-[#141418] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.035)] sm:p-8">
          {/* Decorative blur (Figma: "Overlay+Blur") */}
          <div
            className="pointer-events-none absolute -top-32 right-16 size-64 rounded-full bg-white/[0.05] blur-[64px]"
            aria-hidden
          />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-col gap-6 sm:flex-row sm:items-center">
              <div className="grid size-20 shrink-0 place-items-center rounded-xl border border-white/[0.07] bg-[#1a1a1f] p-1">
                <Image
                  src={logo}
                  alt={job.company}
                  width={70}
                  height={70}
                  className="size-[70px] rounded-lg object-cover"
                />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-[32px] leading-10 font-semibold tracking-[-0.025em] text-[#ededef]">
                  {job.title}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-6">
                  <span className="text-[22px] leading-7 font-semibold tracking-[-0.018em] text-[#a0a0ab]">
                    {job.company}
                  </span>
                  <span
                    className="hidden size-1 rounded-full bg-[#8e9192] sm:block"
                    aria-hidden
                  />
                  <span className="flex items-center gap-2 text-[16px] leading-[27px] font-semibold text-[#22c55e]">
                    <Check className="size-4" strokeWidth={3} />
                    Verified Employer
                  </span>
                </div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                aria-label={saved ? "Unsave job" : "Save job"}
                aria-disabled={!canSaveApply}
                onClick={() => {
                  requireSeeker(() => {
                    setSaved((prev) => !prev)
                  })
                }}
                className={cn(
                  "grid size-12 place-items-center rounded-lg border border-white/[0.07] bg-[#222228] transition-colors hover:bg-[#2a2a30]",
                  saved && "bg-white/[0.08]"
                )}
              >
                <Bookmark
                  className={cn(
                    "h-[18px] w-3.5 text-[#e5e2e3]",
                    saved && "fill-[#8f88ff] text-[#8f88ff]"
                  )}
                />
              </button>
              <button
                type="button"
                aria-disabled={!canSaveApply}
                onClick={() => {
                  requireSeeker(() => {
                    if (applicationEmail) {
                      window.location.href = `mailto:${applicationEmail}?subject=Application: ${encodeURIComponent(
                        job.title ?? ""
                      )}`
                    } else {
                      router.push("/signIn")
                    }
                  })
                }}
                className="inline-flex h-[47px] items-center justify-center gap-1 rounded-lg bg-[#fafafa] px-4 text-[16px] leading-6 font-medium text-[#0b0b0c] shadow-[0_1px_2px_rgba(0,0,0,0.35)] transition-colors hover:bg-white"
              >
                Apply Now
              </button>
            </div>
          </div>
        </section>

        {/* Container: main content + sidebar */}
        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          {/* Main Content Area */}
          <div className="min-w-0 flex-1">
            {/* Bento Info Grid */}
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              <BentoCard
                icon={<Banknote className="size-5 text-[#c4c7c8]" />}
                label="Salary Range"
                value={salary}
              />
              <BentoCard
                icon={<MapPin className="size-5 text-[#c4c7c8]" />}
                label="Location"
                value={location}
              />
              <BentoCard
                icon={<Clock className="size-5 text-[#c4c7c8]" />}
                label="Job Type"
                value={jobType}
              />
              <BentoCard
                icon={<Briefcase className="size-4 text-[#c4c7c8]" />}
                label="Experience"
                value={experience}
              />
            </div>

            {/* Content Sections */}
            <div className="mt-6 rounded-xl border border-white/[0.07] bg-[#141418] p-8 shadow-[0_1px_2px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.035)]">
              {/* Job Description */}
              <section>
                <SectionHeading>Job Description</SectionHeading>
                <p className="mt-6 text-[13px] leading-5 tracking-[-0.005em] whitespace-pre-line text-[#a0a0ab]">
                  {job.description || "No description provided."}
                </p>
              </section>

              {job.responsibilities && job.responsibilities.length > 0 && (
                <section className="mt-6 border-t border-white/[0.07] pt-6">
                  <SectionHeading>Responsibilities</SectionHeading>
                  <ul className="mt-6 flex flex-col gap-3">
                    {job.responsibilities.map((item, index) => (
                      <Bullet key={index}>{item}</Bullet>
                    ))}
                  </ul>
                </section>
              )}

              {((job.requirements && job.requirements.length > 0) ||
                (job.responsibilities && job.responsibilities.length > 0)) && (
                <section className="mt-6 border-t border-white/[0.07] pt-6">
                  <SectionHeading>Requirements</SectionHeading>
                  {job.requirements && job.requirements.length > 0 && (
                    <>
                      <div className="mt-6 flex flex-wrap gap-2">
                        {job.requirements.slice(0, 4).map((item, index) => (
                          <span
                            key={index}
                            className="flex h-9 items-center gap-2 rounded-lg border border-white/[0.07] bg-[#1a1a1f] px-3.5 text-[13px] leading-5 font-medium tracking-[-0.005em] text-[#ededef]"
                          >
                            <Check className="size-3.5 text-[#a1a4aa]" />
                            {item}
                          </span>
                        ))}
                      </div>
                      <ul className="mt-6 flex flex-col gap-3">
                        {job.requirements.slice(4).map((item, index) => (
                          <Bullet key={index}>{item}</Bullet>
                        ))}
                      </ul>
                    </>
                  )}
                </section>
              )}

              {job.benefits && job.benefits.length > 0 && (
                <section className="mt-6 border-t border-white/[0.07] pt-6">
                  <SectionHeading>Benefits</SectionHeading>
                  <div className="mt-6 grid gap-2 sm:grid-cols-2">
                    {job.benefits.slice(0, 4).map((benefit, index) => {
                      const Icon = BENEFIT_ICONS[index % BENEFIT_ICONS.length]
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-6 rounded-lg p-3"
                        >
                          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/10">
                            <Icon className="size-5 text-white" />
                          </span>
                          <span className="text-[16px] leading-[27px] font-semibold text-[#ededef]">
                            {benefit}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* Aside - Sidebar */}
          <aside className="w-full shrink-0 lg:w-[397px]">
            <div className="rounded-xl border border-white/[0.07] bg-[#141418] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.035)]">
              <h3 className="text-[22px] leading-7 font-semibold tracking-[-0.018em] text-[#ededef]">
                Company Overview
              </h3>
              <div className="relative mt-3 overflow-hidden rounded-xl">
                <Image
                  src={cover}
                  alt={job.company}
                  width={512}
                  height={512}
                  className="h-[204px] w-full object-cover"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#08080a]/80 via-transparent to-transparent"
                  aria-hidden
                />
              </div>
              <div className="mt-6">
                <div className="flex items-center justify-between border-t border-white/[0.07] px-3 py-3 first:border-t-0">
                  <span className="text-[13px] leading-5 tracking-[-0.005em] text-[#a0a0ab] uppercase">
                    Size
                  </span>
                  <span className="text-[16px] leading-6 text-[#ededef]">
                    {DEMO_COMPANY_OVERVIEW.size}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-white/[0.07] px-3 py-3">
                  <span className="text-[13px] leading-5 tracking-[-0.005em] text-[#a0a0ab] uppercase">
                    Industry
                  </span>
                  <span className="text-right text-[16px] leading-6 text-[#ededef]">
                    {job.category || DEMO_COMPANY_OVERVIEW.industry}
                  </span>
                </div>
              </div>
              <a
                href={DEMO_COMPANY_OVERVIEW.website}
                className="mt-6 flex h-11 items-center justify-center gap-2 rounded-[10px] border border-white/[0.07] bg-white/[0.04] text-[13px] leading-5 font-medium tracking-[-0.005em] text-[#ededef] transition-colors hover:bg-white/[0.07]"
              >
                Visit Website
                <ExternalLink className="size-3.5 text-[#a0a0ab]" />
              </a>
            </div>
          </aside>
        </div>

        {demoMode && (
          <p className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-center text-[13px] text-amber-400/90">
            Showing the design demo job — the jobs service is unreachable.
          </p>
        )}

        <div className="mt-8 flex justify-center">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-[#a0a0ab] transition-colors hover:text-[#ededef]"
          >
            <ArrowRight className="size-4 rotate-180" />
            Back to all jobs
          </Link>
        </div>
      </div>
    </div>
  )
}
