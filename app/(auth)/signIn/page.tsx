"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  FiBriefcase,
  FiArrowRight,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { authClient } from "@/lib/auth-client"
import { getAuthErrorMessage } from "@/lib/auth-errors"
import { dashboardRootForRole, isRole, type Role } from "@/lib/navigation"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const { data, error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      })

      if (error) {
        setError(
          getAuthErrorMessage(error.code, error.message) ||
            "Invalid email or password."
        )
        return
      }

      if (data) {
        const role: Role =
          typeof data.user.role === "string" && isRole(data.user.role)
            ? data.user.role
            : "seeker"
        router.push(dashboardRootForRole(role))
        router.refresh()
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    setError("")
    setIsLoading(true)

    try {
      const { error } = await authClient.signIn.social({ provider })

      if (error) {
        setError(
          getAuthErrorMessage(error.code, error.message) ||
            "Failed to sign in with provider."
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-50 p-4 font-sans dark:bg-[#050505]">
      {/* Background Glow Effects */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-100 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4a35ea]/10 blur-[100px] dark:bg-[#4a35ea]/20 dark:blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 z-0 h-75 w-100 rounded-full bg-[#10a5c4]/10 blur-[80px] dark:blur-[100px]" />

      {/* Sign-In Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white/70 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#0a0a0c]/80 dark:shadow-2xl">
        {/* Header / Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/5">
            <FiBriefcase className="h-6 w-6 text-[#4a35ea]" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Sign in to your HireLoop account
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-500/10 p-3 text-center text-sm font-medium text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="ml-1 text-xs font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <div className="relative flex items-center">
              <FiMail className="absolute left-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-[#4a35ea]/50 focus:ring-1 focus:ring-[#4a35ea]/50 focus:outline-none dark:border-white/10 dark:bg-[#141417] dark:text-white dark:placeholder:text-gray-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="ml-1 flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#4a35ea] transition-colors hover:text-[#3824d6] dark:hover:text-white"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative flex items-center">
              <FiLock className="absolute left-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pr-10 pl-10 text-sm text-gray-900 transition-all placeholder:text-gray-400 focus:border-[#4a35ea]/50 focus:ring-1 focus:ring-[#4a35ea]/50 focus:outline-none dark:border-white/10 dark:bg-[#141417] dark:text-white dark:placeholder:text-gray-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 flex h-5 w-5 items-center justify-center text-gray-400 transition-colors hover:text-gray-600 focus:outline-none dark:text-gray-500 dark:hover:text-gray-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <FiEyeOff className="h-4 w-4" />
                ) : (
                  <FiEye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#4a35ea] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#5b45ff] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Signing in..." : "Sign In"}
            {!isLoading && <FiArrowRight className="h-4 w-4" />}
          </button>
        </form>

        {/* Separator */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
          <span className="text-[11px] font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
            or continue with
          </span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
        </div>

        {/* OAuth Integration */}
        <div className="flex w-full gap-3">
          <button
            type="button"
            onClick={() => handleOAuthSignIn("google")}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:text-gray-900 focus:ring-2 focus:ring-[#4a35ea]/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <FcGoogle className="h-4 w-4" />
            Google
          </button>

          <button
            type="button"
            onClick={() => handleOAuthSignIn("github")}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:text-gray-900 focus:ring-2 focus:ring-[#4a35ea]/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <FaGithub className="h-4 w-4 text-black dark:text-white" />
            GitHub
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/signUp"
            className="font-medium text-[#4a35ea] transition-colors hover:text-[#3824d6] dark:text-white dark:hover:text-[#4a35ea]"
          >
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  )
}
