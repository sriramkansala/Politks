"use client"

import { SegmentedControl } from "@/components/ui/segmented-control"
import { useUnits, UNIT_LABEL, type UnitMode } from "@/lib/budget/units"

const OPTIONS: { value: UnitMode; label: string }[] = [
  { value: "nominal",   label: UNIT_LABEL.nominal },
  { value: "real",      label: UNIT_LABEL.real },
  { value: "gdp",       label: UNIT_LABEL.gdp },
  { value: "percapita", label: UNIT_LABEL.percapita },
]

export function UnitToggle({ size = "sm" }: { size?: "sm" | "md" }) {
  const { mode, setMode } = useUnits()
  return (
    <SegmentedControl<UnitMode>
      value={mode}
      onValueChange={setMode}
      options={OPTIONS}
      size={size}
      ariaLabel="Display units"
    />
  )
}
