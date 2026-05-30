"use client"

import { useState } from "react"
import { StatusPill } from "@/components/promises/StatusPill"
import { StatusUpdateDialog } from "@/components/admin/StatusUpdateDialog"
import { Button } from "@/components/ui/button"
import type { PromiseStatus } from "@/lib/db/types"

// Sample data — replace with live Supabase query
const SAMPLE = [
  { id: "bjp-1", title: "3 crore new houses under PM Awas Yojana by 2029", party: "BJP", status: "in_the_works" as PromiseStatus },
  { id: "bjp-2", title: "1 crore rooftop solar installations", party: "BJP", status: "in_the_works" as PromiseStatus },
  { id: "aap-1", title: "Free 300 units of electricity per month to all households", party: "AAP", status: "promise_kept" as PromiseStatus },
  { id: "aap-4", title: "24-hour clean drinking water supply across Delhi", party: "AAP", status: "stalled" as PromiseStatus },
  { id: "dmk-3", title: "Neet exemption for Tamil Nadu medical admissions", party: "DMK", status: "compromise" as PromiseStatus },
]

export default function PromisesAdminPage() {
  const [promises, setPromises] = useState(SAMPLE)
  const [editing, setEditing] = useState<(typeof SAMPLE)[0] | null>(null)

  async function handleUpdate(newStatus: PromiseStatus, rationale: string) {
    if (!editing) return
    setPromises((prev) =>
      prev.map((p) => (p.id === editing.id ? { ...p, status: newStatus } : p))
    )
    // In production: POST to /api/admin/status with { promise_id, to_status, rationale }
    console.log("Status update:", { id: editing.id, newStatus, rationale })
  }

  return (
    <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto space-y-6">
      <div>
        <h1 className="h-page mb-1" style={{ color: "var(--text-primary)" }}>
          Promise Status Editor
        </h1>
        <p className="text-body" style={{ color: "var(--text-secondary)" }}>
          Every status change requires a rationale and creates an audit log entry.
        </p>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--border)" }}
      >
        {promises.map((p, i) => (
          <div
            key={p.id}
            className="flex items-center gap-4 px-4 py-3 transition-colors duration-100 hover:bg-[var(--bg-elevated-2)]"
            style={i < promises.length - 1 ? { borderBottom: "1px solid var(--border)" } : undefined}
          >
            <div className="flex-1 min-w-0">
              <p className="text-[13px] truncate" style={{ color: "var(--text-primary)" }}>
                {p.title}
              </p>
              <p className="text-caption mt-0.5" style={{ color: "var(--text-tertiary)" }}>
                {p.party}
              </p>
            </div>
            <StatusPill status={p.status} />
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => setEditing(p)}
              className="shrink-0"
            >
              Update
            </Button>
          </div>
        ))}
      </div>

      {editing && (
        <StatusUpdateDialog
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
          promiseTitle={editing.title}
          currentStatus={editing.status}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  )
}
