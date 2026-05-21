// Shared empty state for party-profile subsections that have no curated data
// yet. Single short line, tertiary text, with a contribute link. Used across
// History, Organisation, Donors, Legal-cases, Manifestos tabs.
//
// Linear discipline: one line, no stat-card grids of zeros.

interface PartyEmptyStateProps {
  /** Section name — appears in the message ("History data being compiled."). */
  section: string
}

export function PartyEmptyState({ section }: PartyEmptyStateProps) {
  return (
    <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
      {section} data being compiled.{" "}
      <a
        href="mailto:contribute@bharatmanifesto.watch?subject=Party%20profile%20data"
        style={{ color: "var(--accent)", textDecoration: "none" }}
      >
        Contribute a verified record →
      </a>
    </p>
  )
}
