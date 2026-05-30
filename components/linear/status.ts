// Linear's issue-workflow model — the status + priority enums and their visual
// metadata (label + colour). Colours track Linear's published status palette;
// they are rendered as SVG glyphs by StatusIcon / PriorityIcon, never as plain
// dots. Pure data (no JSX) so this module is safe to import from server code.

export type IssueStatus =
  | "backlog"
  | "todo"
  | "in_progress"
  | "in_review"
  | "done"
  | "canceled"

export type IssuePriority = "no_priority" | "urgent" | "high" | "medium" | "low"

export const STATUS_META: Record<IssueStatus, { label: string; color: string }> = {
  backlog:     { label: "Backlog",     color: "#8a8f98" }, // dim grey, dashed ring
  todo:        { label: "Todo",        color: "#e2e2e3" }, // bright grey ring
  in_progress: { label: "In Progress", color: "#f2c94c" }, // amber pie
  in_review:   { label: "In Review",   color: "#4cb782" }, // green pie (~75%)
  done:        { label: "Done",        color: "#5e6ad2" }, // brand-indigo disc + check
  canceled:    { label: "Canceled",    color: "#62666d" }, // dim disc + ✕
}

// Render / grouping order — mirrors Linear's board column order.
export const STATUS_ORDER: IssueStatus[] = [
  "backlog",
  "todo",
  "in_progress",
  "in_review",
  "done",
  "canceled",
]

export const PRIORITY_META: Record<IssuePriority, { label: string; rank: number }> = {
  urgent:      { label: "Urgent",      rank: 0 },
  high:        { label: "High",        rank: 1 },
  medium:      { label: "Medium",      rank: 2 },
  low:         { label: "Low",         rank: 3 },
  no_priority: { label: "No priority", rank: 4 },
}

// Menu order — urgent first, "no priority" last (Linear convention).
export const PRIORITY_ORDER: IssuePriority[] = [
  "urgent",
  "high",
  "medium",
  "low",
  "no_priority",
]
