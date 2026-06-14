'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowRight, FiCheck, FiChevronDown, FiAlertCircle } from 'react-icons/fi'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getServiceBySlug } from '@/data/services'
import type { IndustryData } from '@/data/industries'

const SOLUTION_EMOJIS = ['🎯', '📅', '📍', '💬', '✍️', '⚡', '🗺️', '🎨']

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

// ─── Main component ───────────────────────────────────────────────────────────

export function IndustryPageContent({ industry }: { industry: IndustryData }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const relatedServices = industry.relatedServiceSlugs
    .map((slug) => getServiceBySlug(slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))

  return (
    <>
      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-navy via-[#1B3A6B] to-primary">
        <div className="absolute top-0 left-0 w-[520px] h-[520px] bg-primary/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/15 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '64px 64px' }}
        />

        <Container>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl relative">
            <span className="inline-block text-secondary text-sm font-semibold uppercase tracking-widest mb-5">
              For {industry.industryLabel}
            </span>
            <h1 className="text-white font-bold leading-[1.08] mb-6">{industry.title}</h1>
            <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-2xl">{industry.heroDescription}</p>

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

            <div className="grid grid-cols-3 gap-3 max-w-md">
              {[
                { val: '50+',   label: 'Projects Delivered'   },
                { val: '99.9%', label: 'Client Satisfaction' },
                { val: '3+',    label: 'Years Experience'     },
              ].map((s) => (
                <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl py-4 px-2 text-center">
                  <p className="text-white font-bold text-xl">{s.val}</p>
                  <p className="text-white/55 text-[11px] mt-0.5 leading-snug">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </Container>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path d="M0 72H1440V28C1200 68 960 8 720 28C480 48 240 8 0 28V72Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ══ CHALLENGES ══════════════════════════════════════════════════════ */}
      <section className="section-padding bg-white">
        <Container>
          <SectionHeader
            badge="Common Pain Points"
            title={`Challenges ${industry.industryLabel} Face Online`}
            description="If any of these sound familiar, you're leaving customers — and revenue — on the table."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {industry.challenges.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex gap-4 p-6 rounded-2xl border border-gray-100 bg-light-bg hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <span className="text-red-400 shrink-0 mt-0.5"><FiAlertCircle size={22} /></span>
                <div>
                  <h3 className="font-bold text-navy text-base mb-1.5">{c.title}</h3>
                  <p className="text-navy/60 text-sm leading-relaxed">{c.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ══ SOLUTIONS ═══════════════════════════════════════════════════════ */}
      <section className="section-padding bg-light-bg">
        <Container>
          <SectionHeader
            badge="How We Help"
            title={`What We Build for ${industry.name}`}
            description="A complete digital presence tailored to how your customers actually search, browse, and decide."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {industry.solutions.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex gap-4 p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <span className="text-2xl shrink-0 mt-0.5">{SOLUTION_EMOJIS[i % SOLUTION_EMOJIS.length]}</span>
                <div>
                  <h3 className="font-bold text-navy text-base mb-1.5">{s.title}</h3>
                  <p className="text-navy/60 text-sm leading-relaxed">{s.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ══ FEATURES CHECKLIST ══════════════════════════════════════════════ */}
      <section className="section-padding bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-primary text-sm font-semibold uppercase tracking-widest">What's Included</span>
              <h2 className="mt-3 text-navy">Everything {industry.industryLabel} Need to Get Found Online</h2>
              <p className="mt-4 text-navy/65 leading-relaxed">
                Every project is built around how your customers actually search and decide — not generic templates.
              </p>
              <Link
                href="/contact"
                className="mt-9 inline-flex items-center gap-2 bg-primary text-white px-7 py-3.5 rounded-full font-semibold hover:bg-primary/90 transition"
              >
                Start Your Project <FiArrowRight size={17} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-primary to-navy rounded-3xl p-9 text-white overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 space-y-4">
                {industry.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 border-b border-white/15 pb-4 last:border-0 last:pb-0">
                    <FiCheck className="text-secondary shrink-0 mt-0.5" size={18} />
                    <span className="text-white/85 text-sm font-medium leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ══ FAQS ════════════════════════════════════════════════════════════ */}
      <section className="section-padding bg-light-bg">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-start">
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
            </motion.div>

            <div className="space-y-3">
              {industry.faqs.map((faq, i) => (
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

      {/* ══ RELATED SERVICES ════════════════════════════════════════════════ */}
      {relatedServices.length > 0 && (
        <section className="py-16 bg-white border-t border-gray-100">
          <Container>
            <h2 className="text-navy font-bold text-2xl mb-8">Related Services</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {relatedServices.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="bg-light-bg rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all group flex items-center justify-between"
                >
                  <span className="font-semibold text-navy group-hover:text-primary transition-colors">{service.name}</span>
                  <FiArrowRight size={18} className="text-primary shrink-0 group-hover:translate-x-1 transition-transform" />
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

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
            <h2 className="mb-5">Ready to Grow Your {industry.name} Business Online?</h2>
            <p className="text-white/70 text-xl leading-relaxed mb-10">
              Let's talk about your goals and build a website and marketing plan designed specifically for {industry.industryLabel.toLowerCase()}.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="bg-white text-navy px-8 py-4 rounded-full font-bold text-lg hover:bg-white/90 transition inline-flex items-center gap-2"
              >
                Get Free Quote <FiArrowRight size={18} />
              </Link>
              <Link
                href="/industries"
                className="border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition"
              >
                View Other Industries
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
    </>
  )
}
