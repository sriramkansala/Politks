"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, X } from "lucide-react"
import { fontWeights } from "@/lib/font-weight"

export type ExplainTarget = {
  rect: DOMRect
  label: string
  value?: string
  context?: string
}

const PANEL_W = 320

export function ExplainerPanel({
  target,
  onClose,
}: {
  target: ExplainTarget
  onClose: () => void
}) {
  const [text, setText] = useState("")
  const [status, setStatus] = useState<"loading" | "streaming" | "done" | "error">("loading")
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    abortRef.current = controller
    setText("")
    setStatus("loading")

    fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label: target.label,
        value: target.value,
        context: target.context,
      }),
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok || !res.body) {
          setStatus("error")
          setText(
            res.status === 503
              ? "AI is offline — set ANTHROPIC_API_KEY in .env.local to enable explanations."
              : "Couldn't reach the AI service.",
          )
          return
        }
        setStatus("streaming")
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let acc = ""
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          acc += decoder.decode(value, { stream: true })
          setText(acc)
        }
        setStatus("done")
      })
      .catch((err) => {
        if (err.name === "AbortError") return
        setStatus("error")
        setText("Something went wrong fetching the explanation.")
      })

    return () => controller.abort()
  }, [target.label, target.value, target.context])

  // Position: prefer right side; fall back to left, then below
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200
  const vh = typeof window !== "undefined" ? window.innerHeight : 800
  const gap = 14
  let left = target.rect.right + gap
  let top = target.rect.top
  if (left + PANEL_W > vw - 16) {
    left = target.rect.left - PANEL_W - gap
  }
  if (left < 16) {
    left = Math.min(Math.max(16, target.rect.left), vw - PANEL_W - 16)
    top = target.rect.bottom + gap
  }
  top = Math.min(Math.max(16, top), vh - 220)

  return (
    <motion.div
      role="dialog"
      aria-label={`AI explanation: ${target.label}`}
      className="fixed z-[10000] pointer-events-auto"
      style={{ left, top, width: PANEL_W }}
      initial={{ opacity: 0, scale: 0.94, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 8 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
    >
      <div
        className="relative rounded-[14px] overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--bg-elevated-2) 92%, transparent), color-mix(in oklab, var(--bg-elevated) 92%, transparent))",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid var(--border)",
          boxShadow:
            "0 0 0 1px color-mix(in oklab, var(--accent) 24%, transparent), 0 18px 60px -12px rgba(0,0,0,0.55), 0 0 60px -20px color-mix(in oklab, var(--accent) 70%, transparent)",
        }}
      >
        {/* Animated accent edge */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--accent), color-mix(in oklab, var(--accent) 60%, white), var(--accent), transparent)",
            backgroundSize: "200% 100%",
          }}
          animate={{ backgroundPositionX: ["0%", "200%"] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
        />

        <div className="px-4 pt-3.5 pb-3 flex items-start gap-2.5">
          <div
            className="shrink-0 mt-0.5 grid place-items-center rounded-md"
            style={{
              width: 22,
              height: 22,
              background: "color-mix(in oklab, var(--accent) 18%, transparent)",
              color: "var(--accent)",
            }}
          >
            <Sparkles size={13} />
          </div>
          <div className="min-w-0 flex-1">
            <div
              className="text-[10px] uppercase tracking-[0.08em]"
              style={{ color: "var(--accent)", ...{ fontVariationSettings: fontWeights.medium } }}
            >
              AI Explainer
            </div>
            <div
              className="text-[13px] truncate"
              style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.medium }}
              title={target.label}
            >
              {target.label}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close explanation"
            className="shrink-0 rounded-md p-1 -mr-1 -mt-0.5 transition-colors"
            style={{ color: "var(--text-tertiary)" }}
          >
            <X size={14} />
          </button>
        </div>

        <div
          className="px-4 pb-4 text-[13px] leading-[1.55]"
          style={{ color: "var(--text-secondary)" }}
        >
          {status === "loading" && <ThinkingDots />}
          {(status === "streaming" || status === "done" || status === "error") && (
            <span>
              {text}
              {status === "streaming" && (
                <motion.span
                  className="inline-block align-middle ml-0.5"
                  style={{
                    width: 6,
                    height: 13,
                    background: "var(--accent)",
                    transform: "translateY(1px)",
                  }}
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 0.9, repeat: Infinity }}
                />
              )}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function ThinkingDots() {
  return (
    <span className="inline-flex items-center gap-1.5" aria-label="Thinking">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block rounded-full"
          style={{ width: 6, height: 6, background: "var(--accent)" }}
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.12 }}
        />
      ))}
      <span className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>
        thinking…
      </span>
    </span>
  )
}
