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
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg z-50 hover:bg-green-600 transition"
    >
      <FaWhatsapp size={28} />
    </motion.a>
  )
}
