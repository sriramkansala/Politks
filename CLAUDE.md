@AGENTS.md

# CLAUDE.md — Dashboard build rules
Auto-loaded every session. These are **behavioral rules**, not background reading. Follow them on every dashboard/UI task. Full reasoning lives in `docs/anti-slop-dashboard-playbook.md`; the actionable checklist is `docs/dashboard-design-checklist.md`.
---
## Order of operations (do NOT skip or reorder)
1. **Understand the product first.** State the primary user, the task that brings them, the single most frequent action, the data model, and which states matter (first-run, populated, admin, restricted). If any of these are unknown, ASK before writing code.
2. **Gather references** (only if the tools exist — see "Tool reality check" below). GitHub for *implementation* patterns; Mobbin MCP for *product-design/interaction* patterns.
3. **Pick ONE visual direction.** One dominant UX grammar + one primary implementation foundation + at most two narrowly-scoped secondary references. Never merge unrelated styles.
4. **Write a design spec and STOP for approval.** Use the spec template below. Do not write feature code until the spec is approved.
5. **Implement** using the agreed tokens and primitives consistently.
6. **Visual QA loop** (only if a screenshot tool exists). Otherwise say so and self-audit against the spec.
> Treat the design spec (step 4) as a hard checkpoint. Present it and wait.
## Tool reality check (be honest — do not fake research)
- **Do NOT claim to have consulted Mobbin or GitHub references you did not actually fetch.** If Mobbin MCP is not connected/authenticated, say "Mobbin MCP unavailable — proceeding from rules only" and continue. Never invent screen analyses.
- **Do NOT claim a screenshot audit you did not perform.** If no browser/screenshot tool is available, say so and self-audit by reading the rendered structure instead.
- If a step in the workflow needs a capability this environment lacks, name the gap explicitly rather than pretending the step happened.
---
## STRICT anti-slop rules (apply to every screen)
- Do NOT produce a generic AI dashboard. Do NOT add sections to fill space.
- Do NOT assume four KPI cards. Use summaries only when each metric answers a real user question.
- Do NOT use a chart unless it answers a clear product question. Chart type follows data shape (bars = categories, lines = time).
- Do NOT wrap every section in a rounded card. Do NOT nest cards unless the information architecture genuinely requires it.
- Do NOT use gradients, glassmorphism, heavy shadows, giant radii, decorative animation, Inter/Roboto, or purple-on-white — unless the brand explicitly justifies it.
- Do NOT combine unrelated visual styles. Do NOT blindly copy a GitHub template. Do NOT copy a Mobbin screen verbatim.
- USE realistic, product-specific sample data. No lorem, no fake metrics.
- For **operational** products, prioritize tables / lists / filters / workflows over decorative analytics.
- For **analytical** products, prioritize comparisons and drill-downs over metric-card walls.
- USE one coherent design system across every screen.
- **Tables are the work surface** of most dashboards. Treat them as a first-class product surface: anchor column first, right-aligned numbers, sortable headers, faceted filters, hover/bulk actions, density toggle, sticky header, and real empty/loading/error states.
- **BIND every text element to a fixed, named type-scale step.** No ad-hoc or off-scale font sizes (`text-[19px]`, arbitrary rem). The same semantic element (page title, section header, table cell) uses the same step on EVERY screen. Build hierarchy with weight + color, not by inventing new sizes.
- Implement empty, loading, and error states for every surface — they are not afterthoughts.
- Match density to user frequency. Power users / data-heavy tools want density (compress whitespace with discipline, lean on hierarchy). First-run / low-frequency / consumer contexts can be more spacious.
---
## Design tokens (defaults for a desktop B2B dashboard — adapt to the brand, then enforce)
| Token | Default |
|---|---|
| Spacing scale | 4px base; 4/8/12/16/24/32/48. Dense surfaces use 4/8/12 paddings, not 16–24 |
| **Type scale** | **Fixed named steps only:** xs 12 (meta), sm 13–14 (body/table), base 14–15, md 16 (section), lg 18, xl 20, 2xl 24 (page title). Every element maps to one step; **no off-scale values.** Hierarchy via weight (500 body / 600–700 headings) + color |
| Border colors | one subtle border token + one stronger divider |
| Surface hierarchy | base → surface → elevated (3 steps) via value steps, not shadows |
| Border-radius | 2px tags/badges, 6px cards/inputs/buttons, 8px modals; avoid >12px |
| Shadow | none on static surfaces; one elevation reserved for true overlays (popover/menu/modal) |
| Accent color | ONE dominant accent + neutrals; green/red for +/-, amber for warning, used sparingly |
| Chart colors | small ordered categorical palette from the accent; never rainbow; colorblind-safe |
| Selected state | accent-tinted bg + accent border/check; never color alone |
| Hover state | subtle surface step + cursor; reveal row actions on hover |
| Disabled state | reduced opacity + no pointer; preserve layout |
| Destructive | red, confirmation required, never the default focus |
| Icon sizes | 16px inline/table, 20px nav; one set (e.g. Lucide) |
| Table row height | compact 40 / regular 48 / relaxed 56; default 48 + density toggle |
| Sidebar width | ~240–280px; collapsible to icon rail |
| Header height | ~48–64px |
| Content max width | full-bleed for tables/ops; ~1200–1440px cap for analytical/reading |
| Breakpoints | sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536; desktop-first; collapse sidebar < lg |
---
## Design spec template (fill, then get approval before coding)

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
## Reference picks by archetype (study, don't clone; check licenses)
- **Foundations:** Kiranism/next-shadcn-dashboard-starter (Next.js, MIT), satnaing/shadcn-admin (Vite, MIT).
- **Tables/filters:** openstatusHQ/data-table-filters (MIT) — the reference for production data tables.
- **Analytics components:** Tremor (MIT, maintenance mode).
- **CRUD admin architecture:** refinedev/refine (MIT).
- **Domain grammar (AGPL — visual reference only, do not copy code):** Plane (PM), Twenty (CRM), Midday/Ghostfolio (finance), openstatus (ops).
License rule: MIT/Apache repos are safe to reuse with attribution; AGPL/GPL repos are visual/pattern references only unless you accept copyleft.
