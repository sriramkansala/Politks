// /mp/[slug] — Single MP dossier.
// Header: name + party + house. Below: 5-tab layout via MpPageTabs (client).

import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { MP_BY_SLUG, STATIC_MPS_BMW } from "@/lib/db/staticMps"
import { MpPageTabs } from "@/components/mp/MpPageTabs"
import type { Mp } from "@/lib/db/types"
import { fontWeights } from "@/lib/font-weight"

export async function generateStaticParams() {
  return STATIC_MPS_BMW.map((mp) => ({ slug: mp.prs_slug! }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const mp = MP_BY_SLUG[slug]
  if (!mp) return { title: "MP not found · Neo Nīti" }
  return { title: `${mp.name} · ${mp.party_name} · Neo Nīti` }
}

function Initials({ name }: { name: string }) {
  const parts = name.split(/\s+/).filter(Boolean)
  return <>{parts.slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("")}</>
}

export default async function MpDossierPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const mp = MP_BY_SLUG[slug] as Mp | undefined
  if (!mp) notFound()

  const house = mp.house === "rajya_sabha" ? "Rajya Sabha" : "Lok Sabha"

  return (
    <div className="px-6 py-8 max-w-[var(--content-max)] mx-auto">
      {/* Back link */}
      {/* Breadcrumb back-link — documented body-copy exception per UI_RULES.md §1. */}
      <Link
        href="/mp"
        className="inline-flex items-center gap-1 text-[12px] mb-6 transition-colors hover:text-[var(--text-primary)]"
        style={{ color: "var(--text-tertiary)", textDecoration: "none" }}
      >
        <ArrowLeft size={12} />
        All legislators
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        {mp.photo_url ? (
          <div
            className="shrink-0 rounded-full overflow-hidden"
            style={{ width: 56, height: 56, border: "1px solid var(--border)" }}
          >
            <Image
              src={mp.photo_url}
              alt=""
              width={56}
              height={56}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div
            className="shrink-0 rounded-full inline-flex items-center justify-center"
            style={{
              width: 56,
              height: 56,
              background: "var(--bg-tertiary)",
              color: "var(--text-tertiary)",
              border: "1px solid var(--border)",
              fontSize: 16,
              fontVariationSettings: fontWeights.semibold,
            }}
          >
            <Initials name={mp.name} />
          </div>
        )}
        <div>
          <h1
            className="text-[22px] leading-tight"
            style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.semibold, letterSpacing: "-0.02em" }}
          >
            {mp.name}
          </h1>
          <p className="text-[13px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
            {mp.party_name} · {house}
            {mp.constituency ? ` · ${mp.constituency}` : ""}
            {mp.state_code ? ` · ${mp.state_code}` : ""}
          </p>
        </div>
      </div>

      {/* 5-tab layout */}
      <MpPageTabs mp={mp} />
    </div>
  )
}
