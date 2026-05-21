import { ExternalLink } from "lucide-react"

export const revalidate = 86400

export default function AboutPage() {
  return (
    <>
      <div className="px-6 py-8 max-w-[860px] mx-auto space-y-8">
        <div>
          <h1 className="h-page mb-2" style={{ color: "var(--text-primary)" }}>
            About Bharat Manifesto Watch
          </h1>
          <p className="text-body" style={{ color: "var(--text-secondary)" }}>
            A citizen accountability dashboard tracking political promises across India.
            Non-partisan. Open source. Built for voters.
          </p>
        </div>

        {[
          {
            title: "Mission",
            content:
              "We believe voters deserve to know whether their elected representatives kept their promises. Bharat Manifesto Watch indexes election manifestos, extracts specific, verifiable commitments, and tracks their delivery using publicly available data.",
          },
          {
            title: "Neutrality",
            content:
              "We apply identical methodology to every party — ruling and opposition. We do not editorialize beyond the factual status rating. We have no political affiliation and accept no funding from political parties or their affiliates.",
          },
          {
            title: "Right of Reply",
            content:
              "Any political party may submit a factual correction or additional evidence for any rating. We will review and update with attribution. Send corrections to the contact listed below.",
          },
          {
            title: "Copyright & Fair Use",
            content:
              "Election manifestos are published for mass distribution but remain copyrighted by the issuing party. We display short verbatim excerpts (≤500 characters per promise) under Indian Copyright Act §52(1)(a)(ii) — fair dealing for purposes of criticism or review. Original PDFs are linked to the party's own hosted source, not reproduced in full.",
          },
          {
            title: "Open Source",
            content:
              "The codebase is available on GitHub under the MIT licence. Data exports (parties, manifestos, promises, status updates) will be published under CC-BY-4.0.",
          },
        ].map(({ title, content }) => (
          <section
            key={title}
            className="rounded-[6px] p-5"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
          >
            <h2 className="h-section mb-2" style={{ color: "var(--text-primary)" }}>{title}</h2>
            <p className="text-body" style={{ color: "var(--text-secondary)" }}>{content}</p>
          </section>
        ))}

        <section>
          <h2 className="h-section mb-3" style={{ color: "var(--text-primary)" }}>Attribution</h2>
          <div className="space-y-2">
            {[
              { label: "Methodology", href: "https://www.politifact.com/truth-o-meter/promises/", text: "PolitiFact Promise Tracker" },
              { label: "Legislative data", href: "https://prsindia.org", text: "PRS Legislative Research (CC-BY-4.0)" },
              { label: "Electoral data", href: "https://eci.gov.in", text: "Election Commission of India" },
              { label: "Open data", href: "https://data.gov.in", text: "Open Government Data Platform India" },
            ].map(({ label, href, text }) => (
              <div key={label} className="flex items-center gap-2 text-body">
                <span style={{ color: "var(--text-tertiary)", minWidth: "120px" }}>{label}</span>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 transition-colors duration-100"
                  style={{ color: "var(--accent)" }}
                >
                  {text} <ExternalLink size={11} strokeWidth={1.5} />
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
