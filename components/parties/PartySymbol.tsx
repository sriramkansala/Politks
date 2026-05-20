interface PartySymbolProps {
  slug: string
  color: string
  size?: number
}

export function PartySymbol({ slug, color, size = 20 }: PartySymbolProps) {
  if (slug === "bjp") {
    // Lotus — 5 petals rotating around base point
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" aria-label="BJP lotus symbol">
        {/* Water pad at base */}
        <ellipse cx="10" cy="17.5" rx="7.5" ry="1.5" fill={color} fillOpacity="0.18" />
        {/* Centre petal */}
        <ellipse cx="10" cy="9" rx="2.2" ry="6.8" fill={color} fillOpacity="0.95" />
        {/* Inner-left petal */}
        <ellipse cx="10" cy="9" rx="2.2" ry="6.8" transform="rotate(-38 10 16)" fill={color} fillOpacity="0.82" />
        {/* Inner-right petal */}
        <ellipse cx="10" cy="9" rx="2.2" ry="6.8" transform="rotate(38 10 16)" fill={color} fillOpacity="0.82" />
        {/* Outer-left petal */}
        <ellipse cx="10" cy="9" rx="1.8" ry="5.8" transform="rotate(-72 10 16)" fill={color} fillOpacity="0.55" />
        {/* Outer-right petal */}
        <ellipse cx="10" cy="9" rx="1.8" ry="5.8" transform="rotate(72 10 16)" fill={color} fillOpacity="0.55" />
      </svg>
    )
  }

  if (slug === "inc") {
    // Hand — open palm with five fingers pointing up
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" aria-label="INC hand symbol" fill={color}>
        {/* Thumb */}
        <rect x="1.5" y="10" width="2.8" height="6.5" rx="1.4" />
        {/* Index */}
        <rect x="5"   y="4.5" width="2.5" height="12" rx="1.25" />
        {/* Middle */}
        <rect x="8"   y="2.5" width="2.5" height="14" rx="1.25" />
        {/* Ring */}
        <rect x="11"  y="4.5" width="2.5" height="12" rx="1.25" />
        {/* Pinky */}
        <rect x="14.5" y="7"  width="2.5" height="9.5" rx="1.25" />
        {/* Palm — connects all fingers */}
        <rect x="1.5" y="14.5" width="15.5" height="4.5" rx="2" />
      </svg>
    )
  }

  if (slug === "aap") {
    // Broom (Jhaadu) — handle + fanned bristles
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" aria-label="AAP broom symbol" fill="none">
        {/* Handle */}
        <line x1="14" y1="1.5" x2="7" y2="14" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
        {/* Bristle ferrule */}
        <circle cx="7.2" cy="13.8" r="1.4" fill={color} />
        {/* Fanned bristles */}
        <line x1="7"  y1="14" x2="2"  y2="19" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
        <line x1="7"  y1="14" x2="5"  y2="19.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
        <line x1="7"  y1="14" x2="8"  y2="19.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
        <line x1="7"  y1="14" x2="11" y2="18" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
        <line x1="7"  y1="14" x2="13.5" y2="15.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    )
  }

  if (slug === "dmk") {
    // Rising sun — semi-circle above horizon with radiating rays
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" aria-label="DMK rising sun symbol">
        {/* Rays */}
        <line x1="10" y1="1"   x2="10" y2="4.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        <line x1="3.5" y1="3.5" x2="5.8" y2="5.8" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        <line x1="16.5" y1="3.5" x2="14.2" y2="5.8" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        <line x1="1"  y1="10"  x2="4.5" y2="10"  stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        <line x1="19" y1="10"  x2="15.5" y2="10" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
        {/* Sun semi-circle */}
        <path d="M3.5 15 A6.5 6.5 0 0 1 16.5 15Z" fill={color} />
        {/* Horizon line */}
        <line x1="1" y1="15" x2="19" y2="15" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    )
  }

  // Generic fallback — colored initial in a circle
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
