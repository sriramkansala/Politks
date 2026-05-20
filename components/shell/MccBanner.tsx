import { AlertTriangle } from "lucide-react"
import { isMccActive, MCC_BANNER_TEXT } from "@/lib/mcc"

export function MccBanner() {
  if (!isMccActive()) return null

  return (
    <div
      role="alert"
      aria-live="polite"
      className="w-full flex items-center justify-center gap-2 px-4 py-2 text-[12px] shrink-0"
      style={{
        background: "var(--status-stalled-bg, color-mix(in srgb, var(--status-stalled) 14%, transparent))",
        color: "var(--status-stalled)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <AlertTriangle size={12} strokeWidth={1.75} />
      <span style={{ fontVariationSettings: "'wght' 510" }}>
        {MCC_BANNER_TEXT}
      </span>
    </div>
  )
}
