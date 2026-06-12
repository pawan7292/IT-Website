'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiArrowRight, FiCheck, FiChevronDown,
  FiCode, FiShoppingCart, FiSettings, FiLayers,
  FiGlobe, FiZap, FiTrendingUp, FiShield,
} from 'react-icons/fi'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { ServiceData } from '@/data/services'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FEATURE_ICONS = [
  FiCode, FiShoppingCart, FiSettings, FiLayers,
  FiGlobe, FiZap, FiTrendingUp, FiShield,
]

const BENEFIT_EMOJIS = ['🎨', '📱', '🔍', '⚡', '🔒', '📝', '💡', '🤝']

const PROCESS_COLS: Record<number, string> = {
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
}

// ─── FAQ Accordion item ────────────────────────────────────────────────────────

function FaqItem({
  question, answer, isOpen, onToggle,
}: {
  question: string; answer: string; isOpen: boolean; onToggle: () => void
}) {
  return (
    <div className={`rounded-2xl border transition-colors ${isOpen ? 'border-primary/30 bg-white' : 'border-gray-100 bg-white'}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left gap-4"
      >
        <span className={`font-semibold text-base transition-colors ${isOpen ? 'text-primary' : 'text-navy'}`}>
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.22 }}
          className={`shrink-0 transition-colors ${isOpen ? 'text-primary' : 'text-navy/40'}`}
        >
          <FiChevronDown size={20} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-navy/65 leading-relaxed text-sm">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Service-specific highlight sections ─────────────────────────────────────

const SERVICE_HIGHLIGHTS: Record<string, { icon: string; label: string; desc: string }[]> = {
  'website-development': [
    { icon: '🏢', label: 'Corporate / Business', desc: 'Professional brand sites that build credibility and win clients.' },
    { icon: '🛒', label: 'E-Commerce Stores',    desc: 'High-converting online stores that sell 24/7.' },
    { icon: '💼', label: 'Portfolio Sites',       desc: 'Showcase your work and attract your dream clients.' },
    { icon: '📰', label: 'News & Blogs',          desc: 'Content-heavy sites with fast load times and SEO built in.' },
    { icon: '🎯', label: 'Landing Pages',         desc: 'Laser-focused pages designed for campaigns and conversions.' },
    { icon: '🏥', label: 'NGO / Non-Profit',      desc: 'Purposeful sites that tell your story and drive donations.' },
  ],
  'seo-services': [
    { icon: '📍', label: 'Local SEO',       desc: 'Dominate Google Maps and local search results in your area.' },
    { icon: '⚙️', label: 'Technical SEO',   desc: 'Fix crawl errors, improve site speed, and optimize site structure.' },
    { icon: '📝', label: 'On-Page SEO',     desc: 'Optimize content, headings, meta tags, and internal links.' },
    { icon: '🛒', label: 'E-Commerce SEO',  desc: 'Rank product pages higher and drive more qualified buyers.' },
    { icon: '🔗', label: 'Link Building',   desc: 'Earn high-authority backlinks that build domain credibility.' },
    { icon: '🔍', label: 'SEO Audit',       desc: 'A complete technical and content audit to find and fix all issues.' },
  ],
  'digital-marketing': [
    { icon: '💰', label: 'PPC / Google Ads',         desc: 'Targeted paid campaigns that bring immediate, qualified traffic.' },
    { icon: '✍️', label: 'Content Marketing',         desc: 'Valuable content that attracts, educates, and converts.' },
    { icon: '📧', label: 'Email Marketing',           desc: 'Automated sequences that nurture leads and drive repeat sales.' },
    { icon: '🎯', label: 'Conversion Optimization',  desc: 'A/B testing and UX tweaks that turn more visitors into buyers.' },
    { icon: '📊', label: 'Marketing Analytics',      desc: 'Data-driven insights to measure what works and invest smarter.' },
    { icon: '🔄', label: 'Remarketing',              desc: 'Re-engage visitors who didn\'t convert the first time around.' },
  ],
  'social-media-marketing': [
    { icon: '📘', label: 'Facebook',    desc: 'Reach millions with targeted ads and engaging community pages.' },
    { icon: '📸', label: 'Instagram',   desc: 'Visual storytelling through reels, stories, and shoppable posts.' },
    { icon: '💼', label: 'LinkedIn',    desc: 'B2B lead generation and professional brand positioning.' },
    { icon: '🎵', label: 'TikTok',     desc: 'Short-form video content reaching younger, highly engaged audiences.' },
    { icon: '▶️', label: 'YouTube',    desc: 'Long-form video marketing and channel growth strategies.' },
    { icon: '🐦', label: 'Twitter / X',desc: 'Real-time engagement, thought leadership, and customer support.' },
  ],
  'software-development': [
    { icon: '🏭', label: 'ERP Systems',         desc: 'Centralized management for finance, HR, and operations.' },
    { icon: '🤝', label: 'CRM Solutions',       desc: 'Track leads, manage clients, and close more deals.' },
    { icon: '☁️', label: 'SaaS Platforms',      desc: 'Cloud-based software products built to scale with your users.' },
    { icon: '🔌', label: 'API Development',     desc: 'Robust APIs that connect your systems and enable integrations.' },
    { icon: '🤖', label: 'Business Automation', desc: 'Eliminate repetitive tasks and cut operational costs.' },
    { icon: '🖥️', label: 'Admin Portals',       desc: 'Custom dashboards for managing your business data in real time.' },
  ],
  'mobile-app-development': [
    { icon: '🍎', label: 'iOS Development',      desc: 'Native Swift apps optimized for every iPhone and iPad.' },
    { icon: '🤖', label: 'Android Development',  desc: 'Kotlin-powered apps for the full Android device ecosystem.' },
    { icon: '🔄', label: 'Cross-Platform Apps',  desc: 'React Native and Flutter apps that run perfectly on both.' },
    { icon: '🌐', label: 'Progressive Web Apps', desc: 'App-like experiences delivered instantly through the browser.' },
    { icon: '🛒', label: 'E-Commerce Apps',      desc: 'Mobile shopping experiences built to drive sales on the go.' },
    { icon: '🏢', label: 'Enterprise Apps',      desc: 'Internal tools and dashboards that streamline your workforce.' },
  ],
  'ui-ux-design': [
    { icon: '🌐', label: 'Web App Design',      desc: 'Clean, intuitive interfaces for web-based platforms and SaaS.' },
    { icon: '📱', label: 'Mobile App Design',   desc: 'iOS and Android designs that feel native and delightful.' },
    { icon: '📊', label: 'Dashboard Design',    desc: 'Data-heavy UIs made clear, scannable, and immediately actionable.' },
    { icon: '🛒', label: 'E-Commerce UX',       desc: 'Conversion-focused product pages, carts, and checkout flows.' },
    { icon: '🎨', label: 'Design Systems',      desc: 'Scalable component libraries that keep your product consistent.' },
    { icon: '🔬', label: 'UX Research',         desc: 'User interviews, personas, and testing that drive design decisions.' },
  ],
  'branding-design': [
    { icon: '✏️', label: 'Logo Design',          desc: 'Unique, memorable logos that capture your brand in a single mark.' },
    { icon: '🎨', label: 'Brand Identity',       desc: 'Complete visual systems — colors, type, patterns, and icons.' },
    { icon: '📋', label: 'Brand Guidelines',     desc: 'A rulebook ensuring consistent use across all touchpoints.' },
    { icon: '🖨️', label: 'Print & Collateral',  desc: 'Business cards, brochures, and marketing materials.' },
    { icon: '📱', label: 'Social Media Kit',     desc: 'Ready-to-use templates for every platform and post type.' },
    { icon: '🔄', label: 'Rebranding',           desc: 'Modernize an existing brand while preserving its equity.' },
  ],
  'ecommerce-development': [
    { icon: '🟢', label: 'Shopify Stores',       desc: 'Fast, scalable stores on the world\'s leading e-commerce platform.' },
    { icon: '🔵', label: 'WooCommerce',          desc: 'Flexible WordPress stores with complete customization freedom.' },
    { icon: '⚙️', label: 'Custom Solutions',     desc: 'Bespoke e-commerce platforms for complex requirements.' },
    { icon: '🏭', label: 'B2B Portals',          desc: 'Wholesale and trade portals with tiered pricing and bulk orders.' },
    { icon: '🌐', label: 'Headless Commerce',    desc: 'API-first commerce with blazing-fast frontend performance.' },
    { icon: '📦', label: 'Marketplace Platforms',desc: 'Multi-vendor platforms where sellers and buyers meet.' },
  ],
  'ai-automation': [
    { icon: '🤖', label: 'AI Chatbots',            desc: 'Intelligent bots that handle support, sales, and leads 24/7.' },
    { icon: '🔄', label: 'Workflow Automation',    desc: 'Eliminate repetitive manual tasks with smart automated pipelines.' },
    { icon: '📊', label: 'Data Analytics',         desc: 'AI-powered dashboards that surface actionable business insights.' },
    { icon: '✍️', label: 'AI Content Tools',       desc: 'Automated content generation and optimization workflows.' },
    { icon: '🔮', label: 'Predictive Analytics',   desc: 'Forecast trends, demand, and customer behavior with ML models.' },
    { icon: '🔗', label: 'System Integration',     desc: 'Connect your apps, databases, and APIs into one smart ecosystem.' },
  ],
}

// ─── Related blog guide per service ──────────────────────────────────────────

const SERVICE_BLOG_LINKS: Record<string, { href: string; label: string }> = {
  'website-development': {
    href: '/blog/website-development-services-nepal',
    label: 'Read our full guide: Website Development Services in Nepal',
  },
  'seo-services': {
    href: '/blog/seo-services-nepal-guide',
    label: 'Read our full guide: SEO Services in Nepal',
  },
  'digital-marketing': {
    href: '/blog/digital-marketing-services-nepal',
    label: 'Read our full guide: Digital Marketing Services in Nepal',
  },
  'social-media-marketing': {
    href: '/blog/social-media-marketing-business-growth-nepal',
    label: 'Read our full guide: How Social Media Marketing Helps Businesses Grow',
  },
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ServicePageContent({ service }: { service: ServiceData }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const processCols = PROCESS_COLS[service.process.length] ?? 'md:grid-cols-4'
  const highlights = SERVICE_HIGHLIGHTS[service.slug] ?? null
  const relatedBlog = SERVICE_BLOG_LINKS[service.slug] ?? null

  return (
    <>
      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-navy via-[#1B3A6B] to-primary">
        {/* BG atmosphere */}
        <div className="absolute top-0 left-0 w-[520px] h-[520px] bg-primary/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/15 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '64px 64px' }}
        />

        <Container>
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <span className="inline-block text-secondary text-sm font-semibold uppercase tracking-widest mb-5">
                Digital Marmat · {service.name}
              </span>
              <h1 className="text-white font-bold leading-[1.08] mb-6">{service.title}</h1>
              <p className="text-white/70 text-lg leading-relaxed mb-9 max-w-xl">{service.heroDescription}</p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Link
                  href="/contact"
                  className="bg-white text-navy px-7 py-3.5 rounded-full font-bold hover:bg-white/90 transition inline-flex items-center gap-2"
                >
                  Get Free Quote <FiArrowRight size={17} />
                </Link>
                <Link
                  href="/portfolio"
                  className="border border-white/30 text-white px-7 py-3.5 rounded-full font-semibold hover:bg-white/10 transition"
                >
                  View Our Work
                </Link>
              </div>

              {/* Trust stats */}
              <div className="grid grid-cols-3 gap-3 max-w-sm">
                {[
                  { val: '50+',    label: 'Websites Built'     },
                  { val: '99.9%',  label: 'Satisfaction'       },
                  { val: '3+',     label: 'Years Experience'   },
                ].map((s) => (
                  <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl py-4 px-2 text-center">
                    <p className="text-white font-bold text-xl">{s.val}</p>
                    <p className="text-white/55 text-[11px] mt-0.5 leading-snug">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — feature highlight cards */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
              <div className="grid grid-cols-2 gap-4">
                {service.benefits.slice(0, 4).map((b, i) => (
                  <motion.div
                    key={b.title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-5"
                  >
                    <span className="text-2xl">{BENEFIT_EMOJIS[i]}</span>
                    <p className="text-white font-semibold text-sm mt-2 mb-1">{b.title}</p>
                    <p className="text-white/50 text-xs leading-relaxed">{b.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </Container>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path d="M0 72H1440V28C1200 68 960 8 720 28C480 48 240 8 0 28V72Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ══ SERVICE-SPECIFIC HIGHLIGHTS ══════════════════════════════════════ */}
      {highlights && (
        <section className="section-padding bg-white">
          <Container>
            <SectionHeader
              badge="What We Cover"
              title={`Types of ${service.name} We Offer`}
              description="Every project is different — here's the full range of what we handle under this service."
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {highlights.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="flex gap-5 p-6 rounded-2xl border border-gray-100 bg-light-bg hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <span className="text-3xl shrink-0">{item.icon}</span>
                  <div>
                    <h3 className="font-bold text-navy text-base mb-1.5">{item.label}</h3>
                    <p className="text-navy/60 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ══ BENEFITS ════════════════════════════════════════════════════════ */}
      <section className={`section-padding ${highlights ? 'bg-light-bg' : 'bg-white'}`}>
        <Container>
          <SectionHeader
            badge="Why It Matters"
            title={`Benefits of Our ${service.name}`}
            description="Real results you can measure — not just a pretty website."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`flex gap-4 p-6 rounded-2xl border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all ${highlights ? 'bg-white' : 'bg-light-bg'}`}
              >
                <span className="text-2xl shrink-0 mt-0.5">{BENEFIT_EMOJIS[i] ?? '✨'}</span>
                <div>
                  <h3 className="font-bold text-navy text-base mb-1">{b.title}</h3>
                  <p className="text-navy/60 text-sm leading-relaxed">{b.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ══ FEATURES ════════════════════════════════════════════════════════ */}
      <section className={`section-padding ${highlights ? 'bg-white' : 'bg-light-bg'}`}>
        <Container>
          <SectionHeader
            badge="What's Included"
            title="Everything You Need to Succeed"
            description="Every project comes packed with the features that drive real results — no extras, no shortcuts."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {service.features.map((f, i) => {
              const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length]
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className={`rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group ${highlights ? 'bg-light-bg' : 'bg-white'}`}
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-bold text-navy text-base mb-2">{f.title}</h3>
                  <p className="text-navy/60 text-sm leading-relaxed">{f.description}</p>
                </motion.div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* ══ PROCESS ═════════════════════════════════════════════════════════ */}
      <section className="section-padding bg-light-bg">
        <Container>
          <SectionHeader
            badge="How We Work"
            title="Our Proven Process"
            description="From the first conversation to post-launch support — complete clarity at every stage."
          />
          <div className={`relative grid ${processCols} gap-6 mt-6`}>
            {/* Connecting line — desktop */}
            <div className="hidden md:block absolute top-10 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            {service.process.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold shadow-lg ring-4 ring-white mb-6">
                  {step.step}
                </div>
                <h3 className="font-bold text-navy text-base mb-2">{step.title}</h3>
                <p className="text-navy/60 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ══ WHY DIGITAL MARMAT ══════════════════════════════════════════════ */}
      <section className="section-padding bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: copy */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-primary text-sm font-semibold uppercase tracking-widest">Why Digital Marmat</span>
              <h2 className="mt-3 text-navy">The Partner That Delivers, Not Just Designs</h2>
              <p className="mt-4 text-navy/65 leading-relaxed">
                We've delivered 50+ projects across e-commerce, corporate, NGO, and startup sectors. Every project is a commitment — on time, on budget, and with results you can measure.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'No templates — every design is 100% custom-built',
                  'Direct communication — you always know the status',
                  'Post-launch support included in every project',
                  'Transparent pricing — zero surprise invoices',
                  'SEO and performance baked in from the very start',
                  '5+ years of real, hands-on delivery experience',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <FiCheck className="text-green-500 mt-0.5 shrink-0" size={17} />
                    <span className="text-navy/70 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="mt-9 inline-flex items-center gap-2 bg-primary text-white px-7 py-3.5 rounded-full font-semibold hover:bg-primary/90 transition"
              >
                Start Your Project <FiArrowRight size={17} />
              </Link>
            </motion.div>

            {/* Right: deliverables card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gradient-to-br from-primary to-navy rounded-3xl p-9 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-7">What You Get With Every Project</h3>
                  <div className="space-y-4">
                    {[
                      { icon: '🎨', text: 'Custom Figma Design Mockups'          },
                      { icon: '📱', text: 'Fully Responsive on All Devices'      },
                      { icon: '🔍', text: 'On-Page SEO Setup'                    },
                      { icon: '⚡', text: 'Performance Optimized (90+ Score)'    },
                      { icon: '🔒', text: 'SSL & Security Hardening'             },
                      { icon: '📊', text: 'Google Analytics Integration'         },
                      { icon: '🗺️', text: 'Sitemap & Search Console Setup'      },
                      { icon: '🛠️', text: '30 Days Post-Launch Support'         },
                    ].map((item) => (
                      <div key={item.text} className="flex items-center gap-3 border-b border-white/15 pb-4 last:border-0 last:pb-0">
                        <span className="text-xl shrink-0">{item.icon}</span>
                        <span className="text-white/85 text-sm font-medium">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </Container>
      </section>

      {/* ══ TECHNOLOGIES ════════════════════════════════════════════════════ */}
      <section className="py-16 bg-light-bg border-y border-gray-100">
        <Container>
          <SectionHeader
            badge="Tech Stack"
            title="Technologies We Work With"
            description="Battle-tested, modern tools chosen for performance, scalability, and long-term maintainability."
          />
          <div className="flex flex-wrap justify-center gap-3">
            {service.technologies.map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="px-5 py-2.5 bg-white rounded-full text-sm font-medium text-navy/70 border border-gray-200 hover:border-primary hover:text-primary transition-colors cursor-default"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </Container>
      </section>

      {/* ══ FAQS ════════════════════════════════════════════════════════════ */}
      <section className="section-padding bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* Left: heading + CTA */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:sticky lg:top-28"
            >
              <span className="text-primary text-sm font-semibold uppercase tracking-widest">FAQs</span>
              <h2 className="mt-3 text-navy">Frequently Asked Questions</h2>
              <p className="mt-4 text-navy/60 leading-relaxed">
                Everything you need to know before getting started. Still have questions? We're happy to chat.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 border-2 border-primary text-primary px-7 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition"
              >
                Ask Us Anything <FiArrowRight size={17} />
              </Link>

              {relatedBlog && (
                <Link
                  href={relatedBlog.href}
                  className="mt-5 flex items-center gap-2 text-navy/60 text-sm font-medium hover:text-primary transition-colors"
                >
                  📖 {relatedBlog.label} <FiArrowRight size={14} />
                </Link>
              )}

              {(service.slug === 'digital-marketing' || service.slug === 'social-media-marketing' || service.slug === 'seo-services' || service.slug === 'website-development') && (
                <Link
                  href="/digital-marketing-score"
                  className="mt-3 flex items-center gap-2 text-navy/60 text-sm font-medium hover:text-primary transition-colors"
                >
                  🎯 Take the free Digital Marketing Score Checker <FiArrowRight size={14} />
                </Link>
              )}
            </motion.div>

            {/* Right: accordion */}
            <div className="space-y-3">
              {service.faqs.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                >
                  <FaqItem
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openFaq === i}
                    onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                  />
                </motion.div>
              ))}
            </div>

          </div>
        </Container>
      </section>

      {/* ══ CTA ═════════════════════════════════════════════════════════════ */}
      <section className="py-28 bg-gradient-to-r from-navy to-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative text-center text-white max-w-2xl mx-auto"
          >
            <span className="inline-block bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              Free Consultation — No Commitment Required
            </span>
            <h2 className="mb-5">
              Ready for a {service.name} That Works for You?
            </h2>
            <p className="text-white/70 text-xl leading-relaxed mb-10">
              Let's build something you'll be proud of. Tell us about your project and get a clear plan, honest timeline, and the best solution for your budget.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="bg-white text-navy px-8 py-4 rounded-full font-bold text-lg hover:bg-white/90 transition inline-flex items-center gap-2"
              >
                Get Free Quote <FiArrowRight size={18} />
              </Link>
              <Link
                href="/portfolio"
                className="border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition"
              >
                View Portfolio
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
    </>
  )
}
