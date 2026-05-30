"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { StatusPill } from "@/components/promises/StatusPill"
import { statusMeta, type PromiseStatus } from "@/lib/tokens"

const STATUSES: PromiseStatus[] = [
  "not_yet_rated",
  "in_the_works",
  "stalled",
  "compromise",
  "promise_kept",
  "promise_broken",
]

interface StatusUpdateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  promiseTitle: string
  currentStatus: PromiseStatus
  onUpdate: (newStatus: PromiseStatus, rationale: string) => Promise<void>
}

export function StatusUpdateDialog({
  open,
  onOpenChange,
  promiseTitle,
  currentStatus,
  onUpdate,
}: StatusUpdateDialogProps) {
  const [newStatus, setNewStatus] = useState<PromiseStatus>(currentStatus)
  const [rationale, setRationale] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    if (!rationale.trim()) return
    setSaving(true)
    setError(null)
    try {
      await onUpdate(newStatus, rationale.trim())
      setRationale("")
      onOpenChange(false)
    } catch (err) {
      // Keep the dialog open so the typed rationale isn't lost.
      setError(err instanceof Error ? err.message : "Couldn't save the status change. Try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
        <DialogHeader>
          <DialogTitle className="text-subheading" style={{ color: "var(--text-primary)" }}>
            Update Status
          </DialogTitle>
          <p className="text-caption mt-1" style={{ color: "var(--text-secondary)" }}>
            {promiseTitle}
          </p>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center gap-3">
            <StatusPill status={currentStatus} />
            <span style={{ color: "var(--text-tertiary)" }}>→</span>
            <StatusPill status={newStatus} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-caption" style={{ color: "var(--text-secondary)" }}>New Status</Label>
            <Select value={newStatus} onValueChange={(v) => setNewStatus(v as PromiseStatus)}>
              <SelectTrigger placeholder="Pick a status…" />
              <SelectContent>
                {STATUSES.map((s, i) => (
                  <SelectItem key={s} value={s} index={i}>
                    {statusMeta[s].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-caption" style={{ color: "var(--text-secondary)" }}>
              Rationale <span style={{ color: "var(--danger)" }}>*</span>
            </Label>
            <textarea
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="Why is this status changing? Cite evidence. (≤500 chars)"
              maxLength={500}
              rows={4}
              className="w-full text-[13px] px-3 py-2 rounded-xl resize-none outline-none transition-colors duration-100"
              style={{
                background: "var(--bg-input)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
            <p className="text-caption text-right" style={{ color: "var(--text-tertiary)" }}>
              {rationale.length}/500
            </p>
          </div>
        </div>

        {error && (
          <p
            className="text-[12px] px-3 py-2 rounded-lg"
            style={{
              color: "var(--danger)",
              background: "color-mix(in oklab, var(--danger) 10%, transparent)",
              border: "1px solid color-mix(in oklab, var(--danger) 28%, transparent)",
            }}
            role="alert"
          >
            {error}
          </p>
        )}

        <DialogFooter>
          <Button variant="tertiary" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !rationale.trim() || newStatus === currentStatus}
          >
            {saving ? "Saving…" : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
