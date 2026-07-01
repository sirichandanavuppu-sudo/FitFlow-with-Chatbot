import { motion } from 'framer-motion'
import dayjs from 'dayjs'
import { useUserStore } from '../store/userStore'
import { useWeightStore } from '../store/weightStore'
import { projectByHistory, projectByDeficit } from '../utils/goal'
import { slideVariants, staggerContainer } from '../animations/variants'
import ProgressRing from '../components/ProgressRing'

const container = staggerContainer(0.09, 0.04)

export default function Goals() {
  const { goalWeight, calorieDeficit } = useUserStore()
  const { entries, getCurrentWeight } = useWeightStore()

  const currentWeight = getCurrentWeight()
  const startWeight = entries.length > 0 ? entries[0].weight : currentWeight
  const remaining = Math.max(currentWeight - goalWeight, 0)
  const totalToLose = Math.max(startWeight - goalWeight, 1)
  const pct = Math.min(((startWeight - currentWeight) / totalToLose) * 100, 100)

  const historyProjection = projectByHistory(entries, goalWeight)
  const deficitProjection = calorieDeficit
    ? projectByDeficit(calorieDeficit, currentWeight, goalWeight)
    : null

  const milestones = [25, 50, 75, 100].map((p) => ({
    pct: p,
    weight: Math.round((startWeight - (totalToLose * p) / 100) * 10) / 10,
    reached: pct >= p,
  }))

  return (
    <motion.div
      className="page"
      variants={container}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Goal ring */}
      <motion.div
        variants={slideVariants}
        className="section-card"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}
      >
        <ProgressRing
          value={pct}
          max={100}
          size={148}
          strokeWidth={12}
          color="var(--color-primary)"
          label={`${Math.round(pct)}%`}
          sublabel="complete"
        />
        <p style={{ color: pct >= 100 ? 'var(--color-primary)' : 'var(--color-text-muted)', fontSize: '0.88rem', fontWeight: 500 }}>
          {remaining > 0 ? `${remaining.toFixed(1)} kg remaining` : 'Goal reached! 🎉'}
        </p>
      </motion.div>

      {/* History projection */}
      {historyProjection ? (
        <motion.div variants={slideVariants} className="goal-projection" style={{ borderLeft: '2px solid var(--color-primary)', paddingLeft: 16 }}>
          <div className="projection-mode">📈 Based on your history</div>
          <div className="projection-value">
            {historyProjection.weeksRemaining === 0 ? 'Already at goal!' : `~${historyProjection.weeksRemaining} weeks`}
          </div>
          {historyProjection.weeksRemaining > 0 && (
            <div className="projection-sub">
              Est. {dayjs(historyProjection.projectedDate).format('MMM D, YYYY')} · losing {Math.abs(historyProjection.weeklyDelta)} kg/wk
            </div>
          )}
        </motion.div>
      ) : entries.length < 2 ? (
        <motion.div variants={slideVariants} className="goal-projection">
          <div className="projection-mode">📈 History-based estimate</div>
          <div className="projection-sub" style={{ marginTop: 4 }}>Log at least 2 weight entries to see a projection.</div>
        </motion.div>
      ) : null}

      {/* Deficit projection */}
      {deficitProjection && (
        <motion.div variants={slideVariants} className="goal-projection" style={{ borderLeft: '2px solid var(--color-accent)', paddingLeft: 16 }}>
          <div className="projection-mode">🔥 Based on calorie deficit</div>
          <div className="projection-value" style={{ color: 'var(--color-accent)' }}>
            {deficitProjection.weeksRemaining === 0 ? 'Already at goal!' : `~${deficitProjection.weeksRemaining} weeks`}
          </div>
          {deficitProjection.weeksRemaining > 0 && (
            <div className="projection-sub">
              Est. {dayjs(deficitProjection.projectedDate).format('MMM D, YYYY')} · {calorieDeficit} kcal/day → {deficitProjection.kgPerWeek} kg/wk
            </div>
          )}
        </motion.div>
      )}

      {/* Milestones */}
      <motion.div variants={slideVariants} className="section-card">
        <h3>Milestones</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {milestones.map((m, i) => (
            <motion.div
              key={m.pct}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.07 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                background: m.reached ? 'var(--color-primary-dim)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${m.reached ? 'rgba(200,255,0,0.2)' : 'var(--color-border)'}`,
                transition: 'all 0.3s',
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{m.reached ? '✅' : '⭕'}</span>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: m.reached ? 'var(--color-primary)' : 'var(--color-text-muted)',
                }}>
                  {m.pct}% — {m.weight} kg
                </div>
              </div>
              {m.reached && (
                <span style={{ fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Done
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
