"use client"

// User setting: which party IDs the viewer has chosen to hide from list/grid
// views across the app. Persisted to localStorage so the preference survives
// reloads. The key is a Set semantically, but we store it as a string array
// because localStorage / JSON don't have a Set type.

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface HiddenPartiesStore {
  /** Party IDs the user has toggled off. */
  hidden: string[]
  toggle: (partyId: string) => void
  setAll: (partyIds: string[]) => void
  clear: () => void
  isHidden: (partyId: string) => boolean
}

export const useHiddenParties = create<HiddenPartiesStore>()(
  persist(
    (set, get) => ({
      hidden: [],
      toggle: (partyId) =>
        set((state) => ({
          hidden: state.hidden.includes(partyId)
            ? state.hidden.filter((id) => id !== partyId)
            : [...state.hidden, partyId],
        })),
      setAll: (partyIds) => set({ hidden: partyIds }),
      clear: () => set({ hidden: [] }),
      isHidden: (partyId) => get().hidden.includes(partyId),
    }),
    { name: "neo-niti-hidden-parties" }
  )
)
