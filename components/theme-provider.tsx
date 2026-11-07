"use client"

import * as React from "react"

const STORAGE_KEY = "theme"
const MEDIA_QUERY = "(prefers-color-scheme: dark)"
const THEMES = ["light", "dark"]

type SystemTheme = "light" | "dark"

type ThemeStoreValue = {
  theme: string
  setTheme: (theme: string) => void
  resolvedTheme: SystemTheme | undefined
  systemTheme: SystemTheme | undefined
}

function getSystemTheme(): SystemTheme | undefined {
  if (typeof window === "undefined") return undefined
  return window.matchMedia(MEDIA_QUERY).matches ? "dark" : "light"
}

function getSnapshot(): string {
  let stored = "system"
  try {
    stored = localStorage.getItem(STORAGE_KEY) ?? "system"
  } catch {
    // localStorage can throw in private mode or when quota is exceeded
  }
  return `${stored};${getSystemTheme() ?? ""}`
}

function getServerSnapshot(): string {
  return "system;"
}

function parseSnapshot(snapshot: string): Omit<ThemeStoreValue, "setTheme"> {
  const [theme, system] = snapshot.split(";")
  const systemTheme =
    system === "light" || system === "dark" ? system : undefined
  const resolvedTheme =
    theme === "system"
      ? systemTheme
      : theme === "light" || theme === "dark"
        ? theme
        : undefined
  return { theme, systemTheme, resolvedTheme }
}

const changeListeners = new Set<() => void>()

function emitChange() {
  for (const listener of changeListeners) {
    listener()
  }
}

function subscribeChanges(callback: () => void) {
  changeListeners.add(callback)

  const media = window.matchMedia(MEDIA_QUERY)
  const onMediaChange = () => emitChange()
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      emitChange()
    }
  }

  media.addEventListener("change", onMediaChange)
  window.addEventListener("storage", onStorage)

  return () => {
    changeListeners.delete(callback)
    media.removeEventListener("change", onMediaChange)
    window.removeEventListener("storage", onStorage)
  }
}

function applyTheme(resolved: SystemTheme) {
  const classList = document.documentElement.classList
  classList.remove(...THEMES)
  classList.add(resolved)
  document.documentElement.style.colorScheme = resolved
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const snapshot = React.useSyncExternalStore(
    subscribeChanges,
    getSnapshot,
    getServerSnapshot
  )
  const state = parseSnapshot(snapshot)

  React.useEffect(() => {
    if (state.resolvedTheme) {
      applyTheme(state.resolvedTheme)
    }
  }, [state.resolvedTheme])

  const setTheme = React.useCallback((next: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // theme switching still works for the current session
    }
    const resolved =
      next === "light" || next === "dark" ? next : getSystemTheme()
    if (resolved === "light" || resolved === "dark") {
      applyTheme(resolved)
    }
    emitChange()
  }, [])

  const value = React.useMemo(() => ({ ...state, setTheme }), [state, setTheme])

  return (
    <ThemeProviderContext.Provider value={value}>
      <ThemeHotkey />
      {children}
    </ThemeProviderContext.Provider>
  )
}

const ThemeProviderContext = React.createContext<ThemeStoreValue>({
  theme: "system",
  setTheme: () => {},
  resolvedTheme: undefined,
  systemTheme: undefined,
})

function useTheme() {
  return React.useContext(ThemeProviderContext)
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (event.key?.toLowerCase() !== "d") {
        return
      }

      if (isTypingTarget(event.target)) {
        return
      }

      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [resolvedTheme, setTheme])

  return null
}

export { ThemeProvider, useTheme }
