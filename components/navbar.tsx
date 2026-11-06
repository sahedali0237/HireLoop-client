"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Menu, X, Sun, Moon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import Image from "next/image"

const navLinks = [
  { href: "/jobs", label: "Browse Jobs" },
  { href: "/company", label: "Company" },
  { href: "/pricing", label: "Pricing" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])
  const close = useCallback(() => setIsOpen(false), [])

  const { setTheme, resolvedTheme } = useTheme()
  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        toggle()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [toggle])

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="HireLoop"
            width={180}
            height={40}
            loading="eager"
            className="h-10 w-auto drop-shadow-md"
            style={{ width: "auto", height: "auto" }}
          />
        </Link>

        {/* Desktop navigation (hidden on sm devices) */}
        <div className="hidden items-center gap-8 sm:flex">
          <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <span className="h-4 w-px bg-border" />
            <Link
              href="/signIn"
              className="text-primary transition-colors hover:text-primary/80"
            >
              Sign In
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" className="px-4">
              Get Started
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={toggleTheme}
              aria-label={
                resolvedTheme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile hamburger toggle (sm device only) */}
        <div className="flex items-center gap-3 sm:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="transition-all duration-300"
          >
            {/* Hamburger <-> X morph (cross-fade) */}
            <div className="relative size-5">
              {!isOpen && (
                <Menu
                  className="absolute inset-0 size-5 transition-opacity duration-200 ease-in-out"
                  style={{ opacity: isOpen ? 0 : 1 }}
                />
              )}
              {isOpen && (
                <X
                  className="absolute inset-0 size-5 transition-opacity duration-200 ease-in-out"
                  style={{ opacity: isOpen ? 1 : 0 }}
                />
              )}
            </div>
          </Button>
        </div>
      </div>

      {/* Mobile menu panel (sm device only) */}
      {isOpen && (
        <div className="z-50 w-full animate-in border-b border-border bg-background duration-200 fade-in slide-in-from-top-2 sm:hidden">
          <div className="flex items-center justify-between px-4 py-4"></div>
          <div className="space-y-4 px-4 pb-6">
            <div className="space-y-2 text-sm font-medium text-muted-foreground">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  className="block transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/signIn"
                onClick={close}
                className="block text-primary transition-colors hover:text-primary/80"
              >
                Sign In
              </Link>
            </div>
            <div className="pt-4">
              <Link href="/signUp" className="w-full px-6 py-3">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
