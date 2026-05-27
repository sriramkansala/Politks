"use client"

import { useEffect, useRef } from "react"

/**
 * Detects a "vigorous wiggle" — rapid direction reversals within a short window.
 *
 * Heuristic: track horizontal-velocity sign flips. If we see ≥ FLIPS_NEEDED flips
 * within WINDOW_MS while cumulative path length exceeds MIN_PATH_PX, fire.
 *
 * Why: pure path-length triggers on any fast drag; pure direction-change triggers
 * on tiny jitters. The combination filters both.
 */
const FLIPS_NEEDED = 6
const WINDOW_MS = 600
const MIN_PATH_PX = 350
const COOLDOWN_MS = 1500

export function useWiggleDetector(onWiggle: () => void, enabled = true) {
  const cb = useRef(onWiggle)
  cb.current = onWiggle

  useEffect(() => {
    if (!enabled) return

    let lastX = 0
    let lastY = 0
    let lastT = 0
    let lastDir = 0 // -1, 0, 1
    const flips: number[] = []
    let pathInWindow = 0
    let pathSamples: { t: number; len: number }[] = []
    let cooldownUntil = 0
    let initialised = false

    const onMove = (e: PointerEvent) => {
      const now = performance.now()
      if (now < cooldownUntil) return

      if (!initialised) {
        lastX = e.clientX
        lastY = e.clientY
        lastT = now
        initialised = true
        return
      }

      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      const dist = Math.hypot(dx, dy)
      lastX = e.clientX
      lastY = e.clientY
      lastT = now

      // Track path length over the rolling window
      pathSamples.push({ t: now, len: dist })
      pathInWindow += dist
      while (pathSamples.length && now - pathSamples[0].t > WINDOW_MS) {
        pathInWindow -= pathSamples[0].len
        pathSamples.shift()
      }

      // Direction (use the dominant axis to avoid diagonal noise)
      const dir = Math.abs(dx) > Math.abs(dy) ? Math.sign(dx) : Math.sign(dy)
      if (dir !== 0 && dir !== lastDir && lastDir !== 0) {
        flips.push(now)
      }
      if (dir !== 0) lastDir = dir
      while (flips.length && now - flips[0] > WINDOW_MS) flips.shift()

      if (flips.length >= FLIPS_NEEDED && pathInWindow >= MIN_PATH_PX) {
        cooldownUntil = now + COOLDOWN_MS
        flips.length = 0
        pathSamples = []
        pathInWindow = 0
        cb.current()
      }
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    return () => window.removeEventListener("pointermove", onMove)
  }, [enabled])
}
