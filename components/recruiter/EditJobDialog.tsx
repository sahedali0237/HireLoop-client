"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
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
import { toast } from "react-toastify"

import { type Job } from "@/lib/jobs"

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
  applicationEmail: z
    .string()
    .email("Enter a valid email address")
    .or(z.literal(""))
    .optional(),
})

export type JobEditFormValues = z.infer<typeof jobEditSchema>

// Values must exactly match the stored employmentType on Job (case, spaces,
// hyphens) so the controlled Select shows the current value instead of its
// placeholder.
const EMPLOYMENT_TYPES = [
  { value: "Full-time", label: "Full-time" },
  { value: "Part-time", label: "Part-time" },
  { value: "Contract", label: "Contract" },
  { value: "Internship", label: "Internship" },
  { value: "Freelance", label: "Freelance" },
]

interface EditJobDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  job: Job | null
  onSave: (values: JobEditFormValues) => Promise<void>
}

export function EditJobDialog({
  open,
  onOpenChange,
  job,
  onSave,
}: EditJobDialogProps) {
  const form = useForm<JobEditFormValues>({
    resolver: zodResolver(jobEditSchema),
    defaultValues: {
      title: "",
      company: "",
      description: "",
      location: "",
      employmentType: "Full-time",
      category: "",
      salaryMin: "",
      salaryMax: "",
      applicationEmail: "",
    },
  })

  // Reset the form whenever the dialog opens for a (new) job so the controlled
  // fields re-initialize from the selected job.
  useEffect(() => {
    if (!open || !job) return
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
  }, [open, job, form])

  async function onSubmit(values: JobEditFormValues) {
    try {
      await onSave(values)
      toast.success("Job updated successfully")
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update job.")
    }
  }

  if (!open) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* max-h-[90vh] caps the dialog to the viewport; gap-0 + overflow-hidden
          on DialogContent plus a scrolling form (flex-1 overflow-y-auto)
          keeps the header and footer pinned on short screens. */}
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="shrink-0 border-b px-6 py-4">
          <DialogTitle>Edit Job</DialogTitle>
          <DialogDescription>
            Update the job posting details below.
          </DialogDescription>
        </DialogHeader>

        <form
          id="edit-job-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-4"
        >
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

            <div className="col-span-full">
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
              {form.formState.errors.location && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.location.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Employment Type
              </label>
              <Select
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
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.employmentType && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.employmentType.message}
                </p>
              )}
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
                {form.formState.errors.category && (
                  <p className="mt-1 text-xs text-destructive">
                    {form.formState.errors.category.message}
                  </p>
                )}
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
                    {form.formState.errors.applicationEmail.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>

        <DialogFooter className="shrink-0 border-t px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={form.formState.isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-job-form"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Saving…" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
