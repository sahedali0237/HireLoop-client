/**
 * Maps better-auth error codes to friendly, user-facing messages.
 */
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "Invalid email or password. Please try again.",
  INVALID_PASSWORD: "Password must be at least 8 characters. Please try again.",
  USER_NOT_FOUND: "No account found with this email.",
  USER_ALREADY_EXISTS:
    "This email is already registered. Try signing in instead.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
    "This email is already registered. Try signing in instead.",
  FAILED_TO_CREATE_USER: "Couldn't create your account. Please try again.",
  EMAIL_PASSWORD_DISABLED: "Email & password sign in is disabled.",
  BANNED_USER: "This account has been banned. Contact support for help.",
  USER_EMAIL_NOT_VERIFIED: "Please verify your email before signing in.",
  SOCIAL_PROVIDER_NOT_FOUND:
    "This sign-in provider isn't configured yet. Use email & password.",
}

export function getAuthErrorMessage(
  code?: string | null,
  fallback?: string | null
): string {
  if (code && AUTH_ERROR_MESSAGES[code]) return AUTH_ERROR_MESSAGES[code]
  if (fallback) return fallback
  return "Something went wrong. Please try again."
}
