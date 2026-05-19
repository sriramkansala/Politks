"use client"

import { Search } from "lucide-react"
import { useCommandPalette } from "@/hooks/use-command-palette"
import { cn } from "@/lib/utils"

export function TopNav({ title }: { title?: string }) {
  const { open } = useCommandPalette()

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-4 shrink-0"
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
            className="text-[14px] font-[510]"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.015em" }}
          >
            {title}
          </span>
        )}
      </div>

      {/* Right: search trigger */}
      <button
        onClick={open}
        className={cn(
          "flex items-center gap-2 px-3 h-7 rounded-[6px] text-[13px] transition-colors duration-100",
          "hover:bg-[var(--bg-elevated-2)]"
        )}
        style={{
          color: "var(--text-secondary)",
          border: "1px solid var(--border)",
          background: "var(--bg-elevated)",
        }}
      >
        <Search size={13} strokeWidth={1.5} />
        <span>Search…</span>
        <kbd
          className="ml-2 text-[11px] font-mono"
          style={{ color: "var(--text-disabled)" }}
        >
          ⌘K
        </kbd>
      </button>
    </header>
  )
}
