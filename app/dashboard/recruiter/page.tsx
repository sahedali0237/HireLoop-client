"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Briefcase } from "lucide-react"

export default function RecruiterDashboard() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Recruiter Portal
          </h1>
          <p className="text-muted-foreground">
            Manage your company, jobs, and applications.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            nativeButton={false}
            render={
              <Link
                href="/dashboard/recruiter/jobs/new"
                className="flex items-center justify-center gap-2"
              />
            }
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Briefcase className="size-4 shrink-0" />
            Post a Job
          </Button>
          <Button variant="outline" className="w-auto">
            Manage Jobs
          </Button>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-card p-6">
        <p className="text-muted-foreground">
          Post a job to start receiving applications. Manage your listings from
          the Manage Jobs page.
        </p>
      </div>
    </div>
  )
}
