"use client"

/**
 * SegmentedControl — single primitive for every "pick one of N options" toggle.
 *
 *  - shadcn-aligned, accessible (radiogroup semantics)
 *  - Fluid Functionalism: `motion.div` underlay with `layoutId` for the slide
 *  - One visual language: neutral active pill (`var(--bg-elevated-3)`),
 *    primary text on active, tertiary on inactive
 *
 *    <SegmentedControl
 *      value={mode}
 *      onValueChange={setMode}
 *      options={[
 *        { value: "area", label: "Area" },
 *        { value: "bar",  label: "Stacked Bar" },
 *      ]}
 *    />
 */

import { useId, useMemo, type ReactNode } from "react"
import { motion, LayoutGroup } from "framer-motion"
import { cn } from "@/lib/utils"
import { springs } from "@/lib/springs"
import { fontWeights } from "@/lib/font-weight"

export interface SegmentedOption<V extends string = string> {
  value: V
  label: ReactNode
  /** Optional aria-label override when `label` is an icon-only node. */
  ariaLabel?: string
}

interface SegmentedControlProps<V extends string = string> {
  value: V
  onValueChange: (v: V) => void
  options: ReadonlyArray<SegmentedOption<V>>
  /** Visual scale. `sm` = compact toggle, `md` = default. */
  size?: "sm" | "md"
  className?: string
  ariaLabel?: string
}

export function SegmentedControl<V extends string = string>({
  value,
  onValueChange,
  options,
  size = "md",
  className,
  ariaLabel,
}: SegmentedControlProps<V>) {
  // Stable layoutId scoped to the instance so multiple controls don't share a pill.
  const id = useId()
  const layoutId = useMemo(() => `seg-${id}`, [id])

  const padY = size === "sm" ? "py-1" : "py-1.5"
  const padX = size === "sm" ? "px-2.5" : "px-3"
  const text = size === "sm" ? "text-[11px]" : "text-[12px]"

  return (
    <LayoutGroup id={layoutId}>
      <div
        role="radiogroup"
        aria-label={ariaLabel}
        className={cn(
          "inline-flex items-center rounded-lg p-0.5 gap-0.5",
          className,
        )}
        style={{
          background: "var(--bg-elevated-2)",
          border: "1px solid var(--border)",
        }}
      >
        {options.map(opt => {
          const isActive = opt.value === value
          return (
            <button
              key={opt.value}
              role="radio"
              aria-checked={isActive}
              aria-label={opt.ariaLabel ?? (typeof opt.label === "string" ? opt.label : undefined)}
              onClick={() => onValueChange(opt.value)}
              className={cn(
                "relative rounded-md outline-none cursor-pointer transition-colors",
                "focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-0",
                padX,
                padY,
                text,
              )}
              style={{
                color: isActive ? "var(--text-primary)" : "var(--text-tertiary)",
                fontVariationSettings: isActive ? fontWeights.semibold : fontWeights.medium,
              }}
            >
              {isActive && (
                <motion.div
                  layoutId={`${layoutId}-pill`}
                  className="absolute inset-0 rounded-md"
                  style={{ background: "var(--bg-elevated-3)" }}
                  transition={springs.responsive}
                />
              )}
              <span className="relative z-10">{opt.label}</span>
            </button>
          )
        })}
      </div>
    </LayoutGroup>
  )
}
