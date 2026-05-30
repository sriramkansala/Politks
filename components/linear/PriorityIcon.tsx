// Linear's priority glyphs:
//   no_priority → three dim horizontal dashes
//   low/medium/high → three ascending signal bars, filled by level
//   urgent → orange rounded square with a white "!"

import type { IssuePriority } from "./status"

interface PriorityIconProps {
  priority: IssuePriority
  size?: number
  className?: string
}

const DIM = "var(--text-disabled)"
const FILL = "var(--text-secondary)"
const URGENT = "#fc7840"

// x / y / height for the three ascending bars (bottom-aligned at y=13).
const BARS = [
  { x: 1.5, y: 9, h: 4 },
  { x: 6.5, y: 6, h: 7 },
  { x: 11.5, y: 3, h: 10 },
]

export function PriorityIcon({ priority, size = 16, className }: PriorityIconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 16 16",
    fill: "none" as const,
    className,
    role: "img" as const,
  }

  if (priority === "no_priority") {
    return (
      <svg {...common} aria-label="No priority">
        {[4.25, 7.25, 10.25].map((y) => (
          <rect key={y} x="2.5" y={y} width="11" height="1.5" rx="0.75" fill={DIM} />
        ))}
      </svg>
    )
  }

  if (priority === "urgent") {
    return (
      <svg {...common} aria-label="Urgent">
        <rect x="1" y="1" width="14" height="14" rx="3.5" fill={URGENT} />
        <rect x="7.1" y="3.6" width="1.8" height="5.2" rx="0.9" fill="#fff" />
        <circle cx="8" cy="11.4" r="1.05" fill="#fff" />
      </svg>
    )
  }

  const filledCount = priority === "high" ? 3 : priority === "medium" ? 2 : 1

  return (
    <svg {...common} aria-label={`${priority} priority`}>
      {BARS.map((b, i) => (
        <rect
          key={i}
          x={b.x}
          y={b.y}
          width="3"
          height={b.h}
          rx="1"
          fill={i < filledCount ? FILL : DIM}
        />
      ))}
    </svg>
  )
}
