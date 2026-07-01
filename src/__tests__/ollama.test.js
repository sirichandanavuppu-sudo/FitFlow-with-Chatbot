import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  buildSystemPrompt,
  toOllamaMessages,
  chatWithOllama,
  formatOllamaError,
  OllamaError,
} from '../utils/ollama'

describe('buildSystemPrompt', () => {
  it('includes chunk text in the prompt', () => {
    const prompt = buildSystemPrompt([{ text: 'Drink more water.' }])
    expect(prompt).toContain('Drink more water.')
    expect(prompt).toContain('FitFlow AI')
  })

  it('handles empty chunks', () => {
    const prompt = buildSystemPrompt([])
    expect(prompt).toContain('No matching entries')
  })
})

describe('toOllamaMessages', () => {
  it('maps bot role to assistant', () => {
    const messages = toOllamaMessages(
      [{ role: 'user', text: 'Hi' }, { role: 'bot', text: 'Hello' }],
      'system'
    )
    expect(messages[0]).toEqual({ role: 'system', content: 'system' })
    expect(messages[1]).toEqual({ role: 'user', content: 'Hi' })
    expect(messages[2]).toEqual({ role: 'assistant', content: 'Hello' })
  })
})

describe('chatWithOllama', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns assistant content on success', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ message: { content: 'Stay hydrated.' } }),
    })

    const result = await chatWithOllama([{ role: 'user', text: 'water tips?' }])
    expect(result).toBe('Stay hydrated.')
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/chat'),
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"model":"llama3"'),
      })
    )
  })

  it('throws when fetch fails', async () => {
    fetch.mockRejectedValue(new Error('network'))
    await expect(chatWithOllama([{ role: 'user', text: 'hi' }])).rejects.toBeInstanceOf(OllamaError)
  })

  it('throws when model is missing', async () => {
    fetch.mockResolvedValue({ ok: false, status: 404 })
    await expect(chatWithOllama([{ role: 'user', text: 'hi' }])).rejects.toThrow('not found')
  })
})

describe('formatOllamaError', () => {
  it('returns message for OllamaError', () => {
    expect(formatOllamaError(new OllamaError('offline'))).toBe('offline')
  })
})
