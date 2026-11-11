"use client"

import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import {
  Banknote,
  Bookmark,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Search,
  Zap,
} from "lucide-react"

import { fetchPublicJobs, type Job } from "@/lib/jobs"
import { DEMO_JOBS, type DemoJob } from "@/lib/demo-jobs"
import { cn } from "@/lib/utils"
import { useSaveApplyGuard } from "@/hooks/use-save-apply-guard"

const DEFAULT_JOB_TYPES = ["Full-time", "Contract", "Freelance"]
const DEMO_LOGOS = [
  "/images/hireloop2/company-techflow.png",
  "/images/hireloop2/company-fingrid.png",
  "/images/hireloop2/company-creativestudio.png",
  "/images/hireloop2/company-healthai.png",
]

type SortOption = "Most Recent" | "Most Relevant" | "Highest Salary" | "Oldest"

const SORT_OPTIONS: SortOption[] = [
  "Most Recent",
  "Most Relevant",
  "Highest Salary",
  "Oldest",
]

function formatSalaryCompact(value?: string | number) {
  const n = typeof value === "string" ? Number(value) : value
  if (!n || Number.isNaN(n)) return null
  return `$${Math.round(n / 1000)}k`
}

/** Deterministic logo for live jobs that don't carry one. */
function logoFor(job: Job, index: number) {
  if ((job as DemoJob).logo) return (job as DemoJob).logo
  let hash = 0
  const key = job.company || job.title || String(index)
  for (let i = 0; i < key.length; i++)
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  return DEMO_LOGOS[hash % DEMO_LOGOS.length]
}

function formatCount(n: number) {
  if (n >= 1000) return `${(Math.round((n / 1000) * 10) / 10).toFixed(1)}k`
  return String(n)
}

/* ------------------------------------------------------------------ */
/* Filter checkbox (Figma: 20x20 r4, checked = white with dark check) */
/* ------------------------------------------------------------------ */
function FilterCheckbox({
  checked,
  onChange,
  label,
  count,
}: {
  checked: boolean
  onChange: () => void
  label: string
  count?: number | null
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-1 select-none">
      <span
        className={cn(
          "grid size-5 place-items-center rounded border transition-colors",
          checked ? "border-primary bg-primary" : "border-border bg-secondary"
        )}
      >
        {checked && (
          <Check className="size-3.5 text-primary-foreground" strokeWidth={3} />
        )}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span className="text-[13px] leading-5 font-medium tracking-[-0.005em] text-muted-foreground">
        {label}
      </span>
      {count != null && (
        <span className="ml-auto text-[12px] leading-5 text-muted-foreground">
          {formatCount(count)}
        </span>
      )}
    </label>
  )
}

/* ------------------------------------------------------------------ */
/* Job card (Figma: "Article - Job Card")                              */
/* ------------------------------------------------------------------ */
function JobCard({
  job,
  index,
  requireSeeker,
  canSaveApply,
}: {
  job: Job
  index: number
  requireSeeker: (onSuccess: () => void) => void
  canSaveApply: boolean
}) {
  const [saved, setSaved] = useState(false)
  const salary =
    job.salaryMin || job.salaryMax
      ? `${formatSalaryCompact(job.salaryMin) ?? "—"} - ${formatSalaryCompact(job.salaryMax) ?? "—"}`
      : null
  const jobType = job.jobType || job.employmentType || "Full-time"
  const isRemote = (job.location || "").toLowerCase().includes("remote")
  const isHot = Number(job.salaryMax) >= 200000

  return (
    <article className="group relative flex gap-5 rounded-xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-border">
      <Link
        href={`/jobs/${job._id}`}
        className="absolute inset-0"
        aria-label={job.title}
      />
      <div className="grid size-16 shrink-0 place-items-center rounded-lg border border-border bg-secondary">
        <Image
          src={logoFor(job, index)}
          alt={job.company}
          width={40}
          height={40}
          className="size-10 rounded object-cover"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-[22px] leading-7 font-semibold tracking-[-0.018em] text-foreground">
              {job.title}
            </h3>
            <p className="mt-2 truncate text-[16px] leading-[27px] font-semibold text-muted-foreground">
              {job.company} • {job.location || "Remote"}
            </p>
          </div>
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
              "relative z-10 grid size-10 shrink-0 place-items-center rounded-lg transition-colors",
              saved ? "bg-secondary" : "hover:bg-secondary"
            )}
          >
            <Bookmark
              className={cn(
                "h-[18px] w-3.5",
                saved
                  ? "fill-brand-soft text-brand-soft"
                  : "text-muted-foreground"
              )}
            />
          </button>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {salary && (
            <span className="flex h-[30px] items-center gap-2 rounded-lg border border-border bg-secondary px-3 text-[13px] leading-5 font-medium tracking-[-0.005em] text-foreground">
              <Banknote className="size-4 text-foreground" />
              {salary}
            </span>
          )}
          <span className="flex h-[30px] items-center gap-2 rounded-lg border border-border bg-secondary px-3 text-[13px] leading-5 font-medium tracking-[-0.005em] text-foreground">
            <Clock className="size-3.5 text-foreground" />
            {jobType}
          </span>
          {isRemote && (
            <span className="flex h-[30px] items-center gap-2 rounded-md border border-[#22c55e] bg-[#22c55e]/10 px-3 text-[13px] leading-5 font-medium tracking-[-0.005em] text-[#22c55e]">
              <Zap className="size-3.5" />
              Easy Apply
            </span>
          )}
          {isHot && (
            <span className="flex h-[30px] items-center gap-2 rounded-md border border-[#f59e0b] bg-[#f59e0b]/10 px-3 text-[13px] leading-5 font-medium tracking-[-0.005em] text-[#f59e0b]">
              <Flame className="size-3.5" />
              Hot Job
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

/* ------------------------------------------------------------------ */
/* Sort dropdown (Figma: "Dropdown menu · Sort jobs")                  */
/* ------------------------------------------------------------------ */
function SortDropdown({
  value,
  onChange,
}: {
  value: SortOption
  onChange: (next: SortOption) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node))
        setOpen(false)
    }
    document.addEventListener("mousedown", onPointerDown)
    return () => document.removeEventListener("mousedown", onPointerDown)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-9 items-center justify-between gap-2 rounded-lg border border-border bg-secondary pr-3 pl-3 text-[13px] leading-5 font-medium tracking-[-0.005em] text-foreground transition-colors hover:bg-secondary"
      >
        {value}
        <ChevronDown className="size-4 text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute right-0 z-40 mt-1 w-[220px] rounded-xl border border-border bg-popover p-1.5 shadow-lg">
          <div className="flex flex-col gap-0.5">
            {SORT_OPTIONS.map((option) => {
              const selected = option === value
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option)
                    setOpen(false)
                  }}
                  className={cn(
                    "flex h-9 items-center justify-between gap-2 rounded-md px-2.5 text-left text-[14px] leading-none transition-colors",
                    selected
                      ? "bg-secondary font-medium text-primary-foreground"
                      : "font-normal text-muted-foreground hover:bg-secondary"
                  )}
                >
                  {option}
                  {selected && (
                    <Check className="size-4 text-brand-soft" strokeWidth={2} />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Fallbacks                                                           */
/* ------------------------------------------------------------------ */
function BrowseJobsFallback() {
  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <div className="mx-auto max-w-[1280px] px-6 pt-[17px] pb-24">
        <div className="h-[109px] animate-pulse rounded-xl bg-card" />
        <div className="mt-6 h-6 w-72 animate-pulse rounded bg-card" />
        <div className="mt-6 space-y-6">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[180px] animate-pulse rounded-xl bg-card"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
function BrowseJobsClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [search, setSearch] = useState(searchParams.get("search") ?? "")
  const [jobTypes, setJobTypes] = useState<string[]>(
    searchParams.getAll("jobType")
  )
  const [sort, setSort] = useState<SortOption>("Most Recent")
  const [jobs, setJobs] = useState<Job[]>([])
  const [demoMode, setDemoMode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)

  const { requireSeeker, canSaveApply } = useSaveApplyGuard()

  // Keep the URL in sync with the current filters (shareable links).
  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    jobTypes.forEach((type) => params.append("jobType", type))
    const next = params.toString()
    const current = window.location.search.slice(1)
    if (next !== current) {
      router.replace(`/jobs?${next}`, { scroll: false })
    }
  }, [search, jobTypes, router])

  // Fetch jobs whenever filters change.
  useEffect(() => {
    let ignore = false
    ;(async () => {
      setLoading(true)
      setError("")
      try {
        const data = await fetchPublicJobs({
          search: search || undefined,
          jobType: jobTypes.length > 0 ? jobTypes : undefined,
        })
        if (!ignore) {
          setJobs(data)
          setDemoMode(false)
        }
      } catch {
        if (!ignore) {
          // API unreachable → fall back to the design demo listings.
          let data: Job[] = DEMO_JOBS
          if (search) {
            const q = search.toLowerCase()
            data = data.filter(
              (j) =>
                j.title.toLowerCase().includes(q) ||
                j.company.toLowerCase().includes(q)
            )
          }
          if (jobTypes.length > 0) {
            data = data.filter((j) =>
              jobTypes.includes(j.jobType || j.employmentType || "")
            )
          }
          setJobs(data)
          setDemoMode(true)
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    })()

    return () => {
      ignore = true
    }
  }, [search, jobTypes])

  const toggleJobType = (type: string) => {
    setPage(1)
    setJobTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  // Sorted + paginated list.
  const PER_PAGE = 4
  const sortedJobs = useMemo(() => {
    const list = [...jobs]
    switch (sort) {
      case "Most Recent":
        list.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        )
        break
      case "Oldest":
        list.sort(
          (a, b) =>
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime()
        )
        break
      case "Highest Salary":
        list.sort((a, b) => Number(b.salaryMax || 0) - Number(a.salaryMax || 0))
        break
      default:
        break
    }
    return list
  }, [jobs, sort])

  const pageCount = Math.max(1, Math.ceil(sortedJobs.length / PER_PAGE))
  const visibleJobs = sortedJobs.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  // Filter group types: design defaults ∪ types present in the data.
  const filterTypes = useMemo(() => {
    const set = new Set(DEFAULT_JOB_TYPES)
    jobs.forEach((job) => {
      const t = job.jobType || job.employmentType
      if (t) set.add(t)
    })
    return [...set].slice(0, 5)
  }, [jobs])

  const countsByType = useMemo(() => {
    const counts: Record<string, number> = {}
    if (demoMode) {
      // Design copy counts for the demo state.
      return { "Full-time": 1248, Contract: 432, Freelance: 156 }
    }
    jobs.forEach((job) => {
      const t = job.jobType || job.employmentType
      if (t) counts[t] = (counts[t] || 0) + 1
    })
    return counts
  }, [jobs, demoMode])

  const hasActiveFilters = search.length > 0 || jobTypes.length > 0

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <div className="mx-auto max-w-[1280px] px-6 pt-[17px] pb-20">
        {/* Section - Search & Quick Filters */}
        <form
          onSubmit={(event) => event.preventDefault()}
          className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center"
        >
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => {
                setPage(1)
                setSearch(event.target.value)
              }}
              placeholder="Search by job title, keywords..."
              className="h-[58px] w-full rounded-lg border border-border bg-input pr-4 pl-[44px] text-[14px] text-foreground outline-none placeholder:text-[13px] placeholder:text-muted-foreground focus:border-ring"
            />
          </div>
          <button
            type="submit"
            className="h-[59px] shrink-0 rounded-lg bg-primary px-6 text-[16px] leading-[27px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Search Jobs
          </button>
        </form>

        {demoMode && (
          <p className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-center text-[13px] text-amber-400/90">
            Showing design demo listings — the jobs service is unreachable.
          </p>
        )}
        {error && !demoMode && (
          <p className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-center text-[13px] text-red-400">
            {error}
          </p>
        )}

        {/* Container: sidebar + main listing */}
        <div className="mt-6 flex flex-col gap-8 lg:flex-row">
          {/* Aside - Sidebar Filters */}
          <aside className="w-full shrink-0 lg:w-[296px]">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-[22px] leading-7 font-semibold tracking-[-0.018em] text-foreground">
                Filters
              </h2>
              <div className="mt-6">
                <h3 className="text-[16px] leading-[27px] font-semibold text-foreground">
                  Job Type
                </h3>
                <div className="mt-3 flex flex-col gap-1">
                  {filterTypes.map((type) => (
                    <FilterCheckbox
                      key={type}
                      label={type}
                      count={countsByType[type] ?? null}
                      checked={jobTypes.includes(type)}
                      onChange={() => toggleJobType(type)}
                    />
                  ))}
                </div>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("")
                    setJobTypes([])
                    setPage(1)
                  }}
                  className="mt-6 text-[13px] font-medium text-brand hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </aside>

          {/* Section - Main Job Listing */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-[22px] leading-7 font-semibold tracking-[-0.018em] text-foreground">
                {loading
                  ? "Finding jobs…"
                  : `Found ${sortedJobs.length.toLocaleString()} Professional ${
                      sortedJobs.length === 1 ? "Job" : "Jobs"
                    }`}
              </h2>
              <div className="flex items-center gap-3">
                <span className="text-[13px] leading-5 font-medium tracking-[-0.005em] text-muted-foreground">
                  Sort by:
                </span>
                <SortDropdown
                  value={sort}
                  onChange={(next) => {
                    setPage(1)
                    setSort(next)
                  }}
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {loading ? (
                <>
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-[180px] animate-pulse rounded-xl bg-card"
                    />
                  ))}
                </>
              ) : visibleJobs.length === 0 ? (
                <div className="rounded-xl border border-border bg-card p-10 text-center">
                  <Search className="mx-auto mb-3 size-6 text-muted-foreground" />
                  <p className="text-[15px] text-muted-foreground">
                    {hasActiveFilters
                      ? "No jobs match your filters."
                      : "No jobs available right now."}
                  </p>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("")
                        setJobTypes([])
                        setPage(1)
                      }}
                      className="mt-4 rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                visibleJobs.map((job, index) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    index={index}
                    requireSeeker={requireSeeker}
                    canSaveApply={canSaveApply}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            {!loading && sortedJobs.length > 0 && (
              <nav className="mt-6 flex items-center justify-center gap-1.5 px-6">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="grid size-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="size-4" />
                </button>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    className={cn(
                      "grid size-8 place-items-center rounded-lg text-[13px] leading-5 transition-colors",
                      n === page
                        ? "bg-primary font-medium text-primary-foreground"
                        : "border border-border text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    {n}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={page === pageCount}
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  className="grid size-8 place-items-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight className="size-4" />
                </button>
              </nav>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BrowseJobsPage() {
  // `useSearchParams()` suspends during static prerendering (the query string
  // isn't known at build time), so the client logic is revealed behind a
  // Suspense boundary. The fallback is shown in the static HTML and the real
  // content hydrates on the client.
  return (
    <Suspense fallback={<BrowseJobsFallback />}>
      <BrowseJobsClient />
    </Suspense>
  )
}
