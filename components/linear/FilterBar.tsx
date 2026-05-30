// The filtering workflow's container. Renders applied filters as editable pills
// followed by a "+ Filter" entry point; shows a "Clear" affordance once any
// filter is active. Fully controlled — parent owns the AppliedFilter[] state.
//
// Pair with `useFilteredIssues` (./use-filters) to derive the matching issues.
// Fluid Functionalism: the entry-point + clear buttons give spring whileTap.

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ListFilter, Plus } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { fontWeights } from "@/lib/font-weight"
import { springs } from "@/lib/springs"
import type { AppliedFilter, FilterProperty } from "./filter-types"
import { FilterPill } from "./FilterPill"
import { FilterPropertyMenu } from "./FilterMenu"

interface FilterBarProps {
  properties: FilterProperty[]
  filters: AppliedFilter[]
  onChange: (next: AppliedFilter[]) => void
  className?: string
}

export function FilterBar({ properties, filters, onChange, className }: FilterBarProps) {
  const byKey = (key: string) => properties.find((p) => p.key === key)!
  // Controls the "+ Filter" property-picker popover so we can close it on pick.
  const [addOpen, setAddOpen] = useState(false)
  // The property just added — its pill auto-opens its value menu on mount.
  const [justAdded, setJustAdded] = useState<string | null>(null)

  function addFilter(key: string) {
    const prop = byKey(key)
    const op = prop.operators?.[0] ?? "is"
    setAddOpen(false)
    // Don't duplicate an existing property filter.
    if (filters.some((f) => f.propertyKey === key)) return
    setJustAdded(key)
    onChange([...filters, { propertyKey: key, operator: op, valueIds: [] }])
  }

  const hasFilters = filters.length > 0

  return (
    <div className={className}>
      <div className="flex items-center gap-2 flex-wrap">
        {filters.map((f, i) => (
          <FilterPill
            key={f.propertyKey}
            filter={f}
            property={byKey(f.propertyKey)}
            defaultOpen={f.propertyKey === justAdded}
            onChange={(next) => onChange(filters.map((x, j) => (j === i ? next : x)))}
            onRemove={() => onChange(filters.filter((_, j) => j !== i))}
          />
        ))}

        <Popover open={addOpen} onOpenChange={setAddOpen}>
          <PopoverTrigger asChild>
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              transition={springs.snap}
              className="inline-flex items-center gap-1.5 h-6 px-2 text-[12px] transition-colors hover:bg-[var(--ff-hover)]"
              style={{
                color: "var(--text-tertiary)",
                border: hasFilters ? "none" : "1px dashed var(--border-strong)",
                borderRadius: "var(--radius-6)",
                fontVariationSettings: fontWeights.medium,
              }}
            >
              {hasFilters ? (
                <Plus size={13} strokeWidth={2} />
              ) : (
                <ListFilter size={13} strokeWidth={1.75} />
              )}
              Filter
            </motion.button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[240px] p-0">
            <FilterPropertyMenu properties={properties} onPick={addFilter} />
          </PopoverContent>
        </Popover>

        {hasFilters && (
          <motion.button
            type="button"
            onClick={() => {
              setJustAdded(null)
              onChange([])
            }}
            whileTap={{ scale: 0.95 }}
            transition={springs.snap}
            className="inline-flex items-center h-6 px-2 text-[12px] transition-colors hover:bg-[var(--ff-hover)] ml-auto"
            style={{
              color: "var(--text-tertiary)",
              borderRadius: "var(--radius-6)",
              fontVariationSettings: fontWeights.medium,
            }}
          >
            Clear
          </motion.button>
        )}
      </div>
    </div>
  )
}
