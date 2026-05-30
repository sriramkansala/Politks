# Reference: Approved SaaS surface set (spending card · bio card · invoice dropdown · portfolio dashboard · integrations grid · storage plan · schedule-meeting)

## Classification

Approved

> Source: the 7 product-UI references the project owner supplied as the target
> aesthetic (May 2026). The raw images are not committed (third-party shots);
> this note captures the extracted, brand-neutral lessons. Already mirrored
> into project auto-memory as `ui-style-references`.

## Why this reference matters

This set defines the product's surface language: rounded-xl cards, a single
warm accent, generous-but-purposeful row rhythm, stat-led hierarchy, and
floating dark tooltips. It is the bar every Neo Nīti screen is measured against.

## Borrow

- **Row-item pattern**: icon + label left, value/badge right, thin dividers,
  generous `py-3` rhythm. (Bio card, invoice dropdown.)
- **Stat-led hierarchy**: large heavy number is the hero; its caption label is
  small and muted and never competes. (Spending, portfolio dashboard.)
- **Pill filter tabs** with a clearly recessed inactive state and a single
  obvious active state. (Integrations "All / Enabled / Disabled".)
- **One restrained accent** carrying selection, status, and chart-primary —
  everything else neutral.
- **Floating tooltip card**: compact, two series values, per-series swatch,
  vertical cursor at the hover point. (Spending chart.)
- **Comparison chart language**: solid primary line vs muted/dashed comparison
  line; abbreviated axis labels.
- **App-card grid**: logo + name + category tag (muted, pushed right),
  truncated description, footer with quiet action link left + toggle right.

## Do not borrow

- The literal orange brand hue — Neo Nīti's accent token stays
  `var(--accent)`; do not hardcode `#F97316`.
- The marketing-grade drop shadows on the light dashboard — our light mode uses
  lower-alpha shadows.
- Any specific company logo, copy, or number.
- KPI-card-grid-as-default — only use stat tiles where the metric genuinely
  leads the task (e.g. `/mp` honesty card), never to fill space.

## Typography lesson

Hero numbers large + heavy; caption labels ~11–12px muted, never bold. Section
titles are grounding (medium weight, normal size), not shouting. No all-caps
except tiny metadata. Deltas inline and smaller than the value they annotate.

## Spacing lesson

Dense but breathing: rows are tall enough to scan one-per-glance, cards carry
`p-4`–`p-6`, groups are separated by spacing + a hairline rather than nested
containers. Whitespace expresses relationship, not luxury.

## Interaction lesson

Active filter state is unmistakable and persistent. Toggles are right-aligned
in their row. Tooltips and dropdowns float above content without shifting
layout. Selection > decoration.

## Reusable rule

Every list/detail surface uses the row-item pattern (icon+label left,
value/badge right, hairline divider, `py-3`); stat numbers lead with weight and
size while their labels stay small and muted.
