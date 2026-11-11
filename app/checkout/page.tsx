"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, ChevronDown, CreditCard, EyeOff, Lock } from "lucide-react"

import { cn } from "@/lib/utils"

type Currency = "BDT" | "USD"

const PLAN = {
  name: "Hireloop Pro Plan",
  detail: "Access to all features",
  bdt: "BDT 2,553.33",
  usd: "$20.00",
  rate: "1 USD = 127.6665 BDT",
}

export default function CheckoutPage() {
  const router = useRouter()
  const [currency, setCurrency] = useState<Currency>("BDT")
  const [email, setEmail] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvc, setCvc] = useState("")
  const [cardholder, setCardholder] = useState("")
  const [saveInfo, setSaveInfo] = useState(true)
  const [paying, setPaying] = useState(false)

  const amount = currency === "BDT" ? PLAN.bdt : PLAN.usd

  const formatCardNumber = (value: string) =>
    value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim()

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4)
    if (digits.length <= 2) return digits
    return `${digits.slice(0, 2)} / ${digits.slice(2)}`
  }

  const handlePay = () => {
    if (paying) return
    setPaying(true)
    // The Stripe integration posts the session on the backend; the client
    // continues to the confirmation view of the same flow.
    router.push("/checkout/success")
  }

  const inputClasses =
    "h-[49px] w-full rounded-lg border border-[#2e2e33] bg-[#1b1b1c] px-4 text-[16px] text-white outline-none transition-colors placeholder:text-[#888891] focus:border-[#5b5b63]"
  const labelClasses =
    "text-[11px] leading-[15px] font-bold tracking-[0.5px] text-[#808089]"

  return (
    <div className="flex min-h-screen flex-col bg-[#08080a] font-body">
      {/* MainHeader */}
      <header className="border-b border-transparent">
        <div className="mx-auto flex h-24 max-w-328 items-center justify-between px-6 lg:px-20">
          <div className="flex items-center">
            <Link
              href="/"
              aria-label="Back to HireLoop"
              className="grid size-6 place-items-center text-[#a1a1aa] transition-colors hover:text-white"
            >
              <ArrowLeft className="size-4.5" strokeWidth={2} />
            </Link>
            <span className="ml-6 grid size-8 place-items-center rounded bg-[#27272a]">
              <Lock className="size-3.75 text-white" strokeWidth={1.67} />
            </span>
          </div>
          <span className="rounded bg-[#1e2329] px-2 py-0.5 text-[11px] leading-3.75 font-bold tracking-[1px] text-white">
            SANDBOX
          </span>
        </div>
      </header>

      {/* Main - CheckoutLayout */}
      <main className="flex-1">
        <div className="mx-auto grid max-w-300 gap-16 px-6 pb-24 lg:grid-cols-2 lg:px-6">
          {/* Section - LeftColumn (Order Summary) */}
          <section>
            <h2 className="text-[12px] leading-4 font-bold tracking-[1.2px] text-[#a1a1aa] uppercase">
              Choose a currency:
            </h2>
            <div className="mt-3 flex gap-4">
              <button
                type="button"
                onClick={() => setCurrency("BDT")}
                className={cn(
                  "flex h-15 flex-1 items-center rounded-lg px-4 text-left transition-colors",
                  currency === "BDT"
                    ? "border-2 border-white/20 bg-[#27272a]"
                    : "border border-[#2e2e33] hover:border-[#3f3f46]"
                )}
              >
                <Image
                  src="/images/hireloop2/flag-bd.png"
                  alt="Bangladesh"
                  width={24}
                  height={16}
                  className="h-4 w-6 rounded-sm object-cover"
                />
                <span
                  className={cn(
                    "ml-3 text-[16px] leading-6 font-semibold",
                    currency === "BDT" ? "text-white" : "text-[#a1a1aa]"
                  )}
                >
                  {PLAN.bdt}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setCurrency("USD")}
                className={cn(
                  "flex h-15 flex-1 items-center rounded-lg px-4 text-left transition-colors",
                  currency === "USD"
                    ? "border-2 border-white/20 bg-[#27272a]"
                    : "border border-[#2e2e33] hover:border-[#3f3f46]"
                )}
              >
                <Image
                  src="/images/hireloop2/flag-us.png"
                  alt="United States"
                  width={24}
                  height={16}
                  className="rounded-sm object-cover"
                />
                <span
                  className={cn(
                    "ml-3 text-[16px] leading-6 font-semibold",
                    currency === "USD" ? "text-white" : "text-[#a1a1aa]"
                  )}
                >
                  {PLAN.usd}
                </span>
              </button>
            </div>
            <p className="mt-4 text-[12px] leading-4 text-[#808089] italic">
              {PLAN.rate}
            </p>

            <div className="mt-8 border-t border-[#2e2e33] pt-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-[18px] leading-7 font-semibold text-white">
                    {PLAN.name}
                  </h3>
                  <p className="mt-1 text-[14px] leading-5 text-[#a1a1aa]">
                    {PLAN.detail}
                  </p>
                </div>
                <span className="text-[18px] leading-7 font-semibold text-white">
                  {amount}
                </span>
              </div>
            </div>
          </section>

          {/* Section - RightColumn (Payment Form) */}
          <section>
            {/* Button - Link Express Checkout */}
            <button
              type="button"
              onClick={handlePay}
              className="flex h-12 w-full items-center justify-center gap-1 rounded-lg bg-[#00d66f] transition-colors hover:bg-[#1be07d]"
            >
              <span className="text-[18px] leading-7 font-bold text-[#18181b]">
                link
              </span>
              <span className="mx-2 text-[16px] leading-6 text-[#18181b]/60">
                |
              </span>
              <span className="rounded bg-[#2400ff] px-1.5 py-0.5 text-[11px] leading-3.75 font-bold text-white">
                VISA
              </span>
              <span className="ml-2 text-[14px] leading-5 font-medium text-[#18181b]">
                4242
              </span>
            </button>

            {/* Divider */}
            <div className="mt-8 flex items-center gap-4">
              <span className="h-px flex-1 bg-[#2e2e33]" aria-hidden />
              <span className="text-[12px] leading-4 font-bold tracking-[1.2px] text-[#808089]">
                OR
              </span>
              <span className="h-px flex-1 bg-[#2e2e33]" aria-hidden />
            </div>

            {/* Contact Info */}
            <div className="mt-8">
              <h4 className="text-[14px] leading-5 font-semibold text-white">
                Contact information
              </h4>
              <div className="mt-3">
                <label
                  htmlFor="checkout-email"
                  className="text-[12px] leading-4 text-[#a1a1aa]"
                >
                  Email
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="email@example.com"
                  className={cn(inputClasses, "mt-1.5")}
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-6">
              <h4 className="text-[14px] leading-5 font-semibold text-white">
                Payment method
              </h4>
              <div className="mt-3 overflow-hidden rounded-lg border border-[#2e2e33]">
                {/* Card Header */}
                <div className="flex items-center gap-2 bg-[#27272a] px-4 py-4">
                  <CreditCard
                    className="size-5 text-[#a1a1aa]"
                    strokeWidth={1.67}
                  />
                  <span className="ml-2 text-[14px] leading-5 font-medium text-white">
                    Card
                  </span>
                </div>
                {/* Card Details */}
                <div className="flex flex-col gap-4 p-4">
                  <div>
                    <span className={labelClasses}>Card Information</span>
                    <div className="mt-1.5">
                      <div className="relative">
                        <input
                          value={cardNumber}
                          onChange={(event) =>
                            setCardNumber(formatCardNumber(event.target.value))
                          }
                          inputMode="numeric"
                          placeholder="1234 1234 1234 1234"
                          className={cn(
                            inputClasses,
                            "rounded-t-lg rounded-b-none border-b-0 pr-26"
                          )}
                        />
                        <span className="absolute top-1/2 right-4 flex -translate-y-1/2 items-center opacity-70">
                          <Image
                            src="/images/hireloop2/card-visa.png"
                            alt="Visa"
                            width={16}
                            height={16}
                          />
                          <Image
                            src="/images/hireloop2/card-mastercard.png"
                            alt="Mastercard"
                            width={16}
                            height={16}
                            className="ml-1"
                          />
                          <Image
                            src="/images/hireloop2/card-amex.png"
                            alt="Amex"
                            width={16}
                            height={16}
                            className="ml-1"
                          />
                          <Image
                            src="/images/hireloop2/card-discover.png"
                            alt="Discover"
                            width={16}
                            height={16}
                            className="ml-1"
                          />
                        </span>
                      </div>
                      <div className="flex">
                        <input
                          value={expiry}
                          onChange={(event) =>
                            setExpiry(formatExpiry(event.target.value))
                          }
                          inputMode="numeric"
                          placeholder="MM / YY"
                          className={cn(
                            inputClasses,
                            "w-1/2 rounded-none rounded-bl-lg border-r-0"
                          )}
                        />
                        <div className="relative w-1/2">
                          <input
                            value={cvc}
                            onChange={(event) =>
                              setCvc(
                                event.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 4)
                              )
                            }
                            inputMode="numeric"
                            placeholder="CVC"
                            className={cn(
                              inputClasses,
                              "rounded-t-none rounded-tl-none rounded-tr-none rounded-br-lg rounded-bl-none"
                            )}
                          />
                          <EyeOff
                            className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-[#71717a]"
                            strokeWidth={1.67}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className={labelClasses}>Cardholder Name</span>
                    <input
                      value={cardholder}
                      onChange={(event) => setCardholder(event.target.value)}
                      placeholder="Full name on card"
                      className={cn(inputClasses, "mt-1.5")}
                    />
                  </div>

                  <div>
                    <span className={labelClasses}>Country or Region</span>
                    <div className="relative mt-1.5">
                      <select
                        defaultValue="Bangladesh"
                        className={cn(
                          inputClasses,
                          "h-12.5 appearance-none pr-2.5"
                        )}
                      >
                        <option>Bangladesh</option>
                        <option>United States</option>
                        <option>United Kingdom</option>
                        <option>India</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-[#71717a]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Info Option */}
            <button
              type="button"
              onClick={() => setSaveInfo((prev) => !prev)}
              className="mt-6 flex w-full items-start gap-3 rounded-lg border border-[#2e2e33] p-4 text-left"
            >
              <span
                className={cn(
                  "mt-1 grid size-5 shrink-0 place-items-center rounded border transition-colors",
                  saveInfo
                    ? "border-[#2e2e33] bg-white"
                    : "border-[#2e2e33] bg-[#1b1b1c]"
                )}
              >
                {saveInfo && (
                  <span className="size-1.5 rounded-full bg-[#0b0b0c]" />
                )}
              </span>
              <span>
                <span className="block text-[14px] leading-5 font-semibold text-white">
                  Save my information for faster checkout
                </span>
                <span className="mt-0.5 block text-[12px] leading-[19.5px] text-[#808089]">
                  Pay securely on this site and everywhere Link is accepted.
                </span>
              </span>
            </button>

            {/* Pay Button */}
            <button
              type="button"
              onClick={handlePay}
              disabled={paying}
              className="mt-6 h-15 w-full rounded-lg bg-[#0070e0] text-[18px] leading-7 font-bold text-white shadow-[0_4px_6px_rgba(59,130,246,0.1),0_10px_15px_rgba(59,130,246,0.1)] transition-colors hover:bg-[#1a7ee6] disabled:opacity-70"
            >
              {paying ? "Processing…" : `Pay ${amount}`}
            </button>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2e2e33] px-6 py-12 lg:px-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center">
          <span className="text-[12px] leading-4 font-medium text-[#808089]">
            Powered by Stripe
          </span>
          <div className="mt-6 flex items-center text-[11px] leading-4 font-medium text-[#808089]">
            <Link href="#" className="hover:underline">
              Terms
            </Link>
            <span className="mx-3 h-3 w-px bg-[#2e2e33]" aria-hidden />
            <Link href="#" className="hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
