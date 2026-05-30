"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { useWiggleDetector } from "@/lib/ai-explain/use-wiggle-detector"
import { CursorOrb } from "./CursorOrb"
import { ActivationBurst } from "./ActivationBurst"
import { ExplainerPanel, type ExplainTarget } from "./ExplainerPanel"
import { fontWeights } from "@/lib/font-weight"

const IDLE_TIMEOUT_MS = 25_000

/**
 * Globally listens for the wiggle gesture. When triggered, enters "Explain
 * mode": cursor gets an orb + trail, elements with `data-explain` highlight
 * on hover, clicking one opens a streamed AI explanation.
 *
 * Exit conditions: ESC, clicking outside an explainable element, or 25s idle.
 */
export function WiggleExplainProvider() {
  const [active, setActive] = useState(false)
  const [burst, setBurst] = useState<{ x: number; y: number; id: number } | null>(null)
  const [hovered, setHovered] = useState<HTMLElement | null>(null)
  const [target, setTarget] = useState<ExplainTarget | null>(null)
  const cursorPos = useRef({ x: 0, y: 0 })
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Track cursor for activation burst position
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      cursorPos.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => window.removeEventListener("pointermove", onMove)
  }, [])

  const resetIdleTimer = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(() => {
      setActive(false)
      setTarget(null)
      setHovered(null)
    }, IDLE_TIMEOUT_MS)
  }, [])

  const activate = useCallback(() => {
    setActive(true)
    setBurst({ x: cursorPos.current.x, y: cursorPos.current.y, id: Date.now() })
    resetIdleTimer()
  }, [resetIdleTimer])

  useWiggleDetector(activate, !active)

  // ESC to exit; reset idle on any movement
  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActive(false)
        setTarget(null)
        setHovered(null)
      }
    }
    const onMove = () => resetIdleTimer()
    window.addEventListener("keydown", onKey)
    window.addEventListener("pointermove", onMove, { passive: true })
    resetIdleTimer()
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("pointermove", onMove)
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [active, resetIdleTimer])

  // Hover tracking while active — find nearest [data-explain] ancestor
  useEffect(() => {
    if (!active) return
    const onMove = (e: PointerEvent) => {
      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
      const explainEl = el?.closest("[data-explain]") as HTMLElement | null
      setHovered((prev) => (prev === explainEl ? prev : explainEl))
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => window.removeEventListener("pointermove", onMove)
  }, [active])

  // Click an explainable → open panel; click outside (and not on panel) → exit
  useEffect(() => {
    if (!active) return
    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null
      if (el?.closest('[data-ai-explain-panel="true"]')) return
      const explainEl = el?.closest("[data-explain]") as HTMLElement | null
      if (explainEl) {
        e.preventDefault()
        e.stopPropagation()
        openTarget(explainEl)
        return
      }
      // Click on blank space → exit
      setActive(false)
      setTarget(null)
      setHovered(null)
    }
    window.addEventListener("click", onClick, { capture: true })
    return () => window.removeEventListener("click", onClick, { capture: true } as EventListenerOptions)
  }, [active])

  const openTarget = (el: HTMLElement) => {
    const label =
      el.getAttribute("data-explain-label") ||
      el.getAttribute("aria-label") ||
      el.textContent?.trim().slice(0, 80) ||
      "this element"
    const value = el.getAttribute("data-explain-value") || undefined
    const context = el.getAttribute("data-explain-context") || undefined
    setTarget({ rect: el.getBoundingClientRect(), label, value, context })
  }

  // Keep panel position synced if the user scrolls / resizes
  useEffect(() => {
    if (!target || !hovered) return
    const onScroll = () => {
      // The panel reads target.rect once on open; do not chase the element —
      // leave the panel pinned so the user can read while scrolling.
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [target, hovered])

  return (
    <>
      <CursorOrb active={active} />

      <AnimatePresence>
        {burst && (
          <ActivationBurst
            key={burst.id}
            x={burst.x}
            y={burst.y}
            onDone={() => setBurst(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && <StatusPill key="pill" onExit={() => setActive(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {active && hovered && !target && (
          <HoverHighlight key={hovered.dataset.explain ?? "h"} el={hovered} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {target && (
          <div data-ai-explain-panel="true">
            <ExplainerPanel
              target={target}
              onClose={() => setTarget(null)}
            />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!active && <HintToast key="hint" />}
      </AnimatePresence>
    </>
  )
}

// ── Subcomponents ──────────────────────────────────────────────────────────

function StatusPill({ onExit }: { onExit: () => void }) {
  return (
    <motion.div
      className="fixed z-[10000] left-1/2 top-4 -translate-x-1/2 pointer-events-auto"
      initial={{ opacity: 0, y: -8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
    >
      <div
        className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-[12px]"
        style={{
          background: "color-mix(in oklab, var(--bg-elevated-2) 92%, transparent)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid color-mix(in oklab, var(--accent) 40%, var(--border))",
          color: "var(--text-primary)",
          boxShadow:
            "0 0 24px -6px color-mix(in oklab, var(--accent) 70%, transparent), 0 6px 22px -10px rgba(0,0,0,0.6)",
        }}
      >
        <motion.span
          aria-hidden
          style={{ color: "var(--accent)", display: "inline-flex" }}
          animate={{ rotate: [0, 12, -12, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles size={13} />
        </motion.span>
        <span style={{ fontVariationSettings: fontWeights.medium }}>AI Explain · on</span>
        <span style={{ color: "var(--text-tertiary)" }}>hover a metric</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onExit()
          }}
          className="ml-1 rounded-md px-1.5 py-0.5 text-[10px] tracking-wide"
          style={{
            color: "var(--text-tertiary)",
            border: "1px solid var(--border)",
          }}
        >
          ESC
        </button>
      </div>
    </motion.div>
  )
}

function HoverHighlight({ el }: { el: HTMLElement }) {
  const [rect, setRect] = useState<DOMRect>(() => el.getBoundingClientRect())
  useEffect(() => {
    setRect(el.getBoundingClientRect())
    const onScroll = () => setRect(el.getBoundingClientRect())
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [el])

  const label =
    el.getAttribute("data-explain-label") ||
    el.textContent?.trim().slice(0, 50) ||
    "this"

  return (
    <>
      <motion.div
        aria-hidden
        className="fixed pointer-events-none z-[9996] rounded-[12px]"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        style={{
          left: rect.left - 4,
          top: rect.top - 4,
          width: rect.width + 8,
          height: rect.height + 8,
          border: "1.5px solid color-mix(in oklab, var(--accent) 80%, white)",
          boxShadow:
            "0 0 0 4px color-mix(in oklab, var(--accent) 18%, transparent), 0 0 32px -4px color-mix(in oklab, var(--accent) 70%, transparent)",
        }}
      />
      <motion.div
        className="fixed pointer-events-none z-[9996] text-[11px] px-2 py-1 rounded-md"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.16 }}
        style={{
          left: rect.left,
          top: rect.bottom + 8,
          background: "var(--accent)",
          color: "var(--text-on-accent, white)",
          fontVariationSettings: fontWeights.medium,
          boxShadow: "0 4px 14px -4px color-mix(in oklab, var(--accent) 80%, transparent)",
        }}
      >
        Click to explain · {label}
      </motion.div>
    </>
  )
}

function HintToast() {
  // Shown briefly on first mount to teach the user about the gesture
  const [show, setShow] = useState(false)
  useEffect(() => {
    const seen = typeof window !== "undefined" && window.localStorage.getItem("ai-explain:hint-v1")
    if (seen) return
    const t1 = setTimeout(() => setShow(true), 2000)
    const t2 = setTimeout(() => {
      setShow(false)
      try {
        window.localStorage.setItem("ai-explain:hint-v1", "1")
      } catch {}
    }, 9000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])
  if (!show) return null
  return (
    <motion.div
      className="fixed z-[9995] bottom-5 right-5 pointer-events-none max-w-[260px]"
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
    >
      <div
        className="rounded-[12px] px-3.5 py-3 flex gap-2.5 items-start"
        style={{
          background: "color-mix(in oklab, var(--bg-elevated-2) 95%, transparent)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid var(--border)",
          boxShadow: "0 14px 38px -14px rgba(0,0,0,0.6)",
        }}
      >
        <motion.div
          style={{ color: "var(--accent)" }}
          animate={{ rotate: [-8, 8, -8] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles size={15} />
        </motion.div>
        <div className="text-[12px] leading-snug" style={{ color: "var(--text-secondary)" }}>
          <div style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.medium }}>
            Tip: wiggle your cursor
          </div>
          Shake it back and forth to summon the AI explainer on any metric.
        </div>
      </div>
    </motion.div>
  )
}
