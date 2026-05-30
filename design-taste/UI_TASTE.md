# Product UI Taste Constitution

> **Integration note.** This repository already ships a codebase-specific
> enforcement doc at [`/UI_RULES.md`](../UI_RULES.md) — the concrete "what NOT
> to do, with file paths" checklist (component library, tokens, Indian number
> formatting, font-variation weights, Fluid-Functionalism motion). **That file
> remains the binding, repo-specific layer.** This `design-taste/` system sits
> one level above it: the *why* and the *taste* that those rules express. When
> the two ever appear to conflict, `UI_RULES.md` wins for implementation detail;
> this file wins for design intent. Do not fork a parallel design system —
> extend the existing one.

## Product Character

Build calm, structured, high-signal product interfaces.

The product should feel stable, predictable, technical, and collaborative without becoming noisy.

Prefer the restraint of Linear, Stripe, and Vercel over decorative startup landing-page aesthetics.

This is an operational product interface, not a marketing page.

## Design Priorities

When making design decisions, prioritize in this order:

1. Information hierarchy
2. Functional clarity
3. Interaction predictability
4. Efficient density
5. Consistency with existing patterns
6. Visual polish
7. Decorative styling only when it genuinely improves comprehension

## Hierarchy

- Establish hierarchy through layout, alignment, grouping, typography, spacing, and contrast before adding decoration.
- Prefer compact, structured layouts over oversized empty areas.
- Use lists, rows, tables, side panels, menus, and grouped settings when the information model calls for them.
- Keep one primary action visually obvious.
- Secondary actions should remain discoverable without competing with the primary action.
- Use progressive disclosure for advanced or rarely used settings.
- Avoid showing every possible action at once.

## Layout

- Prefer clean grid-based alignment.
- Related information should feel visibly grouped.
- Unrelated information should have enough separation.
- Use consistent spacing increments.
- Do not add empty space merely to make the product look premium.
- Do not stretch small amounts of information across unnecessarily large containers.
- Avoid excessive dashboard card layouts.
- Use cards only when a container communicates meaningful grouping.

## Surfaces

- Prefer subtle borders and background separation.
- Use shadows sparingly and only when elevation communicates hierarchy.
- Keep border radius restrained and consistent.
- Avoid floating cards nested inside floating cards.
- Avoid wrapping every section inside a card.
- Do not use glassmorphism.
- Do not use decorative gradients unless explicitly required by the established brand system.

## Color

- Keep neutral colors dominant.
- Use one controlled accent color.
- Use color to communicate action, selection, status, urgency, or meaning.
- Avoid arbitrary accent colors.
- Do not use color as a substitute for hierarchy.
- Ensure selected, hover, focused, disabled, loading, error, and success states remain clear.

## Density

- Product screens should feel efficient rather than sparse.
- Do not over-space operational screens.
- Use whitespace to establish relationships, not to make the product feel expensive.
- Dense interfaces must still remain readable.
- Prefer compact rows and grouped controls for repeat-use workflows.

## Interaction

- Hover states must not shift layouts.
- Focus states must remain visible.
- Selected states must remain clear and persistent.
- Loading, empty, success, error, disabled, and permission states must be designed deliberately.
- Motion should clarify state changes, not decorate the interface.
- Keep animation restrained, fast, and purposeful.
- Preserve familiar platform conventions unless there is a strong usability reason not to.

## Copy

- Use concise, specific product language.
- Avoid vague startup copy.
- Avoid unnecessary explanatory paragraphs.
- Use contextual help where confusion is likely.
- Prefer actionable button labels such as "Invite member" over vague labels such as "Continue" when the action is known.

## Existing Codebase

- Inspect the existing implementation before creating new components.
- Preserve working architecture, reusable components, naming conventions, and spacing tokens whenever sensible.
- Extend existing patterns rather than introducing parallel systems.
- Remove duplication where possible.
