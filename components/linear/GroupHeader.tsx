// Collapsible group header for the issue list (group-by status). Status glyph +
// label + count, a collapse chevron, and a trailing "+" to add into the group.
// Sits on a faintly raised bar — Linear's section divider for grouped lists.
//
// Fluid Functionalism: the chevron rotates on a spring; the toggle + add buttons
// give spring whileTap feedback.

"use client"

import { motion } from "framer-motion"
import { ChevronRight, Plus } from "lucide-react"
import { fontWeights } from "@/lib/font-weight"
import { springs } from "@/lib/springs"
import type { IssueStatus } from "./status"
import { STATUS_META } from "./status"
import { StatusIcon } from "./StatusIcon"

interface GroupHeaderProps {
  status: IssueStatus
  count: number
  collapsed?: boolean
  onToggle?: () => void
}

export function GroupHeader({ status, count, collapsed, onToggle }: GroupHeaderProps) {
  return (
    <div
      className="flex items-center gap-2 h-9 pl-2.5 pr-4 group/gh"
      style={{ background: "var(--bg-elevated)", boxShadow: "inset 0 -1px 0 var(--border)" }}
    >
      <motion.button
        type="button"
        onClick={onToggle}
        whileTap={{ scale: 0.85 }}
        transition={springs.snap}
        className="inline-flex items-center justify-center w-4 h-4 shrink-0"
        style={{ color: "var(--text-tertiary)" }}
        aria-label={collapsed ? "Expand" : "Collapse"}
      >
        <motion.span
          animate={{ rotate: collapsed ? 0 : 90 }}
          transition={springs.responsive}
          className="inline-flex"
        >
          <ChevronRight size={14} strokeWidth={2} />
        </motion.span>
      </motion.button>

      <StatusIcon status={status} size={15} />

      <span
        className="text-[13px]"
        style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold }}
      >
        {STATUS_META[status].label}
      </span>
      <span className="text-[12px] tabular-nums" style={{ color: "var(--text-tertiary)" }}>
        {count}
      </span>

      <span className="flex-1" />

      <motion.button
        type="button"
        whileTap={{ scale: 0.85 }}
        transition={springs.snap}
        className="inline-flex items-center justify-center w-5 h-5 rounded-[4px] opacity-0 group-hover/gh:opacity-100 transition-opacity hover:bg-[var(--ff-hover)]"
        style={{ color: "var(--text-tertiary)" }}
        aria-label="Add issue"
      >
        <Plus size={14} strokeWidth={2} />
      </motion.button>
    </div>
  )
}
