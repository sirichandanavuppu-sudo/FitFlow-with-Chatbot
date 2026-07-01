import { useEffect, useRef } from 'react'
import dayjs from 'dayjs'
import { useNotificationStore } from '../store/notificationStore'

export function useNotificationScheduler() {
  const reminders = useNotificationStore((s) => s.reminders)
  const permissionState = useNotificationStore((s) => s.permissionState)
  const timeoutRefs = useRef({})

  useEffect(() => {
    Object.values(timeoutRefs.current).forEach(clearTimeout)
    timeoutRefs.current = {}

    const enabled = reminders.filter((r) => r.enabled)

    enabled.forEach((reminder) => {
      const scheduleNext = () => {
        const [h, m] = reminder.customTime.split(':').map(Number)
        let target = dayjs().hour(h).minute(m).second(0).millisecond(0)
        if (target.isBefore(dayjs())) {
          target = target.add(1, 'day')
        }
        const msUntil = target.diff(dayjs())

        timeoutRefs.current[reminder.id] = setTimeout(() => {
          if (permissionState === 'granted' && 'Notification' in window) {
            new Notification('FitFlow', {
              body: reminder.label,
              icon: '/icons/icon-192.png',
            })
          }
          window.dispatchEvent(
            new CustomEvent('fitflow-reminder', { detail: { label: reminder.label } })
          )
          scheduleNext()
        }, msUntil)
      }

      scheduleNext()
    })

    return () => {
      Object.values(timeoutRefs.current).forEach(clearTimeout)
      timeoutRefs.current = {}
    }
  }, [reminders, permissionState])
}
