'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  FiCode, FiTrendingUp, FiBarChart2, FiShare2,
  FiServer, FiSmartphone, FiLayers, FiPenTool,
  FiShoppingCart, FiZap, FiArrowRight,
} from 'react-icons/fi'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getAllServices } from '@/data/services'

const ICONS: Record<string, React.ElementType> = {
  'website-development':    FiCode,
  'seo-services':            FiTrendingUp,
  'digital-marketing':       FiBarChart2,
  'social-media-marketing':  FiShare2,
  'software-development':    FiServer,
  'mobile-app-development':  FiSmartphone,
  'ui-ux-design':            FiLayers,
  'branding-design':         FiPenTool,
  'ecommerce-development':   FiShoppingCart,
  'ai-automation':           FiZap,
}

export default function ServicesListPage() {
  const services = getAllServices()

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
              What We Do
            </span>
            <h1 className="text-white font-bold leading-tight mb-6">All Services</h1>
            <p className="text-white/70 text-lg leading-relaxed">
              Comprehensive digital solutions under one roof — from websites and SEO to branding, apps, and AI
              automation. Everything your business needs to grow online.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* ── Services Grid ── */}
      <section className="section-padding bg-light-bg">
        <Container>
          <SectionHeader
            badge="Our Services"
            title="Built for Every Stage of Growth"
            description="Pick a service to explore how it works, what's included, and how it can help your business."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => {
              const Icon = ICONS[service.slug] ?? FiCode
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                >
                  <Link
                    href={`/services/${service.slug}`}
                    className="block h-full bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-5 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <Icon size={24} />
                    </div>
                    <h2 className="text-lg font-bold text-navy mb-2">{service.name}</h2>
                    <p className="text-navy/60 text-sm leading-relaxed">{service.description}</p>
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
            <h2 className="mb-4">Not Sure Where to Start?</h2>
            <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
              Tell us about your project and we'll recommend the right services for your goals and budget.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="bg-white text-navy px-8 py-3 rounded-full font-semibold hover:bg-white/90 transition"
              >
                Get Free Consultation
              </Link>
              <Link
                href="/pricing"
                className="border border-white/30 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition"
              >
                View Pricing
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
    </>
  )
}
