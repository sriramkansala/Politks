"use client"

import { fontWeights } from "@/lib/font-weight"

export function TopNav({ title }: { title?: string }) {
  return (
    <header
      className="sticky top-0 z-40 flex items-center px-4 shrink-0"
      style={{
        height: "var(--topnav-height)",
        background: "color-mix(in oklab, var(--bg-base) 80%, transparent)",
        borderBottom: "1px solid var(--border)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* Left: title */}
      <div className="flex items-center gap-2">
        {title && (
          <span
            className="text-[14px]"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.015em", fontVariationSettings: fontWeights.medium }}
          >
            {title}
          </span>
        )}
      </div>

    </header>
  )
}
