"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Edit2, Trash2, ArrowLeft, Building2 } from "lucide-react"

import { deleteJob, fetchJob, type Job, updateJob } from "@/lib/jobs"
import {
  EditJobDialog,
  type JobEditFormValues,
} from "@/components/recruiter/EditJobDialog"
import { toast } from "react-toastify"

function formatDate(value?: string) {
  if (!value) return "-"
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ jobId?: string; id?: string; _id?: string }>
}) {
  // Works whether the route folder is [jobId], [id] or [_id]
  const resolvedParams = use(params)
  const jobId =
    resolvedParams.jobId ?? resolvedParams.id ?? resolvedParams._id ?? ""
  const hasMissingJobId = !jobId || jobId === "undefined"
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(() => !hasMissingJobId)
  const [loadError, setLoadError] = useState(() =>
    hasMissingJobId ? "Job id is missing." : ""
  ) // failed to load the job
  const [actionError, setActionError] = useState("") // failed to delete
  const [deleting, setDeleting] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  // True while this page's job has been deleted. Prevents the fetch effect
  // below from re-fetching (and 404-ing on) a now-deleted job id.
  const [deleted, setDeleted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (hasMissingJobId || deleted) return

    let ignore = false
    ;(async () => {
      setLoading(true)
      setLoadError("")
      try {
        const data = await fetchJob(jobId)
        if (!ignore) setJob(data)
      } catch (err) {
        if (!ignore)
          setLoadError(
            err instanceof Error ? err.message : "Failed to load job."
          )
      } finally {
        if (!ignore) setLoading(false)
      }
    })()

    return () => {
      ignore = true
    }
  }, [hasMissingJobId, jobId, deleted])

  async function handleSave(values: JobEditFormValues) {
    try {
      // Commit the changes to the server (PATCH /jobs/:id)
      await updateJob(jobId, values)
      // Reload the saved job so the page shows exactly what the server has
      const updated = await fetchJob(jobId)
      setJob(updated)
      toast.success("Job updated successfully")
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update job."
      toast.error(message)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this job?")) return
    // Mark the job as deleted so the fetch effect above never refetches this
    // (now-deleted) id, then navigate away FIRST. Use replace so the Back
    // button cannot return to a detail page for a deleted job (which would 404
    // and show "Job not found").
    setDeleted(true)
    setDeleting(true)
    setActionError("")
    try {
      await deleteJob(jobId)
      toast.success("Job deleted successfully")
      router.replace("/dashboard/recruiter/jobs")
    } catch (err) {
      setDeleted(false)
      setDeleting(false)
      const message =
        err instanceof Error ? err.message : "Failed to delete job."
      setActionError(message)
      toast.error(message)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Job Details
          </h1>
          <p className="text-muted-foreground">Loading the job posting…</p>
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Job Details
          </h1>
        </div>
        <div className="rounded-md bg-red-500/10 p-3 text-center text-sm font-medium text-red-600 dark:text-red-400">
          {loadError}
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/recruiter/jobs")}
        >
          <ArrowLeft className="mr-1 size-4 shrink-0" />
          Back to Manage Jobs
        </Button>
      </div>
    )
  }

  if (!job) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Job Details
          </h1>
          <p className="text-muted-foreground">
            View and manage this job posting.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/recruiter/jobs")}
          >
            <ArrowLeft className="mr-1 size-4 shrink-0" />
            Back to Manage Jobs
          </Button>
        </div>
      </div>

      {actionError && (
        <div className="rounded-md bg-red-500/10 p-3 text-center text-sm font-medium text-red-600 dark:text-red-400">
          {actionError}
        </div>
      )}

      <Card className="rounded-lg border border-border bg-card p-6">
        <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
          <div>
            <CardTitle className="text-2xl font-semibold">
              {job.title}
            </CardTitle>
            <span className="mt-2 inline-block rounded bg-muted/50 px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {job.employmentType}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Company
              </p>
              <p className="text-sm text-foreground">{job.company}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Location
              </p>
              <p className="text-sm text-foreground">
                {job.location || "Remote"}
              </p>
            </div>
            {job.category && (
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  Category
                </p>
                <p className="text-sm text-foreground">{job.category}</p>
              </div>
            )}
            {(job.salaryMin || job.salaryMax) && (
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  Salary
                </p>
                <p className="text-sm text-foreground">
                  {job.salaryMin && job.salaryMax
                    ? `$${job.salaryMin} - $${job.salaryMax}`
                    : job.salaryMin
                      ? `$${job.salaryMin}+`
                      : `up to $${job.salaryMax}`}
                </p>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Apply
              </p>
              <p className="text-sm text-foreground">
                {job.applicationEmail ? (
                  <a
                    href={`mailto:${job.applicationEmail}`}
                    className="text-primary underline underline-offset-4 hover:text-primary/80"
                  >
                    {job.applicationEmail}
                  </a>
                ) : (
                  <span className="text-muted-foreground">Not provided</span>
                )}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Posted
              </p>
              <p className="text-sm text-foreground">
                {formatDate(job.createdAt)}
              </p>
            </div>
          </div>

          <div className="border-t border-border pt-2">
            <p className="mb-2 text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Description
            </p>
            <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
              {job.description || "No description provided."}
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Building2 className="size-3 shrink-0" />
            <span>{job.company}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setEditOpen(true)}
            >
              <Edit2 className="mr-1 size-3.5 shrink-0" />
              Edit
            </Button>
            <Button
              variant="destructive"
              type="button"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                "Deleting…"
              ) : (
                <>
                  <Trash2 className="mr-1 size-3.5 shrink-0" />
                  Delete
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>

      <EditJobDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        job={job}
        onSave={handleSave}
      />
    </div>
  )
}
