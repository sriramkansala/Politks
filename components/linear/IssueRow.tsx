// A single issue row in Linear's list view. Left→right anatomy:
//   priority icon · status icon · issue id · title · [spacer] · labels · due · assignee
// 36px tall, hairline separators between rows, hover + selected states, and an
// optional leading checkbox revealed on hover / when selected (multi-select).
//
// Fluid Functionalism: the row is a motion.div with a spring whileTap; hover
// tint is CSS via the --ff-hover token (no manual DOM style mutation).

"use client"

import { motion } from "framer-motion"
import { fontWeights } from "@/lib/font-weight"
import { springs } from "@/lib/springs"
import { cn } from "@/lib/utils"
import type { Issue } from "./types"
import { StatusIcon } from "./StatusIcon"
import { PriorityIcon } from "./PriorityIcon"
import { LabelChip } from "./LabelChip"
import { Assignee } from "./Assignee"

interface IssueRowProps {
  issue: Issue
  selected?: boolean
  active?: boolean
  onClick?: () => void
  onToggleSelect?: () => void
  selectable?: boolean
}

export function IssueRow({
  issue,
  selected,
  active,
  onClick,
  onToggleSelect,
  selectable,
}: IssueRowProps) {
  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick?.()
      }}
      whileTap={{ scale: 0.997 }}
      transition={springs.snap}
      className={cn(
        "group/row flex items-center gap-2 h-9 pl-3 pr-4 cursor-default select-none outline-none transition-colors duration-100",
        !active && !selected && "hover:bg-[var(--ff-hover)]"
      )}
      style={{
        background: active ? "var(--accent-tint)" : selected ? "var(--ff-active)" : undefined,
        boxShadow: "inset 0 -1px 0 var(--border)",
      }}
    >
      {selectable && (
        <motion.button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggleSelect?.()
          }}
          whileTap={{ scale: 0.85 }}
          transition={springs.snap}
          className={cn(
            "shrink-0 w-3.5 h-3.5 rounded-[4px] grid place-items-center transition-opacity",
            selected ? "opacity-100" : "opacity-0 group-hover/row:opacity-100"
          )}
          style={{
            border: `1px solid ${selected ? "var(--accent)" : "var(--border-stronger)"}`,
            background: selected ? "var(--accent)" : "transparent",
          }}
          aria-label={selected ? "Deselect" : "Select"}
        >
          {selected && (
            <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path
                d="M2.5 6.2 L5 8.5 L9.5 3.5"
                stroke="#fff"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </motion.button>
      )}

      <span className="shrink-0">
        <PriorityIcon priority={issue.priority} size={16} />
      </span>
      <span className="shrink-0">
        <StatusIcon status={issue.status} size={16} />
      </span>

      <span
        className="shrink-0 text-[13px] tabular-nums w-[64px]"
        style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.normal }}
      >
        {issue.id}
      </span>

      <span
        className="truncate text-[13px] min-w-0"
        style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.normal }}
      >
        {issue.title}
      </span>

      <span className="flex-1 min-w-0" />

      <div className="hidden md:flex items-center gap-1.5 shrink-0">
        {issue.labels.slice(0, 3).map((l) => (
          <LabelChip key={l.label} label={l.label} color={l.color} />
        ))}
      </div>

      {issue.dueDate && (
        <span
          className="shrink-0 text-[12px] tabular-nums w-[52px] text-right"
          style={{ color: "var(--text-tertiary)" }}
        >
          {issue.dueDate}
        </span>
      )}

      <span className="shrink-0">
        <Assignee name={issue.assignee?.name} color={issue.assignee?.color} size={20} />
      </span>
    </motion.div>
  )
}
