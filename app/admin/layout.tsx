import type { Metadata } from "next"
import { fontWeights } from "@/lib/font-weight"
import { AdminNav } from "@/components/admin/AdminNav"

export const metadata: Metadata = {
  title: "Admin — Neo Nīti",
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-base)" }}>
      {/* Admin top bar */}
      <header
        className="flex items-center justify-between px-6 shrink-0"
        style={{
          height: "var(--topnav-height)",
          background: "var(--bg-elevated)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-[3px] flex items-center justify-center"
            style={{ background: "var(--accent)" }}
          >
            <span className="text-[9px]" style={{ color: "var(--text-on-accent)", fontVariationSettings: fontWeights.semibold }}>N</span>
          </div>
          <span
            className="text-[13px]"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.015em", fontVariationSettings: fontWeights.medium }}
          >
            Admin
          </span>
          <span
            className="px-1.5 py-0.5 text-[10px] rounded-[var(--radius-tag)] uppercase tracking-wide"
            style={{ background: "var(--accent-muted)", color: "var(--accent)", fontVariationSettings: fontWeights.medium }}
          >
            Editor
          </span>
        </div>
        <AdminNav />
      </header>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
