"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch — render nothing until mounted
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-lg",
          className
        )}
      />
    )
  }

  const isDark = resolvedTheme === "dark"

  function toggle() {
    // Add transitioning class for smooth crossfade, remove after transition
    document.documentElement.classList.add("transitioning")
    setTheme(isDark ? "light" : "dark")
    setTimeout(() => {
      document.documentElement.classList.remove("transitioning")
    }, 220)
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded-lg",
        "transition-colors duration-100",
        "hover:bg-[var(--ff-hover)] active:bg-[var(--ff-active)]",
        "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]",
        className
      )}
    >
      {isDark ? (
        <Sun size={14} strokeWidth={1.5} />
      ) : (
        <Moon size={14} strokeWidth={1.5} />
      )}
    </button>
  )
}
