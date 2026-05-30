// Static specimen grid for the foundation glyphs/chips — pure render (no state),
// safe to use from the server-rendered /design page. The interactive workflow
// demo lives in LinearShowcase (client).

import { fontWeights } from "@/lib/font-weight"
import { StatusIcon } from "./StatusIcon"
import { PriorityIcon } from "./PriorityIcon"
import { LabelChip } from "./LabelChip"
import { Assignee } from "./Assignee"
import { Kbd } from "./Kbd"
import { STATUS_ORDER, STATUS_META, PRIORITY_ORDER, PRIORITY_META } from "./status"

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
      {children}
    </span>
  )
}

export function LinearSpecimens() {
  return (
    <div className="space-y-6">
      {/* Status glyphs */}
      <div>
        <p
          className="text-[12px] mb-3"
          style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.medium }}
        >
          Status
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-4">
          {STATUS_ORDER.map((s) => (
            <div key={s} className="flex flex-col items-center gap-1.5 w-[84px]">
              <StatusIcon status={s} size={22} />
              <Caption>{STATUS_META[s].label}</Caption>
            </div>
          ))}
        </div>
      </div>

      {/* Priority glyphs */}
      <div>
        <p
          className="text-[12px] mb-3"
          style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.medium }}
        >
          Priority
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-4">
          {PRIORITY_ORDER.map((p) => (
            <div key={p} className="flex flex-col items-center gap-1.5 w-[84px]">
              <PriorityIcon priority={p} size={22} />
              <Caption>{PRIORITY_META[p].label}</Caption>
            </div>
          ))}
        </div>
      </div>

      {/* Labels + assignees + kbd */}
      <div className="flex flex-wrap items-start gap-x-10 gap-y-4">
        <div>
          <p
            className="text-[12px] mb-3"
            style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.medium }}
          >
            Labels
          </p>
          <div className="flex flex-wrap gap-2">
            <LabelChip label="UI" color="#4ea7fc" />
            <LabelChip label="Bug" color="#eb5757" />
            <LabelChip label="Tech debt" color="#b08968" />
            <LabelChip label="Forensic" color="#5e6ad2" />
          </div>
        </div>

        <div>
          <p
            className="text-[12px] mb-3"
            style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.medium }}
          >
            Assignee
          </p>
          <div className="flex items-center gap-2">
            <Assignee name="Priya Nair" color="#5e6ad2" size={24} />
            <Assignee name="Arjun Rao" color="#4cb782" size={24} />
            <Assignee name="Meera Iyer" color="#fc7840" size={24} />
            <Assignee name={null} size={24} />
          </div>
        </div>

        <div>
          <p
            className="text-[12px] mb-3"
            style={{ color: "var(--text-tertiary)", fontVariationSettings: fontWeights.medium }}
          >
            Keys
          </p>
          <div className="flex items-center gap-1.5">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
            <Kbd>↵</Kbd>
            <Kbd>esc</Kbd>
          </div>
        </div>
      </div>
    </div>
  )
}
