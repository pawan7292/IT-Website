'use client'

import { motion } from 'framer-motion'

interface SectionHeaderProps {
  badge?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  inverted?: boolean
}

export function SectionHeader({ badge, title, description, align = 'center', inverted = false }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-12 ${align === 'center' ? 'text-center' : 'text-left'}`}
    >
      {badge && (
        <span className={`text-sm font-semibold uppercase tracking-wider ${inverted ? 'text-blue-300' : 'text-primary'}`}>
          {badge}
        </span>
      )}
      <h2 className={`mt-2 text-3xl md:text-4xl font-bold ${inverted ? 'text-white' : 'text-navy'}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-lg max-w-2xl mx-auto ${inverted ? 'text-white/70' : 'text-navy/60'}`}>
          {description}
        </p>
      )}
    </motion.div>
  )
}
