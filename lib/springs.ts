// Motion presets tuned to Linear's verified production values.
//
// EXTRACTED FROM LINEAR'S PRODUCTION CSS (static.linear.app/_next/static/css/*):
//   --duration:           180ms
//   --ease-out-quart:     cubic-bezier(0.165, 0.84, 0.44, 1)   ← Linear's standard ease
//   --ease-out-cubic:     cubic-bezier(0.215, 0.61, 0.355, 1)
//   --ease-out-quint:     cubic-bezier(0.23, 1, 0.32, 1)
//   --ease-in-out-quart:  cubic-bezier(0.77, 0, 0.175, 1)
//
// Linear themselves don't expose spring values (their CSS uses cubic-bezier),
// so the spring presets below are TUNED to feel equivalent in framer-motion.
// They are NOT taken from Linear — they're our best approximation of how
// Linear's `--duration 180ms` + `--ease-out-quart` motion translates to a
// physics-based framer spring (mass=1).

import type { Transition } from "framer-motion";

export const springs = {
  /** Tap / press feedback — near-instant settle. */
  snap: {
    type: "spring",
    stiffness: 700,
    damping: 40,
    mass: 1,
  } satisfies Transition,

  /** Standard interaction (tabs, popovers, dropdowns) — equivalent feel
   *  to Linear's 180ms ease-out-quart in cubic-bezier form. */
  responsive: {
    type: "spring",
    stiffness: 380,
    damping: 30,
    mass: 1,
  } satisfies Transition,

  /** Layout transitions (card expand, sidebar active indicator). */
  gentle: {
    type: "spring",
    stiffness: 200,
    damping: 26,
    mass: 1,
  } satisfies Transition,

  /** Modal / sheet entrances — slight overshoot. */
  settle: {
    type: "spring",
    stiffness: 140,
    damping: 22,
    mass: 1,
  } satisfies Transition,

  // ── Linear-equivalent duration-based ease (use these when framer-motion
  //    is asked to mimic Linear's CSS transitions exactly) ──────────────
  linearEaseOutQuart: {
    duration: 0.18,                      // 180ms — Linear's --duration
    ease: [0.165, 0.84, 0.44, 1],        // L: --ease-out-quart
  } satisfies Transition,

  // ── Legacy duration-style aliases (kept for back-compat) ───────────────
  /** @deprecated use `snap` */
  fast:     { type: "spring", duration: 0.08, bounce: 0 } satisfies Transition,
  /** @deprecated use `responsive` */
  moderate: { type: "spring", duration: 0.16, bounce: 0.15 } satisfies Transition,
  /** @deprecated use `gentle` */
  slow:     { type: "spring", duration: 0.24, bounce: 0.15 } satisfies Transition,
} as const;
