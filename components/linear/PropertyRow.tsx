// The key–value row that builds Linear's right-side properties sidebar.
//   [label]                    [ inline control ]
// Label sits left in muted text at a fixed width; the control sits right and is
// a pressable, popover-backed "chip" (icon + value). Unset state shows a faint
// placeholder. Compose PropertyRow with a `control` of your choosing.
//
// Fluid Functionalism: the editable control gives spring whileTap feedback.

"use client"

import { motion } from "framer-motion"
import { fontWeights } from "@/lib/font-weight"
import { springs } from "@/lib/springs"
import { cn } from "@/lib/utils"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

interface PropertyRowProps {
  label: string
  /** The interactive control on the right (e.g. a PropertyControl). */
  control: React.ReactNode
  className?: string
}

export function PropertyRow({ label, control, className }: PropertyRowProps) {
  return (
    <div className={cn("flex items-center gap-2 min-h-8", className)}>
      <span
        className="text-[13px] w-[84px] shrink-0"
        style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.normal }}
      >
        {label}
      </span>
      <div className="flex-1 min-w-0">{control}</div>
    </div>
  )
}

// ── The pressable value control ─────────────────────────────────────────────

interface PropertyControlProps {
  icon?: React.ReactNode
  /** Colour dot when there's no icon. */
  color?: string
  value?: string | null
  placeholder?: string
  children?: React.ReactNode // popover menu contents
  /** When false, renders a static (non-interactive) chip. */
  editable?: boolean
}

export function PropertyControl({
  icon,
  color,
  value,
  placeholder = "Set…",
  children,
  editable = true,
}: PropertyControlProps) {
  const inner = (
    <span className="inline-flex items-center gap-1.5 min-w-0 max-w-full">
      {icon != null && (
        <span className="inline-flex items-center justify-center w-4 h-4 [&_svg]:w-4 [&_svg]:h-4 shrink-0">
          {icon}
        </span>
      )}
      {color && !icon && (
        <span
          className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
          style={{ background: color }}
        />
      )}
      <span
        className="truncate text-[13px]"
        style={{
          color: value ? "var(--text-primary)" : "var(--text-quaternary)",
          fontVariationSettings: fontWeights.medium,
        }}
      >
        {value ?? placeholder}
      </span>
    </span>
  )

  const chipClass =
    "inline-flex items-center h-7 px-2 -ml-2 rounded-[6px] transition-colors max-w-full text-left"

  if (!editable) {
    return <span className={cn(chipClass, "cursor-default")}>{inner}</span>
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          transition={springs.snap}
          className={cn(chipClass, "hover:bg-[var(--ff-hover)]")}
        >
          {inner}
        </motion.button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[240px] p-0">
        {children}
      </PopoverContent>
    </Popover>
  )
}
