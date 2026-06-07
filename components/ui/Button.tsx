'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  href?: string
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
}

export function Button({ children, variant = 'primary', size = 'md', className = '', href, type = 'button', onClick }: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
  }
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }
  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`

  if (href) return <motion.a whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} href={href} className={classes}>{children}</motion.a>
  return <motion.button type={type} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClick} className={classes}>{children}</motion.button>
}
