export const OLLAMA_MODEL = 'llama3'

const OLLAMA_UNAVAILABLE =
  'Could not reach Ollama. Start it locally, then run: ollama pull llama3'

export class OllamaError extends Error {
  constructor(message, { status } = {}) {
    super(message)
    this.name = 'OllamaError'
    this.status = status
  }
}

export function getOllamaBaseUrl() {
  return import.meta.env.DEV ? '/api/ollama' : 'http://localhost:11434'
}

export function buildSystemPrompt(chunks = []) {
  const context = chunks.length
    ? chunks.map((c) => c.text).join('\n\n')
    : 'No matching entries in the FitFlow knowledge base.'

  return `You are FitFlow AI, a concise and friendly fitness assistant.

Use the reference information below when it is relevant. If the context does not cover the question, answer from general fitness knowledge but stay practical and avoid medical diagnoses.

Reference information:
${context}

Keep replies short (2-4 sentences) unless the user asks for more detail.`
}

export function toOllamaMessages(messages, systemPrompt) {
  return [
    { role: 'system', content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role === 'bot' ? 'assistant' : 'user',
      content: m.text,
    })),
  ]
}

export async function chatWithOllama(messages, { model = OLLAMA_MODEL, contextChunks = [] } = {}) {
  const systemPrompt = buildSystemPrompt(contextChunks)
  const ollamaMessages = toOllamaMessages(messages, systemPrompt)

  let response
  try {
    response = await fetch(`${getOllamaBaseUrl()}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        messages: ollamaMessages,
        stream: false,
      }),
    })
  } catch {
    throw new OllamaError(OLLAMA_UNAVAILABLE)
  }

  if (!response.ok) {
    const detail = response.status === 404
      ? `Model "${model}" not found. Run: ollama pull ${model}`
      : `Ollama request failed (${response.status})`
    throw new OllamaError(detail, { status: response.status })
  }

  const data = await response.json()
  const content = data.message?.content?.trim()
  if (!content) throw new OllamaError('Ollama returned an empty response.')
  return content
}

export function formatOllamaError(error) {
  if (error instanceof OllamaError) return error.message
  return OLLAMA_UNAVAILABLE
}
