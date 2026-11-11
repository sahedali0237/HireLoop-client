const API_URL = process.env.NEXT_PUBLIC_API_URL

export interface JobInput {
  title: string
  company: string
  description: string
  location?: string
  employmentType?: string
  category?: string
  salaryMin?: string | number
  salaryMax?: string | number
  applicationEmail?: string
  /** Job type as stored on the server (e.g. "Full-time"). */
  jobType?: string
  requirements?: string[]
  responsibilities?: string[]
  benefits?: string[]
  experience?: string
  date?: string
}

export interface Job extends JobInput {
  _id: string
  createdAt?: string
}

export interface JobResponse {
  message: string
  jobId: string
}

/** Thin wrapper around the backend API that throws on non-ok responses. */
async function apiRequest(path: string, options: RequestInit = {}) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000)

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options.headers },
      signal: controller.signal,
    })

    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { error?: string }
      throw new Error(err.error || "Request failed")
    }

    return res.json()
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function createJob(data: JobInput): Promise<JobResponse> {
  return apiRequest("/jobs", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

/**
 * The backend can return the same job twice (e.g. re-seeded documents).
 * React keys are derived from _id, so duplicates must be removed first or
 * the UI crashes with "two children with the same key".
 */
function dedupeJobs(jobs: Job[]): Job[] {
  const seen = new Set<string>()
  const unique: Job[] = []
  for (const job of jobs) {
    if (seen.has(job._id)) continue
    seen.add(job._id)
    unique.push(job)
  }
  return unique
}

export async function fetchJobs(): Promise<Job[]> {
  const jobs = (await apiRequest("/view-jobs")) as Job[]
  return dedupeJobs(jobs)
}

/** Fetch public jobs with optional title search and job-type filters. */
export async function fetchPublicJobs(params?: {
  search?: string
  jobType?: string | string[]
}): Promise<Job[]> {
  const qs = new URLSearchParams()
  if (params?.search) qs.set("search", params.search)
  if (params?.jobType) {
    const types = Array.isArray(params.jobType)
      ? params.jobType
      : String(params.jobType).split(",")
    for (const type of types) {
      if (type) qs.append("jobType", type)
    }
  }
  const queryString = qs.toString()
  const jobs = (await apiRequest(
    `/view-jobs${queryString ? `?${queryString}` : ""}`
  )) as Job[]
  return dedupeJobs(jobs)
}

export async function fetchJob(id: string): Promise<Job> {
  return apiRequest(`/view-jobs/${id}`)
}

export async function updateJob(
  id: string,
  data: Partial<JobInput>
): Promise<Job> {
  return apiRequest(`/jobs/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export async function deleteJob(id: string): Promise<void> {
  await apiRequest(`/jobs/${id}`, { method: "DELETE" })
}
