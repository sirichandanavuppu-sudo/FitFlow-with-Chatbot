import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dayjs from 'dayjs'
import { useWeightStore } from '../store/weightStore'
import { listItem, listStagger, slideVariants, staggerContainer } from '../animations/variants'
import WeightChart from '../components/WeightChart'

const RANGES = [
  { label: '7d',  value: '7' },
  { label: '30d', value: '30' },
  { label: '90d', value: '90' },
  { label: 'All', value: 'all' },
]

const container = staggerContainer(0.08, 0.04)

export default function Tracker() {
  const { entries, addEntry, deleteEntry } = useWeightStore()
  const [range, setRange] = useState('30')
  const [form, setForm] = useState({ date: dayjs().format('YYYY-MM-DD'), weight: '' })

  const handleAdd = () => {
    if (!form.weight) return
    addEntry(form.date, Number(form.weight))
    setForm((f) => ({ ...f, weight: '' }))
  }

  return (
    <motion.div
      className="page"
      variants={container}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div variants={slideVariants} className="section-card">
        <h3>Weight History</h3>
        <div className="range-tabs">
          {RANGES.map((r) => (
            <button
              key={r.value}
              className={`range-tab${range === r.value ? ' active' : ''}`}
              onClick={() => setRange(r.value)}
            >
              {r.label}
            </button>
          ))}
        </div>
        <WeightChart entries={entries} range={range} />
      </motion.div>

      <motion.div variants={slideVariants} className="section-card">
        <h3>Log Weight</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>
              Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              max={dayjs().format('YYYY-MM-DD')}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>
              Weight (kg)
            </label>
            <div className="quick-add-row">
              <input
                type="number"
                value={form.weight}
                onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
                placeholder="e.g. 74.5"
                step="0.1"
                min="20"
                max="300"
              />
              <button className="btn-primary" onClick={handleAdd} disabled={!form.weight}>Save</button>
            </div>
          </div>
        </div>
      </motion.div>

      {entries.length > 0 && (
        <motion.div variants={slideVariants} className="section-card">
          <h3>History</h3>
          <motion.div className="history-list" variants={listStagger} initial="hidden" animate="visible">
            <AnimatePresence initial={false}>
              {[...entries].reverse().map((e, i) => (
                <motion.div
                  key={e.date}
                  className="history-item"
                  variants={listItem}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, x: 16, height: 0, paddingTop: 0, paddingBottom: 0 }}
                  transition={{ duration: 0.25, delay: i < 10 ? i * 0.03 : 0 }}
                >
                  <span className="history-item-date">{dayjs(e.date).format('MMM D, YYYY')}</span>
                  <span className="history-item-weight">{e.weight} kg</span>
                  <button
                    className="delete-btn"
                    onClick={() => deleteEntry(e.date)}
                    aria-label={`Delete ${e.date}`}
                  >
                    ✕
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}
