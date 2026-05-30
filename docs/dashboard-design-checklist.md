# Dashboard Design Checklist

Work top to bottom. The "Before implementation" block ends at a **STOP — get spec approval** gate; do not write feature code until the design spec is approved.

## Before implementation

- [ ] Product purpose understood (primary user, primary job)
- [ ] Dominant workflow + most-frequent action identified
- [ ] Data model understood (entities, relationships, volume)
- [ ] Tool reality check done: is Mobbin MCP connected? is a screenshot/browser tool available? (Name any gaps; never fake research or audits)
- [ ] GitHub repos inspected for implementation patterns — shell, tables, states, tokens (not just READMEs)
- [ ] Mobbin MCP searches completed *if available*; 3–5 screens analyzed from ONE product family
- [ ] ONE cohesive visual direction selected (one UX grammar + one primary repo + ≤2 secondary; no merged styles)
- [ ] Design tokens defined (spacing, type scale, color, radius, shadow, density, sidebar/header sizes)
- [ ] Explicitly rejected patterns documented (no purple gradient, no 4-KPI default, no off-scale text, etc.)
- [ ] Decision provenance noted (which source influenced each major decision)
- [ ] **STOP — design spec written and approved before any feature code**

## During implementation

- [ ] No arbitrary cards (cards only when IA requires)
- [ ] No nested cards unless IA truly nests
- [ ] No arbitrary charts (every chart answers a stated question; type follows data shape)
- [ ] Realistic, product-specific data (no lorem / fake metrics)
- [ ] Responsive behavior implemented (sidebar collapses < lg)
- [ ] Table treated as a first-class surface: sort, faceted filters, pagination/infinite scroll, density toggle, bulk actions, hover row actions, sticky header
- [ ] Empty states designed (with a clear primary action)
- [ ] Loading states (skeletons) implemented
- [ ] Error states (inline, with retry) implemented
- [ ] Keyboard/accessibility behavior (focus states, ARIA, reduced-motion)
- [ ] Every component reuses the SAME tokens
- [ ] Every text element maps to a named type-scale step (no ad-hoc/off-scale font sizes); hierarchy via weight + color

## After implementation

- [ ] Local app run
- [ ] Screenshot captured *(if a browser/screenshot tool exists; otherwise self-audit the rendered structure and say so)*
- [ ] Screenshot/structure audited against spec + references
- [ ] Unnecessary widgets/sections removed
- [ ] Hierarchy / spacing / typography / responsive checked
- [ ] Typography audited — every text size maps to a defined scale step; no off-scale values; same semantic element uses the same step on every screen
- [ ] First-use / populated / error states checked
- [ ] Review-fix loop repeated until cohesive
