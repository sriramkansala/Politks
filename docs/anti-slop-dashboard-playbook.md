# The Anti-Slop Dashboard Playbook
**An operating manual for generating production-quality dashboards with AI coding agents (Claude Code, Codex, Cursor).**
*Research date: May 30, 2026. Current claims verified against official sources (Mobbin docs, GitHub repo pages, Anthropic's published skill/cookbook) where possible; unverifiable items are flagged. Scores and verdicts are reasoned judgment, not measured benchmarks.*
---
## Table of contents
1. [Executive summary](#1-executive-summary)
2. [Root-cause analysis](#2-root-cause-analysis)
3. [GitHub repository landscape](#3-github-repository-landscape)
4. [Mobbin MCP investigation](#4-mobbin-mcp-investigation)
5. [Mobbin MCP query library](#5-mobbin-mcp-query-library)
6. [Anti-pattern taxonomy](#6-anti-pattern-taxonomy)
7. [Reference-selection framework](#7-reference-selection-framework)
8. [Dashboard archetypes](#8-dashboard-archetypes)
9. [Design-token framework](#9-design-token-framework)
10. [Dashboard-generation workflow](#10-dashboard-generation-workflow)
11. [Agent checklist](#11-agent-checklist)
12. [Final one-shot coding-agent prompt](#12-final-one-shot-coding-agent-prompt)
13. [Worked example: webpage-feedback dashboard](#13-worked-example-webpage-feedback-dashboard)
14. [Limitations and open questions](#14-limitations-and-open-questions)
---
## 1. Executive summary
The reliable way to stop an AI coding agent from producing a dashboard that "looks AI-generated" is to **invert its default order of operations**: force research and a written design spec *before* any code, constrain it to **ONE coherent visual direction**, and close with a **screenshot-driven visual QA loop**.
Anthropic names the failure mode in its official Frontend Design skill: models "tend to converge toward generic, 'on distribution' outputs. In frontend design, this creates what users call the 'AI slop' aesthetic." The fix is not a cleverer one-line prompt — it is a *process* that supplies the three things the model lacks by default:
1. **Product context** (the real workflow and data model),
2. **A dominant UX grammar** from real shipped products (via Mobbin MCP),
3. **Explicit design tokens + explicitly-rejected patterns.**
**Core principles**
- **Process beats prompting.** The biggest lever is research → ONE UX grammar (Mobbin) + ONE primary implementation foundation (GitHub) → token-level design spec → code → screenshot-compare-fix loop.
- **Most slop is statistical-default behavior, not a taste deficit.** Four KPI cards, purple/blue gradients, Inter font, card-in-card nesting, giant radii are the high-probability center of the training distribution. Ban them by name; replace with product-specific defaults.
- **Right reference for the right job, used sparingly.** **GitHub repos = implementation references** ("how do I build a filterable table?"). **Mobbin screens = product-design/interaction references** ("what does a competent team's table look and behave like?"). Cap dominant references at **one UX grammar + one primary repo + ≤2 secondary repos**. Document which source drove each decision. Check licenses before reusing code.
A single starter cloned wholesale → a derivative interface. Too many unrelated references → a "Frankenstein dashboard."
---
## 2. Root-cause analysis
### The mechanism: distributional convergence
Without explicit guidance, the model predicts tokens from statistical patterns — and "safe" design choices that work everywhere dominate the web. So it samples the high-probability center: Inter/Roboto, purple gradient on white, a 3–4 card grid, rounded cards, a blue primary button. Anthropic's `frontend-design` skill explicitly forbids "overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design."
### The three causes of slop
**A) Under-specified prompts.** Every unspecified decision reverts to a default → four oversized KPI cards, arbitrary charts, oversized titles, generic activity feeds, placeholder metrics, marketing copy in-app. *"Silence in your design system = Claude defaults."*
**B) Leaning on component-library conventions.** shadcn/Radix/starter demos ship compositions (the official `dashboard-01` block = sidebar + four cards + one area chart + a table). Treating the demo as the product yields card-in-card nesting, indiscriminate radii, pills everywhere, decorative icon boxes, heavy shadows.
**C) Skipping research.** No domain model and no UX reference → generic sidebars, low-density airy layouts, weak tables (the real work surface), weak navigation hierarchy, inconsistent icons, random illustrations.
### What makes a dashboard feel like a real product
Linear is the canonical example — it "looks engineered: dense, information-rich, keyboard-driven, with every pixel serving a functional purpose. The beauty comes from precision, not decoration." A dashboard feels real when:
1. it is organized around a real workflow and the most frequent action is immediately reachable;
2. hierarchy comes from weight/size/contrast, **not** from wrapping everything in a card;
3. density matches user frequency (power users want more per screen);
4. the **table/list** — usually the real work surface — is excellent;
5. **one** accent color is used decisively;
6. empty/loading/error states are designed, not afterthoughts.
The 2026 consensus: *un-curated* density is the problem, not density itself. Figma, Notion, and Linear prove dense interfaces stay legible when hierarchy and structure do the work.
### Six interface types — don't confuse them
| Type | What it optimizes for | Reuse for |
|---|---|---|
| Admin-dashboard template | Breadth of demo pages | Shell/routing only |
| Component-library demo | Showcasing components | Component wiring, never the blueprint |
| Design-system showcase | Tokens & primitives | Token discipline, primitives |
| Internal-tool interface | Reliability, dense tables, permissions | Operational patterns |
| Polished shipped SaaS | Cohesive opinionated product | UX grammar (study, don't clone) |
| Domain-specific dashboard | Domain conventions (finance deltas, CRM stages) | Domain grammar |
---
## 3. GitHub repository landscape
**Methodology.** Stars are a *discovery signal only* — the most-starred repo is often not the best design reference. Two scores per repo: **Implementation quality** (how good to build on) vs **Design-reference quality** (how good as a visual/interaction model). Star/maintenance values verified by direct fetch on May 30, 2026 and change continuously.
**Scoring rubric (/100):** Visual quality & restraint 20 · Information hierarchy 15 · Realistic data density 15 · Table/list quality 10 · Navigation 10 · Interaction 10 · Code quality 10 · Maintenance 5 · Accessibility & responsive 5.
### Shortlist (22 repos)
**Dashboard foundations / admin starters**
| Repo | Stars | Stack | License | Impl / Design | Verdict |
|---|---|---|---|---|---|
| **satnaing/shadcn-admin** | ~11.4k | Vite + React + TanStack Router + shadcn | MIT | 84 / 72 | **Primary** (shell, Cmd+K, settings) |
| **Kiranism/next-shadcn-dashboard-starter** | ~6k | Next.js App Router + shadcn + TanStack Table + nuqs + Clerk + kbar | MIT | 86 / 68 | **Primary (Next.js foundation)** |
| **arhamkhnz/next-shadcn-admin-dashboard** | ~2.3k | Next.js 16 + Tailwind v4 | MIT | 80 / 70 | Secondary |
| shadcnstore/shadcn-dashboard-landing-template | — | Vite + Next dual, Tailwind v4 | MIT (verify) | 74 / 64 | Niche |
| NaveenDA/shadcn-nextjs-dashboard | — | Next.js 14 minimal | MIT (verify) | 70 / 58 | Niche (minimal) |
| horizon-ui/shadcn-nextjs-boilerplate | — | Next.js AI admin | — | 68 / 56 | Niche |
| themesberg/flowbite-admin-dashboard | — | Tailwind + Flowbite + ApexCharts | MIT | 72 / 60 | Niche / secondary-stack |
**Data-heavy interface references**
| Repo | Stars | Notes | License | Impl / Design | Verdict |
|---|---|---|---|---|---|
| **openstatusHQ/data-table-filters** | ~1.9k | Best open data-table ref: faceted filters, URL-shareable state, infinite scroll, cmdk; inspired by Datadog/Vercel/Axiom | **MIT** | 90 / 82 | **Primary (data tables)** |
| **shadcn-ui/ui** (examples + blocks) | ~70k+ *(unverified)* | Canonical primitives; the `dashboard-01` layout IS the slop archetype | MIT | 88 / 74 | **Primary (primitives) / inspect (the demo layout)** |
| **tremorlabs/tremor** | ~16.5k | 35+ chart/dashboard components; **maintenance mode** post Vercel acquisition (last release Jan 2025) | MIT | 86 / 80 | Primary (analytics components) |
| **tremorlabs/template-dashboard-oss** | — | Free Tremor SaaS template | Apache-2.0 | 82 / 80 | Primary (analytics) |
**Internal-tool platforms (study patterns; do not clone the engine)**
| Repo | Stars | License | Design ref | Verdict |
|---|---|---|---|---|
| ToolJet/ToolJet | ~37.9k | **Copyleft (GPL/AGPL family)** | 78 | Inspect, don't clone |
| appsmithorg/appsmith | — | Copyleft | 76 | Inspect, don't clone |
| **refinedev/refine** | — | **MIT** | 70 (impl 84) | **Primary (CRUD admin architecture)** |
| nocobase/nocobase | — | — | — | Inspect |
**Domain-specific references**
| Repo | Stars | Domain | License | Verdict |
|---|---|---|---|---|
| makeplane/plane | ~48.9k | PM | **AGPL** | Inspect, don't clone (PM grammar) |
| twentyhq/twenty | ~45.8k | CRM | **AGPL** | Inspect, don't clone (CRM grammar) |
| maybe-finance/maybe | ~54.1k | Finance | **AGPLv3** | Inspect only — **ARCHIVED/read-only since Jul 2025** |
| midday-ai/midday | — | Finance/ops | **AGPL-3.0** | Inspect, don't clone |
| openstatusHQ/openstatus | ~8.7k | Ops | **AGPL-3.0** | Inspect (clone only the MIT `data-table-filters` sibling) |
| thefrontkit premium kits | — | CRM/PM/SaaS | Not OSS (paid) | Niche (paid reference) |
| Ghostfolio | — | Wealth/portfolio | — | Inspect (finance) |
### Recommendation categories
- **A) Best foundations:** Kiranism (Next.js), satnaing (Vite/SPA), arhamkhnz (current-stack secondary).
- **B) Best data-heavy refs:** openstatusHQ/data-table-filters, official shadcn data-table example, refine.
- **C) Best design-system refs:** shadcn-ui/ui (primitives/tokens), Tremor (analytics primitives), Geist clone / open design systems.
- **D) Best domain-specific refs:** Plane (PM), Twenty (CRM), Midday/Ghostfolio/Maybe (finance), openstatus (ops), Tremor template (analytics).
- **E) Inspect but don't clone:** ToolJet, Appsmith, NocoBase, Plane, Twenty, Maybe, Midday, openstatus.
- **F) Avoid (as design references):** the literal shadcn `dashboard-01` demo layout, unmaintained "50-page" admin themes used as a blueprint, AGPL/GPL code copied into proprietary products.
**License discipline.** MIT/Apache-2.0 (satnaing, Kiranism, arhamkhnz, data-table-filters, Tremor, refine, official shadcn) → safe to reuse with attribution. AGPL/GPL (Plane, Twenty, Maybe, Midday, openstatus server, ToolJet, Appsmith) → treat as visual/pattern references, not code donors, unless you accept copyleft.
---
## 4. Mobbin MCP investigation
*(Verified against docs.mobbin.com and the Business Wire launch release.)*
- **What it is:** the **official** Model Context Protocol server from Mobbin, launched **May 12, 2026**, currently **in beta**. Library: **621,500+ screens** and **142,200+ flows** from shipped apps across fintech, e-commerce, health, productivity, social, SaaS. CEO Jiho Lim: it "gives AI agents access to real design decisions, patterns, and flows, not generated guesses."
- **Endpoint / transport / auth:** remote server at **`https://api.mobbin.com/mcp`**, **Streamable HTTP** transport, **OAuth** (browser-based; no API key needed).
- **Claude Code setup:** `claude mcp add mobbin --scope user --transport http https://api.mobbin.com/mcp` → `/mcp` → Authenticate.
- **Supported clients:** ChatGPT, Claude Code, Claude Desktop, Claude Web, Codex App, Codex CLI, Cursor, Lovable, Magic Patterns, Manus, Replit, v0, and any client supporting Streamable HTTP + OAuth.
- **Search & images:** natural-language queries; screen images returned inline (base64) so multimodal models can analyze them.
- **Plans:** MCP on **Pro, Team, Enterprise** (free plan excludes MCP). Cheapest = **Pro from €10/mo billed yearly**. The REST API (distinct from MCP) is Team & Enterprise only.
- **Vs a static gallery:** injects the library *into the agent's workflow* — it searches mid-task and grounds implementation in shipped patterns without a context switch. The difference between *guessing* and *seeing* what good looks like.
**⚠️ Tool names — only partially verified.** Mobbin's public docs do **not** enumerate official MCP tool names; only **`get_screen_detail`** is corroborated (third-party review). The widely-circulated `mobbin_search_screens`, `mobbin_search_flows`, etc. belong to the **deprecated UNOFFICIAL** `pdcolandrea/mobbin-mcp` server. **Discover the real tools by listing them after connecting an authenticated paid account.**
**Correct role — what it IS NOT:** not a source for copying one screen verbatim; not a mood board of unrelated screenshots; not a shortcut for imitating a recognizable product; not a replacement for product requirements.
**Correct role — what it IS:** a *structured source of evidence* for dashboard shells, density, when summary cards earn their place, navigation structure, filter placement, chart appropriateness, table patterns (sort/filter/pagination/bulk actions), empty states, in-dashboard onboarding, drawer-vs-modal, progressive disclosure, settings separation, and avoiding visual noise. **Always run a structured screen-analysis pass before implementing** — a flat screenshot alone still produces "vibe-coded" output.
---
## 5. Mobbin MCP query library
**General rule:** select **3–5 screens from ONE product family** per question; never blend radii/spacing/color logic across products.
**General desktop patterns**
- *"Desktop SaaS dashboard overview screens with sidebar navigation"* — establish shell grammar. Extract sidebar width/grouping, header content, primary-action placement, content rhythm. Ignore brand colors/illustrations.
- *"Web app empty dashboard first-run state"* — onboarding/empty patterns.
**Analytics**
- *"Analytics dashboard with date range filter and comparison period"* — one dominant chart, PoP comparison, metric placement, drill-down table. Ignore card walls.
- *"Product analytics funnel and retention screens"* — funnel viz, cohort tables.
**Finance**
- *"Fintech account balance and transactions dashboard"* — balance hierarchy, red/green discipline, transaction table, time controls. Ignore crypto neon.
- *"Investment portfolio breakdown and performance screens"* — allocation viz, benchmarks. Ignore misleading dual-axis.
**Operational / internal**
- *"Admin operations table with filters and bulk actions"* — searchable table, status chips, row actions, bulk toolbar, ownership.
- *"Logistics / order management operational dashboard"* — status pipelines, SLA columns, detail drawers.
**CRM**
- *"CRM pipeline and deal stages board"* — pipeline columns, deal cards, stage progression. Ignore card-only reductions.
- *"CRM contact detail and activity timeline"* — scoped activity, follow-up surfacing.
**Project management**
- *"Issue tracker list and board views with filters"* — list density, saved views, labels/assignees/dates, command menu. Ignore chart-heavy variants.
**Empty states & onboarding**
- *"Dashboard empty state and getting-started screens"* — first-run guidance, sample-data prompts, primary CTA.
**Tables & filters**
- *"Data table with faceted filters, sorting, pagination, column visibility"* — filter placement, sort affordances, density toggle, pagination vs infinite scroll.
**Settings & permissions**
- *"Workspace settings, members, and roles/permissions screens"* — settings IA separated from main workflow, member tables, role assignment.
**Loading / errors / edge cases**
- *"Dashboard loading skeletons and error states"* — skeletons, inline errors, retry affordances.
### Mobbin screen-analysis framework (one row per selected screen)
| Field | Capture |
|---|---|
| Product context | App, category, who uses it |
| Page purpose | The one job this screen serves |
| Shell | Sidebar/topbar structure, regions |
| Hierarchy | What dominates; what recedes |
| Density | Compact / regular / relaxed; rows per screen |
| Cards | Where used and WHY (do they earn their place?) |
| Tables | Columns, anchor column, sort/filter/bulk patterns |
| Charts | Type + the question it answers + comparison context |
| Controls | Filters, search, tabs, date ranges placement |
| Typography | Scale, weight contrast, mono usage |
| Spacing | Base unit, gaps, paddings |
| Borders | Border vs shadow for separation |
| Radius | Corner radii on cards/buttons/tags |
| Color | Accent discipline; semantic (pos/neg) usage |
| Icons | Set, sizes, consistency |
| States | Empty/loading/error handling |
| Progressive disclosure | Drawer vs modal vs detail page |
| Microcopy | Tone, labels, helpful text |
| Reusable insight | The one principle to carry forward |
| Rejection note | What NOT to copy from this screen |
---
## 6. Anti-pattern taxonomy
For each: what it looks like → why agents produce it → why it weakens the UI → when it's still OK → better default.
1. **Four oversized KPI cards by default** — top row of 4 equal cards · statistical default + `dashboard-01` · forces unrelated metrics into equal weight, wastes space · OK for genuine exec north-star metrics · **→ compact KPI strip with sparklines + deltas, or none for ops tools.**
2. **Random line chart** — chart with no question · "charts look like a dashboard" · decoration · OK when time-trend IS the question · **→ chart type follows data shape; only if it answers a stated question.**
3. **Card around every section** — every block bordered/shadowed · library default · visual noise, flat hierarchy · OK for genuinely distinct objects · **→ spacing/weight + a single divider.**
4. **Nested cards** — cards inside cards · naive demo composition · doubled borders, confused hierarchy · rarely · **→ flatten to one surface.**
5. **Purple/blue gradient** — purple-on-white hero · most-cited AI tell · signals "AI-generated" · almost never in a working dashboard · **→ one neutral surface system + one decisive accent.**
6. **Giant rounded corners** — 16–24px everywhere · default "friendly" look · wastes space, weakens density · OK for marketing/consumer · **→ restrained radii (~6–8px cards, 2–4px tags), applied consistently.**
7. **Heavy drop shadows** — big soft shadows everywhere · default elevation · muddy/dated · OK for true floating elements · **→ borders + subtle surface steps; shadows only on overlays.**
8. **Empty/fake activity feed** — generic "recent activity" lorem · fills space · no meaning · OK when real & scoped · **→ real filterable role-relevant events, or omit.**
9. **Fake analytics / placeholder metrics** — dummy numbers · model invents data · erodes trust · OK only in labeled prototypes · **→ realistic product-specific sample data.**
10. **Oversized dashboard title** — huge "Dashboard" H1 · default heading scale · wastes prime space · rarely · **→ compact contextual title + breadcrumbs.**
11. **Excessive whitespace / low density** — sparse layout for a power tool · "clean = good" prior · slows power users · OK for first-run/consumer · **→ match density to frequency; offer a density toggle.**
12. **Decorative icon boxes** — colored rounded squares behind icons · default adornment · noise · OK for categorical color · **→ consistent monochrome icons sized to text.**
13. **Pill controls everywhere** — everything a pill · default control shape · ambiguous affordance · OK for filter chips/tags · **→ distinct shapes per control role.**
14. **Too many widgets** — wall of unrelated widgets · "show everything" · communicates nothing · OK for configurable BI canvases · **→ cap widgets; one screen answers a small set of questions.**
15. **Marketing copy inside the app** — "Built for the modern team" in-app · landing-page bleed · wrong register · never in-app · **→ functional microcopy + real labels.**
16. **Unnecessary animation** — everything fades/slides · default "delight" · slows interaction · OK for one orchestrated load · **→ restrained, purposeful motion; respect reduced-motion.**
17. **Generic stock illustrations** — same flat blobs · empty-state filler · off-brand · rarely · **→ functional empty states with a clear action.**
18. **Weak tables** — unstyled, no sort/filter/states · tables are hard, agent under-invests · the table is the real work surface · never for data-heavy tools · **→ anchor column first, right-aligned numbers, sortable headers, faceted filters, hover/bulk actions, density toggle, sticky header, real states (model on openstatus `data-table-filters`).**
**Additional patterns found:** (19) identical padding/radius on every element; (20) timid evenly-distributed palettes (*"dominant colors with sharp accents outperform timid, evenly-distributed palettes"*); (21) hover states that do nothing / snapping transitions; (22) center-aligned numeric columns (right-align for magnitude scanning).
23. **Ad-hoc / inconsistent type sizing** — text rendered at random, oversized, or one-off sizes that don't match across the UI (a 19px label here, a 23px heading there, body text that drifts between 14/15/16 on different screens). *Why agents do it:* the model picks a font size locally per component instead of pulling from a fixed scale — "Silence in the design system = defaults," so each section improvises and the same semantic element (a section header, a table cell) ends up at different sizes across pages. *Why it weakens the UI:* nothing signals "AI-generated / un-systematic" faster than the same kind of text appearing at different sizes; it destroys the weight/size hierarchy that makes a dense dashboard legible. *When it's OK:* never inside one product — the only legitimate size variation is a deliberate, documented scale step. *Better default:* **define a fixed, named type scale up front and bind every text element to a step.** Forbid off-scale values (`text-[19px]`, arbitrary rem). Generate hierarchy with weight + color, not by inventing sizes. The same semantic element must use the same step on every screen (all page titles = 2xl, all table cells = sm, all section headers = md). Audit by listing every distinct font size used; if the count exceeds your scale, you have drift.
---
## 7. Reference-selection framework
Strict hierarchy the agent must follow **before** implementation:
1. **Product requirements** — real workflows, actions, data model. Dominates everything.
2. **One dominant UX grammar from Mobbin MCP** — a cohesive family of shipped screens from the *appropriate* category. 3–5 screens, one product family.
3. **One primary GitHub implementation foundation** — maintained, stack-aligned.
4. **One or two secondary GitHub references** — ONLY to fill missing implementation details (tables → data-table-filters; charts → Tremor; CRUD → refine; settings/Cmd+K → satnaing). Not for visual direction.
5. **Existing application design system** — tokens/components/brand rules take precedence over any external reference.
6. **Visual audit loop** — screenshot vs brief and reference family; fix; repeat.
**Maximum dominant references: ONE UX grammar + ONE primary repo (+ ≤2 narrowly-scoped secondary repos).** More than this → Frankenstein output.
**Documentation rule:** keep a short "decision provenance" note — for each major decision (shell, table, charts, color, density) record which source (requirements / Mobbin family / repo) influenced it. Prevents silent drift and makes the design defensible.
---
## 8. Dashboard archetypes
| Archetype | Prioritize | Avoid | GitHub queries | Mobbin queries |
|---|---|---|---|---|
| **A. Analytics** | Date ranges, ONE dominant chart, comparison periods, 3–5 meaningful summaries, drill-down tables, filters, export | Unrelated widgets, charts without a question, metric-card walls | `analytics dashboard react language:TypeScript stars:>300`; Tremor + template-dashboard-oss | "analytics dashboard with date range and comparison period"; "retention/funnel screens" |
| **B. Operational** | Searchable tables, statuses, filters, bulk actions, ownership, deadlines, row actions, drawers/detail, audit history | Decorative analytics replacing work surfaces | `internal tools dashboard react stars:>500`; data-table-filters, refine | "admin operations table with filters and bulk actions"; "logistics order management" |
| **C. Financial** | Balances, portfolio/account breakdowns, transactions, time periods, performance context, careful +/- treatment, accessible tables | Crypto neon noise, excessive gradients, misleading viz | `finance portfolio dashboard nextjs`; Midday/Ghostfolio/Maybe (study) | "fintech account balance and transactions"; "investment portfolio performance" |
| **D. Project management** | Projects, issues, statuses, assignees, labels, due dates, saved filters, keyboard actions, command menus | Excessive charts | `project management dashboard react`; makeplane/plane (study) | "issue tracker list and board views with filters"; "sprint/cycle planning" |
| **E. CRM** | Pipeline, contacts, accounts, deal stages, activities, follow-ups, ownership, filters, search, drill-down | Reducing CRM to summary cards | `crm dashboard react`; twentyhq/twenty (study) | "CRM pipeline and deal stages board"; "contact detail and activity timeline" |
| **F. Internal admin** | Reliability, clarity, permissions, dense tables, search, filtering, batch actions, confirmations, auditability | Aesthetic experimentation that slows tasks | `admin-dashboard language:TypeScript stars:>500`; `topic:internal-tools`; ToolJet/Appsmith (study), refine | "admin settings members roles permissions"; "internal tool data management" |
---
## 9. Design-token framework
The goal is a disciplined token-**selection process**, not one universal system. Recommended defaults for a desktop B2B dashboard (adapt per brand):
| Token | Recommended default |
|---|---|
| Spacing scale | 4px base; 4/8/12/16/24/32/48. Dense surfaces use 4/8/12 paddings, not 16–24 |
| Type scale | **Fixed, named steps only** — e.g. xs 12 (meta/captions), sm 13–14 (body/table), base 14–15, md 16 (section), lg 18, xl 20, 2xl 24 (page title). Every text element MUST map to one step; **no off-scale values** (`text-[19px]`, ad-hoc rem). Create hierarchy with **weight contrast** (500 body / 600–700 headings) and color, not by inventing new sizes |
| Border colors | one subtle border token + one stronger divider |
| Surface hierarchy | base → surface → elevated (3 steps) via value steps, not shadows |
| Border-radius | 2px tags/badges, 6px cards/inputs/buttons, 8px modals; avoid >12px in tools |
| Shadow | none on static surfaces; one elevation reserved for true overlays |
| Accent color | ONE dominant accent + neutrals; green/red for +/-, amber for warning, used sparingly |
| Chart colors | small ordered categorical palette from the accent; never rainbow; colorblind-safe |
| Selected state | accent-tinted bg + accent border/check; never color alone |
| Hover state | subtle surface step + cursor; reveal row actions on hover |
| Disabled state | reduced opacity + no pointer; preserve layout |
| Destructive | red, confirmation required, never default focus |
| Icon sizes | 16px inline/table, 20px nav; one set (e.g., Lucide) |
| Table row height | compact 40 / regular 48 / relaxed 56; default 48 + density toggle |
| Sidebar width | ~240–280px; collapsible to icon rail |
| Header height | ~48–64px |
| Content max width | full-bleed for tables/ops; ~1200–1440px cap for analytical/reading |
| Breakpoints | sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536; desktop-first; collapse sidebar < lg |
**Density guidance:** high density for frequent power users and data-heavy tools (compress whitespace with discipline, lean on hierarchy); more whitespace for first-run, low-frequency, or consumer contexts. Offer a density toggle when both audiences exist.
---
## 10. Dashboard-generation workflow
1. **Understand the product** — primary user; the task that brings them; most frequent action; what's visible immediately vs behind drill-downs; type (operational/analytical/administrative/editorial/financial/collaborative); use frequency; data volume; states for first-time / returning / admin / restricted users.
2. **Search GitHub** for stack-aligned implementation refs. Inspect beyond READMEs: shell, routes, sidebar grouping, header, tables (sort/filter/search/pagination), command palette, forms, drawers/modals, empty/error/skeleton states, responsive, tokens, radius, icons, charts, accessibility, composition, state, sample data.
3. **Search Mobbin MCP** for shipped screens in the right category; run the screen-analysis framework on 3–5 screens from ONE product family.
4. **Select ONE visual direction** — don't merge styles; commit to a tone + token set.
5. **Write a compact design specification** (template below); get it approved before coding.
6. **Implement** only after spec approval; reuse the same tokens everywhere.
7. **Visual QA loop** — run app → screenshot → compare to Mobbin refs + spec → remove filler → fix spacing/typography/density/alignment → test empty/loading/error states → repeat until cohesive.
### Design specification template
```
Product category:
Primary user:
Primary job:
Dashboard shell:
Sidebar:
Header:
Primary action:
Main content region:
Secondary content:
Tables:
Charts:
Filters:
Search:
Tabs:
Drawers:
Modals:
Empty states:
Loading states:
Error states:
Permissions:
Responsive behavior:
Typography scale:
Spacing scale:
Border rules:
Radius scale:
Shadow rules:
Color rules:
Icon rules:
Animation rules:
Explicitly rejected patterns:
```
---
## 11. Agent checklist
Save as `docs/dashboard-design-checklist.md`:
```markdown
# Dashboard Design Checklist
## Before implementation
- [ ] Product purpose understood (primary user, primary job)
- [ ] Dominant workflow + most-frequent action identified
- [ ] Data model understood (entities, relationships, volume)
- [ ] GitHub repos inspected (shell, tables, states, tokens) — not just READMEs
- [ ] Mobbin MCP searches completed; 3–5 screens analyzed from ONE product family
- [ ] ONE cohesive visual direction selected (no merged styles)
- [ ] Design tokens defined (spacing, type, color, radius, shadow, density, sidebar/header sizes)
- [ ] Explicitly rejected patterns documented (no purple gradient, no 4-KPI default, etc.)
- [ ] Decision provenance noted (which source influenced each major decision)
## During implementation
- [ ] No arbitrary cards (cards only when IA requires)
- [ ] No nested cards unless IA truly nests
- [ ] No arbitrary charts (every chart answers a stated question)
- [ ] Realistic, product-specific data (no lorem/fake metrics)
- [ ] Responsive behavior implemented (sidebar collapses < lg)
- [ ] Table states: sort, filter, pagination/infinite scroll, density, bulk actions
- [ ] Empty states designed (with clear primary action)
- [ ] Loading states (skeletons) implemented
- [ ] Error states (inline, with retry) implemented
- [ ] Keyboard/accessibility behavior (focus states, ARIA, reduced-motion)
- [ ] Every component reuses the SAME tokens
- [ ] Every text element maps to a named type-scale step (no ad-hoc/off-scale font sizes); hierarchy via weight + color, not invented sizes
## After implementation
- [ ] Local app run
- [ ] Screenshot captured
- [ ] Screenshot audited against spec + Mobbin references
- [ ] Unnecessary widgets/sections removed
- [ ] Hierarchy / spacing / typography / responsive checked
- [ ] Typography audited — every text size maps to a defined scale step; no off-scale values; same semantic element uses the same step on every screen
- [ ] First-use / populated / error states checked
- [ ] Screenshot-review-fix loop repeated until cohesive
```
---
## 12. Final one-shot coding-agent prompt
```
You are building a production-quality dashboard. Do NOT produce a generic AI dashboard.
STEP 1 — INSPECT: Read this repository. Identify the stack, existing design tokens,
component library, and conventions. Reuse what exists.
STEP 2 — UNDERSTAND THE PRODUCT: State the primary user, the task that brings them,
the most frequent action, the data model, and which states matter (first-run, populated,
admin, restricted). If unknown, ask before coding.
STEP 3 — SEARCH GITHUB for maintained, stack-aligned references. Inspect beyond READMEs:
app shell, sidebar grouping, header, tables (sort/filter/pagination), command palette,
forms, drawers/modals, empty/loading/error states, tokens, radius, icons, charts,
accessibility, state management. Prefer MIT/Apache repos for reuse; treat AGPL/GPL as
visual references only.
STEP 4 — USE MOBBIN MCP to search REAL shipped-product screens in the correct product
category (analytics / finance / CRM / PM / operational / admin). Analyze 3–5 screens
from ONE product family. Extract: shell, density, when summary cards earn their place,
navigation, filter placement, chart appropriateness, table patterns, empty states,
drawer-vs-modal, progressive disclosure, settings separation.
STEP 5 — SELECT ONE dominant UX grammar + ONE primary implementation foundation
(+ at most two narrowly-scoped secondary repos). Do NOT merge unrelated visual styles.
STEP 6 — DOCUMENT DESIGN RULES + DEFINE TOKENS: spacing, type scale, surfaces, borders,
radius, shadows, one accent color, chart colors, selected/hover/disabled/destructive
states, icon sizes, table row height, sidebar/header sizes, content width, breakpoints,
and an explicit list of REJECTED patterns. Get sign-off on this spec before coding.
STEP 7 — IMPLEMENT using the chosen primitives and tokens consistently.
STEP 8 — RUN THE APP, capture screenshots, and perform a VISUAL AUDIT against the spec
and the Mobbin references. Fix spacing/typography/density/alignment, remove filler,
test empty/loading/error states. Iterate the screenshot-review-fix loop until cohesive.
STRICT ANTI-SLOP RULES:
- Do NOT add sections to fill space. Do NOT assume four KPI cards.
- Do NOT use a chart unless it answers a clear product question (chart type follows data shape).
- Do NOT place every section in a rounded card. Do NOT nest cards unless the IA requires it.
- Do NOT combine unrelated visual styles. Do NOT blindly copy a GitHub template.
- Do NOT copy a Mobbin screen verbatim.
- Do NOT use gradients, glassmorphism, excessive shadows, giant radii, decorative animation,
  Inter/Roboto, or purple-on-white unless explicitly justified by the brand.
- USE realistic, product-specific data.
- For operational products, PRIORITIZE tables/lists/filters/workflows over decorative analytics.
- For analytical products, PRIORITIZE comparisons/drill-downs over metric walls.
- USE one coherent design system across every screen.
- BIND every text element to a fixed, named type scale — no ad-hoc or off-scale font sizes
  (no text-[19px], no arbitrary rem). The same semantic element (page title, section header,
  table cell) must use the same step on EVERY screen. Build hierarchy with weight + color,
  not by inventing new sizes.
```
---
## 13. Worked example: webpage-feedback dashboard
**Product:** desktop B2B SaaS dashboard for a webpage-feedback tool — manage projects, browse annotated webpages, review comments, filter issues, assign ownership, sync selected comments to Linear/Jira, manage workspace members.
**Product requirements**
- Primary user: a product/QA lead or designer triaging webpage feedback across projects.
- Primary job: review/triage annotated comments, assign owners, push selected items to Linear/Jira.
- Most frequent action: filtering/triaging comments and assigning ownership (a **table/list** operation, not a chart).
- Immediately visible: the comment/issue queue with filters, status, owner, source page; project switcher.
- Behind drill-downs: annotated-page viewer, comment detail, member management, integration settings.
- Type: **operational** (work surface) with light analytical accents — NOT an analytics dashboard.
- States: first-run (no projects/comments), populated queue, restricted member (read-only), admin (member/integration management).
**GitHub queries:** `internal tools dashboard react stars:>500`; `nextjs dashboard tailwind language:TypeScript`; `shadcn dashboard language:TypeScript stars:>500`; `topic:internal-tools`; `topic:shadcn-ui`.
**Repository references chosen**
- **Primary implementation:** Kiranism/next-shadcn-dashboard-starter (Next.js shell, RBAC nav, command palette).
- **Secondary (tables/filters):** openstatusHQ/data-table-filters (queue with faceted filters, sorting, bulk actions, URL-shareable views).
- **Secondary (settings/members + Cmd+K):** satnaing/shadcn-admin.
- **Domain grammar (study only, AGPL):** twentyhq/twenty (record detail + activity), makeplane/plane (issue list + command menu).
**Mobbin MCP queries:** "admin operations table with filters and bulk actions"; "issue tracker list view with labels, assignees, and filters"; "comment/annotation review interface"; "workspace settings, members, and roles/permissions screens"; "integration settings / connect third-party app"; "empty state and first-run onboarding for a collaboration tool." Analyze 3–5 screens from ONE Linear-like product family.
**Chosen UX grammar:** a Linear-like engineered-density grammar — neutral surfaces, one accent, dense keyboard-driven issue list, command menu, detail drawers, restrained ~6px radii, borders over shadows. (Studied via Mobbin; NOT cloned.)
**Mini design specification**
- **Category:** operational (feedback triage). **User:** product/QA lead. **Job:** triage comments → assign owner → sync to Linear/Jira.
- **Shell:** 240px collapsible sidebar (Projects switcher; Inbox/All comments; By page; Members; Settings); ~56px header (search, Cmd+K, project context, primary action).
- **Sidebar:** project switcher top; nav grouped (Triage / Pages / Admin); role-filtered (RBAC).
- **Header:** breadcrumb (Project / View), search, Cmd+K, "New project," user menu.
- **Primary action:** "Sync to Linear/Jira" on selected rows (bulk toolbar) + per-row.
- **Main content:** comment/issue **queue table** — anchor column = comment summary; columns page/URL, status (open/in-progress/resolved), owner, label, source, updated; faceted filters; sortable; density toggle; bulk select → assign / sync / resolve.
- **Secondary:** annotated-page viewer in a right **drawer** + comment detail panel.
- **Tables:** openstatus-style faceted filters, URL-shareable views, sticky header, hover row actions, bulk toolbar, sort, pagination/infinite scroll.
- **Charts:** minimal — a small open/resolved trend ONLY if it answers a real triage question; otherwise omit.
- **Filters:** status, owner, label, page, sync state; saved views. **Search:** global Cmd+K + table search. **Tabs:** All / Mine / Unassigned / Synced.
- **Drawers:** annotated-page viewer + comment detail (progressive disclosure; not modals for browsing). **Modals:** confirmation for destructive (delete project) + sync confirmation.
- **Empty states:** "No comments yet — add the browser extension / invite teammates"; first-run project creation. **Loading:** skeleton rows + skeleton drawer. **Error:** inline retry on failed sync; banner on integration auth failure.
- **Permissions:** admins manage members/integrations; members triage; restricted = read-only.
- **Responsive:** desktop-first; sidebar collapses < lg; drawer full-screen on small.
- **Type:** 13/14 body & table, 20 page title; 500/700 weight contrast; mono for IDs/URLs. **Spacing:** 4px base; 8/12 table paddings. **Borders:** subtle border + divider (borders over shadows). **Radius:** 6px cards/inputs/buttons, 2px tags. **Shadow:** only drawer/menus/modals. **Color:** neutral surfaces + ONE accent; semantic status chips; Linear/Jira brand marks only on the sync control. **Icons:** Lucide, 16px tables, 20px nav. **Animation:** drawer slide only; respect reduced-motion.
- **Rejected patterns:** four KPI cards; purple/blue gradient; charts without a question; card-in-card; giant radii; heavy shadows; fake activity feed; stock illustrations; marketing copy; oversized "Dashboard" title; low-density airy layout.
**Expected page structure:** (1) app shell (sidebar + header + Cmd+K); (2) Triage view (default): faceted-filter bar → queue table → bulk-action toolbar on selection; (3) annotated-page drawer + comment detail; (4) Members & roles (admin); (5) Integrations (Linear/Jira); (6) Project settings; (7) empty/loading/error states for each.
---
## 14. Limitations and open questions
**Where human judgment remains essential.** Choosing *which* metrics matter, defining the real workflow, naming the IA, deciding when density helps vs hurts a specific audience, and the brand-defining aesthetic call are human judgments. AI raises the floor (fewer obviously-generic outputs) but does not replace a designer's taste or a PM's domain knowledge. The research-first + visual-audit loop closes most of the gap; the final 10–25% still benefits from human review.
**Where information could not be fully verified.**
- **Official Mobbin MCP tool names** — docs don't enumerate them; only `get_screen_detail` corroborated (third-party). The `mobbin_*` names online are from the **deprecated unofficial** server. Discover the real tools by listing them after authenticating a paid account.
- **Mobbin pricing** — reported as Pro from €10/mo billed yearly (free excludes MCP); USD framing varies. Verify on mobbin.com/pricing for your region.
- **GitHub stars/maintenance** — point-in-time (May 30, 2026) and change continuously. shadcn-ui/ui star count not directly verified (reported ~70k+). **maybe-finance/maybe is archived/read-only since Jul 27, 2025.** Tremor is in maintenance mode (last release Jan 13, 2025) post Vercel acquisition.
- **Repo scores** are reasoned judgment from documented features + inspection, not a controlled evaluation; verify against the live demo and source before adopting.
- **Linear design quote** and the **"screenshots are flat" practitioner warning** are from secondary/blog sources; treat as paraphrase/attribution.
- **Mobbin MCP is in beta** (launched May 12, 2026); feature set may change.
- The broad claim that this process reliably defeats "AI slop" is supported by Anthropic's cookbook/skill (Rajasekaran, Wei, Bricken, Oct 2025) and practitioner reports, but is a directional best-practice, not a measured guarantee.
---
### Key source anchors
- **Anthropic frontend-design skill & cookbook:** github.com/anthropics/skills · github.com/anthropics/claude-cookbooks (coding/prompting_for_frontend_aesthetics) · platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics
- **Mobbin MCP:** mobbin.com/mcp · docs.mobbin.com (overview, mcp/introduction, mcp/clients/*) · Business Wire launch release (May 12, 2026)
- **Repos:** satnaing/shadcn-admin · Kiranism/next-shadcn-dashboard-starter · arhamkhnz/next-shadcn-admin-dashboard · openstatusHQ/data-table-filters · tremorlabs/tremor · tremorlabs/template-dashboard-oss · makeplane/plane · twentyhq/twenty · ToolJet/ToolJet · maybe-finance/maybe · midday-ai/midday · openstatusHQ/openstatus · refinedev/refine · ui.shadcn.com/blocks
- **Design principles:** Linear design-refresh post · Pencil&Paper / Andrew Coyle / Stephanie Walter data-table guides · LogRocket, Designlab, MyDesigner density articles
