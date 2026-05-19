export const tokens = {
  color: {
    bgBase:      "var(--bg-base)",
    bgElevated:  "var(--bg-elevated)",
    bgElevated2: "var(--bg-elevated-2)",
    bgInput:     "var(--bg-input)",
    border:      "var(--border)",
    borderStrong:"var(--border-strong)",
    textPrimary:   "var(--text-primary)",
    textSecondary: "var(--text-secondary)",
    textTertiary:  "var(--text-tertiary)",
    textDisabled:  "var(--text-disabled)",
    accent:      "var(--accent)",
    accentHover: "var(--accent-hover)",
    accentMuted: "var(--accent-muted)",
    success: "var(--success)",
    warning: "var(--warning)",
    danger:  "var(--danger)",
    info:    "var(--info)",
  },
  status: {
    kept:       "var(--status-kept)",
    broken:     "var(--status-broken)",
    compromise: "var(--status-compromise)",
    stalled:    "var(--status-stalled)",
    inworks:    "var(--status-inworks)",
    unrated:    "var(--status-unrated)",
  },
  radius: {
    tag:   "var(--radius-tag)",
    badge: "var(--radius-badge)",
    card:  "var(--radius-card)",
    large: "var(--radius-large)",
    pill:  "var(--radius-pill)",
  },
  duration: {
    fast:     "var(--duration-fast)",
    base:     "var(--duration-base)",
    moderate: "var(--duration-moderate)",
    slow:     "var(--duration-slow)",
  },
  easing: {
    out:   "var(--ease-out)",
    inOut: "var(--ease-in-out)",
  },
  layout: {
    sidebarWidth: "var(--sidebar-width)",
    topnavHeight: "var(--topnav-height)",
    contentMax:   "var(--content-max)",
  },
} as const

export type PromiseStatus =
  | "not_yet_rated"
  | "in_the_works"
  | "stalled"
  | "compromise"
  | "promise_kept"
  | "promise_broken"

export const statusMeta: Record<
  PromiseStatus,
  { label: string; color: string; bg: string }
> = {
  not_yet_rated:  { label: "Not Yet Rated",  color: "var(--status-unrated)",    bg: "color-mix(in oklab, var(--status-unrated) 12%, transparent)" },
  in_the_works:   { label: "In the Works",   color: "var(--status-inworks)",    bg: "color-mix(in oklab, var(--status-inworks) 12%, transparent)" },
  stalled:        { label: "Stalled",         color: "var(--status-stalled)",    bg: "color-mix(in oklab, var(--status-stalled) 12%, transparent)" },
  compromise:     { label: "Compromise",      color: "var(--status-compromise)", bg: "color-mix(in oklab, var(--status-compromise) 12%, transparent)" },
  promise_kept:   { label: "Promise Kept",    color: "var(--status-kept)",       bg: "color-mix(in oklab, var(--status-kept) 12%, transparent)" },
  promise_broken: { label: "Promise Broken",  color: "var(--status-broken)",     bg: "color-mix(in oklab, var(--status-broken) 12%, transparent)" },
}
