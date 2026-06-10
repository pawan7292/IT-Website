'use client'

import { motion } from 'framer-motion'
import { FaWhatsapp } from 'react-icons/fa'

export function FloatingWhatsApp() {
  const phone = '+9779802362213'
  const message = 'Hello Digital Marmat, I would like a free consultation.'
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="group fixed bottom-6 right-6 z-50 flex items-center"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping" />
      <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] transition-shadow group-hover:shadow-[0_8px_28px_rgba(37,211,102,0.6)]">
        <FaWhatsapp size={28} />
      </span>
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-navy text-white text-sm font-semibold px-4 py-2 shadow-lg opacity-0 translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
        Chat with us
      </span>
    </motion.a>
  )
}
