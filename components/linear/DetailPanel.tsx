// Linear's split issue view:
//   ┌──────────────────────────────┬───────────────────────┐
//   │ main: id · title · description │ properties sidebar    │
//   │                                │  Status   ◖ In Progress│
//   │                                │  Priority ▮▮▯ High     │
//   │                                │  Assignee  ◯ Priya     │
//   │                                │  Labels    • Finance   │
//   │                                │  …                     │
//   └──────────────────────────────┴───────────────────────┘
// The sidebar is a stack of PropertyRows (key–value), grouped with hairline
// dividers. Fixed 240px sidebar, scrollable main. Controls are inline-editable
// popovers wired to mutate the passed issue via onChange.

"use client"

import { fontWeights } from "@/lib/font-weight"
import type { Issue } from "./types"
import { STATUS_META, STATUS_ORDER, PRIORITY_META, PRIORITY_ORDER } from "./status"
import type { IssueStatus, IssuePriority } from "./status"
import { StatusIcon } from "./StatusIcon"
import { PriorityIcon } from "./PriorityIcon"
import { Assignee } from "./Assignee"
import { LabelChip } from "./LabelChip"
import { PropertyRow, PropertyControl } from "./PropertyRow"

interface DetailPanelProps {
  issue: Issue
  people?: { id: string; name: string; color?: string }[]
  onChange?: (next: Issue) => void
  className?: string
}

function MiniMenu({
  rows,
}: {
  rows: { key: string; leading: React.ReactNode; label: string; onClick: () => void }[]
}) {
  return (
    <div className="py-1 max-h-[280px] overflow-y-auto">
      {rows.map((r) => (
        <button
          key={r.key}
          type="button"
          onClick={r.onClick}
          className="flex items-center gap-2 w-full px-2.5 h-8 text-left transition-colors hover:bg-[var(--ff-hover)]"
          style={{ color: "var(--text-secondary)", fontVariationSettings: fontWeights.medium }}
        >
          <span className="inline-flex items-center justify-center w-4 h-4 [&_svg]:w-4 [&_svg]:h-4 shrink-0">
            {r.leading}
          </span>
          <span className="flex-1 truncate text-[13px]">{r.label}</span>
        </button>
      ))}
    </div>
  )
}

function Divider() {
  return <div className="my-3" style={{ borderTop: "1px solid var(--border)" }} />
}

export function DetailPanel({ issue, people = [], onChange, className }: DetailPanelProps) {
  const set = (patch: Partial<Issue>) => onChange?.({ ...issue, ...patch })

  return (
    <div
      className={className}
      style={{
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-8)",
        background: "var(--bg-base)",
        overflow: "hidden",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_240px]">
        {/* ── Main content ─────────────────────────────────────────── */}
        <div className="p-5 md:p-6 min-w-0" style={{ borderRight: "1px solid var(--border)" }}>
          <div className="text-[12px] tabular-nums mb-3" style={{ color: "var(--text-tertiary)" }}>
            {issue.id}
          </div>
          <h2
            className="text-[20px] leading-snug mb-4"
            style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}
          >
            {issue.title}
          </h2>
          {issue.description ? (
            <p
              className="text-[14px] leading-relaxed whitespace-pre-line"
              style={{ color: "var(--text-secondary)" }}
            >
              {issue.description}
            </p>
          ) : (
            <p className="text-[14px]" style={{ color: "var(--text-quaternary)" }}>
              Add description…
            </p>
          )}
        </div>

        {/* ── Properties sidebar ───────────────────────────────────── */}
        <aside className="p-4" style={{ background: "var(--bg-elevated)" }}>
          <div
            className="text-[11px] uppercase tracking-[0.06em] mb-3"
            style={{ color: "var(--text-quaternary)", fontVariationSettings: fontWeights.semibold }}
          >
            Properties
          </div>

          <PropertyRow
            label="Status"
            control={
              <PropertyControl
                icon={<StatusIcon status={issue.status} size={16} />}
                value={STATUS_META[issue.status].label}
              >
                <MiniMenu
                  rows={STATUS_ORDER.map((s) => ({
                    key: s,
                    leading: <StatusIcon status={s as IssueStatus} size={16} />,
                    label: STATUS_META[s].label,
                    onClick: () => set({ status: s as IssueStatus }),
                  }))}
                />
              </PropertyControl>
            }
          />

          <PropertyRow
            label="Priority"
            control={
              <PropertyControl
                icon={<PriorityIcon priority={issue.priority} size={16} />}
                value={PRIORITY_META[issue.priority].label}
              >
                <MiniMenu
                  rows={PRIORITY_ORDER.map((p) => ({
                    key: p,
                    leading: <PriorityIcon priority={p as IssuePriority} size={16} />,
                    label: PRIORITY_META[p].label,
                    onClick: () => set({ priority: p as IssuePriority }),
                  }))}
                />
              </PropertyControl>
            }
          />

          <PropertyRow
            label="Assignee"
            control={
              <PropertyControl
                icon={<Assignee name={issue.assignee?.name} color={issue.assignee?.color} size={18} />}
                value={issue.assignee?.name ?? null}
                placeholder="Unassigned"
              >
                <MiniMenu
                  rows={[
                    {
                      key: "unassigned",
                      leading: <Assignee name={null} size={18} />,
                      label: "Unassigned",
                      onClick: () => set({ assignee: null }),
                    },
                    ...people.map((p) => ({
                      key: p.id,
                      leading: <Assignee name={p.name} color={p.color} size={18} />,
                      label: p.name,
                      onClick: () => set({ assignee: p }),
                    })),
                  ]}
                />
              </PropertyControl>
            }
          />

          <Divider />

          <PropertyRow
            label="Labels"
            control={
              issue.labels.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {issue.labels.map((l) => (
                    <LabelChip key={l.label} label={l.label} color={l.color} />
                  ))}
                </div>
              ) : (
                <PropertyControl value={null} placeholder="Add label…" editable={false} />
              )
            }
          />

          <PropertyRow
            label="Project"
            control={
              <PropertyControl
                value={issue.project ?? null}
                placeholder="No project"
                color="#4ea7fc"
                editable={false}
              />
            }
          />

          <PropertyRow
            label="Milestone"
            control={
              <PropertyControl value={issue.milestone ?? null} placeholder="No milestone" editable={false} />
            }
          />

          <PropertyRow
            label="Cycle"
            control={<PropertyControl value={issue.cycle ?? null} placeholder="No cycle" editable={false} />}
          />

          <PropertyRow
            label="Due date"
            control={
              <PropertyControl value={issue.dueDate ?? null} placeholder="No due date" editable={false} />
            }
          />

          <Divider />

          <PropertyRow
            label="Created by"
            control={
              <PropertyControl
                icon={<Assignee name={issue.createdBy?.name} color={issue.createdBy?.color} size={18} />}
                value={issue.createdBy?.name ?? null}
                placeholder="—"
                editable={false}
              />
            }
          />
        </aside>
      </div>
    </div>
  )
}
