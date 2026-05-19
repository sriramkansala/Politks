import { statusMeta, type PromiseStatus } from "@/lib/tokens"
import { cn } from "@/lib/utils"

interface StatusPillProps {
  status: PromiseStatus
  className?: string
}

export function StatusPill({ status, className }: StatusPillProps) {
  const meta = statusMeta[status]
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[11px] font-[510] uppercase tracking-[0.04em] shrink-0",
        className
      )}
      style={{
        color: meta.color,
        background: meta.bg,
        borderRadius: "2px",
      }}
    >
      {meta.label}
    </span>
  )
}
