"use client"

import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

import { useSeekerSession } from "./use-seeker-session"

/**
 * Guards save / apply actions so they only run when the visitor is signed in
 * AND their role is "seeker".
 *
 * `requireSeeker(onSuccess)` runs `onSuccess` only when both criteria are met.
 * Otherwise it shows a toast and (when signed out) redirects to /signIn.
 */
export function useSaveApplyGuard() {
  const { isAuthenticated, role, canSaveApply } = useSeekerSession()
  const router = useRouter()

  const requireSeeker = (onSuccess: () => void): void => {
    if (!isAuthenticated) {
      toast.error("Please sign in to save or apply to jobs.")
      router.push("/signIn")
      return
    }
    if (role !== "seeker") {
      toast.error("Only job seekers can save and apply to jobs.")
      return
    }
    onSuccess()
  }

  return { requireSeeker, canSaveApply, isAuthenticated, role }
}
