"use client"

import { useState, useRef } from "react"
import { Upload, FileText, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { fontWeights } from "@/lib/font-weight"

type IngestionStep = {
  message: string
  type: "progress" | "complete" | "error"
  timestamp: number
}

const PARTIES = [
  { value: "bjp", label: "BJP — Bharatiya Janata Party" },
  { value: "inc", label: "INC — Indian National Congress" },
  { value: "aap", label: "AAP — Aam Aadmi Party" },
  { value: "dmk", label: "DMK — Dravida Munnetra Kazhagam" },
]

export function ManifestoUploader() {
  const [partySlug, setPartySlug] = useState("")
  const [pdfUrl, setPdfUrl] = useState("")
  const [electionYear, setElectionYear] = useState("2024")
  const [electionType, setElectionType] = useState("lok_sabha")
  const [steps, setSteps] = useState<IngestionStep[]>([])
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle")
  const abortRef = useRef<AbortController | null>(null)

  function addStep(message: string, type: IngestionStep["type"]) {
    setSteps((prev) => [...prev, { message, type, timestamp: Date.now() }])
  }

  async function handleIngest() {
    if (!partySlug || !pdfUrl) return
    setSteps([])
    setStatus("running")
    abortRef.current = new AbortController()

    try {
      const res = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pdf_url: pdfUrl,
          party_id: partySlug,
          manifesto_id: `${partySlug}-${electionYear}-${Date.now()}`,
        }),
        signal: abortRef.current.signal,
      })

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) throw new Error("No response stream")

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "))

        for (const line of lines) {
          const data = JSON.parse(line.slice(6))
          addStep(data.message ?? `${data.count} promises extracted.`, data.type)
          if (data.type === "complete") setStatus("done")
          if (data.type === "error") setStatus("error")
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        addStep((err as Error).message, "error")
        setStatus("error")
      }
    }
  }

  function handleCancel() {
    abortRef.current?.abort()
    setStatus("idle")
  }

  return (
    <div className="space-y-6">
      {/* Form */}
      <div
        className="rounded-xl p-6 space-y-4"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-subheading" style={{ color: "var(--text-primary)" }}>
          Manifesto Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-caption" style={{ color: "var(--text-secondary)" }}>Party</Label>
            <Select value={partySlug} onValueChange={setPartySlug}>
              <SelectTrigger placeholder="Select party…" />
              <SelectContent>
                {PARTIES.map((p, i) => (
                  <SelectItem key={p.value} value={p.value} index={i}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-caption" style={{ color: "var(--text-secondary)" }}>Election Type</Label>
            <Select value={electionType} onValueChange={setElectionType}>
              <SelectTrigger placeholder="Election type…" />
              <SelectContent>
                <SelectItem value="lok_sabha"    index={0}>Lok Sabha</SelectItem>
                <SelectItem value="vidhan_sabha" index={1}>Vidhan Sabha</SelectItem>
                <SelectItem value="local"        index={2}>Local Body</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-caption" style={{ color: "var(--text-secondary)" }}>Election Year</Label>
            <Input
              type="number"
              value={electionYear}
              onChange={(e) => setElectionYear(e.target.value)}
              placeholder="2024"
              min={1950}
              max={2050}
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-caption" style={{ color: "var(--text-secondary)" }}>
              PDF URL (public, direct link)
            </Label>
            <Input
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              placeholder="https://party.org/manifesto-2024.pdf"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleIngest}
            disabled={status === "running" || !partySlug || !pdfUrl}
            className="gap-2"
          >
            {status === "running" ? (
              <Loader2 size={14} strokeWidth={1.5} className="animate-spin" />
            ) : (
              <Upload size={14} strokeWidth={1.5} />
            )}
            {status === "running" ? "Extracting…" : "Start Extraction"}
          </Button>
          {status === "running" && (
            <Button variant="tertiary" onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Progress steps */}
      {steps.length > 0 && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--border)" }}
        >
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)" }}
          >
            <span className="text-caption uppercase tracking-wide" style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.medium }}>
              Extraction Log
            </span>
            {status === "done" && (
              <span className="text-caption flex items-center gap-1" style={{ color: "var(--success)" }}>
                <CheckCircle2 size={12} strokeWidth={1.5} /> Complete
              </span>
            )}
            {status === "error" && (
              <span className="text-caption flex items-center gap-1" style={{ color: "var(--danger)" }}>
                <XCircle size={12} strokeWidth={1.5} /> Failed
              </span>
            )}
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {steps.map((step, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-3 px-4 py-3 text-[13px]",
                  step.type === "error" ? "bg-[color-mix(in_oklab,var(--danger)_6%,transparent)]" :
                  step.type === "complete" ? "bg-[color-mix(in_oklab,var(--success)_6%,transparent)]" : ""
                )}
              >
                {step.type === "progress" && <Loader2 size={13} strokeWidth={1.5} className="animate-spin mt-0.5 shrink-0" style={{ color: "var(--accent)" }} />}
                {step.type === "complete" && <CheckCircle2 size={13} strokeWidth={1.5} className="mt-0.5 shrink-0" style={{ color: "var(--success)" }} />}
                {step.type === "error" && <XCircle size={13} strokeWidth={1.5} className="mt-0.5 shrink-0" style={{ color: "var(--danger)" }} />}
                <span style={{ color: step.type === "error" ? "var(--danger)" : "var(--text-primary)" }}>
                  {step.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
