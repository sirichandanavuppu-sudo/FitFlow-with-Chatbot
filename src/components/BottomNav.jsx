import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12L12 4L21 12V20H15V14H9V20H3V12Z" />
  </svg>
)

const TrackerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 20V14M8 20V8M12 20V12M16 20V4M20 20V10" />
  </svg>
)

const GoalsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

const ChatIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const NAV_ITEMS = [
  { to: '/',        label: 'Home',    Icon: HomeIcon,    end: true },
  { to: '/tracker', label: 'Track',   Icon: TrackerIcon, end: false },
  { to: '/goals',   label: 'Goals',   Icon: GoalsIcon,   end: false },
  { to: '/chat',    label: 'AI',      Icon: ChatIcon,    end: false },
]

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          {({ isActive }) => (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }} style={{ display: 'contents' }}>
              <motion.span
                className="nav-icon"
                whileHover={{ rotate: isActive ? 0 : 8, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              >
                <item.Icon />
              </motion.span>
              <span className="nav-label">{item.label}</span>
            </motion.div>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
