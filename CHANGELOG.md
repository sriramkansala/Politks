# Changelog

All notable changes to Neo Nīti are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added
- BMW-032: Bill Diff View — clause-level side-by-side diff with time-machine slider and poison-pill attribution
- BMW-031: Lifecycle Timeline (16-stage) on bill detail pages
- BMW-041: Issue/Causal Graph on WRB bill pages (D3-force canvas)
- Constitutional significance filters in PromiseList (Fundamental Right → Directive Principle → Welfare → Economic → Aspirational)
- Inline SVG party symbols (BJP lotus, INC hand, AAP broom, DMK rising sun) replacing letter avatars
- Promise search bar in party promise list
- `aria-label` on sidebar `<aside>`, `aria-current="page"` on active nav links, skip-to-main-content link
- Mobile navigation: hamburger button in top bar opens slide-in Sheet drawer on viewports < 768 px (§8.2 V6)
- BMW-095 stub: "Challenge this finding" button on forensic signal cards with `aria-live` confirmation (§8.4 V9)
- Vitest unit tests for clause alignment logic, including WRB Article 334A poison-pill scenario (§8.6 V12)
- `@vercel/analytics` wired into root layout for privacy-respecting page-view tracking (§8.7 V15)
- MCC mode infrastructure (§8.4 V8): `lib/mcc.ts` helper + `MccBanner` in app shell; activated via `NEXT_PUBLIC_MCC_MODE=true` to surface ECI compliance notice during election notification periods
- Bharat Civic Atlas — standalone HTML at `public/atlas.html`: 3D globe (globe.gl) with party-coloured Indian states, drill-down panel (State → Constituency → Politician), tabbed profile (Overview / Promises / Legal Record / News / Power Network), and D3 force-directed power-network graph designed to expose party ↔ media ↔ businessman triangles with mode filters, hop limits, path-trace, and a Shared Interests companion table
- "Atlas" link added to sidebar that opens the atlas in a new tab
- `@next/bundle-analyzer` + `npm run analyze` script for JS bundle inspection (§8.1 V1)
- `supabase/0003_bill_diff.sql` — `bill_versions` + `bill_clauses` tables with RLS
- `supabase/seed_wrb_bill_versions.sql` — WRB 2008 vs 2023 clause data for diff demo

### Changed
- Filter chips now use uniform active state (no per-category colors) — Linear aesthetic
- StatusPill significance bar colors use only existing `--status-*` CSS vars
- Input component now reads `useShape()` for border-radius

### Infrastructure
- MIT License added
- `prefers-reduced-motion` block in globals.css
- Self-hosted Inter Variable and JetBrains Mono fonts (no Google CDN)

---

## [0.1.0] — 2025-05 — Private beta

### Added
- Next.js 16.2.6 App Router scaffold
- Linear-faithful design token system (`globals.css`)
- Supabase + Postgres backend (parties, manifestos, promises, bills tables)
- Sidebar + command palette (⌘K) shell
- Party pages with promise list (BJP, INC, AAP, DMK)
- Cross-party comparison page
- Promise tracker with aggregate stats
- WRB forensic seed (5 bills, stage events, issue-graph edges, promise ancestry)
- i18n scaffold via next-intl (English primary, 22 language stubs)
- Admin: manifesto upload, status update dialog
