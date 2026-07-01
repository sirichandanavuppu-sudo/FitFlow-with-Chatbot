import { useState } from 'react'
import { motion } from 'framer-motion'
import dayjs from 'dayjs'
import { useUserStore } from '../store/userStore'
import { useWeightStore } from '../store/weightStore'
import { useNotificationStore } from '../store/notificationStore'
import { calcBMI } from '../utils/bmi'
import { listItem, slideVariants, staggerContainer } from '../animations/variants'
import StatCard from '../components/StatCard'
import ProgressRing from '../components/ProgressRing'

const container = staggerContainer(0.07, 0.05)

function getGreeting() {
  const h = dayjs().hour()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Home() {
  const { name, heightCm, goalWeight } = useUserStore()
  const { entries, addEntry, getCurrentWeight } = useWeightStore()
  const reminders = useNotificationStore((s) => s.reminders)
  const [quickWeight, setQuickWeight] = useState('')

  const currentWeight = getCurrentWeight()
  const bmi = calcBMI(currentWeight, heightCm)

  const startWeight = entries.length > 0 ? entries[0].weight : currentWeight
  const totalToLose = startWeight - goalWeight
  const lost = startWeight - currentWeight
  const goalPct = totalToLose > 0 ? Math.min((lost / totalToLose) * 100, 100) : 0

  const upcoming = reminders
    .filter((r) => r.enabled)
    .sort((a, b) => a.customTime.localeCompare(b.customTime))
    .slice(0, 3)

  const handleQuickAdd = () => {
    if (!quickWeight) return
    addEntry(dayjs().format('YYYY-MM-DD'), Number(quickWeight))
    setQuickWeight('')
  }

  return (
    <motion.div
      className="page"
      variants={container}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Greeting */}
      <motion.div variants={slideVariants} className="greeting-card">
        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {getGreeting()}
        </p>
        <h2>
          <em>{name}</em> 👋
        </h2>
        <p style={{ marginTop: 6 }}>{dayjs().format('dddd, MMMM D')}</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={slideVariants} className="stats-grid" style={{ marginBottom: 0 }}>
        <StatCard
          label="Current Weight"
          value={`${currentWeight} kg`}
          icon="⚖️"
          accent="var(--color-primary)"
          index={0}
        />
        <StatCard
          label="Goal Weight"
          value={`${goalWeight} kg`}
          icon="🎯"
          accent="var(--color-accent)"
          index={1}
        />
      </motion.div>

      {/* Rings */}
      <motion.div variants={slideVariants} className="rings-row">
        {bmi && (
          <div style={{ textAlign: 'center' }}>
            <ProgressRing
              value={bmi.value}
              max={40}
              color={bmi.color}
              label={String(bmi.value)}
              sublabel={bmi.category}
            />
            <p style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>BMI</p>
          </div>
        )}
        <div style={{ textAlign: 'center' }}>
          <ProgressRing
            value={goalPct}
            max={100}
            color="var(--color-primary)"
            label={`${Math.round(goalPct)}%`}
            sublabel="Goal"
          />
          <p style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Progress</p>
        </div>
      </motion.div>

      {/* Quick log */}
      <motion.div variants={slideVariants} className="section-card">
        <h3>Log today's weight</h3>
        <div className="quick-add-row">
          <input
            type="number"
            value={quickWeight}
            onChange={(e) => setQuickWeight(e.target.value)}
            placeholder="kg"
            step="0.1"
            min="20"
            max="300"
          />
          <button className="btn-primary" onClick={handleQuickAdd} disabled={!quickWeight}>
            Add
          </button>
        </div>
      </motion.div>

      {/* Reminders */}
      {upcoming.length > 0 && (
        <motion.div variants={slideVariants} className="section-card">
          <h3>Upcoming reminders</h3>
          {upcoming.map((r, i) => (
            <motion.div
              key={r.id}
              className="reminder-item"
              variants={listItem}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 + i * 0.06 }}
            >
              <span style={{ color: 'var(--color-text)' }}>
                <span style={{ marginRight: 8, opacity: 0.7 }}>🔔</span>
                {r.label}
              </span>
              <span style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.95rem' }}>
                {r.customTime}
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
