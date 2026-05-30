// Typography specimen — validates the Inter Variable type system against
// realistic product strings in BOTH themes side-by-side. Rendered on /design.
//
// Each panel re-declares the colour tokens inline so the two-up light/dark
// comparison is independent of the globally-active theme — you see both modes
// at once without toggling. Type-role classes (.h-page, .text-small, …) and
// the fontWeights axis tokens are the real ones from globals.css / lib.

import type { CSSProperties } from "react"
import { Check, X } from "lucide-react"
import { fontWeights } from "@/lib/font-weight"

// Token sets mirror app/globals.css :root (dark) and html.light exactly.
const DARK_TOKENS: Record<string, string> = {
  "--bg-base": "#08090a",
  "--bg-elevated": "#0f1011",
  "--bg-elevated-2": "#141516",
  "--border": "#23252a",
  "--border-strong": "#34343a",
  "--text-primary": "#f7f8f8",
  "--text-secondary": "#d0d6e0",
  "--text-tertiary": "#8a8f98",
  "--text-disabled": "#4a4d52",
  "--accent": "#7170ff",
  "--success": "#4cb782",
  "--danger": "#eb5757",
}

const LIGHT_TOKENS: Record<string, string> = {
  "--bg-base": "#F5F5F7",
  "--bg-elevated": "#FFFFFF",
  "--bg-elevated-2": "#F8F8FA",
  "--border": "#E2E4E8",
  "--border-strong": "#CBCDD3",
  "--text-primary": "#0F1117",
  "--text-secondary": "#323644",
  "--text-tertiary": "#6B7080",
  "--text-disabled": "#BCC0CA",
  "--accent": "#5e6ad2",
  "--success": "#4cb782",
  "--danger": "#eb5757",
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "success" | "muted" }) {
  return (
    <div
      className="flex items-center justify-between py-3"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <span className="text-[13px]" style={{ color: "var(--text-secondary)" }}>
        {label}
      </span>
      <span
        className="text-[13px] tabular-nums"
        style={{
          color: tone === "success" ? "var(--success)" : tone === "muted" ? "var(--text-tertiary)" : "var(--text-primary)",
          fontVariationSettings: fontWeights.medium,
        }}
      >
        {value}
      </span>
    </div>
  )
}

function Mono({ children }: { children: React.ReactNode }) {
  return (
    <code
      className="text-[12px] tabular-nums"
      style={{ fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}
    >
      {children}
    </code>
  )
}

// The specimen body — pure var()-driven, rendered inside each themed panel.
function SpecimenBody() {
  return (
    <div className="space-y-6">
      {/* Title block */}
      <div>
        <h2 className="h-page" style={{ color: "var(--text-primary)" }}>
          Workspace settings
        </h2>
        <p className="text-[13px] mt-1" style={{ color: "var(--text-tertiary)" }}>
          Manage members, integrations, and billing for your organisation.
        </p>
      </div>

      {/* Form fragment */}
      <div className="space-y-2">
        <h3 className="h-card" style={{ color: "var(--text-primary)" }}>
          Invite collaborators
        </h3>
        <div className="flex items-end gap-2">
          <div className="flex-1 space-y-1">
            <label
              className="text-[12px] block"
              style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.medium }}
            >
              Email address
            </label>
            <div
              className="h-8 flex items-center px-3 rounded-lg text-[13px]"
              style={{ background: "var(--bg-elevated-2)", border: "1px solid var(--border)", color: "var(--text-disabled)" }}
            >
              name@org.in
            </div>
          </div>
          <button
            className="h-8 px-3 rounded-lg text-[13px] shrink-0"
            style={{ background: "var(--accent)", color: "#fff", fontVariationSettings: fontWeights.medium }}
          >
            Invite member
          </button>
        </div>
      </div>

      {/* Settings rows */}
      <div style={{ borderTop: "1px solid var(--border)" }}>
        <Row label="Two-factor authentication" value="Enabled" tone="success" />
        <Row label="Default workspace" value="Neo Nīti" />
        <Row label="Session timeout" value="30 minutes" tone="muted" />
      </div>

      {/* Table with tabular numerals + currency */}
      <div>
        <div
          className="grid grid-cols-[1fr_auto_auto] gap-4 pb-2 text-[11px] uppercase"
          style={{ color: "var(--text-tertiary)", letterSpacing: "0.04em", fontVariationSettings: fontWeights.medium, borderBottom: "1px solid var(--border)" }}
        >
          <span>Member</span>
          <span className="text-right">Last active</span>
          <span className="text-right">Allocation</span>
        </div>
        {[
          { name: "Arnav Mehta", active: "3 minutes ago", amount: "₹4,28,500.00" },
          { name: "Priya Nair", active: "2 hours ago", amount: "₹1,12,000.00" },
        ].map((m) => (
          <div
            key={m.name}
            className="grid grid-cols-[1fr_auto_auto] gap-4 py-2.5 text-[13px]"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <span style={{ color: "var(--text-primary)" }}>{m.name}</span>
            <span className="text-right" style={{ color: "var(--text-tertiary)" }}>{m.active}</span>
            <span className="text-right tabular-nums" style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.medium }}>{m.amount}</span>
          </div>
        ))}
      </div>

      {/* Metadata line */}
      <div
        className="text-[11px] uppercase"
        style={{ color: "var(--text-tertiary)", letterSpacing: "0.04em", fontVariationSettings: fontWeights.medium }}
      >
        12 unresolved comments · Last updated 3 minutes ago
      </div>

      {/* Mono / technical metadata */}
      <div className="space-y-1.5">
        <div><Mono>https://dribbble.com/shots/123456</Mono></div>
        <div><Mono>usr_8Kd92Lp · v0.1.0 · beta</Mono></div>
        <div className="flex items-center gap-1.5">
          <kbd
            className="text-[11px] px-1.5 py-0.5 rounded-md"
            style={{ background: "var(--bg-elevated-2)", border: "1px solid var(--border)", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}
          >
            Shift + Enter
          </kbd>
          <span className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>to send to Linear</span>
        </div>
      </div>

      {/* States */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="inline-flex items-center gap-1.5 text-[12px]" style={{ color: "var(--success)" }}>
          <Check size={13} strokeWidth={2} /> Project archived
        </span>
        <span className="inline-flex items-center gap-1.5 text-[12px]" style={{ color: "var(--text-tertiary)" }}>
          Comment synced 2 minutes ago
        </span>
        <span className="inline-flex items-center gap-1.5 text-[12px]" style={{ color: "var(--danger)" }}>
          <X size={13} strokeWidth={2} /> Unable to sync changes
        </span>
        <button
          disabled
          className="h-7 px-3 rounded-lg text-[12px] opacity-50 pointer-events-none"
          style={{ background: "var(--bg-elevated-2)", border: "1px solid var(--border)", color: "var(--text-tertiary)" }}
        >
          Invite member
        </button>
      </div>
    </div>
  )
}

function Panel({ mode }: { mode: "dark" | "light" }) {
  const tokens = mode === "dark" ? DARK_TOKENS : LIGHT_TOKENS
  return (
    <div
      className="rounded-xl p-5 min-w-0"
      style={{ ...(tokens as CSSProperties), background: "var(--bg-base)", border: "1px solid var(--border)" }}
    >
      <div
        className="text-[11px] uppercase mb-4"
        style={{ color: "var(--text-tertiary)", letterSpacing: "0.06em", fontVariationSettings: fontWeights.medium }}
      >
        {mode} mode
      </div>
      <SpecimenBody />
    </div>
  )
}

export function TypographySpecimen() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Panel mode="light" />
      <Panel mode="dark" />
    </div>
  )
}
