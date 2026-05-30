// Faithful re-creation of Linear's circular status glyphs, drawn as SVG so they
// stay crisp at any size and inherit the workflow colour:
//   backlog     → dashed ring
//   todo        → empty ring
//   in_progress → ring + partial pie (clock fill, ~42%)
//   in_review   → ring + ~75% pie
//   done        → filled disc + check
//   canceled    → filled disc + ✕
// The pie is the standard SVG "donut" trick: a circle of radius R stroked with
// width 2R, sliced by stroke-dasharray, rotated so it starts at 12 o'clock.

import type { IssueStatus } from "./status"
import { STATUS_META } from "./status"

interface StatusIconProps {
  status: IssueStatus
  size?: number
  /** Override the pie fill (0..1) for in_progress / in_review. */
  progress?: number
  className?: string
}

const PIE_R = 2.1
const PIE_C = 2 * Math.PI * PIE_R

export function StatusIcon({ status, size = 16, progress, className }: StatusIconProps) {
  const color = STATUS_META[status].color
  const filled = status === "done" || status === "canceled"
  const pie =
    status === "in_progress"
      ? progress ?? 0.42
      : status === "in_review"
        ? progress ?? 0.75
        : 0

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      role="img"
      aria-label={STATUS_META[status].label}
    >
      {status === "backlog" && (
        <circle
          cx="8"
          cy="8"
          r="6"
          stroke={color}
          strokeWidth="1.5"
          strokeDasharray="1.6 2.25"
          strokeLinecap="round"
        />
      )}

      {status === "todo" && (
        <circle cx="8" cy="8" r="6" stroke={color} strokeWidth="1.5" />
      )}

      {(status === "in_progress" || status === "in_review") && (
        <>
          <circle cx="8" cy="8" r="6" stroke={color} strokeWidth="1.5" />
          <circle
            cx="8"
            cy="8"
            r={PIE_R}
            fill="none"
            stroke={color}
            strokeWidth={PIE_R * 2}
            strokeDasharray={`${(pie * PIE_C).toFixed(3)} ${PIE_C.toFixed(3)}`}
            transform="rotate(-90 8 8)"
          />
        </>
      )}

      {filled && (
        <>
          <circle cx="8" cy="8" r="7" fill={color} />
          {status === "done" ? (
            <path
              d="M5 8.4 L7 10.4 L11.2 5.8"
              stroke="#fff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <path
              d="M5.6 5.6 L10.4 10.4 M10.4 5.6 L5.6 10.4"
              stroke="#fff"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          )}
        </>
      )}
    </svg>
  )
}
