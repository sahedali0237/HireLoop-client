export { cn } from "cn"

/** Uppercase initials for avatar fallbacks (max 2 parts of name, else email). */
export function initials(name: string, email: string): string {
  const source = name || email
  return source
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}
