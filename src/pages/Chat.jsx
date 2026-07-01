import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { retrieveChunks } from '../utils/chatbot'
import { chatWithOllama, formatOllamaError } from '../utils/ollama'
import knowledgeBase from '../data/knowledge-base.json'
import { listStagger, pageTransition, slideVariants, staggerContainer } from '../animations/variants'

const WELCOME = {
  role: 'bot',
  text: "Hi! I'm powered by Llama 3 (Ollama). Ask me about fitness, nutrition, BMI, or hydration 💪",
}

function conversationHistory(messages, newUserMessage) {
  return [...messages, newUserMessage]
    .filter((m) => m.role === 'user' || m.role === 'bot')
    .filter((m, i) => !(i === 0 && m.role === 'bot' && m.text === WELCOME.text))
}

export default function Chat() {
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async () => {
    const query = input.trim()
    if (!query || loading) return

    const userMessage = { role: 'user', text: query }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const chunks = retrieveChunks(query, knowledgeBase, 3)
      const history = conversationHistory(messages, userMessage)
      const response = await chatWithOllama(history, { contextChunks: chunks })
      setMessages((prev) => [...prev, { role: 'bot', text: response }])
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'bot', text: formatOllamaError(error) }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <motion.div
      className="page"
      variants={staggerContainer(0.06, 0.02)}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={pageTransition.animate.transition}
    >
      <motion.div className="section-card" style={{ flex: 1 }} variants={slideVariants}>
        <h3>FitFlow AI</h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 12 }}>
          Llama 3 via Ollama · local & free
        </p>
        <motion.div className="chat-messages" variants={listStagger} initial="hidden" animate="visible">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                className={`chat-msg ${msg.role}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i < 10 ? i * 0.015 : 0 }}
              >
                {msg.text}
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <motion.div className="chat-msg bot typing-indicator" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <span />
              <span />
              <span />
            </motion.div>
          )}
          <div ref={bottomRef} />
        </motion.div>
        <div className="chat-input-row" style={{ marginTop: 12 }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about fitness, diet, BMI…"
            disabled={loading}
          />
          <button className="btn-primary" onClick={send} disabled={!input.trim() || loading}>
            Send
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
