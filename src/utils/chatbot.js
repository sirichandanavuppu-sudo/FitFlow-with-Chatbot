function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(Boolean)
}

function buildVocabulary(docs) {
  const counts = {}
  docs.forEach((doc) => {
    tokenize(doc.text).forEach((word) => {
      counts[word] = (counts[word] || 0) + 1
    })
  })
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([word]) => word)
}

function embed(text, vocab) {
  const words = tokenize(text)
  const total = Math.max(words.length, 1)
  return vocab.map((v) => words.filter((w) => w === v).length / total)
}

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
  if (magA === 0 || magB === 0) return 0
  return dot / (magA * magB)
}

let _vocab = null
let _embedded = null

export function _resetCache() {
  _vocab = null
  _embedded = null
}

function initEmbeddings(kb) {
  if (_embedded) return _embedded
  _vocab = buildVocabulary(kb)
  _embedded = kb.map((doc) => ({ ...doc, embedding: embed(doc.text, _vocab) }))
  return _embedded
}

export function retrieveChunks(query, kb, topK = 3) {
  const docs = initEmbeddings(kb)
  const queryVec = embed(query, _vocab)
  return docs
    .map((doc) => ({ ...doc, score: cosineSimilarity(queryVec, doc.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
}

export function assembleResponse(chunks) {
  if (!chunks.length) {
    return "I don't have information on that topic. Try asking about hydration, nutrition, BMI, exercise, or sleep."
  }
  return chunks.map((c) => c.text).join(' ')
}
