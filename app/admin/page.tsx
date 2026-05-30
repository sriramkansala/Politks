import Link from "next/link"
import { BookOpen, Plus, BarChart3 } from "lucide-react"
import { fontWeights } from "@/lib/font-weight"

export default function AdminDashboard() {
  return (
    <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto space-y-6">
      <div>
        <h1 className="h-page mb-1" style={{ color: "var(--text-primary)" }}>
          Admin Dashboard
        </h1>
        <p className="text-body" style={{ color: "var(--text-secondary)" }}>
          Manage manifesto ingestion, promise review, and status updates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            href: "/admin/manifestos/new",
            icon: Plus,
            label: "Upload Manifesto",
            description: "Upload a PDF and run Claude extraction",
            accent: true,
          },
          {
            href: "/admin/manifestos",
            icon: BookOpen,
            label: "Manage Manifestos",
            description: "Review, publish, or re-ingest manifestos",
            accent: false,
          },
          {
            href: "/admin/promises",
            icon: BarChart3,
            label: "Update Statuses",
            description: "Change promise ratings and add evidence",
            accent: false,
          },
        ].map(({ href, icon: Icon, label, description, accent }) => (
          <Link
            key={href}
            href={href}
            className="group p-5 rounded-xl flex flex-col gap-3 transition-colors duration-100 hover:bg-[var(--bg-elevated-2)]"
            style={{
              background: "var(--bg-elevated)",
              border: accent ? `1px solid var(--accent)` : "1px solid var(--border)",
            }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: accent ? "var(--accent)" : "var(--bg-elevated-2)" }}
            >
              <Icon size={15} strokeWidth={1.5} style={{ color: accent ? "var(--text-on-accent)" : "var(--text-secondary)" }} />
            </div>
            <div>
              <p className="text-[14px]" style={{ color: "var(--text-primary)", letterSpacing: "-0.015em", fontVariationSettings: fontWeights.medium }}>
                {label}
              </p>
              <p className="text-caption mt-0.5" style={{ color: "var(--text-secondary)" }}>
                {description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
