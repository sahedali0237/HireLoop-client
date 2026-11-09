"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Edit2, Trash2, ArrowLeft, Building2 } from "lucide-react"

import { deleteJob, fetchJob, type Job, updateJob } from "@/lib/jobs"

function formatDate(value?: string) {
  if (!value) return "-"
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const numberOrEmpty = z
  .string()
  .refine(
    (value) => value === "" || /^\d+$/.test(value),
    "Enter a valid number"
  )
  .optional()

const jobEditSchema = z.object({
  title: z.string().min(2, "Job title must be at least 2 characters").max(100),
  company: z.string().min(1, "Company is required"),
  description: z
    .string()
    .min(20, "Please provide a more detailed job description"),
  location: z.string().optional(),
  employmentType: z.string().min(1, "Employment type is required"),
  category: z.string().optional(),
  salaryMin: numberOrEmpty,
  salaryMax: numberOrEmpty,
  // Allow an empty string so jobs without an email can still be saved
  applicationEmail: z
    .string()
    .email("Enter a valid email address")
    .or(z.literal(""))
    .optional(),
})

type JobEditFormValues = z.infer<typeof jobEditSchema>

const EMPLOYMENT_TYPES = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "freelance", label: "Freelance" },
]

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
  const [saveError, setSaveError] = useState("") // failed to save (shown in dialog)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const router = useRouter()

  const form = useForm<JobEditFormValues>({
    resolver: zodResolver(jobEditSchema),
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

  useEffect(() => {
    if (hasMissingJobId) return

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
  }, [hasMissingJobId, jobId])

  function openEditDialog() {
    if (!job) return
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
    setSaveError("")
    setEditOpen(true)
  }

  function closeEditDialog() {
    if (saving) return
    setEditOpen(false)
    setSaveError("")
  }

  async function onSubmit(values: JobEditFormValues) {
    setSaving(true)
    setSaveError("")
    try {
      // Commit the changes to the server (PATCH /jobs/:id)
      await updateJob(jobId, values)
      // Reload the saved job so the page shows exactly what the server has
      const updated = await fetchJob(jobId)
      setJob(updated)
      setEditOpen(false)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to update job.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this job?")) return
    setDeleting(true)
    setActionError("")
    try {
      await deleteJob(jobId)
      router.push("/dashboard/recruiter/jobs")
    } catch (err) {
      setDeleting(false)
      setActionError(
        err instanceof Error ? err.message : "Failed to delete job."
      )
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
            <Button variant="outline" type="button" onClick={openEditDialog}>
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

      <Dialog
        open={editOpen}
        onOpenChange={(open) => {
          if (!open) closeEditDialog()
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
            <DialogDescription>
              Update the job posting details below.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {saveError && (
              <div className="rounded-md bg-red-500/10 p-3 text-center text-sm font-medium text-red-600 dark:text-red-400">
                {saveError}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
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
                <label
                  htmlFor="company"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Company
                </label>
                <Input id="company" {...form.register("company")} />
                {form.formState.errors.company && (
                  <p className="mt-1 text-xs text-destructive">
                    {form.formState.errors.company.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
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
                <Controller
                  control={form.control}
                  name="employmentType"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value ?? "")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {EMPLOYMENT_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.employmentType && (
                  <p className="mt-1 text-xs text-destructive">
                    {form.formState.errors.employmentType.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
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

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  Category
                </label>
                <Input
                  id="category"
                  placeholder="e.g. Engineering"
                  {...form.register("category")}
                />
              </div>

              <div>
                <label
                  htmlFor="applicationEmail"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
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
                    {form.formState.errors.applicationEmail.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="salaryMin"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
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
                <label
                  htmlFor="salaryMax"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
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
            </div>

            <DialogFooter className="justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeEditDialog}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
