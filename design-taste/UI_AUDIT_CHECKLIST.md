# UI Audit Checklist

Every implemented screen must be rendered, visually inspected, scored, corrected, and rendered again before the task is considered complete.

Score each category from 1–5.

## 1. Product Fit

- Does the screen feel like a real shipped product?
- Does every visible element have a reason to exist?
- Is the terminology specific to the feature?
- Does the UI support the actual user task efficiently?

## 2. Layout

- Is the information hierarchy immediately clear?
- Is the density appropriate?
- Are sections aligned precisely?
- Are related elements grouped correctly?
- Are containers used only when needed?
- Has unnecessary whitespace been removed?

## 3. Typography

- Are font roles consistent?
- Are headings restrained?
- Are labels readable?
- Are line heights deliberate?
- Are font weights controlled?
- Is hierarchy established through role and weight before size?
- Are numbers and currency values legible?

## 4. Visual Restraint

- Are shadows subtle?
- Are borders consistent?
- Is border radius controlled?
- Is color usage restrained?
- Is there only one intentional accent system?
- Are unnecessary decorations absent?

## 5. Interaction States

Confirm that relevant states exist:

- Default
- Hover
- Focus
- Selected
- Active
- Loading
- Empty
- Filtered-empty
- Error
- Disabled
- Success
- Permission-restricted
- Destructive-action confirmation

## 6. Responsiveness

- Does the layout work across intended screen sizes?
- Do labels truncate gracefully?
- Do dropdowns remain usable?
- Do panels and dialogs fit correctly?
- Are overflow states handled?

## 7. Anti-Slop Review

- Does the UI resemble a generic dashboard template?
- Were unnecessary cards added?
- Was a random chart added?
- Were decorative gradients added?
- Are there too many pills?
- Are headings oversized?
- Is whitespace harming usability?
- Are nested cards creating noise?
- Are animations decorative rather than functional?

## Passing Rule

Do not consider the task complete until:

- Every category scores at least 4/5
- No anti-pattern remains
- The rendered output has been visually inspected
- Corrections have been applied after the first render
- The corrected output has been rendered and inspected again
