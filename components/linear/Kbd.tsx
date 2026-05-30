// Keyboard-shortcut key cap, matching Linear's footer/menu hint style.

import { cn } from "@/lib/utils"
import { fontWeights } from "@/lib/font-weight"

export function Kbd({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[11px] leading-none",
        className
      )}
      style={{
        background: "var(--bg-elevated-3)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-4)",
        color: "var(--text-tertiary)",
        fontVariationSettings: fontWeights.medium,
      }}
    >
      {children}
    </kbd>
  )
}
