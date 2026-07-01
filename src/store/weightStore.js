import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useWeightStore = create(
  persist(
    (set, get) => ({
      entries: [],

      addEntry: (date, weight) =>
        set((state) => ({
          entries: [
            ...state.entries.filter((e) => e.date !== date),
            { date, weight: Number(weight) },
          ].sort((a, b) => a.date.localeCompare(b.date)),
        })),

      deleteEntry: (date) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.date !== date),
        })),

      reset: () => set({ entries: [] }),

      getCurrentWeight: () => {
        const { entries } = get()
        if (entries.length > 0) return entries[entries.length - 1].weight
        try {
          const raw = localStorage.getItem('fitflow_user')
          if (raw) return JSON.parse(raw).state?.onboardingWeight ?? 0
        } catch { /* empty */ }
        return 0
      },
    }),
    { name: 'fitflow_weights' }
  )
)
