"use client"

// URL-driven filter dropdown.
// SSR pages can't use the FF Select directly because its onValueChange is a
// client callback. This component wraps Select and converts a value change
// into next/navigation (which preserves SSR-friendly URL filtering).
//
// Used by /legislators where PARTY (30+ options) and STATE (30+ options)
// don't fit as chip strips.

import { useRef } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { fontWeights } from "@/lib/font-weight"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

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
  const hiddenTriggerRef = useRef<HTMLButtonElement>(null)

  // Normalize value: null/undefined → "" (the "All" sentinel)
  const currentValue = value ?? ""
  const selected = options.find((o) => o.value === currentValue) ?? null
  const displayLabel = selected?.label ?? allLabel

  function navigate(next: string) {
    // "__all__" is the internal sentinel for the "All" option (Radix forbids value="")
    const real = next === "__all__" ? "" : next
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries(preserveParams)) {
      if (v != null && v !== "") params.set(k, v)
    }
    // empty string means "All" — don't add to params
    if (real) params.set(paramKey, real)
    const qs = params.toString()
    const base = window.location.pathname
    router.push(qs ? `${base}?${qs}` : base)
  }

  // All items with sequential indices (SelectItem requires explicit index prop)
  const allItems: Array<Option & { idx: number }> = [
    { value: "", label: allLabel, idx: 0 },
    ...options.map((opt, i) => ({ ...opt, idx: i + 1 })),
  ]

  return (
    <div className="filter-row" style={{ width: "fit-content" }}>
      {/* Label prefix ("Party", "State", etc.) */}
      <span className="label-prefix">{label}</span>

      <Select value={currentValue === "" ? "__all__" : currentValue} onValueChange={navigate}>
        {/*
          Hidden SelectTrigger: zero-size, aria-hidden. It owns the Radix open
          state, keyboard handling, and accessibility roles. Our visible button
          below delegates clicks to it.
        */}
        <SelectTrigger
          ref={hiddenTriggerRef}
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
          placeholder={allLabel}
        />

        {/*
          Visible custom trigger styled to match .filter-dropdown-btn.
          Clicking it programmatically clicks the hidden SelectTrigger so
          Radix manages all open/close/keyboard state — no useState needed.
        */}
        <button
          type="button"
          className={cn("filter-dropdown-btn", "inline-flex items-center justify-between gap-2")}
          style={{ minWidth: 130 }}
          onClick={() => hiddenTriggerRef.current?.click()}
          onKeyDown={(e) => {
            if (
              e.key === "Enter" ||
              e.key === " " ||
              e.key === "ArrowDown" ||
              e.key === "ArrowUp"
            ) {
              e.preventDefault()
              hiddenTriggerRef.current?.click()
            }
          }}
          aria-haspopup="listbox"
        >
          <span className="inline-flex items-center gap-[6px] min-w-0 flex-1">
            {selected?.color && (
              <span
                aria-hidden="true"
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
            className="shrink-0 transition-transform duration-[180ms] ease-[var(--ease-out-quart)]"
            style={{ color: "var(--text-tertiary)" }}
          />
        </button>

        <SelectContent>
          {allItems.map((item) => (
            <SelectItem
              key={item.value === "" ? "__all__" : item.value}
              value={item.value === "" ? "__all__" : item.value}
              index={item.idx}
            >
              {/*
                Render as string so SelectItem registers the label in labelMap
                (its useEffect checks `typeof children === "string"`). The swatch
                is rendered outside the string but inside a flex wrapper — however
                since SelectItem wraps children in <span className="flex-1 min-w-0 truncate">,
                we use a React fragment with the swatch as a sibling via a data-swatch
                span that lives BEFORE the text in a flex container.

                The outer span here IS the children prop — it's a React element, not
                a string, so labelMap won't auto-populate. We rely on our own
                displayLabel computation above for the trigger; labelMap is not needed.
              */}
              <span className="inline-flex items-center gap-[6px] min-w-0 w-full">
                {item.color && (
                  <span
                    aria-hidden="true"
                    className="inline-block rounded-full shrink-0"
                    style={{ width: 7, height: 7, background: item.color }}
                  />
                )}
                <span
                  className="truncate"
                  style={{ fontVariationSettings: fontWeights.medium }}
                >
                  {item.label}
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
