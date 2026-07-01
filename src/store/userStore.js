import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DEFAULT = {
  name: '',
  heightCm: 0,
  onboardingWeight: 0,
  goalWeight: 0,
  calorieDeficit: null,
  onboardingComplete: false,
}

export const useUserStore = create(
  persist(
    (set) => ({
      ...DEFAULT,
      setProfile: (profile) => set(profile),
      completeOnboarding: () => set({ onboardingComplete: true }),
      reset: () => set(DEFAULT),
    }),
    { name: 'fitflow_user' }
  )
)
