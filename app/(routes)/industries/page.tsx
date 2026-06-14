'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  FiActivity, FiBookOpen, FiCoffee, FiHome, FiHeart, FiMap, FiArrowRight,
} from 'react-icons/fi'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getAllIndustries } from '@/data/industries'

const ICONS: Record<string, React.ElementType> = {
  'healthcare':        FiActivity,
  'education':         FiBookOpen,
  'restaurants-hotels': FiCoffee,
  'real-estate':       FiHome,
  'ngo-nonprofit':     FiHeart,
  'travel-trekking':   FiMap,
}

export default function IndustriesListPage() {
  const industries = getAllIndustries()

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-navy via-[#1B3A6B] to-primary">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl pointer-events-none" />
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative max-w-2xl"
          >
            <span className="inline-block text-secondary text-sm font-semibold uppercase tracking-widest mb-5">
              Industries We Serve
            </span>
            <h1 className="text-white font-bold leading-tight mb-6">Built for Your Industry, Not a Template</h1>
            <p className="text-white/70 text-lg leading-relaxed">
              Every industry has different customers, search habits, and goals. We design websites and marketing
              campaigns around how your specific industry actually wins business online.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* ── Industries Grid ── */}
      <section className="section-padding bg-light-bg">
        <Container>
          <SectionHeader
            badge="Specialized Solutions"
            title="Choose Your Industry"
            description="Explore how we help businesses like yours get found, build trust, and convert more visitors into customers."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry, i) => {
              const Icon = ICONS[industry.slug] ?? FiHome
              return (
                <motion.div
                  key={industry.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                >
                  <Link
                    href={`/industries/${industry.slug}`}
                    className="block h-full bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-5 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <Icon size={24} />
                    </div>
                    <h2 className="text-lg font-bold text-navy mb-2">{industry.industryLabel}</h2>
                    <p className="text-navy/60 text-sm leading-relaxed">{industry.heroDescription}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-primary text-sm font-semibold group-hover:gap-2.5 transition-all duration-200">
                      Learn More <FiArrowRight size={14} />
                    </span>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-gradient-to-r from-navy to-primary">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h2 className="mb-4">Don't See Your Industry?</h2>
            <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
              We work with businesses across many sectors. Tell us about your business and we'll show you exactly how we can help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="bg-white text-navy px-8 py-3 rounded-full font-semibold hover:bg-white/90 transition"
              >
                Get Free Consultation
              </Link>
              <Link
                href="/services"
                className="border border-white/30 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition"
              >
                View All Services
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
    </>
  )
}
