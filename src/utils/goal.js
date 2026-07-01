import dayjs from 'dayjs'

export function projectByHistory(entries, goalWeight) {
  if (!entries || entries.length < 2) return null

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date))
  const recent = sorted.slice(-4)
  if (recent.length < 2) return null

  const daysDiff = dayjs(recent[recent.length - 1].date).diff(dayjs(recent[0].date), 'day')
  if (daysDiff === 0) return null

  const weightDelta = recent[recent.length - 1].weight - recent[0].weight
  const weeklyDelta = Math.round((weightDelta / daysDiff) * 7 * 100) / 100

  if (weeklyDelta >= 0) return null

  const currentWeight = sorted[sorted.length - 1].weight
  const remaining = currentWeight - goalWeight

  if (remaining <= 0) {
    return { weeksRemaining: 0, projectedDate: dayjs().format('YYYY-MM-DD'), weeklyDelta }
  }

  const weeksRemaining = Math.ceil(remaining / Math.abs(weeklyDelta))
  const projectedDate = dayjs().add(weeksRemaining, 'week').format('YYYY-MM-DD')

  return { weeksRemaining, projectedDate, weeklyDelta }
}

export function projectByDeficit(calorieDeficit, currentWeight, goalWeight) {
  if (!calorieDeficit || calorieDeficit <= 0) return null

  const remaining = currentWeight - goalWeight
  if (remaining <= 0) {
    return { weeksRemaining: 0, projectedDate: dayjs().format('YYYY-MM-DD'), kgPerWeek: 0 }
  }

  const kgPerWeekRaw = (calorieDeficit * 7) / 7700
  const kgPerWeek = Math.round(kgPerWeekRaw * 100) / 100
  const weeksRemaining = Math.ceil(remaining / kgPerWeekRaw)
  const projectedDate = dayjs().add(weeksRemaining, 'week').format('YYYY-MM-DD')

  return { weeksRemaining, projectedDate, kgPerWeek }
}
