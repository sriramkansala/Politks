"use client"

// URL-driven filter dropdown.
// SSR pages can't use the FF Select directly because its onValueChange is a
// client callback. This component wraps Select and converts a value change
// into next/navigation (which preserves SSR-friendly URL filtering).
//
// Used by /legislators where PARTY (30+ options) and STATE (30+ options)
// don't fit as chip strips.

import { useRouter } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { fontWeights } from "@/lib/font-weight"
import { cn } from "@/lib/utils"

interface Option {
  value: string
  label: string
  /** Optional colored swatch shown before the label (e.g. party color). */
  color?: string
}

interface FilterDropdownProps {
  /** URL query-param key, e.g. "party" or "state". */
  paramKey: string
  /** Currently selected value (null/"" = "All"). */
  value: string | null | undefined
  /** Options to show (excluding "All" which is implicit). */
  options: Option[]
  /** Short label shown before the trigger value, e.g. "Party". */
  label: string
  /** Other query params to preserve in URL. */
  preserveParams?: Record<string, string | null | undefined>
  /** Placeholder shown when no value is selected. */
  allLabel?: string
}

export function FilterDropdown({
  paramKey,
  value,
  options,
  label,
  preserveParams = {},
  allLabel = "All",
}: FilterDropdownProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = options.find((o) => o.value === value) ?? null
  const displayLabel = selected?.label ?? allLabel

  function navigate(next: string | null) {
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries(preserveParams)) {
      if (v != null && v !== "") params.set(k, v)
    }
    if (next) params.set(paramKey, next)
    const qs = params.toString()
    const base = window.location.pathname
    router.push(qs ? `${base}?${qs}` : base)
    setOpen(false)
  }

  // Close on click outside
  useEffect(() => {
    if (!open) return
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDocClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDocClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <div className="filter-row" style={{ width: "fit-content", position: "relative" }} ref={ref}>
      <span className="label-prefix">{label}</span>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="filter-dropdown-btn"
        data-state={open ? "open" : "closed"}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-2 min-w-0">
          {selected?.color && (
            <span
              className="inline-block rounded-full shrink-0"
              style={{ width: 7, height: 7, background: selected.color }}
            />
          )}
          <span
            className="truncate"
            style={{ fontVariationSettings: fontWeights.medium }}
          >
            {displayLabel}
          </span>
        </span>
        <ChevronDown
          size={12}
          strokeWidth={1.5}
          className={cn(
            "shrink-0 ml-1.5 transition-transform duration-[180ms] ease-[var(--ease-out-quart)]",
            open && "rotate-180"
          )}
          style={{ color: "var(--text-tertiary)" }}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="filter-dropdown-menu"
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            zIndex: 50,
          }}
        >
          <li>
            <button
              type="button"
              role="option"
              aria-selected={!value}
              onClick={() => navigate(null)}
              className={cn(
                "filter-dropdown-item",
                !value && "is-active"
              )}
            >
              {allLabel}
            </button>
          </li>
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                role="option"
                aria-selected={value === opt.value}
                onClick={() => navigate(opt.value)}
                className={cn(
                  "filter-dropdown-item",
                  value === opt.value && "is-active"
                )}
              >
                {opt.color && (
                  <span
                    className="inline-block rounded-full shrink-0"
                    style={{ width: 7, height: 7, background: opt.color }}
                  />
                )}
                <span style={{ fontVariationSettings: fontWeights.medium }}>
                  {opt.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
