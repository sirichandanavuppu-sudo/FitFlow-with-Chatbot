import { describe, it, expect, beforeEach } from 'vitest'
import { retrieveChunks, assembleResponse, _resetCache } from '../utils/chatbot'

const MINI_KB = [
  { id: '1', text: 'Drinking water helps with weight loss and metabolism.' },
  { id: '2', text: 'Protein intake supports muscle growth and recovery after exercise.' },
  { id: '3', text: 'Sleep deprivation increases hunger hormones and reduces fat loss.' },
]

beforeEach(() => _resetCache())

describe('retrieveChunks', () => {
  it('returns topK results', () => {
    const results = retrieveChunks('water hydration', MINI_KB, 2)
    expect(results).toHaveLength(2)
  })

  it('returns items with a score property', () => {
    const results = retrieveChunks('water', MINI_KB, 1)
    expect(results[0]).toHaveProperty('score')
    expect(typeof results[0].score).toBe('number')
  })

  it('ranks hydration doc highest for water query', () => {
    const results = retrieveChunks('water drinking hydration', MINI_KB, 3)
    expect(results[0].id).toBe('1')
  })

  it('ranks sleep doc highest for sleep query', () => {
    const results = retrieveChunks('sleep deprivation hunger', MINI_KB, 3)
    expect(results[0].id).toBe('3')
  })
})

describe('assembleResponse', () => {
  it('returns fallback for empty chunks', () => {
    const response = assembleResponse([])
    expect(response).toContain("don't have information")
  })

  it('includes chunk text in response', () => {
    const chunks = [{ text: 'Water is essential for metabolism.' }]
    expect(assembleResponse(chunks)).toContain('Water is essential')
  })
})
