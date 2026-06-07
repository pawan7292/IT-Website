'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiCheck, FiX, FiZap } from 'react-icons/fi'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'

// ─── Data ─────────────────────────────────────────────────────────────────────

const categories = ['Web Development', 'Digital Marketing', 'SEO', 'Branding & Design']

const plans: Record<string, {
  name: string; price: string; period: string; description: string
  features: { text: string; included: boolean }[]; highlight: boolean; badge?: string
}[]> = {
  'Web Development': [
    {
      name: 'Starter',
      price: 'NPR 15,000',
      period: 'one-time',
      description: 'Perfect for small businesses and personal brands launching online.',
      highlight: false,
      features: [
        { text: 'Up to 5 pages',              included: true  },
        { text: 'Mobile responsive design',   included: true  },
        { text: 'Basic SEO setup',            included: true  },
        { text: 'Contact form',               included: true  },
        { text: 'Social media links',         included: true  },
        { text: 'CMS / Blog',                 included: false },
        { text: 'E-commerce functionality',   included: false },
        { text: 'Custom animations',          included: false },
        { text: '3 months free support',      included: false },
      ],
    },
    {
      name: 'Business',
      price: 'NPR 35,000',
      period: 'one-time',
      description: 'For growing businesses that need a powerful, feature-rich website.',
      highlight: true,
      badge: 'Most Popular',
      features: [
        { text: 'Up to 15 pages',             included: true },
        { text: 'Mobile responsive design',   included: true },
        { text: 'Advanced SEO setup',         included: true },
        { text: 'Contact & inquiry forms',    included: true },
        { text: 'CMS / Blog integration',     included: true },
        { text: 'Custom animations',          included: true },
        { text: 'Google Analytics setup',     included: true },
        { text: 'E-commerce functionality',   included: false },
        { text: '3 months free support',      included: true },
      ],
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'quote',
      description: 'Large-scale websites, e-commerce stores, and custom web applications.',
      highlight: false,
      features: [
        { text: 'Unlimited pages',            included: true },
        { text: 'Mobile responsive design',   included: true },
        { text: 'Full SEO optimization',      included: true },
        { text: 'E-commerce / custom store',  included: true },
        { text: 'CMS / Blog integration',     included: true },
        { text: 'Custom animations & UI',     included: true },
        { text: 'API & third-party integrations', included: true },
        { text: 'Priority support',           included: true },
        { text: '6 months free support',      included: true },
      ],
    },
  ],
  'Digital Marketing': [
    {
      name: 'Basic',
      price: 'NPR 8,000',
      period: '/month',
      description: 'Establish your brand online with essential marketing coverage.',
      highlight: false,
      features: [
        { text: '2 social platforms managed',   included: true  },
        { text: '8 posts per month',            included: true  },
        { text: 'Basic content creation',       included: true  },
        { text: 'Monthly performance report',   included: true  },
        { text: 'Paid ad management',           included: false },
        { text: 'Email marketing',              included: false },
        { text: 'Competitor analysis',          included: false },
        { text: 'Dedicated account manager',    included: false },
      ],
    },
    {
      name: 'Growth',
      price: 'NPR 18,000',
      period: '/month',
      description: 'Scale your reach with full-funnel digital marketing execution.',
      highlight: true,
      badge: 'Most Popular',
      features: [
        { text: '4 social platforms managed',   included: true },
        { text: '20 posts per month',           included: true },
        { text: 'Professional content creation',included: true },
        { text: 'Weekly performance report',    included: true },
        { text: 'Paid ad management (Meta/Google)', included: true },
        { text: 'Email marketing',              included: true },
        { text: 'Competitor analysis',          included: true },
        { text: 'Dedicated account manager',    included: false },
      ],
    },
    {
      name: 'Pro',
      price: 'Custom',
      period: 'quote',
      description: 'End-to-end digital marketing strategy for high-growth businesses.',
      highlight: false,
      features: [
        { text: 'All platforms managed',        included: true },
        { text: 'Unlimited content creation',   included: true },
        { text: 'Full ad management & budget',  included: true },
        { text: 'Daily monitoring & reports',   included: true },
        { text: 'Email & SMS marketing',        included: true },
        { text: 'In-depth competitor analysis', included: true },
        { text: 'Dedicated account manager',    included: true },
        { text: 'Monthly strategy session',     included: true },
      ],
    },
  ],
  'SEO': [
    {
      name: 'Local SEO',
      price: 'NPR 6,000',
      period: '/month',
      description: 'Get found by customers in your city with targeted local SEO.',
      highlight: false,
      features: [
        { text: 'Google My Business setup',     included: true  },
        { text: 'Local keyword research',       included: true  },
        { text: 'On-page optimization (5 pages)',included: true  },
        { text: 'Monthly SEO report',           included: true  },
        { text: 'Link building',                included: false },
        { text: 'Technical SEO audit',          included: false },
        { text: 'Competitor analysis',          included: false },
        { text: 'Content strategy',             included: false },
      ],
    },
    {
      name: 'Growth SEO',
      price: 'NPR 14,000',
      period: '/month',
      description: 'Comprehensive SEO to drive consistent organic traffic growth.',
      highlight: true,
      badge: 'Most Popular',
      features: [
        { text: 'Full keyword research',        included: true },
        { text: 'On-page optimization (20 pages)',included: true },
        { text: 'Technical SEO audit & fixes',  included: true },
        { text: 'Link building (10 backlinks)',  included: true },
        { text: 'Monthly SEO report',           included: true },
        { text: 'Google My Business management',included: true },
        { text: 'Competitor analysis',          included: true },
        { text: 'Content strategy',             included: false },
      ],
    },
    {
      name: 'Authority SEO',
      price: 'Custom',
      period: 'quote',
      description: 'Dominate search rankings with an aggressive, full-scale SEO strategy.',
      highlight: false,
      features: [
        { text: 'Full keyword research',        included: true },
        { text: 'Unlimited page optimization',  included: true },
        { text: 'Technical SEO audit & fixes',  included: true },
        { text: 'Aggressive link building',     included: true },
        { text: 'Weekly SEO report',            included: true },
        { text: 'Content strategy & creation',  included: true },
        { text: 'Competitor analysis',          included: true },
        { text: 'Dedicated SEO manager',        included: true },
      ],
    },
  ],
  'Branding & Design': [
    {
      name: 'Basic Brand',
      price: 'NPR 10,000',
      period: 'one-time',
      description: 'Essential brand identity package for new businesses.',
      highlight: false,
      features: [
        { text: 'Logo design (3 concepts)',     included: true  },
        { text: 'Color palette',               included: true  },
        { text: 'Typography selection',        included: true  },
        { text: 'Business card design',        included: true  },
        { text: 'Brand style guide',           included: false },
        { text: 'Social media kit',            included: false },
        { text: 'Stationery design',           included: false },
        { text: 'Brand strategy',              included: false },
      ],
    },
    {
      name: 'Full Brand',
      price: 'NPR 25,000',
      period: 'one-time',
      description: 'Complete brand identity system to establish a professional presence.',
      highlight: true,
      badge: 'Most Popular',
      features: [
        { text: 'Logo design (5 concepts)',     included: true },
        { text: 'Color palette',               included: true },
        { text: 'Typography selection',        included: true },
        { text: 'Business card design',        included: true },
        { text: 'Brand style guide',           included: true },
        { text: 'Social media kit',            included: true },
        { text: 'Stationery design',           included: true },
        { text: 'Brand strategy',              included: false },
      ],
    },
    {
      name: 'Brand Strategy',
      price: 'Custom',
      period: 'quote',
      description: 'Full brand strategy and identity for established or growing companies.',
      highlight: false,
      features: [
        { text: 'Logo design (unlimited)',      included: true },
        { text: 'Complete brand identity',      included: true },
        { text: 'Brand style guide (full)',     included: true },
        { text: 'Social media kit',            included: true },
        { text: 'Stationery & collateral',     included: true },
        { text: 'Brand strategy & positioning',included: true },
        { text: 'Competitor brand analysis',   included: true },
        { text: 'Ongoing brand consultation',  included: true },
      ],
    },
  ],
}

const faqs = [
  {
    q: 'Can I upgrade my plan later?',
    a: 'Yes, absolutely. You can upgrade to a higher plan anytime and we\'ll adjust the cost accordingly.',
  },
  {
    q: 'Do you offer custom packages?',
    a: 'Every business is different. If none of the plans fit, reach out and we\'ll build a custom package just for you.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept bank transfers, eSewa, Khalti, and other popular Nepali payment methods.',
  },
  {
    q: 'Is there a contract or lock-in period?',
    a: 'Monthly plans require a minimum 3-month commitment. One-time packages are paid as agreed upon project start.',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const [activeCategory, setActiveCategory] = useState('Web Development')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const activePlans = plans[activeCategory]

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-navy via-[#1B3A6B] to-primary">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl pointer-events-none" />
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-2xl mx-auto"
          >
            <span className="inline-block text-secondary text-sm font-semibold uppercase tracking-widest mb-5">
              Transparent Pricing
            </span>
            <h1 className="text-white font-bold leading-tight mb-6">
              Simple Plans,
              <br />
              <span className="bg-gradient-to-r from-secondary to-blue-300 bg-clip-text text-transparent">
                No Hidden Costs
              </span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              Choose a plan that fits your goals and budget. Every plan comes with dedicated support and a commitment to results.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* ── Plans ── */}
      <section className="section-padding bg-light-bg">
        <Container>
          {/* Category tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                    : 'bg-white text-navy/60 hover:text-primary border border-gray-200 hover:border-primary/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Plan cards */}
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {activePlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`relative flex flex-col rounded-3xl border p-8 transition-all duration-300 ${
                  plan.highlight
                    ? 'bg-gradient-to-b from-primary to-navy text-white border-primary shadow-2xl shadow-primary/20 md:scale-105'
                    : 'bg-white border-gray-100 hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1 bg-secondary text-navy text-xs font-bold px-4 py-1.5 rounded-full shadow">
                      <FiZap size={11} /> {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={`text-xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-navy'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm leading-relaxed ${plan.highlight ? 'text-white/70' : 'text-navy/60'}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="mb-8">
                  <span className={`text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-navy'}`}>
                    {plan.price}
                  </span>
                  {plan.period !== 'quote' && (
                    <span className={`ml-1 text-sm ${plan.highlight ? 'text-white/60' : 'text-navy/50'}`}>
                      {plan.period}
                    </span>
                  )}
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex items-center gap-3 text-sm">
                      {f.included ? (
                        <FiCheck size={16} className={`shrink-0 ${plan.highlight ? 'text-secondary' : 'text-primary'}`} />
                      ) : (
                        <FiX size={16} className={`shrink-0 ${plan.highlight ? 'text-white/30' : 'text-gray-300'}`} />
                      )}
                      <span className={f.included
                        ? (plan.highlight ? 'text-white/90' : 'text-navy/80')
                        : (plan.highlight ? 'text-white/30' : 'text-navy/30 line-through')
                      }>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.price === 'Custom' ? '/contact' : `/contact?plan=${encodeURIComponent(plan.name + ' ' + activeCategory)}`}
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    plan.highlight
                      ? 'bg-white text-primary hover:bg-white/90'
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                >
                  {plan.price === 'Custom' ? 'Get a Custom Quote' : 'Get Started'}
                </Link>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-navy/50 text-sm mt-10">
            All prices are in Nepalese Rupees (NPR). Need something different?{' '}
            <Link href="/contact" className="text-primary font-semibold hover:underline">
              Talk to us
            </Link>
            .
          </p>
        </Container>
      </section>

      {/* ── FAQ ── */}
      <section className="section-padding bg-white">
        <Container>
          <SectionHeader
            badge="FAQ"
            title="Common Questions"
            description="Everything you need to know before getting started."
          />
          <div className="max-w-2xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-light-bg rounded-2xl border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-semibold text-navy text-sm">{faq.q}</span>
                  <span className={`text-primary transition-transform duration-200 ${openFaq === i ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-navy/60 text-sm leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </motion.div>
            ))}
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
            <h2 className="mb-4">Not Sure Which Plan Is Right?</h2>
            <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
              Let's talk. We'll understand your goals and recommend the best option — no pressure, no commitment.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-navy px-8 py-3 rounded-full font-semibold hover:bg-white/90 transition"
            >
              Book a Free Consultation
            </Link>
          </motion.div>
        </Container>
      </section>
    </>
  )
}
