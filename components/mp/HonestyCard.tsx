// BMW-130 — "Find My MP" Honesty Card
// Linear+FF discipline: stat-card utility class, fontWeights variation, party color band.

import type { Mp } from "@/lib/db/types"
import { fontWeights } from "@/lib/font-weight"
import { formatINR as fmtINR, formatIndianNumber } from "@/lib/format"

type Tone = "good" | "bad" | "warn" | "neutral"

function toneClass(tone: Tone): string {
  switch (tone) {
    case "good": return "tone-good"
    case "bad": return "tone-bad"
    case "warn": return "tone-warn"
    default: return ""
  }
}

function Stat({
  label,
  value,
  note,
  tone = "neutral",
}: {
  label: string
  value: string
  note?: string
  tone?: Tone
}) {
  return (
    <div className={`stat-card ${toneClass(tone)}`}>
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {note && <div className="note">{note}</div>}
    </div>
  )
}

export function HonestyCard({ mp, partyColor }: { mp: Mp; partyColor?: string | null }) {
  const attendanceUnavailable = mp.attendance_pct == null
  const attendanceTone: Tone =
    attendanceUnavailable
      ? "neutral"
      : (mp.attendance_pct ?? 0) >= 80
        ? "good"
        : (mp.attendance_pct ?? 0) >= 50
          ? "warn"
          : "bad"

  const crimAny = mp.criminal_cases_any ?? null
  const crimSerious = mp.criminal_cases_serious ?? null
  const crimTone: Tone =
    crimSerious == null && crimAny == null
      ? "neutral"
      : (crimSerious ?? 0) > 0
        ? "bad"
        : (crimAny ?? 0) > 0
          ? "warn"
          : "good"

  return (
    <article
      className="rounded-[var(--radius-card)] overflow-hidden"
      style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
    >
      {/* Party color band */}
      <div className="party-band" style={{ background: partyColor ?? "var(--accent)" }} />

      <div className="p-5 flex flex-col gap-4">
        {/* Header row */}
        <div className="flex items-start gap-4">
          <div
            className="w-16 h-16 rounded-[var(--radius-card)] shrink-0 overflow-hidden flex items-center justify-center"
            style={{
              background: "var(--bg-elevated-2)",
              border: "1px solid var(--border)",
              color: "var(--text-tertiary)",
            }}
          >
            {mp.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mp.photo_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span
                className="text-[20px]"
                style={{ fontVariationSettings: fontWeights.semibold }}
              >
                {mp.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="h-section" style={{ color: "var(--text-primary)" }}>
              {mp.name}
            </h2>
            <div className="text-[12px] mt-1" style={{ color: "var(--text-secondary)" }}>
              {mp.party_name ?? "Independent"} ·{" "}
              {mp.constituency ?? (mp.house === "rajya_sabha" ? "Rajya Sabha" : "—")}
              {mp.state_code ? ` · ${mp.state_code}` : ""}
            </div>
            {mp.is_minister && (
              <span className="lbl-tiny inline-block mt-2 px-2 py-0.5 rounded-[var(--radius-tag)]" style={{ background: "var(--bg-elevated-2)", border: "1px solid var(--border)" }}>
                Minister · attendance register exempt
              </span>
            )}
          </div>
        </div>

        {/* Stat grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Stat
            label="Attendance"
            value={attendanceUnavailable ? "—" : `${mp.attendance_pct!.toFixed(0)}%`}
            tone={attendanceTone}
            note={
              attendanceUnavailable
                ? mp.attendance_note ?? "Data unavailable"
                : mp.national_avg_attendance != null
                  ? `vs ${mp.national_avg_attendance.toFixed(0)}% nat avg`
                  : undefined
            }
          />
          <Stat
            label="Questions"
            value={mp.questions_asked != null ? formatIndianNumber(mp.questions_asked) : "—"}
            tone={
              mp.questions_asked == null
                ? "neutral"
                : mp.questions_asked >= (mp.national_avg_questions ?? 103)
                  ? "good"
                  : mp.questions_asked === 0
                    ? "bad"
                    : "warn"
            }
            note={mp.national_avg_questions != null ? `vs ${mp.national_avg_questions.toFixed(0)} nat avg` : undefined}
          />
          <Stat
            label="Criminal cases"
            value={
              crimAny == null
                ? "—"
                : crimSerious != null
                  ? `${crimAny} · ${crimSerious} serious`
                  : `${crimAny}`
            }
            tone={crimTone}
            note={crimAny != null ? "Self-declared affidavit" : undefined}
          />
          <Stat
            label="Assets"
            value={fmtINR(mp.assets_inr)}
            tone={mp.assets_inr != null && mp.assets_inr >= 1_00_00_000 ? "warn" : "neutral"}
            note={mp.is_crorepati ? "Crorepati" : undefined}
          />
          <Stat
            label="Debates"
            value={mp.debates_participated != null ? `${mp.debates_participated}` : "—"}
            note={mp.national_avg_debates != null ? `vs ${mp.national_avg_debates.toFixed(1)} nat avg` : undefined}
          />
          <Stat
            label="PM Bills"
            value={mp.private_member_bills != null ? `${mp.private_member_bills}` : "—"}
            note="Only 14 PMBs ever became law"
          />
          <Stat
            label="MPLADS unspent"
            value={fmtINR(mp.mplads_unspent_inr)}
            tone={mp.mplads_unspent_inr != null && mp.mplads_unspent_inr >= 5_00_00_000 ? "bad" : "neutral"}
          />
          <Stat label="Education" value={mp.education_level ?? "—"} />
        </div>

        {/* Confidence + sources */}
        <div
          className="flex flex-wrap items-center gap-2 text-[10px]"
          style={{ color: "var(--text-disabled)" }}
        >
          <span>
            Confidence:{" "}
            <span style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.semibold }}>
              {mp.data_confidence ?? "medium"}
            </span>
          </span>
          {(mp.data_sources ?? []).map((url) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
              style={{ color: "var(--text-tertiary)" }}
            >
              source ↗
            </a>
          ))}
          <span>· Affidavit figures self-reported</span>
        </div>
      </div>
    </article>
  )
}
