import { describe, it, expect } from 'vitest'
import { calcBMI } from '../utils/bmi'

describe('calcBMI', () => {
  it('returns null for missing inputs', () => {
    expect(calcBMI(0, 170)).toBeNull()
    expect(calcBMI(70, 0)).toBeNull()
    expect(calcBMI(null, 170)).toBeNull()
  })

  it('calculates BMI value correctly', () => {
    const result = calcBMI(70, 170)
    expect(result.value).toBe(24.2)
  })

  it('returns Normal category for BMI 18.5–24.9', () => {
    expect(calcBMI(70, 170).category).toBe('Normal')
  })

  it('returns Underweight for BMI < 18.5', () => {
    expect(calcBMI(50, 170).category).toBe('Underweight')
  })

  it('returns Overweight for BMI 25–29.9', () => {
    expect(calcBMI(80, 170).category).toBe('Overweight')
  })

  it('returns Obese for BMI >= 30', () => {
    expect(calcBMI(100, 170).category).toBe('Obese')
  })

  it('includes correct colors', () => {
    expect(calcBMI(70, 170).color).toBe('#22C55E')
    expect(calcBMI(50, 170).color).toBe('#38BDF8')
    expect(calcBMI(80, 170).color).toBe('#F59E0B')
    expect(calcBMI(100, 170).color).toBe('#EF4444')
  })
})
