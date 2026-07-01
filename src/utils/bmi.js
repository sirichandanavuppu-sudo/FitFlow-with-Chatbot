export function calcBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm || heightCm === 0) return null
  const heightM = heightCm / 100
  const raw = weightKg / (heightM * heightM)
  const value = Math.round(raw * 10) / 10

  let category, color
  if (raw < 18.5)      { category = 'Underweight'; color = '#38BDF8' }
  else if (raw < 25)   { category = 'Normal';      color = '#22C55E' }
  else if (raw < 30)   { category = 'Overweight';  color = '#F59E0B' }
  else                 { category = 'Obese';        color = '#EF4444' }

  return { value, category, color }
}
