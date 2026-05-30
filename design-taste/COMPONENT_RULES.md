# Component Rules

> The binding, file-level component contract for this repo lives in
> [`/UI_RULES.md`](../UI_RULES.md) §1 (the "use the component library" table).
> The rules below are the design rationale; that table is the enforcement.

## General

- Reuse existing repository components before adding new ones.
- Extend the existing design system rather than creating a parallel component library.
- Keep components composable and predictable.
- Avoid one-off styling unless the use case genuinely requires it.
- Use design tokens for spacing, radius, border, typography, and color decisions.

## Buttons

- Maintain a clear distinction between primary, secondary, tertiary, destructive, and icon-only actions.
- Do not place multiple visually dominant buttons next to one another.
- Use specific labels.
- Keep icon-only buttons discoverable through tooltips.
- Use restrained sizing.

## Inputs

- Use clear labels.
- Use placeholders only as examples, not as substitutes for labels.
- Show validation errors near the affected field.
- Preserve focus visibility.
- Keep form density appropriate to the task.

## Cards

- Use cards only when a meaningful grouping requires a container.
- Do not turn every section into a card.
- Avoid unnecessary nested cards.
- Prefer rows, grouped sections, tables, or bordered lists when they communicate structure more clearly.

## Tables and Lists

- Use compact, aligned rows.
- Keep scanning efficiency high.
- Right-align numeric values when appropriate.
- Use tabular numerals when available.
- Keep row actions discoverable but visually quiet.
- Show hover states without layout shift.
- Design empty, loading, filtered-empty, and error states.

## Menus and Dropdowns

- Keep menu labels specific.
- Group related actions.
- Separate destructive actions.
- Avoid excessively long menus.
- Use nested menus only when necessary.
- Keep selected states visible.

## Dialogs and Panels

- Use dialogs for focused decisions.
- Use side panels when users need to preserve context.
- Do not use modals for every interaction.
- Keep headers, action areas, and close controls consistent.
- Avoid overcrowding.

## Icons

- Use one consistent icon family.
- Keep icon stroke weight consistent.
- Avoid mixing filled, outlined, playful, and technical icon styles without a deliberate reason.
- Icons should support comprehension, not decorate every label.

> This repo uses **lucide-react** as the single icon family, at stroke-width
> `1.5` idle / `2` on hover or active (see `Button`, `Sidebar`). Keep that
> convention.

## Motion

- Use motion to explain a state transition.
- Keep transitions fast and restrained.
- Avoid bounce-heavy, theatrical, or decorative animation.
- Respect reduced-motion preferences.

> This repo's motion grammar is **Fluid Functionalism** (see `UI_RULES.md` §11
> and `lib/springs.ts`): Linear-verified easing curves, `layoutId`-driven
> shared-element transitions, 180ms standard duration. `globals.css` already
> ships a `prefers-reduced-motion` guard.
