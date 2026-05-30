// x: -1 = Left, +1 = Right
// y: -1 = Socialist, +1 = Democratic
export const PARTY_POSITIONS: Record<string, { x: number; y: number; label: string }> = {
  bjp:  { x:  0.60, y: -0.35, label: "Right · Nationalist" },
  inc:  { x: -0.18, y:  0.30, label: "Centre-Left · Liberal" },
  aap:  { x: -0.28, y:  0.55, label: "Centre-Left · Democratic" },
  dmk:  { x: -0.52, y:  0.20, label: "Left · Democratic Socialist" },
}

export function getPartyLean(slug: string): string | null {
  return PARTY_POSITIONS[slug]?.label ?? null
}
