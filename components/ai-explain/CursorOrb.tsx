"use client"

import { useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

/**
 * Glowing orb + trail that follows the cursor while Explain mode is active.
 * Springs lag the cursor slightly, giving the orb a "magnetic / alive" feel.
 */
export function CursorOrb({ active }: { active: boolean }) {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const orbX = useSpring(x, { stiffness: 380, damping: 30, mass: 0.4 })
  const orbY = useSpring(y, { stiffness: 380, damping: 30, mass: 0.4 })
  const trailX = useSpring(x, { stiffness: 140, damping: 22, mass: 0.6 })
  const trailY = useSpring(y, { stiffness: 140, damping: 22, mass: 0.6 })

  const initialised = useRef(false)

  useEffect(() => {
    if (!active) return
    const onMove = (e: PointerEvent) => {
      if (!initialised.current) {
        x.jump(e.clientX)
        y.jump(e.clientY)
        initialised.current = true
        return
      }
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      window.removeEventListener("pointermove", onMove)
      initialised.current = false
    }
  }, [active, x, y])

  if (!active) return null

  return (
    <>
      {/* Outer halo — lags behind */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9998]"
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
          width: 84,
          height: 84,
          borderRadius: "9999px",
          background:
            "radial-gradient(circle at center, color-mix(in oklab, var(--accent) 55%, transparent) 0%, color-mix(in oklab, var(--accent) 10%, transparent) 45%, transparent 70%)",
          filter: "blur(8px)",
          mixBlendMode: "screen",
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.9, scale: 1 }}
        exit={{ opacity: 0, scale: 0.6 }}
        transition={{ stiffness: 200, damping: 26, type: "spring" }}
      />
      {/* Inner orb — snappier */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{
          x: orbX,
          y: orbY,
          translateX: "-50%",
          translateY: "-50%",
          width: 22,
          height: 22,
          borderRadius: "9999px",
          background:
            "conic-gradient(from 0deg, var(--accent), color-mix(in oklab, var(--accent) 60%, white) 50%, var(--accent))",
          boxShadow:
            "0 0 0 1.5px color-mix(in oklab, var(--accent) 80%, white), 0 0 24px color-mix(in oklab, var(--accent) 80%, transparent)",
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1, rotate: 360 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{
          opacity: { duration: 0.2 },
          scale: { type: "spring", stiffness: 380, damping: 24 },
          rotate: { duration: 6, repeat: Infinity, ease: "linear" },
        }}
      >
        <div
          className="absolute inset-[3px] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.9), color-mix(in oklab, var(--accent) 70%, transparent) 60%)",
          }}
        />
      </motion.div>
    </>
  )
}
