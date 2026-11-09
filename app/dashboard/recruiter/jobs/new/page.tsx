"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Briefcase, Building2, DollarSign, Mail, MapPin } from "lucide-react"

import { createJob } from "@/lib/jobs"

const jobSchema = z.object({
  title: z.string().min(2, "Job title must be at least 2 characters").max(100),
  company: z.string().min(1, "Company is required"),
  description: z
    .string()
    .min(20, "Please provide a more detailed job description"),
  location: z.string().optional(),
  employmentType: z.enum([
    "full-time",
    "part-time",
    "contract",
    "internship",
    "freelance",
  ]),
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

const EMPLOYMENT_TYPES: {
  value: JobFormValues["employmentType"]
  label: string
}[] = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "freelance", label: "Freelance" },
]

export default function AddJobPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

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
    setIsSubmitting(true)
    setError("")
    try {
      await createJob(values)
      setSubmitted(true)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create job. Try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Job Posted</h1>
          <p className="text-muted-foreground">
            Your job listing is live and ready to receive applications.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Job created successfully</CardTitle>
            <CardDescription>
              You can manage this job from the Manage Jobs page.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-end">
            <Button onClick={() => setSubmitted(false)}>
              Post another job
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Add a Job</h1>
        <p className="text-muted-foreground">
          Publish a new job posting to start receiving applications.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Job Posting</CardTitle>
          <CardDescription>
            Fill in the details below to create your job listing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {error && (
              <div className="col-span-full rounded-md bg-red-500/10 p-3 text-center text-sm font-medium text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
            <div className="col-span-full">
              <div className="mb-2 flex items-center gap-2">
                <Briefcase className="size-4 text-muted-foreground" />
                <label
                  className="text-sm font-medium text-foreground"
                  htmlFor="title"
                >
                  Job Title
                </label>
              </div>
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
              <div className="mb-2 flex items-center gap-2">
                <Building2 className="size-4 text-muted-foreground" />
                <label
                  className="text-sm font-medium text-foreground"
                  htmlFor="company"
                >
                  Company
                </label>
              </div>
              <Input
                id="company"
                defaultValue={form.getValues("company")}
                {...form.register("company")}
              />
              {form.formState.errors.company && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.company.message}
                </p>
              )}
            </div>

            <div className="col-span-full">
              <div className="mb-2 flex items-center gap-2">
                <MapPin className="size-4 text-muted-foreground" />
                <label
                  className="text-sm font-medium text-foreground"
                  htmlFor="location"
                >
                  Location
                </label>
              </div>
              <Input
                id="location"
                placeholder="e.g. New York, NY or Remote"
                {...form.register("location")}
              />
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2">
                <DollarSign className="size-4 text-muted-foreground" />
                <label
                  className="text-sm font-medium text-foreground"
                  htmlFor="employmentType"
                >
                  Employment Type
                </label>
              </div>
              <Controller
                control={form.control}
                name="employmentType"
                defaultValue="full-time"
                render={({ field }) => (
                  <Select
                    id="employmentType"
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select employment type">
                        {field.value}
                      </SelectValue>
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
            </div>

            <div className="col-span-full">
              <div className="mb-2 flex items-center gap-2">
                <Mail className="size-4 text-muted-foreground" />
                <label
                  className="text-sm font-medium text-foreground"
                  htmlFor="description"
                >
                  Job Description
                </label>
              </div>
              <textarea
                id="description"
                rows={6}
                placeholder="Responsibilities, requirements, benefits..."
                {...form.register("description")}
                className="h-32 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
              />
              {form.formState.errors.description && (
                <p className="mt-1 text-xs text-destructive">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Category
              </label>
              <Input
                id="category"
                placeholder="e.g. Engineering, Design, Marketing"
                {...form.register("category")}
              />
            </div>

            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 gap-4">
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
              </div>
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

            <Button
              type="submit"
              disabled={isSubmitting}
              className="col-span-full sm:col-span-2 lg:col-span-3"
            >
              {isSubmitting ? "Posting..." : "Publish Job"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
