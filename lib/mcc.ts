// ECI Model Code of Conduct (MCC) mode — §8.4
//
// When the Election Commission of India notifies an election, MCC takes effect
// from the date of notification until results are declared. During this period,
// platforms tracking political content must not:
//   - publish new status changes that could be construed as campaigning
//   - run live agentic features that could generate fresh political claims
//
// Activation is a single env flag — `NEXT_PUBLIC_MCC_MODE=true` — so it can be
// flipped without a code change. Read both server- and client-side via the
// helper below.

export function isMccActive(): boolean {
  return process.env.NEXT_PUBLIC_MCC_MODE === "true"
}

export const MCC_BANNER_TEXT =
  "ECI Model Code of Conduct is active. Status changes and agentic features are frozen until results are declared."
