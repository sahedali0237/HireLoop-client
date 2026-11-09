const API_URL = process.env.NEXT_PUBLIC_API_URL

export interface JobInput {
  title: string
  company: string
  description: string
  location?: string
  employmentType: string
  category?: string
  salaryMin?: string
  salaryMax?: string
  applicationEmail?: string
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
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  })

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(err.error || "Request failed")
  }

  return res.json()
}

export async function createJob(data: JobInput): Promise<JobResponse> {
  return apiRequest("/jobs", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function fetchJobs(): Promise<Job[]> {
  return apiRequest("/view-jobs")
}

export async function updateJob(
  id: string,
  data: Partial<JobInput>
): Promise<Job> {
  return apiRequest(`/jobs/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteJob(id: string): Promise<void> {
  await apiRequest(`/jobs/${id}`, { method: "DELETE" })
}
