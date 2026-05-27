"use client"

import { motion } from "framer-motion"

/**
 * One-shot particle burst played at the cursor position when Explain mode
 * activates. Twelve sparks fly outward; each fades and shrinks.
 */
export function ActivationBurst({ x, y, onDone }: { x: number; y: number; onDone: () => void }) {
  const sparks = Array.from({ length: 12 })

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[9997]"
      style={{ transform: `translate(${x}px, ${y}px)` }}
    >
      {/* Expanding ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          left: 0,
          top: 0,
          translateX: "-50%",
          translateY: "-50%",
          border: "1.5px solid color-mix(in oklab, var(--accent) 90%, white)",
        }}
        initial={{ width: 12, height: 12, opacity: 0.9 }}
        animate={{ width: 220, height: 220, opacity: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        onAnimationComplete={onDone}
      />
      {/* Sparks */}
      {sparks.map((_, i) => {
        const angle = (i / sparks.length) * Math.PI * 2
        const dist = 70 + Math.random() * 30
        const dx = Math.cos(angle) * dist
        const dy = Math.sin(angle) * dist
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: 0,
              top: 0,
              width: 6,
              height: 6,
              background: "color-mix(in oklab, var(--accent) 85%, white)",
              boxShadow: "0 0 8px color-mix(in oklab, var(--accent) 80%, transparent)",
            }}
            initial={{ x: -3, y: -3, opacity: 1, scale: 1 }}
            animate={{ x: dx, y: dy, opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.55 + Math.random() * 0.2, ease: [0.16, 1, 0.3, 1] }}
          />
        )
      })}
    </div>
  )
}
