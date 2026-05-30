"use client"

import { AlertTriangle, RefreshCw } from "lucide-react"

export default function BudgetError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center gap-4 px-6">
      <AlertTriangle size={24} strokeWidth={1.5} style={{ color: "var(--status-broken)" }} />
      <p className="text-[14px] text-center" style={{ color: "var(--text-secondary)" }}>
        The Budget page failed to load.
        {error.digest && (
          <span className="block text-[11px] mt-1" style={{ color: "var(--text-tertiary)" }}>
            Error ID: {error.digest}
          </span>
        )}
      </p>
      <button
        onClick={reset}
        className="flex items-center gap-2 text-[13px] px-4 py-2 rounded-md"
        style={{
          border: "1px solid var(--border)",
          background: "var(--bg-elevated-2)",
          color: "var(--text-primary)",
        }}
      >
        <RefreshCw size={13} />
        Try again
      </button>
    </main>
  )
}
