import { redirect } from "next/navigation"

import { getSessionUser } from "@/lib/session"

export default async function DashboardPage() {
  const user = await getSessionUser()
  if (!user) redirect("/signIn")

  switch (user.role) {
    case "admin":
      redirect("/dashboard/admin")
    case "recruiter":
      redirect("/dashboard/recruiter")
    default:
      redirect("/dashboard/seeker")
  }
}
