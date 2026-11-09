"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Edit2, Plus, Trash2 } from "lucide-react"

import { deleteJob, fetchJobs, type Job, updateJob } from "@/lib/jobs"

const jobSchema = z.object({
  title: z.string().min(2, "Job title must be at least 2 characters").max(100),
  company: z.string().min(1, "Company is required"),
  description: z
    .string()
    .min(20, "Please provide a more detailed job description"),
  location: z.string().optional(),
  employmentType: z.string().min(1, "Employment type is required"),
  category: z.string().optional(),
  salaryMin: z
    .string()
    .refine(
      (value) => value === "" || /^\d+$/.test(value),
      "Enter a valid number"
    )
    .optional(),
  salaryMax: z
    .string()
    .refine(
      (value) => value === "" || /^\d+$/.test(value),
      "Enter a valid number"
    )
    .optional(),
  applicationEmail: z.string().email("Enter a valid email address").optional(),
})

type JobFormValues = z.infer<typeof jobSchema>

const EMPLOYMENT_TYPES = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "freelance", label: "Freelance" },
]

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

  const refreshJobs = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await fetchJobs()
      setJobs(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load jobs.")
    } finally {
      setLoading(false)
    }
  }

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
      setJobs((current) => current.filter((job) => job._id !== id))
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete job.")
    } finally {
      setDeletingId(null)
    }
  }

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      company: "",
      description: "",
      location: "",
      employmentType: "full-time",
      category: "",
      salaryMin: "",
      salaryMax: "",
      applicationEmail: "",
    },
  })

  async function onSubmit(values: JobFormValues) {
    if (!editingJob) return
    try {
      await updateJob(editingJob._id, values)
      setEditingJob(null)
      form.reset()
      await refreshJobs()
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
          jobs.map((job) => (
            <Card
              key={job._id}
              className="cursor-pointer rounded-lg border border-border bg-card p-4 shadow-sm"
            >
              <Link href={`/dashboard/recruiter/jobs/${job._id}`}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
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
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Dialog
                      open={editingJob !== null}
                      onOpenChange={(open) => {
                        if (!open) setEditingJob(null)
                      }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={deletingId === job._id}
                        onClick={(e) => {
                          e.stopPropagation()
                          form.reset({
                            title: job.title,
                            company: job.company,
                            description: job.description,
                            location: job.location ?? "",
                            employmentType: job.employmentType,
                            category: job.category ?? "",
                            salaryMin: job.salaryMin ?? "",
                            salaryMax: job.salaryMax ?? "",
                            applicationEmail: job.applicationEmail ?? "",
                          })
                          setEditingJob(job)
                        }}
                      >
                        <Edit2 className="mr-1 size-3.5 shrink-0" />
                        Edit
                      </Button>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Job</DialogTitle>
                          <DialogDescription>
                            Update the job posting details below.
                          </DialogDescription>
                        </DialogHeader>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="space-y-4"
                        >
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <label className="mb-2 block text-sm font-medium text-foreground">
                                Job Title
                              </label>
                              <Input
                                id="title"
                                placeholder="e.g. Senior Frontend Engineer"
                                {...form.register("title")}
                              />
                              {form.formState.errors.title && (
                                <p className="mt-1 text-xs text-destructive">
                                  {form.formState.errors.title.message}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="mb-2 block text-sm font-medium text-foreground">
                                Company
                              </label>
                              <Input
                                id="company"
                                {...form.register("company")}
                              />
                              {form.formState.errors.company && (
                                <p className="mt-1 text-xs text-destructive">
                                  {form.formState.errors.company.message}
                                </p>
                              )}
                            </div>
                            <div className="col-span-full">
                              <label className="mb-2 block text-sm font-medium text-foreground">
                                Location
                              </label>
                              <Input
                                id="location"
                                placeholder="e.g. New York, NY or Remote"
                                {...form.register("location")}
                              />
                            </div>
                            <div>
                              <label className="mb-2 block text-sm font-medium text-foreground">
                                Employment Type
                              </label>
                              <Select
                                id="employmentType"
                                value={form.getValues("employmentType")}
                                onValueChange={(value) =>
                                  form.setValue("employmentType", value ?? "")
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {EMPLOYMENT_TYPES.map((type) => (
                                    <SelectItem
                                      key={type.value}
                                      value={type.value}
                                    >
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="col-span-full">
                              <label className="mb-2 block text-sm font-medium text-foreground">
                                Description
                              </label>
                              <textarea
                                id="description"
                                rows={4}
                                {...form.register("description")}
                                className="w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
                              />
                              {form.formState.errors.description && (
                                <p className="mt-1 text-xs text-destructive">
                                  {form.formState.errors.description.message}
                                </p>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                  Category
                                </label>
                                <Input
                                  id="category"
                                  placeholder="e.g. Engineering"
                                  {...form.register("category")}
                                />
                              </div>
                              <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                  Salary Min
                                </label>
                                <Input
                                  id="salaryMin"
                                  type="number"
                                  placeholder="0"
                                  {...form.register("salaryMin")}
                                />
                                {form.formState.errors.salaryMin && (
                                  <p className="mt-1 text-xs text-destructive">
                                    {form.formState.errors.salaryMin.message}
                                  </p>
                                )}
                              </div>
                              <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                  Salary Max
                                </label>
                                <Input
                                  id="salaryMax"
                                  type="number"
                                  placeholder="0"
                                  {...form.register("salaryMax")}
                                />
                                {form.formState.errors.salaryMax && (
                                  <p className="mt-1 text-xs text-destructive">
                                    {form.formState.errors.salaryMax.message}
                                  </p>
                                )}
                              </div>
                              <div>
                                <label className="mb-2 block text-sm font-medium text-foreground">
                                  Application Email
                                </label>
                                <Input
                                  id="applicationEmail"
                                  type="email"
                                  placeholder="jobs@example.com"
                                  {...form.register("applicationEmail")}
                                />
                                {form.formState.errors.applicationEmail && (
                                  <p className="mt-1 text-xs text-destructive">
                                    {
                                      form.formState.errors.applicationEmail
                                        .message
                                    }
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <DialogFooter className="justify-end pt-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setEditingJob(null)
                                form.reset()
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              disabled={deletingId === job._id}
                              className="ml-2"
                            >
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
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
              </Link>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
