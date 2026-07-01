import { motion } from 'framer-motion'

export default function StatCard({ label, value, icon, accent, index = 0 }) {
  return (
    <motion.div
      className="stat-card"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.23, 1, 0.32, 1] }}
      style={accent ? {
        borderColor: `${accent}30`,
        boxShadow: `0 0 20px ${accent}18`,
      } : undefined}
      whileHover={{
        scale: 1.03,
        y: -3,
        boxShadow: accent ? `0 14px 28px ${accent}30` : '0 14px 26px rgba(0, 0, 0, 0.45)',
        transition: { duration: 0.16 },
      }}
    >
      {accent && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '2px',
          background: accent,
          opacity: 0.7,
          borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
        }} />
      )}
      {icon && <span className="stat-card-icon">{icon}</span>}
      <span className="stat-card-label">{label}</span>
      <span className="stat-card-value">{value}</span>
    </motion.div>
  )
}
