'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  FiPhone, FiMail, FiMapPin, FiMessageCircle,
  FiArrowRight, FiCheck, FiClock, FiSend,
  FiChevronDown,
} from 'react-icons/fi'
import { Container } from '@/components/ui/Container'

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  name: string
  email: string
  phone: string
  service: string
  budget: string
  message: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICES = [
  'Website Development',
  'SEO Services',
  'Digital Marketing',
  'Social Media Marketing',
  'UI/UX Design',
  'Branding & Design',
  'E-Commerce Development',
  'Mobile App Development',
  'Software Development',
  'AI Automation Solutions',
  'Other / Not Sure Yet',
]

const BUDGETS = [
  'Under NPR 25,000',
  'NPR 25,000 – 50,000',
  'NPR 50,000 – 1,00,000',
  'NPR 1,00,000 – 5,00,000',
  'Above NPR 5,00,000',
  'Let\'s discuss',
]

const CONTACT_INFO = [
  {
    icon: FiPhone,
    label: 'Call Us',
    value: '+977 9802362213',
    href: 'tel:+9779802362213',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: FiMessageCircle,
    label: 'WhatsApp',
    value: '+977 9802362213',
    href: 'https://wa.me/9779802362213',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: FiMail,
    label: 'Email Us',
    value: 'info@digitalmarmat.com',
    href: 'mailto:info@digitalmarmat.com',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: FiMapPin,
    label: 'Visit Us',
    value: 'Balaju, Kathmandu',
    href: 'https://share.google/5r59EfOdEUfNjF6Dp',
    color: 'bg-orange-50 text-orange-600',
  },
]

// ─── Input component ──────────────────────────────────────────────────────────

function Field({
  label, error, required = false, children,
}: {
  label: string; error?: string; required?: boolean; children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-navy/80 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">⚠ {error}</p>}
    </div>
  )
}

const inputClass = (hasError?: boolean) =>
  `w-full px-4 py-3 rounded-xl border text-navy text-sm transition-all focus:outline-none focus:ring-2 ${
    hasError
      ? 'border-red-300 focus:ring-red-200 bg-red-50'
      : 'border-gray-200 focus:ring-primary/20 focus:border-primary bg-white'
  }`

// ─── Success state ────────────────────────────────────────────────────────────

function SuccessView({ name, onReset }: { name: string; onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="text-center py-12 px-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
      >
        <FiCheck size={36} className="text-green-600" />
      </motion.div>
      <h3 className="text-2xl font-bold text-navy mb-3">Message Sent, {name}!</h3>
      <p className="text-navy/60 leading-relaxed mb-4 max-w-sm mx-auto">
        Thank you for reaching out. We've also sent a confirmation to your email — check your inbox.
      </p>
      <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 rounded-full px-5 py-2 text-sm font-semibold mb-8">
        <FiClock size={15} /> We'll reply within 24 hours
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/portfolio"
          className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition text-sm flex items-center justify-center gap-2"
        >
          View Our Work <FiArrowRight size={15} />
        </Link>
        <button
          onClick={onReset}
          className="border border-gray-200 text-navy/60 px-6 py-3 rounded-full font-semibold hover:border-primary hover:text-primary transition text-sm"
        >
          Send Another Message
        </button>
      </div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({ defaultValues: { service: SERVICES[0], budget: BUDGETS[5] } })

  const submittedName = watch('name')

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    setServerError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        const json = await res.json().catch(() => null)
        setServerError(json?.error ?? 'Something went wrong. Please try again or email us directly.')
      }
    } catch {
      setServerError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setSubmitted(false)
    setServerError(null)
    reset()
  }

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-navy via-[#1B3A6B] to-primary">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '64px 64px' }}
        />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/15 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />

        <Container>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block text-secondary text-sm font-semibold uppercase tracking-widest mb-4">
              Let's Work Together
            </span>
            <h1 className="text-white font-bold leading-tight mb-5">
              Start Your Project<br />
              <span className="bg-gradient-to-r from-secondary to-blue-300 bg-clip-text text-transparent">
                Today
              </span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-xl mb-10">
              Tell us about your project and we'll get back to you within 24 hours with a clear plan, honest timeline, and the best solution for your budget.
            </p>

            {/* Trust chips */}
            <div className="flex flex-wrap gap-3">
              {['Free Consultation', 'Reply Within 24 Hours', 'No Commitment Required', 'Nepal-Based Team'].map((item) => (
                <span key={item} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 text-white/85 text-sm px-4 py-2 rounded-full">
                  <FiCheck size={13} className="text-green-400" /> {item}
                </span>
              ))}
            </div>
          </motion.div>
        </Container>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path d="M0 60H1440V20C1200 55 960 5 720 20C480 35 240 5 0 20V60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── Contact info cards ── */}
      <section className="pt-16 pb-4 bg-white">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CONTACT_INFO.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl border border-gray-100 bg-light-bg hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
                  <item.icon size={22} />
                </div>
                <p className="text-navy/50 text-xs font-medium uppercase tracking-wide mb-1">{item.label}</p>
                <p className="text-navy font-semibold text-sm leading-snug group-hover:text-primary transition-colors">{item.value}</p>
              </motion.a>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Main: Form + Info ── */}
      <section className="section-padding bg-white">
        <Container>
          <div className="grid lg:grid-cols-[1fr_420px] gap-12 items-start">

            {/* ── Form card ── */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden"
            >
              {/* Card header */}
              <div className="bg-gradient-to-r from-navy to-primary p-7">
                <h2 className="text-white font-bold text-xl mb-1">Send Us a Message</h2>
                <p className="text-white/65 text-sm">Fill in the form and we'll be in touch within 24 hours.</p>
              </div>

              {/* Card body */}
              <div className="p-7 md:p-9">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <SuccessView key="success" name={submittedName} onReset={handleReset} />
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-5"
                      noValidate
                    >
                      {/* Row 1: Name + Email */}
                      <div className="grid sm:grid-cols-2 gap-5">
                        <Field label="Full Name" required error={errors.name?.message}>
                          <input
                            type="text"
                            placeholder="Ramesh Thapa"
                            className={inputClass(!!errors.name)}
                            {...register('name', { required: 'Your name is required' })}
                          />
                        </Field>
                        <Field label="Email Address" required error={errors.email?.message}>
                          <input
                            type="email"
                            placeholder="ramesh@example.com"
                            className={inputClass(!!errors.email)}
                            {...register('email', {
                              required: 'Email is required',
                              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                            })}
                          />
                        </Field>
                      </div>

                      {/* Row 2: Phone */}
                      <Field label="Phone Number" error={errors.phone?.message}>
                        <input
                          type="tel"
                          placeholder="+977 9800000000"
                          className={inputClass(!!errors.phone)}
                          {...register('phone')}
                        />
                      </Field>

                      {/* Row 3: Service */}
                      <Field label="Service You're Interested In" required error={errors.service?.message}>
                        <div className="relative">
                          <select
                            className={`${inputClass(!!errors.service)} appearance-none pr-10`}
                            {...register('service', { required: 'Please select a service' })}
                          >
                            {SERVICES.map((s) => <option key={s}>{s}</option>)}
                          </select>
                          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/40 pointer-events-none" size={18} />
                        </div>
                      </Field>

                      {/* Row 4: Budget */}
                      <Field label="Approximate Budget" error={errors.budget?.message}>
                        <div className="relative">
                          <select
                            className={`${inputClass(!!errors.budget)} appearance-none pr-10`}
                            {...register('budget')}
                          >
                            {BUDGETS.map((b) => <option key={b}>{b}</option>)}
                          </select>
                          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/40 pointer-events-none" size={18} />
                        </div>
                      </Field>

                      {/* Row 5: Message */}
                      <Field label="Tell Us About Your Project" required error={errors.message?.message}>
                        <textarea
                          rows={5}
                          placeholder="Describe your project, goals, timeline, or any questions you have…"
                          className={`${inputClass(!!errors.message)} resize-none`}
                          {...register('message', {
                            required: 'Please tell us about your project',
                            minLength: { value: 20, message: 'Please write at least 20 characters' },
                          })}
                        />
                      </Field>

                      {/* Server error */}
                      {serverError && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                          ⚠ {serverError}
                        </div>
                      )}

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-primary text-white py-4 rounded-xl font-bold text-base hover:bg-primary/90 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
                      >
                        {submitting ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Sending…
                          </>
                        ) : (
                          <>
                            <FiSend size={18} /> Send Message
                            <FiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>

                      <p className="text-center text-navy/40 text-xs">
                        By submitting, you agree to be contacted about your enquiry. We never spam.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* ── Right column info ── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6 lg:sticky lg:top-28"
            >
              {/* Why us */}
              <div className="bg-light-bg rounded-2xl p-7 border border-gray-100">
                <h3 className="font-bold text-navy text-lg mb-5">Why Work With Us?</h3>
                <ul className="space-y-4">
                  {[
                    { icon: '🚀', title: 'Fast Turnaround',      body: 'We move quickly without cutting corners. Most projects kick off within 1 week of agreement.' },
                    { icon: '💰', title: 'Transparent Pricing',  body: 'No hidden fees. You get a detailed quote upfront — no surprises at invoice time.' },
                    { icon: '🇳🇵', title: 'Local Nepal Team',    body: 'We understand Nepal\'s market, payment systems, and business culture from the inside.' },
                    { icon: '🛠',  title: 'Post-Launch Support', body: '30 days of free support after every project. We don\'t disappear after delivery.' },
                  ].map((item) => (
                    <li key={item.title} className="flex gap-3">
                      <span className="text-xl shrink-0">{item.icon}</span>
                      <div>
                        <p className="font-semibold text-navy text-sm mb-0.5">{item.title}</p>
                        <p className="text-navy/55 text-sm leading-relaxed">{item.body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Working hours */}
              <div className="bg-light-bg rounded-2xl p-7 border border-gray-100">
                <h3 className="font-bold text-navy text-base mb-4 flex items-center gap-2">
                  <FiClock size={18} className="text-primary" /> Working Hours
                </h3>
                <div className="space-y-3">
                  {[
                    ['Sunday – Friday',  '9:00 AM – 6:00 PM'],
                    ['Saturday',         '10:00 AM – 4:00 PM'],
                  ].map(([day, time]) => (
                    <div key={day} className="flex items-center justify-between text-sm">
                      <span className="text-navy/60">{day}</span>
                      <span className="font-semibold text-navy">{time}</span>
                    </div>
                  ))}
                  <p className="text-xs text-navy/40 pt-1">All times Nepal Standard Time (UTC+5:45)</p>
                </div>
              </div>

              {/* Quick links */}
              <div className="bg-gradient-to-br from-primary to-navy rounded-2xl p-7 text-white">
                <h3 className="font-bold text-lg mb-4">Not Ready to Contact?</h3>
                <p className="text-white/65 text-sm leading-relaxed mb-5">
                  Explore our work first — see the websites and projects we've delivered.
                </p>
                <div className="space-y-2.5">
                  {[
                    { label: 'View Our Portfolio',  href: '/portfolio' },
                    { label: 'See Our Services',    href: '/services'  },
                    { label: 'Get Free SEO Audit',  href: '/free-seo-audit' },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center justify-between bg-white/10 hover:bg-white/20 transition rounded-xl px-4 py-3 text-sm font-medium"
                    >
                      {link.label} <FiArrowRight size={15} />
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </Container>
      </section>

      {/* ── Map + address strip ── */}
      <section className="py-12 bg-light-bg border-t border-gray-100">
        <Container>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-bold text-navy text-xl mb-3">Find Us in Balaju, Kathmandu</h3>
              <p className="text-navy/60 leading-relaxed mb-5">
                We're based in Balaju, Kathmandu, Nepal and work with clients locally and across the globe. Remote collaboration is seamless — we're available on WhatsApp, Zoom, and email.
              </p>
              <a
                href="https://share.google/5r59EfOdEUfNjF6Dp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline"
              >
                <FiMapPin size={16} /> Open in Google Maps
              </a>
            </div>

            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm h-56">
              <iframe
                src="https://maps.google.com/maps?q=Digital+Marmat.+Tech,Balaju,Kathmandu&z=16&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Digital Marmat location in Balaju, Kathmandu, Nepal"
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
