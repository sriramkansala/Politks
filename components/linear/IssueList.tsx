// Groups issues by status (in STATUS_ORDER) and renders each group with a
// collapsible GroupHeader + its IssueRows. Empty groups are omitted. Selection
// and active-row are controlled by the parent so the list can drive a detail
// panel side-by-side (Linear's split view).
//
// Fluid Functionalism: headers + rows enter via AnimateIn/AnimateItem stagger,
// re-keyed by the active filter/selection set so the entry plays on change.

"use client"

import { useState } from "react"
import { AnimateIn, AnimateItem } from "@/components/ui/animate-in"
import type { Issue } from "./types"
import { STATUS_ORDER, type IssueStatus } from "./status"
import { GroupHeader } from "./GroupHeader"
import { IssueRow } from "./IssueRow"

interface IssueListProps {
  issues: Issue[]
  activeId?: string | null
  onActivate?: (issue: Issue) => void
  selectedIds?: string[]
  onToggleSelect?: (id: string) => void
  selectable?: boolean
}

export function IssueList({
  issues,
  activeId,
  onActivate,
  selectedIds = [],
  onToggleSelect,
  selectable,
}: IssueListProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const groups = STATUS_ORDER.map((status) => ({
    status,
    items: issues.filter((i) => i.status === status),
  })).filter((g) => g.items.length > 0)

  if (issues.length === 0) {
    return (
      <div
        className="grid place-items-center py-16 text-[13px]"
        style={{
          color: "var(--text-tertiary)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-8)",
        }}
      >
        No issues match the current filters.
      </div>
    )
  }

  // Re-key so the stagger replays whenever the visible set changes.
  const listKey = groups.map((g) => `${g.status}:${g.items.length}`).join("|")

  return (
    <div
      className="overflow-hidden"
      style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-8)" }}
    >
      <AnimateIn key={listKey} stagger>
        {groups.flatMap(({ status, items }) => {
          const isCollapsed = collapsed[status]
          const nodes: React.ReactNode[] = [
            <AnimateItem key={`h-${status}`}>
              <GroupHeader
                status={status as IssueStatus}
                count={items.length}
                collapsed={isCollapsed}
                onToggle={() => setCollapsed((c) => ({ ...c, [status]: !c[status] }))}
              />
            </AnimateItem>,
          ]
          if (!isCollapsed) {
            for (const issue of items) {
              nodes.push(
                <AnimateItem key={issue.id}>
                  <IssueRow
                    issue={issue}
                    active={activeId === issue.id}
                    selected={selectedIds.includes(issue.id)}
                    selectable={selectable}
                    onClick={() => onActivate?.(issue)}
                    onToggleSelect={() => onToggleSelect?.(issue.id)}
                  />
                </AnimateItem>
              )
            }
          }
          return nodes
        })}
      </AnimateIn>
    </div>
  )
}
