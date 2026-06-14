'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FiExternalLink, FiArrowRight } from 'react-icons/fi'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getAllProjects, type PortfolioProject } from '@/data/portfolio'

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROJECTS = getAllProjects()

const CATEGORIES = ['All', 'Website Design', 'E-Commerce', 'Branding', 'Software']

const CAT_STYLE: Record<string, string> = {
  'Website Design': 'bg-blue-100 text-blue-700',
  'E-Commerce':     'bg-teal-100 text-teal-700',
  'Branding':       'bg-purple-100 text-purple-700',
  'Software':       'bg-orange-100 text-orange-700',
}
const catStyle = (c: string) => CAT_STYLE[c] ?? 'bg-gray-100 text-gray-700'

// ─── Project card ─────────────────────────────────────────────────────────────

function ProjectCard({ project, index }: { project: PortfolioProject; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${catStyle(project.category)}`}>
            {project.category}
          </span>
          {project.featured && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-400 text-yellow-900">
              ⭐ Featured
            </span>
          )}
        </div>

        {/* Live site button on hover */}
        {project.url && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="bg-white text-navy px-5 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 shadow-lg hover:bg-primary hover:text-white transition"
            >
              <FiExternalLink size={15} /> View Live Site
            </a>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <p className="text-navy/40 text-xs font-medium mb-1">{project.client}</p>
        <h3 className="font-bold text-navy text-lg mb-2 leading-snug">{project.title}</h3>
        <p className="text-navy/60 text-sm leading-relaxed flex-1">{project.description}</p>

        {/* Tech stack */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span key={t} className="px-2.5 py-1 bg-light-bg text-navy/60 text-xs font-medium rounded-full border border-gray-100">
              {t}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
          <Link
            href={`/portfolio/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold hover:gap-2.5 transition-all"
          >
            View Case Study <FiArrowRight size={14} />
          </Link>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-navy/40 text-xs font-medium hover:text-primary transition-colors"
            >
              <FiExternalLink size={13} /> Live Site
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PortfolioPage() {
  const [active, setActive] = useState('All')

  const filtered = active === 'All'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === active)

  const counts = CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] = cat === 'All' ? PROJECTS.length : PROJECTS.filter((p) => p.category === cat).length
    return acc
  }, {})

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-navy via-[#1B3A6B] to-primary">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '64px 64px' }}
        />
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-secondary/15 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />

        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <span className="inline-block text-secondary text-sm font-semibold uppercase tracking-widest mb-5">
                Our Work
              </span>
              <h1 className="text-white font-bold leading-[1.08] mb-6">
                Real Projects,<br />
                <span className="bg-gradient-to-r from-secondary to-blue-300 bg-clip-text text-transparent">
                  Real Results
                </span>
              </h1>
              <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-xl">
                Every project in our portfolio represents a business goal achieved — a brand launched, a store that sells, a website that ranks. Here's a sample of our work.
              </p>
              <Link href="/contact"
                className="bg-white text-navy px-7 py-3.5 rounded-full font-bold hover:bg-white/90 transition inline-flex items-center gap-2"
              >
                Start Your Project <FiArrowRight size={17} />
              </Link>
            </motion.div>

            {/* Right: stats */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { val: '50+',   label: 'Projects Delivered',   icon: '🚀' },
                  { val: '10+',   label: 'Industries Served',    icon: '🏢' },
                  { val: '99.9%', label: 'Client Satisfaction',  icon: '⭐' },
                  { val: '3+',    label: 'Years of Experience',  icon: '📅' },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-5 text-center"
                  >
                    <span className="text-2xl">{s.icon}</span>
                    <p className="text-white font-bold text-2xl mt-2">{s.val}</p>
                    <p className="text-white/55 text-xs mt-0.5">{s.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </Container>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path d="M0 60H1440V20C1200 55 960 5 720 20C480 35 240 5 0 20V60Z" fill="#F8FAFC" />
          </svg>
        </div>
      </section>

      {/* ── Projects ── */}
      <section className="section-padding bg-light-bg">
        <Container>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  active === cat
                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                    : 'bg-white text-navy/60 hover:text-primary hover:bg-primary/5 border border-gray-200'
                }`}
              >
                {cat}
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-medium ${active === cat ? 'bg-white/20' : 'bg-gray-100 text-navy/40'}`}>
                  {counts[cat]}
                </span>
              </button>
            ))}
          </div>

          {/* Grid */}
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-navy font-semibold">No projects in this category yet.</p>
            </div>
          )}
        </Container>
      </section>

      {/* ── Testimonials strip ── */}
      <section className="section-padding bg-white">
        <Container>
          <SectionHeader
            badge="Client Feedback"
            title="What Our Clients Say About Our Work"
            description="We measure success by the impact our work has on our clients' businesses."
          />
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Rajesh Sharma',
                role: 'CEO, TechNepal',
                text: 'Digital Marmat delivered a website that completely transformed how customers perceive our brand. The design is stunning and the SEO results are already showing.',
              },
              {
                name: 'Sita Thapa',
                role: 'Director, EcoShop Nepal',
                text: 'Our e-commerce revenue doubled in the 3 months after launch. The team was professional, delivered on time, and the eSewa integration worked flawlessly from day one.',
              },
              {
                name: 'Anish Karki',
                role: 'Founder, StartupHub',
                text: 'They understood our vision better than we explained it. The final product was cleaner, faster, and more impressive than we imagined. Highly recommended.',
              },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-light-bg rounded-2xl p-8 border border-gray-100 flex flex-col"
              >
                <div className="text-yellow-400 text-lg mb-4">★★★★★</div>
                <p className="text-navy/70 leading-relaxed italic flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-5 mt-5 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-navy text-sm">{t.name}</p>
                    <p className="text-navy/50 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Industries ── */}
      <section className="py-16 bg-light-bg border-y border-gray-100">
        <Container>
          <p className="text-center text-navy/40 text-xs font-semibold uppercase tracking-widest mb-8">
            Industries We've Worked In
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Interior Design', 'Travel & Trekking', 'Fashion & Retail',
              'Healthcare', 'Food & Restaurant', 'NGO & Non-Profit',
              'Real Estate', 'Education', 'Finance', 'Technology',
              'Handicrafts & Artisan', 'E-Commerce',
            ].map((industry) => (
              <span key={industry}
                className="px-5 py-2.5 bg-white rounded-full text-sm font-medium text-navy/65 border border-gray-200 hover:border-primary/30 hover:text-primary transition"
              >
                {industry}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 bg-gradient-to-r from-navy to-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative text-center text-white max-w-2xl mx-auto"
          >
            <span className="inline-block bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              Your Business Could Be Next
            </span>
            <h2 className="mb-5">Ready to Add Your Project to This List?</h2>
            <p className="text-white/70 text-xl leading-relaxed mb-10">
              Let's build something you'll be proud to show. Free consultation, transparent pricing, on-time delivery — guaranteed.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact"
                className="bg-white text-navy px-8 py-4 rounded-full font-bold text-lg hover:bg-white/90 transition inline-flex items-center gap-2"
              >
                Start Your Project <FiArrowRight size={18} />
              </Link>
              <Link href="/services"
                className="border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition"
              >
                View Services
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
    </>
  )
}
