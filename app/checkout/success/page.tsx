"use client"

import Link from "next/link"
import { ArrowRight, ShieldCheck } from "lucide-react"

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[#08080a] font-body">
      <main className="relative flex min-h-189.75 items-center justify-center overflow-hidden px-6 py-24">
        {/* Decorative background element */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 size-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1e3a8a] blur-[120px]"
          aria-hidden
        />

        {/* Section - Success Card */}
        <section className="relative w-full max-w-lg rounded-xl border border-white/[0.07] bg-[#141418] px-10.25 pt-10.25 pb-11.25 shadow-[0_25px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.035)]">
          <div
            className="pointer-events-none absolute -top-14 left-1/2 h-10 w-102 -translate-x-1/2 rounded-full bg-[#5c53fe]/30 blur-[20px]"
            aria-hidden
          />

          {/* Checkmark Icon */}
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#10b981]/20 shadow-[0_0_0_4px_rgba(16,185,129,0.05)]">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              aria-hidden
            >
              <path
                d="M8 17.5L13.5 23L24 10.5"
                stroke="#10b981"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Status Badge */}
          <div className="mt-3 flex justify-center">
            <span className="flex h-5 items-center rounded-full border border-[#3b82f6]/20 bg-[#3b82f6]/10 px-2.5 text-[11px] leading-4 font-medium tracking-[0.04em] text-[#60a5fa]">
              UPGRADE SUCCESSFUL
            </span>
          </div>

          {/* Heading */}
          <h1 className="mt-4 text-center text-[22px] leading-7 font-semibold tracking-[-0.018em] text-[#ededef]">
            Welcome to Hireloop Pro
          </h1>

          {/* Description */}
          <div className="mt-5 text-center">
            <p className="text-[16px] leading-6 text-[#9ca3af]">
              Your payment of $20.00 was received perfectly.
            </p>
            <p className="mt-4 text-[16px] leading-6 text-[#9ca3af]">
              All advanced premium recruiting modules are unlocked on your
              account. You may need to re-authenticate to see the effect.
            </p>
          </div>

          {/* Session Verification Box */}
          <div className="mt-10.25 flex h-14.25 items-center justify-between gap-4 rounded-xl border border-[#1f2937] bg-black px-4">
            <div className="flex items-center gap-3">
              <ShieldCheck
                className="size-5 text-[#6b7280]"
                strokeWidth={1.67}
              />
              <span className="text-[13px] leading-5 font-medium tracking-[-0.005em] text-[#a0a0ab]">
                Session ID Verified
              </span>
            </div>
            <span className="rounded bg-[#1f2937] px-2 py-1 font-code text-[11px] leading-3.75 text-[#9ca3af]">
              cs_test_a1046jTBJCi0x9B…
            </span>
          </div>

          {/* Action Button */}
          <Link
            href="/dashboard"
            className="mt-8 flex h-13 items-center justify-center gap-2 rounded-xl bg-white text-[14px] leading-5 font-semibold tracking-[-0.005em] text-black transition-colors hover:bg-[#f4f4f5]"
          >
            Go to Workspace Dashboard
            <ArrowRight className="size-3.75" strokeWidth={1.67} />
          </Link>
        </section>
      </main>
    </div>
  )
}
