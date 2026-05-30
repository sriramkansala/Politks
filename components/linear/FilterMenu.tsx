// Two menus used by the filtering workflow:
//   FilterPropertyMenu — pick WHICH property to filter by (Status, Priority…),
//                        with a fuzzy search box at the top.
//   FilterValueMenu    — pick the value(s) for a chosen property, with leading
//                        icon/colour + a check on selected rows.
// Both share the same searchable-list shell so they feel identical to Linear's.

"use client"

import { useMemo, useState } from "react"
import { Check } from "lucide-react"
import { fontWeights } from "@/lib/font-weight"
import type { FilterProperty } from "./filter-types"

function MenuShell({
  placeholder,
  children,
  query,
  setQuery,
}: {
  placeholder: string
  children: React.ReactNode
  query: string
  setQuery: (v: string) => void
}) {
  return (
    <div className="flex flex-col max-h-[320px]">
      <div className="px-2.5 py-2" style={{ borderBottom: "1px solid var(--border)" }}>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-[13px]"
          style={{ color: "var(--text-primary)" }}
        />
      </div>
      <div className="overflow-y-auto py-1">{children}</div>
    </div>
  )
}

function Row({
  onClick,
  leading,
  label,
  selected,
  showCheck,
}: {
  onClick: () => void
  leading?: React.ReactNode
  label: string
  selected?: boolean
  showCheck?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 w-full px-2.5 h-8 text-left transition-colors hover:bg-[var(--ff-hover)]"
      style={{ color: "var(--text-secondary)", fontVariationSettings: fontWeights.medium }}
    >
      {leading != null && (
        <span className="inline-flex items-center justify-center w-4 h-4 [&_svg]:w-4 [&_svg]:h-4 shrink-0">
          {leading}
        </span>
      )}
      <span className="flex-1 truncate text-[13px]">{label}</span>
      {showCheck && (
        <Check
          size={14}
          strokeWidth={2}
          style={{ color: "var(--accent)", opacity: selected ? 1 : 0 }}
        />
      )}
    </button>
  )
}

export function FilterPropertyMenu({
  properties,
  onPick,
}: {
  properties: FilterProperty[]
  onPick: (key: string) => void
}) {
  const [query, setQuery] = useState("")
  const filtered = useMemo(
    () => properties.filter((p) => p.label.toLowerCase().includes(query.toLowerCase())),
    [properties, query]
  )
  return (
    <MenuShell placeholder="Filter by…" query={query} setQuery={setQuery}>
      {filtered.map((p) => (
        <Row
          key={p.key}
          onClick={() => onPick(p.key)}
          leading={<span style={{ color: "var(--text-tertiary)" }}>{p.icon}</span>}
          label={p.label}
        />
      ))}
      {filtered.length === 0 && (
        <p className="px-2.5 py-3 text-[12px]" style={{ color: "var(--text-tertiary)" }}>
          No properties
        </p>
      )}
    </MenuShell>
  )
}

export function FilterValueMenu({
  property,
  selectedIds,
  onToggle,
}: {
  property: FilterProperty
  selectedIds: string[]
  onToggle: (id: string) => void
}) {
  const [query, setQuery] = useState("")
  const filtered = useMemo(
    () => property.values.filter((v) => v.label.toLowerCase().includes(query.toLowerCase())),
    [property.values, query]
  )
  return (
    <MenuShell placeholder={`${property.label}…`} query={query} setQuery={setQuery}>
      {filtered.map((v) => (
        <Row
          key={v.id}
          onClick={() => onToggle(v.id)}
          leading={
            v.icon ?? (
              v.color ? (
                <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: v.color }} />
              ) : null
            )
          }
          label={v.label}
          selected={selectedIds.includes(v.id)}
          showCheck
        />
      ))}
      {filtered.length === 0 && (
        <p className="px-2.5 py-3 text-[12px]" style={{ color: "var(--text-tertiary)" }}>
          No matches
        </p>
      )}
    </MenuShell>
  )
}
