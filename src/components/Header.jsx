import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUserStore } from '../store/userStore'
import { useWeightStore } from '../store/weightStore'
import { useNotificationStore } from '../store/notificationStore'
import NotificationModal from './NotificationModal'

function FitFlowLogo() {
  return (
    <motion.svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      whileHover={{ rotate: -8, scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 280, damping: 18 }}
    >
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C8FF00" />
          <stop offset="100%" stopColor="#00D4FF" />
        </linearGradient>
      </defs>
      <path d="M16 2L28 9V23L16 30L4 23V9L16 2Z" fill="url(#logo-grad)" opacity="0.12" />
      <path d="M16 2L28 9V23L16 30L4 23V9L16 2Z" stroke="url(#logo-grad)" strokeWidth="1.2" fill="none" />
      <path d="M7 16H11L13.5 11L16.5 21L19 16H25" stroke="url(#logo-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  )
}

function ProfileSheet({ onClose }) {
  const name = useUserStore((s) => s.name)
  const resetUser = useUserStore((s) => s.reset)
  const resetWeights = useWeightStore((s) => s.reset)
  const resetNotifications = useNotificationStore((s) => s.reset)
  const [confirming, setConfirming] = useState(false)
  const safeName = typeof name === 'string' && name.trim().length > 0 ? name.trim() : 'User'

  const handleSwitch = () => {
    onClose()
    setTimeout(() => {
      resetUser()
      resetWeights()
      resetNotifications()
    }, 0)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', zIndex: 150, display: 'flex', alignItems: 'flex-end' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 38 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border-bright)',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          padding: '28px 24px 36px',
          width: '100%',
        }}
      >
        {/* Handle bar */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)', margin: '0 auto 24px' }} />

        {/* Avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'var(--color-primary-dim)',
            border: '2px solid var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700,
            color: 'var(--color-primary)',
          }}>
            {safeName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text)' }}>{safeName}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: 2 }}>FitFlow account</div>
          </div>
        </div>

        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            style={{
              width: '100%', padding: '13px', borderRadius: 'var(--radius-sm)',
              background: 'rgba(255,77,109,0.08)', border: '1px solid rgba(255,77,109,0.25)',
              color: 'var(--color-danger)', fontFamily: 'var(--font-base)', fontSize: '0.95rem',
              fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s',
            }}
          >
            Switch User
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: 4 }}>
              This will clear all your data and restart onboarding.
            </p>
            <button
              onClick={handleSwitch}
              style={{
                width: '100%', padding: '13px', borderRadius: 'var(--radius-sm)',
                background: 'var(--color-danger)', border: 'none',
                color: 'white', fontFamily: 'var(--font-base)', fontSize: '0.95rem',
                fontWeight: 700, cursor: 'pointer',
              }}
            >
              Yes, clear & switch
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="btn-ghost"
              style={{ width: '100%', padding: '13px', textAlign: 'center' }}
            >
              Cancel
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default function Header() {
  const [showModal, setShowModal] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const name = useUserStore((s) => s.name)
  const onboardingComplete = useUserStore((s) => s.onboardingComplete)

  return (
    <header className="app-header">
      <div className="header-brand">
        <FitFlowLogo />
        Fit<span>Flow</span>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <motion.button className="bell-btn icon-ping" onClick={() => setShowModal(true)} aria-label="Open notifications" whileTap={{ scale: 0.95 }}>
          <motion.svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            whileHover={{ rotate: 12, scale: 1.08 }}
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </motion.svg>
        </motion.button>

        <motion.button
          className="bell-btn"
          onClick={() => setShowProfile(true)}
          aria-label="Profile"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-primary)' }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
        >
          {name ? name.charAt(0).toUpperCase() : '?'}
        </motion.button>
      </div>

      {onboardingComplete && showModal && <NotificationModal onClose={() => setShowModal(false)} />}

      <AnimatePresence>
        {onboardingComplete && showProfile && <ProfileSheet onClose={() => setShowProfile(false)} />}
      </AnimatePresence>
    </header>
  )
}
