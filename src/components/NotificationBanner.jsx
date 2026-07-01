import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function NotificationBanner() {
  const [message, setMessage] = useState(null)

  useEffect(() => {
    let timer
    const handler = (e) => {
      setMessage(e.detail.label)
      clearTimeout(timer)
      timer = setTimeout(() => setMessage(null), 4000)
    }
    window.addEventListener('fitflow-reminder', handler)
    return () => {
      window.removeEventListener('fitflow-reminder', handler)
      clearTimeout(timer)
    }
  }, [])

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className="notification-banner"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1, scale: [1, 1.02, 1] }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30, scale: { duration: 0.5 } }}
        >
          🔔 {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
