import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DEFAULT_REMINDERS = [
  { id: 'water-1',      label: 'Morning Water',     defaultTime: '08:00', customTime: '08:00', enabled: false },
  { id: 'water-2',      label: 'Mid-Morning Water', defaultTime: '10:00', customTime: '10:00', enabled: false },
  { id: 'water-3',      label: 'Afternoon Water',   defaultTime: '14:00', customTime: '14:00', enabled: false },
  { id: 'water-4',      label: 'Evening Water',     defaultTime: '18:00', customTime: '18:00', enabled: false },
  { id: 'breakfast',    label: 'Breakfast',         defaultTime: '08:00', customTime: '08:00', enabled: false },
  { id: 'lunch',        label: 'Lunch',             defaultTime: '13:00', customTime: '13:00', enabled: false },
  { id: 'dinner',       label: 'Dinner',            defaultTime: '19:00', customTime: '19:00', enabled: false },
  { id: 'snack-am',     label: 'Morning Snack',     defaultTime: '10:30', customTime: '10:30', enabled: false },
  { id: 'snack-pm',     label: 'Afternoon Snack',   defaultTime: '16:00', customTime: '16:00', enabled: false },
  { id: 'green-tea-am', label: 'Green Tea (AM)',    defaultTime: '09:00', customTime: '09:00', enabled: false },
  { id: 'green-tea-pm', label: 'Green Tea (PM)',    defaultTime: '15:00', customTime: '15:00', enabled: false },
]

export const useNotificationStore = create(
  persist(
    (set) => ({
      permissionState: 'default',
      reminders: DEFAULT_REMINDERS,

      setPermissionState: (state) => set({ permissionState: state }),

      toggleReminder: (id) =>
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id ? { ...r, enabled: !r.enabled } : r
          ),
        })),

      updateReminderTime: (id, time) =>
        set((state) => ({
          reminders: state.reminders.map((r) =>
            r.id === id ? { ...r, customTime: time } : r
          ),
        })),

      reset: () => set({ reminders: DEFAULT_REMINDERS, permissionState: 'default' }),
    }),
    { name: 'fitflow_notifications' }
  )
)
