// One applied filter rendered as an editable pill:
//   [icon] Property  operator  value(s) ▾   ✕
// Clicking the value segment re-opens the value menu; the ✕ removes the pill.
// Matches Linear's segmented pill: hairline outline, two pressable zones split
// by a thin divider, 24px tall.
//
// Fluid Functionalism: the pill enters on a spring (scale/opacity), and the
// operator / value / remove segments give spring whileTap feedback.

"use client"

import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { fontWeights } from "@/lib/font-weight"
import { springs } from "@/lib/springs"
import type { AppliedFilter, FilterProperty, FilterOperator } from "./filter-types"
import { FilterValueMenu } from "./FilterMenu"

const OPERATOR_LABEL: Record<FilterOperator, string> = {
  is: "is",
  is_not: "is not",
  includes: "includes",
  excludes: "excludes",
}

interface FilterPillProps {
  filter: AppliedFilter
  property: FilterProperty
  onChange: (next: AppliedFilter) => void
  onRemove: () => void
  /** Open the value menu on mount — set when the pill was just added, so the
   *  user picks a value in one flow (Linear behaviour). */
  defaultOpen?: boolean
}

export function FilterPill({ filter, property, onChange, onRemove, defaultOpen }: FilterPillProps) {
  const selected = property.values.filter((v) => filter.valueIds.includes(v.id))
  const operators = property.operators ?? ["is", "is_not"]

  // Value summary: single value shows its icon + label; multiple shows "N <prop>".
  const valueSummary =
    selected.length === 0
      ? "—"
      : selected.length === 1
        ? selected[0].label
        : `${selected.length} ${property.label.toLowerCase()}s`

  const leadingValueIcon = selected.length === 1 ? (selected[0].icon ?? null) : null
  const leadingValueDot =
    selected.length === 1 && !selected[0].icon && selected[0].color ? selected[0].color : null

  function cycleOperator() {
    const i = operators.indexOf(filter.operator)
    onChange({ ...filter, operator: operators[(i + 1) % operators.length] })
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={springs.responsive}
      className="inline-flex items-stretch h-6 text-[12px] shrink-0 overflow-hidden"
      style={{
        border: "1px solid var(--border)",
        background: "var(--bg-elevated)",
        borderRadius: "var(--radius-6)",
        fontVariationSettings: fontWeights.medium,
      }}
    >
      {/* Property (static) */}
      <span
        className="inline-flex items-center gap-1.5 pl-2 pr-1.5"
        style={{ color: "var(--text-secondary)" }}
      >
        <span
          className="inline-flex items-center [&_svg]:w-3.5 [&_svg]:h-3.5"
          style={{ color: "var(--text-tertiary)" }}
        >
          {property.icon}
        </span>
        {property.label}
      </span>

      {/* Operator (click to cycle) */}
      <motion.button
        type="button"
        onClick={cycleOperator}
        whileTap={{ scale: 0.92 }}
        transition={springs.snap}
        className="inline-flex items-center px-1.5 transition-colors hover:bg-[var(--ff-hover)]"
        style={{ color: "var(--text-tertiary)", borderLeft: "1px solid var(--border)" }}
        title="Change operator"
      >
        {OPERATOR_LABEL[filter.operator]}
      </motion.button>

      {/* Value (click to edit) */}
      <Popover defaultOpen={defaultOpen}>
        <PopoverTrigger asChild>
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            transition={springs.snap}
            className="inline-flex items-center gap-1.5 px-1.5 transition-colors hover:bg-[var(--ff-hover)] max-w-[200px]"
            style={{ color: "var(--text-primary)", borderLeft: "1px solid var(--border)" }}
          >
            {leadingValueIcon && (
              <span className="inline-flex items-center [&_svg]:w-3.5 [&_svg]:h-3.5">
                {leadingValueIcon}
              </span>
            )}
            {leadingValueDot && (
              <span
                className="inline-block w-2 h-2 rounded-full shrink-0"
                style={{ background: leadingValueDot }}
              />
            )}
            <span className="truncate">{valueSummary}</span>
          </motion.button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[240px] p-0">
          <FilterValueMenu
            property={property}
            selectedIds={filter.valueIds}
            onToggle={(id) => {
              const has = filter.valueIds.includes(id)
              const next = property.multi
                ? has
                  ? filter.valueIds.filter((x) => x !== id)
                  : [...filter.valueIds, id]
                : [id]
              onChange({ ...filter, valueIds: next })
            }}
          />
        </PopoverContent>
      </Popover>

      {/* Remove */}
      <motion.button
        type="button"
        onClick={onRemove}
        whileTap={{ scale: 0.92 }}
        transition={springs.snap}
        className="inline-flex items-center px-1.5 transition-colors hover:bg-[var(--ff-hover)]"
        style={{ color: "var(--text-tertiary)", borderLeft: "1px solid var(--border)" }}
        aria-label={`Remove ${property.label} filter`}
      >
        <X size={12} strokeWidth={2} />
      </motion.button>
    </motion.div>
  )
}
