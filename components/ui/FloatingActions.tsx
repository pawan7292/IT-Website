'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi'

type Message = { role: 'user' | 'model'; text: string }
type View = 'closed' | 'menu' | 'chat'

const GREETING: Message = {
  role: 'model',
  text: "Hi! 👋 I'm Marmat AI. Ask me about our services, pricing, or anything about Digital Marmat — happy to help!",
}

const WHATSAPP_URL = `https://wa.me/9779802362213?text=${encodeURIComponent('Hello Digital Marmat, I would like a free consultation.')}`

export function FloatingActions() {
  const [view, setView] = useState<View>('closed')
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (view === 'chat') endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, view])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    const history = messages.slice(1) // exclude greeting
    setMessages((m) => [...m, { role: 'user', text }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      })
      const data = await res.json()
      const replyText = res.ok
        ? data.reply
        : (data.error ?? 'Something went wrong. Please try again or message us on WhatsApp.')
      setMessages((m) => [...m, { role: 'model', text: replyText }])
    } catch {
      setMessages((m) => [...m, { role: 'model', text: 'Network error. Please try again or message us on WhatsApp.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Chat window */}
      <AnimatePresence>
        {view === 'chat' && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] max-w-sm h-[28rem] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-navy to-primary px-5 py-4 flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                <FiMessageCircle className="text-white" size={18} />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">Marmat AI</p>
                <p className="text-white/60 text-xs">Usually replies instantly</p>
              </div>
              <button
                onClick={() => setView('closed')}
                aria-label="Close chat"
                className="text-white/70 hover:text-white transition"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-light-bg">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-primary text-white rounded-br-sm'
                        : 'bg-white text-navy border border-gray-100 rounded-bl-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="border-t border-gray-100 p-3 flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition disabled:opacity-50"
                aria-label="Send message"
              >
                <FiSend size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drawer menu — WhatsApp + Assistant */}
      <AnimatePresence>
        {view === 'menu' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-3"
          >
            <motion.a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setView('closed')}
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.9 }}
              transition={{ delay: 0.06 }}
              className="flex items-center gap-3 bg-white rounded-full pl-4 pr-1.5 py-1.5 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <span className="text-sm font-semibold text-navy whitespace-nowrap">Chat on WhatsApp</span>
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366] text-white shrink-0">
                <FaWhatsapp size={20} />
              </span>
            </motion.a>

            <motion.button
              onClick={() => setView('chat')}
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.9 }}
              transition={{ delay: 0 }}
              className="flex items-center gap-3 bg-white rounded-full pl-4 pr-1.5 py-1.5 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <span className="text-sm font-semibold text-navy whitespace-nowrap">Ask Marmat AI</span>
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white shrink-0">
                <FiMessageCircle size={20} />
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main toggle button */}
      <motion.button
        onClick={() => setView((v) => (v === 'closed' ? 'menu' : 'closed'))}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label={view === 'closed' ? 'Open chat options' : 'Close'}
        className="group fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-navy to-primary text-white shadow-[0_8px_24px_rgba(30,115,216,0.45)] transition-shadow hover:shadow-[0_8px_28px_rgba(30,115,216,0.6)]"
      >
        {view === 'closed' && (
          <span className="absolute inset-0 -z-10 rounded-full bg-primary opacity-50 animate-ping" />
        )}
        <AnimatePresence mode="wait" initial={false}>
          {view === 'closed' ? (
            <motion.span key="chat" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <FiMessageCircle size={26} />
            </motion.span>
          ) : (
            <motion.span key="close" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <FiX size={26} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  )
}
