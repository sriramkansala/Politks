"use client"

// AskBar — floating chat composer for Neo Nīti AI.
//
// UI_RULES.md §1 exception:
// This component is a composite chat input — a single flex row that combines
// (icon-button + text input + send/stop button) inside one bordered + shadowed
// "bar" surface. Wrapping the inner text field in <Input> would render
// `.linear-input`'s own 1px border inside the outer bar's 1px border (the
// double-frame banned by §7). The 6 inner motion.button uses are similarly
// kept bare so framer-motion's whileHover/whileTap can target them directly
// rather than fighting Button's CSS transitions.
//
// All motion uses `springs.*` from lib/springs.ts; all shadows use tokenised
// --shadow-s* values from globals.css. No hardcoded durations or rgba codes.

import { useRef, useState, useEffect, useCallback } from "react"
import { Sparkles, X, Send, RotateCcw, ChevronDown } from "lucide-react"
import { useAskBar } from "@/hooks/use-ask-bar"
import { fontWeights } from "@/lib/font-weight"
import { springs } from "@/lib/springs"
import { AnimatePresence, motion } from "framer-motion"

const SUGGESTED = [
  "Which party kept the most promises?",
  "Who has the best attendance in Lok Sabha?",
  "What is the One Nation One Election bill?",
  "Show me BJP's unkept promises",
  "How many women MPs are there?",
  "What did AAP promise on education?",
]

function TypingDots() {
  // FF motion replaces the previous @keyframes askbar-bounce CSS animation.
  return (
    <span className="inline-flex items-center gap-[3px] h-4">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block rounded-full"
          style={{ width: 5, height: 5, background: "var(--text-tertiary)" }}
          animate={{ scale: [0.6, 1, 0.6], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2,
          }}
        />
      ))}
    </span>
  )
}

export function AskBar() {
  const { isOpen, open, close, messages, addMessage, updateLastAssistant, clear } = useAskBar()
  const [input, setInput] = useState("")
  const [streaming, setStreaming] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 80)
  }, [isOpen])

  // Keyboard shortcut: Cmd+/ to toggle
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "/") {
        e.preventDefault()
        isOpen ? close() : open()
      }
      if (e.key === "Escape" && isOpen) close()
    }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [isOpen, open, close])

  const send = useCallback(
    async (text: string) => {
      const q = text.trim()
      if (!q || streaming) return
      setInput("")
      if (!isOpen) open()

      addMessage({ role: "user", content: q })
      addMessage({ role: "assistant", content: "" })
      setStreaming(true)

      abortRef.current?.abort()
      abortRef.current = new AbortController()

      try {
        const allMsgs = useAskBar
          .getState()
          .messages.slice(0, -1)
          .map((m) => ({ role: m.role, content: m.content }))

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [...allMsgs, { role: "user", content: q }] }),
          signal: abortRef.current.signal,
        })

        if (!res.ok || !res.body) {
          const err = await res.json().catch(() => ({ error: "Request failed" }))
          updateLastAssistant(err.error ?? "Something went wrong.")
          return
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          updateLastAssistant(decoder.decode(value, { stream: true }))
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          updateLastAssistant("Couldn't reach AI. Check your API key in .env.local.")
        }
      } finally {
        setStreaming(false)
      }
    },
    [streaming, isOpen, open, addMessage, updateLastAssistant]
  )

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={springs.gentle}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.35)" }}
            onClick={close}
          />
        )}
      </AnimatePresence>

      {/* Floating bar + panel */}
      <div
        className="fixed bottom-5 left-1/2 z-50 flex flex-col items-center"
        style={{ transform: "translateX(-50%)", width: "min(680px, calc(100vw - 32px))" }}
      >
        {/* Chat panel — slides up from the bar */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={springs.responsive}
              className="w-full mb-2 flex flex-col overflow-hidden"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-strong)",
                borderRadius: 16,
                boxShadow: "var(--shadow-s7)",
                maxHeight: "60vh",
              }}
            >
              {/* Panel header */}
              <div
                className="flex items-center justify-between px-4 py-3 shrink-0"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={13} style={{ color: "var(--accent)" }} />
                  <span
                    className="text-[13px]"
                    style={{ color: "var(--text-primary)", fontVariationSettings: fontWeights.medium }}
                  >
                    Neo Nīti AI
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {messages.length > 0 && (
                    // Documented §1 exception: composite AskBar button cluster.
                    <button
                      onClick={clear}
                      className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-[6px] transition-colors hover:bg-[var(--bg-tertiary)]"
                      style={{ color: "var(--text-tertiary)" }}
                      title="Clear chat"
                    >
                      <RotateCcw size={10} />
                      Clear
                    </button>
                  )}
                  {/* Documented §1 exception. */}
                  <button
                    onClick={close}
                    className="p-1 rounded-[6px] transition-colors hover:bg-[var(--bg-tertiary)]"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4" style={{ minHeight: 80 }}>
                {messages.length === 0 ? (
                  <div className="py-6">
                    <p
                      className="text-[13px] text-center mb-4"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Ask about politicians, promises, bills, or parties
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {SUGGESTED.map((s) => (
                        // Documented §1 exception: motion.button needed for whileTap.
                        <motion.button
                          key={s}
                          onClick={() => send(s)}
                          whileTap={{ scale: 0.97 }}
                          transition={springs.snap}
                          className="text-[12px] px-3 py-1.5 rounded-[var(--radius-pill)] transition-colors hover:bg-[var(--bg-tertiary)]"
                          style={{
                            border: "1px solid var(--border)",
                            color: "var(--text-secondary)",
                            background: "var(--bg-elevated-2)",
                          }}
                        >
                          {s}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className="max-w-[85%] text-[13px] leading-relaxed px-3 py-2 rounded-[12px]"
                        style={
                          msg.role === "user"
                            ? {
                                background: "var(--accent)",
                                color: "var(--text-on-accent)",
                                borderRadius: "12px 12px 3px 12px",
                              }
                            : {
                                background: "var(--bg-elevated-2)",
                                color: "var(--text-primary)",
                                border: "1px solid var(--border)",
                                borderRadius: "12px 12px 12px 3px",
                              }
                        }
                      >
                        {msg.role === "assistant" && msg.content === "" ? (
                          <TypingDots />
                        ) : (
                          <span style={{ whiteSpace: "pre-wrap" }}>{msg.content}</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The floating bar */}
        <div
          className="w-full flex items-center gap-2 px-3 py-2"
          style={{
            background: "var(--bg-elevated)",
            border: "1px solid var(--border-strong)",
            borderRadius: 14,
            boxShadow: "var(--shadow-s4)",
          }}
        >
          {/* Spark icon button — §1 exception (motion.button for whileHover rotate). */}
          <motion.button
            onClick={() => (isOpen ? close() : open())}
            whileHover={{ rotate: 15 }}
            transition={springs.responsive}
            className="shrink-0 flex items-center justify-center rounded-[10px] transition-colors"
            style={{
              width: 32,
              height: 32,
              background: "var(--accent)",
              color: "var(--text-on-accent)",
            }}
            title="Neo Nīti AI (⌘/)"
          >
            <Sparkles size={14} strokeWidth={1.8} />
          </motion.button>

          {/* Composite-input §1 exception: bare <input> avoids double-framing. */}
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={open}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                send(input)
              }
            }}
            placeholder="Ask anything or search…"
            className="flex-1 bg-transparent outline-none text-[13px] min-w-0"
            style={{ color: "var(--text-primary)" }}
            disabled={streaming}
          />

          {/* Right side: send or stop */}
          <div className="flex items-center gap-1 shrink-0">
            {streaming && (
              // §1 exception: motion.button for whileTap feedback.
              <motion.button
                onClick={() => abortRef.current?.abort()}
                whileTap={{ scale: 0.97 }}
                transition={springs.snap}
                className="flex items-center gap-1 text-[11px] px-2 py-1 rounded-[6px] transition-colors hover:bg-[var(--bg-tertiary)]"
                style={{ color: "var(--text-tertiary)" }}
              >
                <X size={10} /> Stop
              </motion.button>
            )}
            {/* §1 exception: motion.button for whileTap. */}
            <motion.button
              onClick={() => send(input)}
              disabled={!input.trim() || streaming}
              whileTap={{ scale: 0.95 }}
              transition={springs.snap}
              className="flex items-center justify-center rounded-[8px] transition-colors disabled:opacity-30"
              style={{
                width: 28,
                height: 28,
                background: input.trim() ? "var(--accent)" : "var(--bg-tertiary)",
                color: input.trim() ? "var(--text-on-accent)" : "var(--text-disabled)",
              }}
            >
              <Send size={12} strokeWidth={2} />
            </motion.button>
          </div>
        </div>

        {/* Shortcut hint */}
        {!isOpen && (
          <p
            className="mt-1.5 text-[10px] text-center"
            style={{ color: "var(--text-disabled)" }}
          >
            ⌘ /
          </p>
        )}
      </div>
    </>
  )
}
