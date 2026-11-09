"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Edit2, Plus, Trash2 } from "lucide-react"

import { deleteJob, fetchJobs, type Job, updateJob } from "@/lib/jobs"
import {
  EditJobDialog,
  type JobEditFormValues,
} from "@/components/recruiter/EditJobDialog"

function formatDate(value?: string) {
  if (!value) return "-"
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    let ignore = false

    ;(async () => {
      setLoading(true)
      setError("")
      try {
        const data = await fetchJobs()
        if (!ignore) setJobs(data)
      } catch (err) {
        if (!ignore)
          setError(err instanceof Error ? err.message : "Failed to load jobs.")
      } finally {
        if (!ignore) setLoading(false)
      }
    })()

    return () => {
      ignore = true
    }
  }, [])

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return
    setDeletingId(id)
    try {
      await deleteJob(id)
      // Remove the deleted job from local state only. Do not refetch the
      // deleted job's id, and do not touch the detail-page query for it.
      setJobs((current) => current.filter((job) => job._id !== id))
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete job.")
    } finally {
      setDeletingId(null)
    }
  }

  async function handleSave(values: JobEditFormValues) {
    if (!editingJob) return
    const editingId = editingJob._id
    try {
      await updateJob(editingId, values)
      // Update the card in place instead of refetching the whole list or
      // navigating anywhere. No navigation occurs on Save.
      setJobs((current) =>
        current.map((job) =>
          job._id === editingId ? { ...job, ...values } : job
        )
      )
      setEditingJob(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update job.")
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Manage Jobs
          </h1>
          <p className="text-muted-foreground">
            Create, edit, and close your job postings.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-muted-foreground">Loading jobs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Manage Jobs
          </h1>
          <p className="text-muted-foreground">
            Create, edit, and close your job postings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => router.push("/dashboard/recruiter/jobs/new")}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4 shrink-0" />
            Post a Job
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-500/10 p-3 text-center text-sm font-medium text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {jobs.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-6 text-center">
            <p className="text-muted-foreground">
              No jobs posted yet. Post your first job to get started.
            </p>
          </div>
        ) : (
          <>
            {jobs.map((job) => (
              <Card
                key={job._id}
                className="cursor-pointer rounded-lg border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  {/* Info area — the only part that links to the description page. */}
                  <div className="min-w-0 flex-1">
                    <Link href={`/dashboard/recruiter/jobs/${job._id}`}>
                      <div className="mb-1 flex flex-wrap items-baseline gap-2">
                        <h3 className="truncate text-lg font-semibold text-foreground md:max-w-[220px]">
                          {job.title}
                        </h3>
                        <span className="rounded bg-muted/50 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          {job.employmentType}
                        </span>
                      </div>
                      <div className="mb-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span className="truncate md:max-w-[150px]">
                          {job.company}
                        </span>
                        <span aria-hidden>•</span>
                        <span className="truncate md:max-w-[160px]">
                          {job.location || "Remote"}
                        </span>
                        {job.category && (
                          <>
                            <span aria-hidden>•</span>
                            <span className="truncate">{job.category}</span>
                          </>
                        )}
                      </div>
                      {(job.salaryMin || job.salaryMax) && (
                        <p className="mb-1 text-sm text-foreground">
                          {job.salaryMin && job.salaryMax
                            ? `$${job.salaryMin} - $${job.salaryMax}`
                            : job.salaryMin
                              ? `$${job.salaryMin}+`
                              : `up to $${job.salaryMax}`}
                        </p>
                      )}
                      {job.applicationEmail && (
                        <p className="mb-1 text-sm text-muted-foreground">
                          Apply: {job.applicationEmail}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-muted-foreground">
                        Posted {formatDate(job.createdAt)}
                      </p>
                      {job.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                          {job.description}
                        </p>
                      )}
                    </Link>
                  </div>

                  {/* Action buttons live outside the Link so their clicks (and
                      the portaled Dialog below) can never trigger the card's
                      description-page navigation. */}
                  <div className="flex shrink-0 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={deletingId === job._id}
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingJob(job)
                      }}
                    >
                      <Edit2 className="mr-1 size-3.5 shrink-0" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={deletingId === job._id}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(job._id)
                      }}
                    >
                      {deletingId === job._id ? (
                        "Deleting..."
                      ) : (
                        <>
                          <Trash2 className="mr-1 size-3.5 shrink-0" />
                          Delete
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </>
        )}
      </div>

      {/* Edit dialog rendered outside any Link / card so dialog interactions
          (inputs, Save, Cancel) can never bubble into a card link. */}
      <EditJobDialog
        open={editingJob !== null}
        onOpenChange={(open) => {
          if (!open) setEditingJob(null)
        }}
        job={editingJob}
        onSave={handleSave}
      />
    </div>
  )
}
