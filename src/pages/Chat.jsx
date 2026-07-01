import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { retrieveChunks, assembleResponse } from '../utils/chatbot'
import knowledgeBase from '../data/knowledge-base.json'
import { listStagger, pageTransition, slideVariants, staggerContainer } from '../animations/variants'

const WELCOME = {
  role: 'bot',
  text: "Hi! Ask me anything about fitness, nutrition, BMI, or hydration. I'll do my best to help 💪",
}

export default function Chat() {
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = () => {
    const query = input.trim()
    if (!query) return
    setMessages((prev) => [...prev, { role: 'user', text: query }])
    setInput('')
    setLoading(true)
    setTimeout(() => {
      const chunks = retrieveChunks(query, knowledgeBase, 3)
      const response = assembleResponse(chunks)
      setMessages((prev) => [...prev, { role: 'bot', text: response }])
      setLoading(false)
    }, 300)
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
