import { motion } from 'framer-motion'

export default function ProgressRing({
  value,
  max,
  size = 110,
  strokeWidth = 9,
  color = 'var(--color-primary)',
  label,
  sublabel,
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(Math.max(value / max, 0), 1)
  const offset = circumference * (1 - pct)
  const filterId = `glow-${color.replace(/[^a-z0-9]/gi, '')}`

  return (
    <div className="progress-ring-container" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: [0.23, 1, 0.32, 1] }}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
          filter={pct > 0 ? `url(#${filterId})` : undefined}
        />
      </svg>
      <div className="progress-ring-label">
        <span className="progress-ring-value">{label}</span>
        {sublabel && <span className="progress-ring-sublabel">{sublabel}</span>}
      </div>
    </div>
  )
}
