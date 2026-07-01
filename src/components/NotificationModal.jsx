import { motion } from 'framer-motion'
import { useNotificationStore } from '../store/notificationStore'

export default function NotificationModal({ onClose }) {
  const { reminders, permissionState, toggleReminder, updateReminderTime, setPermissionState } =
    useNotificationStore()

  const handleToggle = async (id) => {
    const reminder = reminders.find((r) => r.id === id)
    if (!reminder.enabled && permissionState === 'default' && 'Notification' in window) {
      const result = await Notification.requestPermission()
      setPermissionState(result)
      if (result === 'denied') return
    }
    toggleReminder(id)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-sheet"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 35 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Reminders</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {permissionState === 'denied' && (
          <div style={{ color: 'var(--color-danger)', fontSize: '0.85rem', marginBottom: 12, padding: '8px', background: 'var(--color-bg)', borderRadius: 'var(--radius-sm)' }}>
            Notification permission denied. Enable it in your browser settings.
          </div>
        )}

        {reminders.map((r, index) => (
          <motion.div
            key={r.id}
            className="reminder-row"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.06 + index * 0.04 }}
          >
            <label htmlFor={`toggle-${r.id}`}>{r.label}</label>
            <input
              type="time"
              value={r.customTime}
              onChange={(e) => updateReminderTime(r.id, e.target.value)}
              disabled={!r.enabled}
              aria-label={`Time for ${r.label}`}
            />
            <label className="toggle">
              <input
                id={`toggle-${r.id}`}
                type="checkbox"
                checked={r.enabled}
                onChange={() => handleToggle(r.id)}
                disabled={permissionState === 'denied'}
              />
              <span className="toggle-slider" />
            </label>
          </motion.div>
        ))}

        <motion.div className="permission-note reminder-pulse" animate={{ scale: [1, 1.01, 1] }} transition={{ duration: 1.8, repeat: Infinity }}>
          ℹ️ Reminders only fire while FitFlow is open in your browser tab.
        </motion.div>
      </motion.div>
    </div>
  )
}
