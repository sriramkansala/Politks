import Link from "next/link"
import { ChevronRight, ExternalLink } from "lucide-react"
import type { Party } from "@/lib/db/types"
import { cn } from "@/lib/utils"

interface PartyCardProps {
  party: Party
  promiseCount?: number
  keptCount?: number
  className?: string
}

export function PartyCard({ party, promiseCount = 0, keptCount = 0, className }: PartyCardProps) {
  const keptPct = promiseCount > 0 ? Math.round((keptCount / promiseCount) * 100) : 0

  return (
    <Link
      href={`/parties/${party.slug}`}
      className={cn(
        "group flex items-center gap-4 p-4 rounded-[6px] transition-colors duration-100",
        "hover:bg-[var(--bg-elevated-2)]",
        className
      )}
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Color swatch */}
      <div
        className="w-8 h-8 rounded-[4px] flex items-center justify-center shrink-0 text-white text-[13px] font-[590]"
        style={{ background: party.color_hex }}
      >
        {party.short_name?.[0] ?? party.name[0]}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="text-[14px] font-[510] truncate"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.015em" }}
          >
            {party.name}
          </span>
          {party.short_name && (
            <span
              className="text-caption shrink-0"
              style={{ color: "var(--text-tertiary)" }}
            >
              {party.short_name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-caption" style={{ color: "var(--text-secondary)" }}>
            {promiseCount} promises
          </span>
          {promiseCount > 0 && (
            <span
              className="text-caption font-[510]"
              style={{ color: "var(--status-kept)" }}
            >
              {keptPct}% kept
            </span>
          )}
          <span
            className="text-caption px-1.5 py-0.5 rounded-[2px] uppercase tracking-wide text-[10px]"
            style={{
              background: "var(--bg-elevated-2)",
              color: "var(--text-tertiary)",
            }}
          >
            {party.level}
          </span>
        </div>
      </div>

      <ChevronRight
        size={14}
        strokeWidth={1.5}
        className="shrink-0 transition-transform duration-100 group-hover:translate-x-0.5"
        style={{ color: "var(--text-tertiary)" }}
      />
    </Link>
  )
}
