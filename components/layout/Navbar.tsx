'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiMenu, FiX, FiChevronDown,
  FiCode, FiTrendingUp, FiBarChart2, FiShare2,
  FiLayers, FiShoppingCart, FiSmartphone,
  FiAward, FiZap, FiCpu,
} from 'react-icons/fi'

// ─── Data ─────────────────────────────────────────────────────────────────────

const services = [
  { icon: FiCode,         name: 'Website Development',  slug: 'website-development'    },
  { icon: FiTrendingUp,   name: 'SEO Services',          slug: 'seo-services'           },
  { icon: FiBarChart2,    name: 'Digital Marketing',     slug: 'digital-marketing'      },
  { icon: FiShare2,       name: 'Social Media',          slug: 'social-media-marketing' },
  { icon: FiLayers,       name: 'UI/UX Design',          slug: 'ui-ux-design'           },
  { icon: FiShoppingCart, name: 'E-Commerce',            slug: 'ecommerce-development'  },
  { icon: FiCpu,          name: 'Software Development',  slug: 'software-development'   },
  { icon: FiSmartphone,   name: 'Mobile Apps',           slug: 'mobile-app-development' },
  { icon: FiAward,        name: 'Branding & Design',     slug: 'branding-design'        },
  { icon: FiZap,          name: 'AI Automation',         slug: 'ai-automation'          },
]

const mainLinks = [
  { href: '/',          label: 'Home'      },
  { href: '/about',     label: 'About'     },
  { href: '/pricing',   label: 'Pricing'   },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/blog',      label: 'Blog'      },
  { href: '/contact',   label: 'Contact'   },
]

// ─── Logo with text fallback ───────────────────────────────────────────────────

function Logo() {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="flex items-center gap-2.5">
      {!imgError && (
        <Image
          src="/logo.png"
          alt="Digital Marmat IT Service"
          width={44}
          height={44}
          className="h-10 w-10 md:h-11 md:w-11 object-contain shrink-0"
          priority
          onError={() => setImgError(true)}
        />
      )}
      <div className="flex flex-col leading-none">
        <span className="text-sm md:text-base font-bold tracking-tight">
          <span className="text-primary">Digital</span>
          <span className="text-navy"> Marmat</span>
        </span>
        <span className="text-[9px] md:text-[10px] text-navy/40 font-medium tracking-[0.18em] uppercase mt-0.5">
          IT Service
        </span>
      </div>
    </div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export function Navbar() {
  const [mobileOpen, setMobileOpen]           = useState(false)
  const [servicesOpen, setServicesOpen]       = useState(false)
  const [mobileServices, setMobileServices]   = useState(false)
  const [scrolled, setScrolled]               = useState(false)
  const pathname                              = usePathname()
  const dropdownRef                           = useRef<HTMLDivElement>(null)

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close desktop dropdown on outside click
  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setServicesOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [])

  // Close mobile on navigation
  useEffect(() => {
    setMobileOpen(false)
    setMobileServices(false)
  }, [pathname])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname?.startsWith(href) ?? false

  return (
    <header
      className={`fixed top-0 w-full z-50 bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-md' : 'shadow-sm border-b border-gray-100'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-[72px]">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center shrink-0 group">
            <Logo />
          </Link>

          {/* ── Desktop navigation ── */}
          <nav className="hidden lg:flex items-center gap-0.5">

            {/* Home + About */}
            {[mainLinks[0], mainLinks[1]].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-primary bg-primary/8'
                    : 'text-navy/70 hover:text-primary hover:bg-primary/5'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Services dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setServicesOpen((v) => !v)}
                className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive('/services')
                    ? 'text-primary bg-primary/8'
                    : 'text-navy/70 hover:text-primary hover:bg-primary/5'
                }`}
              >
                Services
                <motion.span
                  animate={{ rotate: servicesOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex"
                >
                  <FiChevronDown size={14} />
                </motion.span>
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 grid grid-cols-2 gap-0.5"
                  >
                    {services.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        onClick={() => setServicesOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/5 group transition-colors"
                      >
                        <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                          <s.icon size={15} />
                        </span>
                        <span className="text-sm text-navy/80 font-medium group-hover:text-primary transition-colors">
                          {s.name}
                        </span>
                      </Link>
                    ))}
                    <div className="col-span-2 mt-1 pt-3 border-t border-gray-100 flex justify-center">
                      <Link
                        href="/services"
                        onClick={() => setServicesOpen(false)}
                        className="text-sm text-primary font-semibold hover:underline"
                      >
                        View All Services →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Portfolio, Blog, Contact */}
            {mainLinks.slice(2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-primary bg-primary/8'
                    : 'text-navy/70 hover:text-primary hover:bg-primary/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Desktop CTAs ── */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/contact"
              className="text-sm font-medium text-navy/60 hover:text-primary transition-colors"
            >
              Get a Quote
            </Link>
            <Link
              href="/free-seo-audit"
              className="bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition shadow-sm shadow-primary/25 whitespace-nowrap"
            >
              Free SEO Audit
            </Link>
          </div>

          {/* ── Hamburger ── */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden p-2 rounded-xl text-navy hover:bg-gray-100 transition"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileOpen ? 'x' : 'menu'}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.15 }}
                className="block"
              >
                {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </motion.span>
            </AnimatePresence>
          </button>

        </div>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="container-custom py-4 space-y-1 pb-6">

              {[mainLinks[0], mainLinks[1]].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-primary bg-primary/5'
                      : 'text-navy hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile services accordion */}
              <button
                onClick={() => setMobileServices((v) => !v)}
                className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive('/services') ? 'text-primary bg-primary/5' : 'text-navy hover:bg-gray-50'
                }`}
              >
                <span>Services</span>
                <motion.span
                  animate={{ rotate: mobileServices ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex"
                >
                  <FiChevronDown size={18} />
                </motion.span>
              </button>

              <AnimatePresence>
                {mobileServices && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden ml-4 pl-4 border-l-2 border-primary/20 space-y-0.5"
                  >
                    {services.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm text-navy/70 hover:text-primary hover:bg-primary/5 transition-colors"
                      >
                        <s.icon size={15} className="text-primary shrink-0" />
                        {s.name}
                      </Link>
                    ))}
                    <Link
                      href="/services"
                      className="block px-2 py-2.5 text-sm text-primary font-semibold hover:bg-primary/5 rounded-lg"
                    >
                      All Services →
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              {mainLinks.slice(2).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-primary bg-primary/5'
                      : 'text-navy hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile CTA buttons */}
              <div className="pt-4 mt-2 border-t border-gray-100 grid grid-cols-2 gap-3">
                <Link
                  href="/contact"
                  className="text-center py-3 rounded-full text-sm font-semibold text-navy border-2 border-gray-200 hover:border-primary hover:text-primary transition"
                >
                  Get a Quote
                </Link>
                <Link
                  href="/free-seo-audit"
                  className="text-center bg-primary text-white py-3 rounded-full text-sm font-semibold hover:bg-primary/90 transition"
                >
                  Free SEO Audit
                </Link>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
