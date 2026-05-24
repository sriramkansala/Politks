"use client"

import { create } from "zustand"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface AskBarStore {
  isOpen: boolean
  messages: Message[]
  open: () => void
  close: () => void
  toggle: () => void
  addMessage: (msg: Message) => void
  updateLastAssistant: (text: string) => void
  clear: () => void
}

export const useAskBar = create<AskBarStore>((set) => ({
  isOpen: false,
  messages: [],
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  updateLastAssistant: (text) =>
    set((s) => {
      const msgs = [...s.messages]
      const last = msgs[msgs.length - 1]
      if (last?.role === "assistant") {
        msgs[msgs.length - 1] = { ...last, content: last.content + text }
      }
      return { messages: msgs }
    }),
  clear: () => set({ messages: [] }),
}))
