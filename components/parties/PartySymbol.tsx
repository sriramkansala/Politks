// Abstract SVG symbols for Indian political parties.
// These are geometric renderings of each party's well-known ECI symbol —
// NOT copies of any official party logo. They serve as identifiable
// visual anchors on cards / list rows.

interface PartySymbolProps {
  slug: string
  color: string
  size?: number
}

export function PartySymbol({ slug, color, size = 20 }: PartySymbolProps) {
  // ── BJP — Lotus (5 petals around base) ─────────────────────────────────
  if (slug === "bjp") {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" aria-label="BJP lotus symbol">
        <ellipse cx="10" cy="17.5" rx="7.5" ry="1.5" fill={color} fillOpacity="0.18" />
        <ellipse cx="10" cy="9" rx="2.2" ry="6.8" fill={color} fillOpacity="0.95" />
        <ellipse cx="10" cy="9" rx="2.2" ry="6.8" transform="rotate(-38 10 16)" fill={color} fillOpacity="0.82" />
        <ellipse cx="10" cy="9" rx="2.2" ry="6.8" transform="rotate(38 10 16)" fill={color} fillOpacity="0.82" />
        <ellipse cx="10" cy="9" rx="1.8" ry="5.8" transform="rotate(-72 10 16)" fill={color} fillOpacity="0.55" />
        <ellipse cx="10" cy="9" rx="1.8" ry="5.8" transform="rotate(72 10 16)" fill={color} fillOpacity="0.55" />
      </svg>
    )
  }

  // ── INC — Open palm (5 fingers + palm) ────────────────────────────────
  if (slug === "inc") {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" aria-label="INC hand symbol" fill={color}>
        <rect x="1.5" y="10" width="2.8" height="6.5" rx="1.4" />
        <rect x="5"   y="4.5" width="2.5" height="12" rx="1.25" />
        <rect x="8"   y="2.5" width="2.5" height="14" rx="1.25" />
        <rect x="11"  y="4.5" width="2.5" height="12" rx="1.25" />
        <rect x="14.5" y="7"  width="2.5" height="9.5" rx="1.25" />
        <rect x="1.5" y="14.5" width="15.5" height="4.5" rx="2" />
      </svg>
    )
  }

  // ── AAP — Broom (jhaadu) ──────────────────────────────────────────────
  if (slug === "aap") {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" aria-label="AAP broom symbol" fill="none">
        <line x1="14" y1="1.5" x2="7" y2="14" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="7.2" cy="13.8" r="1.4" fill={color} />
        <line x1="7"  y1="14" x2="2"  y2="19" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
        <line x1="7"  y1="14" x2="5"  y2="19.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
        <line x1="7"  y1="14" x2="8"  y2="19.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
        <line x1="7"  y1="14" x2="11" y2="18" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
        <line x1="7"  y1="14" x2="13.5" y2="15.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    )
  }

  // ── DMK — Rising sun (rays + semicircle + horizon) ────────────────────
  if (slug === "dmk") {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" aria-label="DMK rising sun symbol">
        <line x1="10" y1="1"   x2="10" y2="4.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        <line x1="3.5" y1="3.5" x2="5.8" y2="5.8" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        <line x1="16.5" y1="3.5" x2="14.2" y2="5.8" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        <line x1="1"  y1="10"  x2="4.5" y2="10"  stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        <line x1="19" y1="10"  x2="15.5" y2="10" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M3.5 15 A6.5 6.5 0 0 1 16.5 15Z" fill={color} />
        <line x1="1" y1="15" x2="19" y2="15" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    )
  }

  // ── CPI(M) — Hammer + sickle crossed + star above ─────────────────────
  if (slug === "cpim") {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" aria-label="CPI(M) hammer-sickle-star symbol" fill="none">
        {/* Star */}
        <polygon
          points="10,1.5 10.9,3.7 13.2,3.7 11.4,5.2 12.2,7.4 10,6 7.8,7.4 8.6,5.2 6.8,3.7 9.1,3.7"
          fill={color}
        />
        {/* Hammer handle (diagonal NW→SE) */}
        <line x1="4.5" y1="9" x2="15.5" y2="18" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
        {/* Hammer head */}
        <rect x="3" y="7.5" width="3.5" height="2.2" rx="0.5" fill={color} transform="rotate(-45 4.75 8.6)" />
        {/* Sickle curve (arc) */}
        <path
          d="M15.5 9 A 6 6 0 0 0 5 17.5"
          stroke={color}
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  // ── CPI — Ears of corn + sickle ───────────────────────────────────────
  if (slug === "cpi") {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" aria-label="CPI ears-of-corn symbol" fill="none">
        {/* Left ear: stem + chevron grains */}
        <line x1="7"  y1="18" x2="9" y2="3" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
        {[5, 7.5, 10, 12.5, 15].map((y) => (
          <path key={"l" + y} d={`M9 ${y} L 6 ${y + 1.5}`} stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        ))}
        {/* Right ear */}
        <line x1="13" y1="18" x2="11" y2="3" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
        {[5, 7.5, 10, 12.5, 15].map((y) => (
          <path key={"r" + y} d={`M11 ${y} L 14 ${y + 1.5}`} stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        ))}
        {/* Sickle blade arc behind */}
        <path d="M3.5 11 A 7 7 0 0 0 16.5 11" stroke={color} strokeWidth="1" strokeOpacity="0.6" fill="none" />
      </svg>
    )
  }

  // ── AITC (TMC) — Twin flowers and grass blades ────────────────────────
  if (slug === "aitc") {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" aria-label="AITC flowers-and-grass symbol" fill="none">
        {/* Stem 1 */}
        <line x1="7" y1="18" x2="7" y2="9" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
        {/* Flower 1 */}
        <circle cx="7" cy="7.5" r="2.2" fill={color} />
        {/* Stem 2 */}
        <line x1="13" y1="18" x2="13" y2="11" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
        {/* Flower 2 */}
        <circle cx="13" cy="9.5" r="1.8" fill={color} fillOpacity="0.78" />
        {/* Grass blades at base */}
        <line x1="2" y1="18.5" x2="4" y2="13" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
        <line x1="16" y1="18.5" x2="18" y2="14" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
        <line x1="10" y1="18.5" x2="10" y2="15" stroke={color} strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    )
  }

  // ── SP — Bicycle (two wheels + frame) ─────────────────────────────────
  if (slug === "sp") {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" aria-label="SP bicycle symbol" fill="none">
        <circle cx="5" cy="14" r="4" stroke={color} strokeWidth="1.4" />
        <circle cx="15" cy="14" r="4" stroke={color} strokeWidth="1.4" />
        {/* Frame */}
        <path d="M5 14 L 10 8 L 15 14 M10 8 L 12 5 M9 14 L 12 5" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        {/* Saddle */}
        <line x1="11" y1="5" x2="13.5" y2="5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
        {/* Hub dots */}
        <circle cx="5" cy="14" r="0.8" fill={color} />
        <circle cx="15" cy="14" r="0.8" fill={color} />
      </svg>
    )
  }

  // ── NCP(SP) — Man blowing trumpet (turha) ─────────────────────────────
  if (slug === "ncp-sp") {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" aria-label="NCP(SP) trumpet symbol" fill="none">
        {/* Trumpet bell (right-facing cone) */}
        <path d="M3 10 L 14 5 L 14 15 L 3 10 Z" fill={color} fillOpacity="0.85" />
        {/* Sound waves */}
        <path d="M15.5 7 Q 17.5 10 15.5 13" stroke={color} strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M17 5.5 Q 19.5 10 17 14.5" stroke={color} strokeWidth="1.1" strokeOpacity="0.6" strokeLinecap="round" fill="none" />
      </svg>
    )
  }

  // ── SHS(UBT) — Burning torch (mashaal) ────────────────────────────────
  if (slug === "shs-ubt") {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" aria-label="SHS(UBT) torch symbol" fill="none">
        {/* Handle */}
        <rect x="8.5" y="11" width="3" height="8" rx="0.7" fill={color} fillOpacity="0.75" />
        {/* Holder cup */}
        <path d="M7 11 L 13 11 L 12.5 9.5 L 7.5 9.5 Z" fill={color} />
        {/* Flame */}
        <path
          d="M10 9 C 12.5 6 9.5 4.5 10.5 2 C 8 4.5 9 5.5 7.5 7 C 8.5 8 9 8.5 10 9 Z"
          fill={color}
        />
        <path
          d="M10 9 C 11 7 10 5.5 10 4 C 10.7 5.5 10.5 7 10 9 Z"
          fill={color}
          fillOpacity="0.5"
        />
      </svg>
    )
  }

  // ── YSRCP — Ceiling fan (3 blades from a hub) ─────────────────────────
  if (slug === "ysrcp") {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" aria-label="YSRCP ceiling fan symbol" fill="none">
        {/* Three teardrop-shaped blades around a centre at (10,10) */}
        {[0, 120, 240].map((deg) => (
          <path
            key={deg}
            d="M0,0 C 1.5,-3.5 1.5,-6.5 0,-8 C -1.5,-6.5 -1.5,-3.5 0,0 Z"
            fill={color}
            transform={`translate(10 10) rotate(${deg})`}
          />
        ))}
        {/* Hub */}
        <circle cx="10" cy="10" r="1.6" fill={color} />
        <circle cx="10" cy="10" r="0.7" fill="var(--bg-base)" />
      </svg>
    )
  }

  // ── BSP — Elephant (simplified silhouette) ────────────────────────────
  if (slug === "bsp") {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" aria-label="BSP elephant symbol" fill={color}>
        {/* Body */}
        <ellipse cx="11" cy="13" rx="6" ry="4" />
        {/* Head */}
        <circle cx="5" cy="11" r="3" />
        {/* Trunk — curve down */}
        <path d="M3 12 Q 1.5 14.5 3 16.5 Q 4.5 17 5 15.5" fill={color} stroke="none" />
        {/* Ear */}
        <ellipse cx="5.5" cy="9" rx="1.8" ry="2.4" fill={color} fillOpacity="0.7" />
        {/* Legs */}
        <rect x="7" y="14" width="1.6" height="4.5" rx="0.3" />
        <rect x="10" y="14" width="1.6" height="4.5" rx="0.3" />
        <rect x="13" y="14" width="1.6" height="4.5" rx="0.3" />
        <rect x="15.5" y="14" width="1.6" height="4.5" rx="0.3" />
        {/* Eye dot */}
        <circle cx="5" cy="10.5" r="0.5" fill="var(--bg-base)" />
      </svg>
    )
  }

  // ── Generic fallback — colored initial in a circle ────────────────────
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-label={`${slug} party symbol`}>
      <circle cx="10" cy="10" r="9" fill={color} fillOpacity="0.15" />
      <text
        x="10" y="14"
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fill={color}
        fontFamily="system-ui, sans-serif"
      >
        {slug[0].toUpperCase()}
      </text>
    </svg>
  )
}
