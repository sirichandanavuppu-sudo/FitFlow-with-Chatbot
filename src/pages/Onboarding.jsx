import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dayjs from 'dayjs'
import { useUserStore } from '../store/userStore'
import { useWeightStore } from '../store/weightStore'

const slide = {
  initial: (dir) => ({ x: dir > 0 ? 120 : -120, opacity: 0 }),
  animate: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -120 : 120, opacity: 0 }),
  transition: { duration: 0.25 },
}

function inchesToCm(inches) {
  return Math.round(inches * 2.54 * 10) / 10
}

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [heightUnit, setHeightUnit] = useState('cm') // 'cm' | 'in'
  const [form, setForm] = useState({ name: '', heightCm: '', weight: '', goalWeight: '', calorieDeficit: '' })

  const setProfile = useUserStore((s) => s.setProfile)
  const completeOnboarding = useUserStore((s) => s.completeOnboarding)
  const addEntry = useWeightStore((s) => s.addEntry)

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  const next = () => { setDir(1); setStep((s) => s + 1) }
  const back = () => { setDir(-1); setStep((s) => s - 1) }

  const switchUnit = (unit) => {
    setHeightUnit(unit)
    setForm((f) => ({ ...f, heightCm: '' }))
  }

  const resolvedHeightCm =
    heightUnit === 'in'
      ? inchesToCm(Number(form.heightCm))
      : Number(form.heightCm)

  const finish = () => {
    setProfile({
      name: form.name.trim(),
      heightCm: resolvedHeightCm,
      onboardingWeight: Number(form.weight),
      goalWeight: Number(form.goalWeight),
      calorieDeficit: form.calorieDeficit ? Number(form.calorieDeficit) : null,
    })
    addEntry(dayjs().format('YYYY-MM-DD'), Number(form.weight))
    completeOnboarding()
  }

  const steps = [
    <div key="0" className="onboarding-step">
      <h1>Welcome to<br /><span>FitFlow</span> 💪</h1>
      <p>Your personal fitness companion. Let's set you up in 60 seconds.</p>
      <div>
        <label>What's your name?</label>
        <input type="text" value={form.name} onChange={update('name')} placeholder="e.g. Alex" autoFocus />
      </div>
      <button className="btn-primary" onClick={next} disabled={!form.name.trim()}>Next →</button>
    </div>,

    <div key="1" className="onboarding-step">
      <h2>Tell us about your body</h2>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <label style={{ margin: 0 }}>Height</label>
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              type="button"
              onClick={() => switchUnit('cm')}
              style={{
                padding: '2px 10px', fontSize: '0.75rem', borderRadius: 999, border: '1.5px solid',
                borderColor: heightUnit === 'cm' ? 'var(--color-primary)' : 'var(--color-border)',
                background: heightUnit === 'cm' ? 'var(--color-primary)' : 'none',
                color: heightUnit === 'cm' ? 'white' : 'var(--color-text-muted)',
                cursor: 'pointer',
              }}
            >cm</button>
            <button
              type="button"
              onClick={() => switchUnit('in')}
              style={{
                padding: '2px 10px', fontSize: '0.75rem', borderRadius: 999, border: '1.5px solid',
                borderColor: heightUnit === 'in' ? 'var(--color-primary)' : 'var(--color-border)',
                background: heightUnit === 'in' ? 'var(--color-primary)' : 'none',
                color: heightUnit === 'in' ? 'white' : 'var(--color-text-muted)',
                cursor: 'pointer',
              }}
            >in</button>
          </div>
        </div>
        <input
          type="number"
          value={form.heightCm}
          onChange={update('heightCm')}
          placeholder={heightUnit === 'cm' ? 'e.g. 170' : 'e.g. 67'}
          min={heightUnit === 'cm' ? 100 : 39}
          max={heightUnit === 'cm' ? 250 : 98}
          step="0.1"
        />
        {form.heightCm && heightUnit === 'in' && (
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
            = {inchesToCm(Number(form.heightCm))} cm
          </p>
        )}
      </div>
      <div>
        <label>Current weight (kg)</label>
        <input type="number" value={form.weight} onChange={update('weight')} placeholder="e.g. 78" min="30" max="300" step="0.1" />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn-ghost" onClick={back}>← Back</button>
        <button className="btn-primary" onClick={next} disabled={!form.heightCm || !form.weight} style={{ flex: 1 }}>Next →</button>
      </div>
    </div>,

    <div key="2" className="onboarding-step">
      <h2>Set your goal</h2>
      <div>
        <label>Goal weight (kg)</label>
        <input type="number" value={form.goalWeight} onChange={update('goalWeight')} placeholder="e.g. 68" min="30" max="300" step="0.1" />
      </div>
      <div>
        <label>Daily calorie deficit (optional)</label>
        <input type="number" value={form.calorieDeficit} onChange={update('calorieDeficit')} placeholder="e.g. 500 kcal" min="0" max="2000" />
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 4 }}>Used to project how fast you'll reach your goal.</p>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn-ghost" onClick={back}>← Back</button>
        <button className="btn-primary" onClick={next} disabled={!form.goalWeight} style={{ flex: 1 }}>Next →</button>
      </div>
    </div>,

    <div key="3" className="onboarding-step">
      <h2>You're all set, {form.name}! 🎉</h2>
      <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', padding: 16, border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <p><strong>Height:</strong> {resolvedHeightCm} cm{heightUnit === 'in' ? ` (${form.heightCm} in)` : ''}</p>
        <p><strong>Current weight:</strong> {form.weight} kg</p>
        <p><strong>Goal weight:</strong> {form.goalWeight} kg</p>
        {form.calorieDeficit && <p><strong>Daily deficit:</strong> {form.calorieDeficit} kcal</p>}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn-ghost" onClick={back}>← Back</button>
        <button className="btn-primary" onClick={finish} style={{ flex: 1 }}>Let's go! 🚀</button>
      </div>
    </div>,
  ]

  return (
    <div className="onboarding">
      <div className="step-dots">
        {steps.map((_, i) => (
          <div key={i} className={`step-dot${i <= step ? ' active' : ''}`} />
        ))}
      </div>
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div key={step} custom={dir} {...slide} style={{ width: '100%', maxWidth: 400 }}>
          {steps[step]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
