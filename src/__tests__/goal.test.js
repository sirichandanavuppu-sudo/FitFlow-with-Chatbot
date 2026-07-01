import { describe, it, expect, vi } from 'vitest'
import { projectByHistory, projectByDeficit } from '../utils/goal'

// Mock dayjs so "today" is deterministic
vi.mock('dayjs', async (importOriginal) => {
  const mod = await importOriginal()
  const actual = mod.default ?? mod
  const TODAY = '2026-04-29'
  const mockDayjs = (...args) => (args.length ? actual(...args) : actual(TODAY))
  Object.assign(mockDayjs, actual)
  mockDayjs.prototype = actual.prototype
  return { default: mockDayjs }
})

describe('projectByHistory', () => {
  it('returns null with fewer than 2 entries', () => {
    expect(projectByHistory([], 65)).toBeNull()
    expect(projectByHistory([{ date: '2026-04-01', weight: 75 }], 65)).toBeNull()
  })

  it('returns null if weight is not decreasing', () => {
    const entries = [
      { date: '2026-04-01', weight: 70 },
      { date: '2026-04-08', weight: 71 },
    ]
    expect(projectByHistory(entries, 65)).toBeNull()
  })

  it('calculates weeks remaining correctly', () => {
    const entries = [
      { date: '2026-04-01', weight: 80 },
      { date: '2026-04-08', weight: 79 },
      { date: '2026-04-15', weight: 78 },
      { date: '2026-04-22', weight: 77 },
    ]
    const result = projectByHistory(entries, 70)
    expect(result).not.toBeNull()
    expect(result.weeklyDelta).toBe(-1)
    expect(result.weeksRemaining).toBe(7)
  })

  it('returns zero weeks if already at or past goal', () => {
    const entries = [
      { date: '2026-04-22', weight: 70 },
      { date: '2026-04-29', weight: 69 },
    ]
    const result = projectByHistory(entries, 70)
    expect(result.weeksRemaining).toBe(0)
  })
})

describe('projectByDeficit', () => {
  it('returns null for missing or zero deficit', () => {
    expect(projectByDeficit(null, 75, 65)).toBeNull()
    expect(projectByDeficit(0, 75, 65)).toBeNull()
  })

  it('returns zero weeks if already at goal', () => {
    const result = projectByDeficit(500, 65, 65)
    expect(result.weeksRemaining).toBe(0)
  })

  it('calculates weeks from 500 kcal/day deficit', () => {
    const result = projectByDeficit(500, 75, 65)
    expect(result).not.toBeNull()
    expect(result.weeksRemaining).toBe(22)
    expect(result.kgPerWeek).toBe(0.45)
  })
})
