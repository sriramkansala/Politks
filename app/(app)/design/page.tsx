import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusPill } from "@/components/promises/StatusPill"
import { TypographySpecimen } from "@/components/dev/TypographySpecimen"
import { LinearSpecimens } from "@/components/linear/LinearSpecimens"
import { LinearShowcase } from "@/components/linear/LinearShowcase"
import { IndiaTilegramLoader } from "@/components/atlas/IndiaTilegramLoader"
import { type PromiseStatus } from "@/lib/tokens"

const statuses: PromiseStatus[] = [
  "not_yet_rated",
  "in_the_works",
  "stalled",
  "compromise",
  "promise_kept",
  "promise_broken",
]

export default function DesignPage() {
  return (
    <>
      <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto space-y-10">

        {/* Colors */}
        <section>
          <h2 className="h-section mb-4" style={{ color: "var(--text-primary)" }}>Surface palette</h2>
          <div className="flex gap-3 flex-wrap">
            {[
              { label: "bg-base", color: "var(--bg-base)" },
              { label: "bg-elevated", color: "var(--bg-elevated)" },
              { label: "bg-elevated-2", color: "var(--bg-elevated-2)" },
              { label: "bg-input", color: "var(--bg-input)" },
              { label: "border", color: "var(--border)" },
              { label: "accent", color: "var(--accent)" },
              { label: "accent-hover", color: "var(--accent-hover)" },
              { label: "success", color: "var(--success)" },
              { label: "danger", color: "var(--danger)" },
              { label: "warning", color: "var(--warning)" },
              { label: "info", color: "var(--info)" },
            ].map(({ label, color }) => (
              <div key={label} className="flex flex-col items-start gap-1.5">
                <div
                  className="w-12 h-12 rounded-xl"
                  style={{ background: color, border: "1px solid var(--border)" }}
                />
                <span className="text-caption font-mono" style={{ color: "var(--text-tertiary)" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <Separator style={{ background: "var(--border)" }} />

        {/* Typography */}
        <section>
          <h2 className="h-section mb-4" style={{ color: "var(--text-primary)" }}>Typography</h2>
          <div className="space-y-3">
            {[
              { cls: "text-display",    sample: "Display — Neo Nīti" },
              { cls: "text-heading-xl", sample: "Heading XL — Neo Nīti" },
              { cls: "text-heading",    sample: "Heading — Party Promises" },
              { cls: "text-subheading", sample: "Subheading — BJP Sankalp Patra 2024" },
              { cls: "text-body",       sample: "Body — Promise tracking for Indian elections" },
              { cls: "text-caption",    sample: "Caption — Last updated May 2026" },
              { cls: "text-mono",       sample: "Mono — const status = 'promise_kept'" },
            ].map(({ cls, sample }) => (
              <div key={cls}>
                <span className={cls} style={{ color: "var(--text-primary)" }}>{sample}</span>
              </div>
            ))}
          </div>
        </section>

        <Separator style={{ background: "var(--border)" }} />

        {/* Status indicators */}
        <section>
          <h2 className="h-section mb-4" style={{ color: "var(--text-primary)" }}>Status indicators (PolitiFact taxonomy)</h2>
          <div className="space-y-3">
            {/* Dot variant — the default, monochrome list indicator */}
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {statuses.map((s) => <StatusPill key={s} status={s} />)}
            </div>
            {/* Chip variant — status-emphasis surfaces only */}
            <div className="flex flex-wrap gap-2">
              {statuses.map((s) => <StatusPill key={s} status={s} variant="chip" />)}
            </div>
          </div>
        </section>

        <Separator style={{ background: "var(--border)" }} />

        {/* Buttons */}
        <section>
          <h2 className="h-section mb-4" style={{ color: "var(--text-primary)" }}>Buttons</h2>
          <div className="flex gap-3 flex-wrap items-center">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="tertiary">Tertiary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button size="sm">Small</Button>
            <Button disabled>Disabled</Button>
          </div>
        </section>

        <Separator style={{ background: "var(--border)" }} />

        {/* Cards */}
        <section>
          <h2 className="h-section mb-4" style={{ color: "var(--text-primary)" }}>Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="h-section">BJP — Sankalp Patra 2024</CardTitle>
              </CardHeader>
              <CardContent>
                <p style={{ color: "var(--text-secondary)" }}>
                  3 crore new houses under PM Awas Yojana by 2029.
                </p>
                <div className="mt-3 flex gap-2">
                  <Badge variant="solid">Infrastructure</Badge>
                  <Badge variant="solid">National</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="h-section">Skeleton state</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator style={{ background: "var(--border)" }} />

        {/* Inputs */}
        <section>
          <h2 className="h-section mb-4" style={{ color: "var(--text-primary)" }}>Inputs</h2>
          <div className="max-w-sm space-y-3">
            <Input placeholder="Search promises…" />
            <Input placeholder="Disabled" disabled />
          </div>
        </section>

        <Separator style={{ background: "var(--border)" }} />

        {/* Typography specimen — realistic product strings, both themes */}
        <section>
          <h2 className="h-section mb-1" style={{ color: "var(--text-primary)" }}>Typography specimen</h2>
          <p className="text-[13px] mb-4" style={{ color: "var(--text-tertiary)" }}>
            Inter Variable across every product role, rendered in both themes for side-by-side validation.
          </p>
          <TypographySpecimen />
        </section>

        <Separator style={{ background: "var(--border)" }} />

        {/* ── Linear-style component system ─────────────────────────────── */}
        <section>
          <h2 className="h-section mb-1" style={{ color: "var(--text-primary)" }}>
            Linear component system
          </h2>
          <p className="text-[13px] mb-6" style={{ color: "var(--text-tertiary)" }}>
            Workflow primitives — status &amp; priority glyphs, labels, assignees — built to Linear spec.
          </p>
          <LinearSpecimens />
        </section>

        <Separator style={{ background: "var(--border)" }} />

        <section>
          <h2 className="h-section mb-1" style={{ color: "var(--text-primary)" }}>
            Filtering · search · detail panel
          </h2>
          <p className="text-[13px] mb-6" style={{ color: "var(--text-tertiary)" }}>
            Live demo — add filters, click a row to open it, edit its properties, or press ⌘K.
          </p>
          <LinearShowcase />
        </section>

        <Separator style={{ background: "var(--border)" }} />

        {/* ── India constituency tilegram ────────────────────────────────── */}
        <section>
          <h2 className="h-section mb-1" style={{ color: "var(--text-primary)" }}>
            India constituency tilegram
          </h2>
          <p className="text-[13px] mb-6" style={{ color: "var(--text-tertiary)" }}>
            543 Lok Sabha constituencies — one hexagon each. Colour-coded by reserved category.
            Drop in <code className="text-[12px] px-1 py-px rounded" style={{ background: "var(--bg-elevated-2)", color: "var(--accent)" }}>data=</code> to
            colour by any metric (vote share, attendance, whatever).
          </p>
          <IndiaTilegramLoader />
        </section>

      </div>
    </>
  )
}
