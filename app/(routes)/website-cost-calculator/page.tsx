'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FiCheck, FiArrowRight, FiLoader } from 'react-icons/fi'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

// ─── Data — kept in sync with /pricing ────────────────────────────────────────

const WEBSITE_TIERS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 15000 as number | null,
    period: 'one-time',
    desc: 'Up to 5 pages — ideal for small businesses & personal brands.',
  },
  {
    id: 'business',
    name: 'Business',
    price: 35000 as number | null,
    period: 'one-time',
    desc: 'Up to 15 pages — for growing businesses that need more.',
    badge: 'Most Popular',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: null as number | null,
    period: 'quote',
    desc: 'Unlimited pages, e-commerce or custom web apps — custom quote.',
  },
]

const ADD_ONS = [
  {
    id: 'seo',
    label: 'Local SEO Setup',
    desc: 'Google Business Profile, local keyword research & on-page SEO',
    price: 6000 as number | null,
    period: '/month',
  },
  {
    id: 'branding',
    label: 'Full Brand Identity',
    desc: 'Logo, color palette, typography & social media kit',
    price: 25000 as number | null,
    period: 'one-time',
  },
  {
    id: 'ecommerce',
    label: 'E-Commerce Functionality',
    desc: 'Online store with payment integration',
    price: null as number | null,
    period: 'custom quote',
  },
]

const formatNPR = (n: number) => `NPR ${n.toLocaleString('en-IN')}`

interface FormData {
  name: string
  email: string
  phone: string
}

export default function CalculatorPage() {
  const [tier, setTier] = useState('starter')
  const [addons, setAddons] = useState<string[]>([])
  const [form, setForm] = useState<FormData>({ name: '', email: '', phone: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const selectedTier = WEBSITE_TIERS.find((t) => t.id === tier)!
  const selectedAddons = ADD_ONS.filter((a) => addons.includes(a.id))

  const oneTimeTotal =
    (selectedTier.price ?? 0) +
    selectedAddons.filter((a) => a.period === 'one-time').reduce((sum, a) => sum + (a.price ?? 0), 0)
  const monthlyTotal = selectedAddons
    .filter((a) => a.period === '/month')
    .reduce((sum, a) => sum + (a.price ?? 0), 0)
  const hasCustomPricing = selectedTier.price === null || selectedAddons.some((a) => a.price === null)

  function toggleAddon(id: string) {
    setAddons((current) => (current.includes(id) ? current.filter((x) => x !== id) : [...current, id]))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) {
      setError('Please enter your name and email so we can send you the quote.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          websiteType: selectedTier.name,
          addons: selectedAddons.map((a) => a.label),
          estimateOneTime: oneTimeTotal,
          estimateMonthly: monthlyTotal,
          hasCustomPricing,
        }),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        setError('Something went wrong. Please try again or message us on WhatsApp.')
      }
    } catch {
      setError('Network error. Please try again or message us on WhatsApp.')
    } finally {
      setLoading(false)
    }
  }

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
              Free Estimate
            </span>
            <h1 className="text-white font-bold leading-tight mb-6">Website Cost Calculator</h1>
            <p className="text-white/70 text-lg leading-relaxed">
              Pick a package and any add-ons to get an instant estimate in NPR — based on our real pricing — then
              request a free, no-obligation quote from our team.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* ── Configurator ── */}
      <section className="section-padding bg-light-bg">
        <Container>
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-xl mx-auto bg-white rounded-2xl border border-gray-100 p-10 text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-50 text-green-600 mb-5">
                <FiCheck size={28} />
              </div>
              <h2 className="text-2xl font-bold text-navy mb-3">Thanks, {form.name.split(' ')[0]}!</h2>
              <p className="text-navy/60 leading-relaxed mb-6">
                We've received your estimate request and sent a copy to <strong>{form.email}</strong>. Our team will
                follow up within 24 hours with a detailed, tailored quote.
              </p>
              <Link href="/portfolio">
                <Button variant="outline">View Our Work</Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-5 gap-10 items-start max-w-5xl mx-auto">
              {/* Left — configurator */}
              <div className="lg:col-span-3 space-y-10">
                {/* Website type */}
                <div>
                  <h2 className="text-lg font-bold text-navy mb-4">1. Choose a Package</h2>
                  <div className="space-y-3">
                    {WEBSITE_TIERS.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTier(t.id)}
                        className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                          tier === t.id ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white hover:border-primary/30'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-navy">{t.name}</span>
                              {t.badge && (
                                <span className="text-[10px] font-semibold uppercase tracking-wider bg-primary text-white px-2 py-0.5 rounded-full">
                                  {t.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-navy/60 mt-1">{t.desc}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-navy">{t.price ? formatNPR(t.price) : 'Custom'}</p>
                            <p className="text-xs text-navy/40">{t.price ? t.period : 'quote'}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add-ons */}
                <div>
                  <h2 className="text-lg font-bold text-navy mb-4">2. Add-ons (optional)</h2>
                  <div className="space-y-3">
                    {ADD_ONS.map((a) => (
                      <label
                        key={a.id}
                        className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                          addons.includes(a.id) ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white hover:border-primary/30'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={addons.includes(a.id)}
                          onChange={() => toggleAddon(a.id)}
                          className="mt-1 w-4 h-4 accent-primary shrink-0"
                        />
                        <div className="flex-1 flex items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-navy">{a.label}</p>
                            <p className="text-sm text-navy/60 mt-1">{a.desc}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-navy">{a.price ? formatNPR(a.price) : 'Custom'}</p>
                            <p className="text-xs text-navy/40">{a.period}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right — estimate + form */}
              <div className="lg:col-span-2 lg:sticky lg:top-28">
                <div className="bg-white rounded-2xl border border-gray-100 p-7">
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-primary mb-4">Your Estimate</h3>

                  <div className="space-y-2 pb-5 mb-5 border-b border-gray-100">
                    {oneTimeTotal > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-navy/60 text-sm">One-time cost</span>
                        <span className="font-bold text-navy">{formatNPR(oneTimeTotal)}</span>
                      </div>
                    )}
                    {monthlyTotal > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-navy/60 text-sm">Monthly cost</span>
                        <span className="font-bold text-navy">{formatNPR(monthlyTotal)}/mo</span>
                      </div>
                    )}
                    {hasCustomPricing && (
                      <p className="text-xs text-navy/50 leading-relaxed">
                        + custom pricing for {selectedTier.price === null ? 'your package' : 'selected add-ons'} —
                        we'll confirm in your quote.
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-navy/50 mb-5">
                    *This is an estimate only. Final pricing depends on your exact requirements — see our{' '}
                    <Link href="/pricing" className="text-primary hover:underline">
                      full pricing
                    </Link>
                    .
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Your name *"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <input
                      type="email"
                      placeholder="Email address *"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <input
                      type="tel"
                      placeholder="Phone (optional)"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    {error && <p className="text-xs text-red-500">⚠ {error}</p>}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-primary text-white py-4 rounded-xl font-bold text-base hover:bg-primary/90 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <FiLoader className="animate-spin" size={18} />
                      ) : (
                        <>
                          Get My Free Quote <FiArrowRight size={16} />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>
    </>
  )
}
