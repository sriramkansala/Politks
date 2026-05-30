// BMW-134 — "Did my MP show up?" Attendance Heatmap
// Session-level bars (one bar per parliamentary session) with attendance %.
// True calendar heatmap (one cell per sitting day) requires per-session sitting data
// which isn't in our static seed — we render a session bar chart as the v1.

import type { Mp } from "@/lib/db/types"
import { fontWeights } from "@/lib/font-weight"

function color(pct: number): string {
  if (pct >= 80) return "var(--status-kept)"
  if (pct >= 50) return "var(--status-compromise)"
  if (pct >= 20) return "var(--status-stalled)"
  return "var(--status-broken)"
}

export function AttendanceHeatmap({ mp }: { mp: Mp }) {
  const sessions = Object.entries(mp.session_attendance ?? {})
  if (sessions.length === 0) {
    return (
      <div
        className="rounded-xl p-4"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
      >
        <div className="text-subheading mb-1" style={{ color: "var(--text-primary)" }}>
          Attendance
        </div>
        <p className="text-caption" style={{ color: "var(--text-tertiary)" }}>
          Per-session attendance not yet ingested for this MP.
          {mp.attendance_pct != null && (
            <>
              {" "}
              Overall term: <strong>{mp.attendance_pct.toFixed(0)}%</strong>.
            </>
          )}
        </p>
      </div>
    )
  }

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-subheading" style={{ color: "var(--text-primary)" }}>
          Attendance by session
        </h3>
        <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
          Source: prsindia.org
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {sessions.map(([label, pct]) => (
          <div key={label} className="flex items-center gap-3">
            <div
              className="text-[12px] w-40 shrink-0 truncate"
              style={{ color: "var(--text-secondary)" }}
            >
              {label}
            </div>
            <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: "var(--bg-elevated-2)" }}>
              <div
                style={{
                  width: `${Math.max(0, Math.min(100, pct))}%`,
                  height: "100%",
                  background: color(pct),
                  transition: "width 200ms var(--ease-out)",
                }}
              />
            </div>
            <div
              className="text-[12px] w-10 text-right tabular-nums"
              style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.medium }}
            >
              {pct}%
            </div>
          </div>
        ))}
      </div>

      {mp.is_minister && (
        <p className="mt-4 text-[11px]" style={{ color: "var(--text-disabled)" }}>
          Note: Ministers and the Speaker are exempt from signing the attendance
          register. Per-session figures here reflect those that were recorded.
        </p>
      )}
    </div>
  )
}
