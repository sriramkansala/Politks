// Interactive demo wiring the whole Linear-style system together for /design:
//   • FilterBar  → editable pills (Status / Priority / Assignee / Labels)
//   • IssueList  → grouped, selectable rows; click a row to open it
//   • DetailPanel→ right-side key–value properties for the active issue
//   • CommandMenu→ ⌘K, grouped results + footer
// Everything is client-side state so reviewers can actually drive it.

"use client"

import { useMemo, useState } from "react"
import {
  CircleDashed,
  SignalHigh,
  User,
  Tag,
  Command as CommandIcon,
  Plus,
  Search,
  Inbox,
  Layers,
} from "lucide-react"
import { fontWeights } from "@/lib/font-weight"
import { Kbd } from "./Kbd"
import { StatusIcon } from "./StatusIcon"
import { PriorityIcon } from "./PriorityIcon"
import { FilterBar } from "./FilterBar"
import { IssueList } from "./IssueList"
import { DetailPanel } from "./DetailPanel"
import { CommandMenu, type CommandGroupSpec } from "./CommandMenu"
import { useFilteredIssues } from "./use-filters"
import {
  STATUS_ORDER,
  STATUS_META,
  PRIORITY_ORDER,
  PRIORITY_META,
  type IssueStatus,
  type IssuePriority,
} from "./status"
import type { AppliedFilter, FilterProperty } from "./filter-types"
import type { Issue } from "./types"
import { DEMO_ISSUES, PEOPLE } from "./demo-data"

const ALL_LABELS = Array.from(
  new Map(DEMO_ISSUES.flatMap((i) => i.labels).map((l) => [l.label, l])).values()
)

export function LinearShowcase() {
  const [issues, setIssues] = useState<Issue[]>(DEMO_ISSUES)
  const [filters, setFilters] = useState<AppliedFilter[]>([])
  const [activeId, setActiveId] = useState<string | null>("NITI-131")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  // Button-triggered in the showcase to avoid colliding with the app's global
  // ⌘K palette. The CommandMenu component still ships `useCommandMenu` for
  // real ⌘K wiring when it's used as THE app palette.
  const [open, setOpen] = useState(false)

  const properties: FilterProperty[] = useMemo(
    () => [
      {
        key: "status",
        label: "Status",
        icon: <CircleDashed size={14} strokeWidth={1.75} />,
        operators: ["is", "is_not"],
        multi: true,
        values: STATUS_ORDER.map((s) => ({
          id: s,
          label: STATUS_META[s].label,
          icon: <StatusIcon status={s as IssueStatus} size={16} />,
        })),
      },
      {
        key: "priority",
        label: "Priority",
        icon: <SignalHigh size={14} strokeWidth={1.75} />,
        operators: ["is", "is_not"],
        multi: true,
        values: PRIORITY_ORDER.map((p) => ({
          id: p,
          label: PRIORITY_META[p].label,
          icon: <PriorityIcon priority={p as IssuePriority} size={16} />,
        })),
      },
      {
        key: "assignee",
        label: "Assignee",
        icon: <User size={14} strokeWidth={1.75} />,
        operators: ["is", "is_not"],
        multi: true,
        values: [
          { id: "unassigned", label: "Unassigned", color: "var(--text-disabled)" },
          ...PEOPLE.map((p) => ({ id: p.id, label: p.name, color: p.color })),
        ],
      },
      {
        key: "labels",
        label: "Label",
        icon: <Tag size={14} strokeWidth={1.75} />,
        operators: ["includes", "excludes"],
        multi: true,
        values: ALL_LABELS.map((l) => ({ id: l.label, label: l.label, color: l.color })),
      },
    ],
    []
  )

  const filtered = useFilteredIssues(issues, filters)
  const active = filtered.find((i) => i.id === activeId) ?? filtered[0] ?? null

  const commandGroups: CommandGroupSpec[] = useMemo(
    () => [
      {
        heading: "Navigation",
        items: [
          { id: "nav-inbox", label: "Inbox", icon: <Inbox size={16} strokeWidth={1.75} />, shortcut: ["G", "I"] },
          { id: "nav-issues", label: "My Issues", icon: <Layers size={16} strokeWidth={1.75} />, shortcut: ["G", "M"] },
        ],
      },
      {
        heading: "Issues",
        items: issues.slice(0, 5).map((i) => ({
          id: i.id,
          label: i.title,
          hint: i.id,
          icon: <StatusIcon status={i.status} size={16} />,
          keywords: [i.id, ...i.labels.map((l) => l.label)],
          onSelect: () => {
            setActiveId(i.id)
            setFilters([])
          },
        })),
      },
      {
        heading: "Commands",
        items: [
          { id: "cmd-new", label: "Create new issue", icon: <Plus size={16} strokeWidth={1.75} />, shortcut: ["C"] },
          { id: "cmd-search", label: "Search…", icon: <Search size={16} strokeWidth={1.75} /> },
        ],
      },
    ],
    [issues]
  )

  return (
    <div className="space-y-5">
      {/* Toolbar: filter bar + ⌘K trigger */}
      <div className="flex items-center gap-3">
        <FilterBar
          properties={properties}
          filters={filters}
          onChange={setFilters}
          className="flex-1 min-w-0"
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 h-7 px-2.5 shrink-0 transition-colors hover:bg-[var(--ff-hover)]"
          style={{
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-6)",
            color: "var(--text-tertiary)",
            fontVariationSettings: fontWeights.medium,
          }}
        >
          <CommandIcon size={13} strokeWidth={1.75} />
          <span className="text-[12px]">Search</span>
          <span className="flex items-center gap-0.5">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </span>
        </button>
      </div>

      {/* List + count */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>
            {filtered.length} {filtered.length === 1 ? "issue" : "issues"}
          </span>
          {selectedIds.length > 0 && (
            <span className="text-[12px]" style={{ color: "var(--accent)" }}>
              · {selectedIds.length} selected
            </span>
          )}
        </div>
        <IssueList
          issues={filtered}
          activeId={active?.id}
          onActivate={(i) => setActiveId(i.id)}
          selectable
          selectedIds={selectedIds}
          onToggleSelect={(id) =>
            setSelectedIds((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
          }
        />
      </div>

      {/* Detail panel for the active issue */}
      {active && (
        <DetailPanel
          issue={active}
          people={PEOPLE}
          onChange={(next) => setIssues((list) => list.map((i) => (i.id === next.id ? next : i)))}
        />
      )}

      <CommandMenu groups={commandGroups} open={open} onOpenChange={setOpen} />
    </div>
  )
}
