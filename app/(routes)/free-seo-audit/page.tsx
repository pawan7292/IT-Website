'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  FiArrowRight, FiCheck, FiZap, FiSearch, FiTrendingUp,
  FiUsers, FiLink, FiMapPin, FiMonitor, FiCheckCircle,
  FiSend, FiClock, FiChevronDown,
} from 'react-icons/fi'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'

// ─── Data ─────────────────────────────────────────────────────────────────────

const AUDIT_ITEMS = [
  { icon: FiZap,          title: 'Technical SEO',         desc: 'Site speed, crawlability, broken links, sitemap, robots.txt, and indexing issues.' },
  { icon: FiSearch,       title: 'On-Page SEO',           desc: 'Title tags, meta descriptions, heading structure, image alt text, and content quality.' },
  { icon: FiTrendingUp,   title: 'Keyword Rankings',      desc: 'Where you currently rank on Google and which keywords offer quick-win opportunities.' },
  { icon: FiUsers,        title: 'Competitor Analysis',   desc: 'How your site compares to your top 3 competitors in rankings, content, and authority.' },
  { icon: FiLink,         title: 'Backlink Profile',      desc: 'Quality and quantity of sites linking to you — domain authority and toxic link detection.' },
  { icon: FiMapPin,       title: 'Local SEO',             desc: 'Google Business Profile optimisation, local citations, and "near me" search visibility.' },
  { icon: FiMonitor,      title: 'Core Web Vitals',       desc: 'Google\'s page experience scores — LCP, FID, and CLS — that directly affect rankings.' },
  { icon: FiCheckCircle,  title: 'Action Plan',           desc: 'A prioritised list of fixes ranked by impact — so you know exactly what to do first.' },
]

const PROCESS_STEPS = [
  { step: '01', title: 'Submit the Form',     desc: 'Takes less than 2 minutes. Just your name, email, and website URL.' },
  { step: '02', title: 'We Analyse',          desc: 'Our SEO team runs 50+ checks across your website within 24 hours.' },
  { step: '03', title: 'You Get the Report',  desc: 'A detailed PDF report + a free 15-minute consultation call to walk you through it.' },
]

const VISITORS = [
  'Less than 100/month',
  '100 – 500/month',
  '500 – 2,000/month',
  '2,000 – 10,000/month',
  'More than 10,000/month',
  'Not sure',
]

const GOALS = [
  'Rank higher on Google',
  'Get more website leads',
  'Improve site speed',
  'Beat local competitors',
  'All of the above',
]

const FAQS = [
  { q: 'Is the SEO audit really free?',                     a: 'Yes, 100% free. No credit card, no hidden charges. We offer this because we believe in earning your trust before your business.' },
  { q: 'What do I receive after the audit?',                a: 'A detailed PDF report covering all 8 areas, plus a free 15-minute call with our SEO team to explain the findings and answer your questions.' },
  { q: 'How long does the audit take?',                     a: 'You\'ll receive your audit report within 24 hours of submitting the form on weekdays. Weekend requests are delivered by Monday morning.' },
  { q: 'Do I need to be a Digital Marmat client?',          a: 'Not at all. The audit is free whether or not you hire us. Of course, we\'d love to help you fix what we find — but there\'s zero obligation.' },
  { q: 'What websites can you audit?',                      a: 'Any publicly accessible website — WordPress, Shopify, Next.js, custom-built, or any other platform. If Google can visit it, we can audit it.' },
  { q: 'Will you use my information for anything else?',    a: 'No. We use your email only to send the audit report and, if you\'re interested, SEO tips from our team. We never sell or share your data.' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

interface FormData {
  name: string; email: string; phone: string; website: string
  business: string; visitors: string; goal: string
}

const inputClass = (err?: boolean) =>
  `w-full px-4 py-3 rounded-xl border text-navy text-sm transition-all focus:outline-none focus:ring-2 ${
    err ? 'border-red-300 focus:ring-red-200 bg-red-50' : 'border-gray-200 focus:ring-primary/20 focus:border-primary bg-white'
  }`

function Field({ label, error, required, children }: {
  label: string; error?: string; required?: boolean; children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-navy/80 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-500">⚠ {error}</p>}
    </div>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`rounded-2xl border transition-colors ${open ? 'border-primary/30 bg-white' : 'border-gray-100 bg-white'}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-6 text-left gap-4">
        <span className={`font-semibold text-base transition-colors ${open ? 'text-primary' : 'text-navy'}`}>{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.22 }}
          className={`shrink-0 ${open ? 'text-primary' : 'text-navy/40'}`}>
          <FiChevronDown size={20} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-6 pb-6 text-navy/65 leading-relaxed text-sm">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SuccessView({ name, onReset }: { name: string; onReset: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
      className="text-center py-12 px-6">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
        <FiCheck size={36} className="text-green-600" />
      </motion.div>
      <h3 className="text-2xl font-bold text-navy mb-3">Audit Request Received, {name}!</h3>
      <p className="text-navy/60 leading-relaxed mb-4 max-w-sm mx-auto">
        We've also sent a confirmation to your email. Check your inbox — and your spam folder just in case.
      </p>
      <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 rounded-full px-5 py-2 text-sm font-semibold mb-8">
        <FiClock size={15} /> Your audit report arrives within 24 hours
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/services/seo-services"
          className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition text-sm flex items-center justify-center gap-2">
          Learn About SEO <FiArrowRight size={15} />
        </Link>
        <button onClick={onReset}
          className="border border-gray-200 text-navy/60 px-6 py-3 rounded-full font-semibold hover:border-primary hover:text-primary transition text-sm">
          Submit Another
        </button>
      </div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FreeSeoAuditPage() {
  const [submitted, setSubmitted]   = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [serverErr, setServerErr]   = useState<string | null>(null)

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: { visitors: VISITORS[5], goal: GOALS[4] },
  })

  const submittedName = watch('name')

  const onSubmit = async (data: FormData) => {
    setSubmitting(true); setServerErr(null)
    try {
      const res = await fetch('/api/audit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
      })
      if (res.ok) { setSubmitted(true) }
      else { const j = await res.json().catch(() => null); setServerErr(j?.error ?? 'Something went wrong. Please try again.') }
    } catch { setServerErr('Network error. Please check your connection.') }
    finally { setSubmitting(false) }
  }

  return (
    <>
      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-navy via-[#1B3A6B] to-primary">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-secondary/15 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />

        <Container>
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <span className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 text-green-300 text-sm font-semibold px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                100% Free — No Credit Card Required
              </span>
              <h1 className="text-white font-bold leading-[1.08] mb-6">
                Find Out Why Your<br />Website Isn't Ranking
                <br />
                <span className="bg-gradient-to-r from-secondary to-blue-300 bg-clip-text text-transparent">
                  — For Free
                </span>
              </h1>
              <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-xl">
                Get a comprehensive 8-point SEO audit of your website delivered within 24 hours. No strings attached — just honest insights and an action plan you can use immediately.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                {['Delivered in 24 hrs', '50+ Audits Completed', 'Free Consultation Call', 'PDF Report Included'].map((item) => (
                  <span key={item} className="flex items-center gap-2 bg-white/10 border border-white/15 text-white/85 text-sm px-4 py-2 rounded-full">
                    <FiCheck size={13} className="text-green-400" /> {item}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Right: social proof */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
              <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-3xl p-8">
                <p className="text-white/60 text-sm font-medium mb-6 uppercase tracking-widest">What you'll discover</p>
                <div className="space-y-4">
                  {[
                    'Why Google isn\'t ranking your pages higher',
                    'Which keywords you\'re missing out on',
                    'How your site speed compares to competitors',
                    'Local SEO opportunities you haven\'t tapped',
                    'Quick wins that can improve rankings this month',
                    'A prioritised action plan with clear next steps',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <FiCheck size={11} className="text-green-400" />
                      </div>
                      <p className="text-white/80 text-sm leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </Container>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path d="M0 60H1440V20C1200 55 960 5 720 20C480 35 240 5 0 20V60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ══ WHAT'S INCLUDED ════════════════════════════════════════════════ */}
      <section className="section-padding bg-white">
        <Container>
          <SectionHeader
            badge="The Audit"
            title="8 Areas We Check in Your SEO Audit"
            description="Our team runs through every critical SEO factor that affects your Google rankings — not just the obvious ones."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {AUDIT_ITEMS.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }}
                className="bg-light-bg rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <item.icon size={22} />
                </div>
                <h3 className="font-bold text-navy text-base mb-2">{item.title}</h3>
                <p className="text-navy/60 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ══ HOW IT WORKS ═══════════════════════════════════════════════════ */}
      <section className="section-padding bg-light-bg">
        <Container>
          <SectionHeader badge="The Process" title="How It Works" description="Simple, fast, and completely free." />
          <div className="relative grid md:grid-cols-3 gap-8 mt-6">
            <div className="hidden md:block absolute top-10 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            {PROCESS_STEPS.map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex flex-col items-center text-center">
                <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-4 ring-white mb-6">
                  {s.step}
                </div>
                <h3 className="font-bold text-navy text-lg mb-2">{s.title}</h3>
                <p className="text-navy/60 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ══ FORM + SIDEBAR ═════════════════════════════════════════════════ */}
      <section className="section-padding bg-white" id="audit-form">
        <Container>
          <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-start">

            {/* Form card */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">
              <div className="bg-gradient-to-r from-navy to-primary p-7">
                <h2 className="text-white font-bold text-xl mb-1">Get Your Free SEO Audit</h2>
                <p className="text-white/65 text-sm">Takes 2 minutes · Results in 24 hours · 100% free</p>
              </div>

              <div className="p-7 md:p-9">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <SuccessView key="success" name={submittedName} onReset={() => { setSubmitted(false); reset() }} />
                  ) : (
                    <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                      {/* Row 1 */}
                      <div className="grid sm:grid-cols-2 gap-5">
                        <Field label="Full Name" required error={errors.name?.message}>
                          <input type="text" placeholder="Ramesh Thapa" className={inputClass(!!errors.name)}
                            {...register('name', { required: 'Your name is required' })} />
                        </Field>
                        <Field label="Email Address" required error={errors.email?.message}>
                          <input type="email" placeholder="you@example.com" className={inputClass(!!errors.email)}
                            {...register('email', {
                              required: 'Email is required',
                              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                            })} />
                        </Field>
                      </div>

                      {/* Row 2 */}
                      <div className="grid sm:grid-cols-2 gap-5">
                        <Field label="Phone Number" required error={errors.phone?.message}>
                          <input type="tel" placeholder="+977 9800000000" className={inputClass(!!errors.phone)}
                            {...register('phone', { required: 'Phone number is required' })} />
                        </Field>
                        <Field label="Business Name" error={errors.business?.message}>
                          <input type="text" placeholder="My Business Nepal" className={inputClass(!!errors.business)}
                            {...register('business')} />
                        </Field>
                      </div>

                      {/* Website URL */}
                      <Field label="Website URL" required error={errors.website?.message}>
                        <input type="url" placeholder="https://yourbusiness.com.np"
                          className={inputClass(!!errors.website)}
                          {...register('website', {
                            required: 'Website URL is required',
                            pattern: { value: /^https?:\/\/.+\..+/, message: 'Enter a valid URL starting with http:// or https://' },
                          })} />
                      </Field>

                      {/* Visitors */}
                      <Field label="Current Monthly Visitors (approx.)">
                        <div className="relative">
                          <select className={`${inputClass()} appearance-none pr-10`} {...register('visitors')}>
                            {VISITORS.map((v) => <option key={v}>{v}</option>)}
                          </select>
                          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/40 pointer-events-none" size={18} />
                        </div>
                      </Field>

                      {/* Goal */}
                      <Field label="Main Goal for Your Website">
                        <div className="relative">
                          <select className={`${inputClass()} appearance-none pr-10`} {...register('goal')}>
                            {GOALS.map((g) => <option key={g}>{g}</option>)}
                          </select>
                          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/40 pointer-events-none" size={18} />
                        </div>
                      </Field>

                      {serverErr && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                          ⚠ {serverErr}
                        </div>
                      )}

                      <button type="submit" disabled={submitting}
                        className="w-full bg-primary text-white py-4 rounded-xl font-bold text-base hover:bg-primary/90 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 group">
                        {submitting ? (
                          <><svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>Sending…</>
                        ) : (
                          <><FiSend size={18} /> Get My Free SEO Audit
                          <FiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                        )}
                      </button>
                      <p className="text-center text-navy/40 text-xs">
                        Free. No obligation. Your data is safe with us.
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="space-y-6 lg:sticky lg:top-28">

              {/* Stats */}
              <div className="bg-light-bg rounded-2xl p-7 border border-gray-100">
                <h3 className="font-bold text-navy text-lg mb-5">Why Get an Audit?</h3>
                <div className="space-y-5">
                  {[
                    { stat: '75%', label: 'of users never scroll past the first page of Google results' },
                    { stat: '53%', label: 'of website traffic comes from organic search — not paid ads' },
                    { stat: '3×',  label: 'more leads from websites with properly optimised SEO' },
                  ].map((item) => (
                    <div key={item.stat} className="flex items-start gap-4">
                      <span className="text-2xl font-bold text-primary shrink-0">{item.stat}</span>
                      <p className="text-navy/60 text-sm leading-relaxed">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* What you receive */}
              <div className="bg-gradient-to-br from-primary to-navy rounded-2xl p-7 text-white">
                <h3 className="font-bold text-lg mb-5">What You'll Receive</h3>
                <div className="space-y-3">
                  {[
                    '📄 Detailed PDF audit report',
                    '📊 Prioritised fix list by impact',
                    '🔍 Competitor comparison table',
                    '⚡ Quick wins you can action today',
                    '📞 Free 15-min consultation call',
                    '✉️ Sent to your email within 24 hrs',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 border-b border-white/15 pb-3 last:border-0 last:pb-0">
                      <span className="text-base">{item.split(' ')[0]}</span>
                      <span className="text-white/85 text-sm">{item.split(' ').slice(1).join(' ')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Urgency */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <p className="font-bold text-amber-800 text-sm mb-2">⚡ Limited Capacity</p>
                <p className="text-amber-700 text-sm leading-relaxed">
                  We manually review each audit to ensure quality. We process a limited number each week — submit yours now to secure your spot.
                </p>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ══ TESTIMONIAL STRIP ══════════════════════════════════════════════ */}
      <section className="py-16 bg-light-bg border-y border-gray-100">
        <Container>
          <p className="text-center text-navy/40 text-xs font-semibold uppercase tracking-widest mb-10">
            What businesses say after their audit
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Rajesh Sharma',  role: 'CEO, TechNepal',             text: 'The audit revealed 3 critical issues we had no idea about. After fixing them, our traffic went up 60% in two months.' },
              { name: 'Priya Gurung',   role: 'Owner, Himalayan Boutique',   text: 'I expected a generic report but got a detailed breakdown specific to my website and my competitors. Incredibly useful.' },
              { name: 'Anish Karki',    role: 'Founder, StartupHub Nepal',   text: 'We thought our SEO was fine. The audit showed we were missing basic technical fixes that were holding back our rankings.' },
            ].map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.12 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="text-yellow-400 text-base mb-3">★★★★★</div>
                <p className="text-navy/70 text-sm leading-relaxed italic mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-navy text-sm">{t.name}</p>
                    <p className="text-navy/50 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ══ FAQs ═══════════════════════════════════════════════════════════ */}
      <section className="section-padding bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }} className="lg:sticky lg:top-28">
              <span className="text-primary text-sm font-semibold uppercase tracking-widest">FAQs</span>
              <h2 className="mt-3 text-navy">Common Questions</h2>
              <p className="mt-4 text-navy/60 leading-relaxed">Everything you want to know before requesting your audit.</p>
              <a href="#audit-form"
                className="mt-8 inline-flex items-center gap-2 bg-primary text-white px-7 py-3.5 rounded-full font-semibold hover:bg-primary/90 transition">
                Get My Free Audit <FiArrowRight size={17} />
              </a>
            </motion.div>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}>
                  <FaqItem q={faq.q} a={faq.a} />
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ══ FINAL CTA ══════════════════════════════════════════════════════ */}
      <section className="py-28 bg-gradient-to-r from-navy to-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <Container>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="relative text-center text-white max-w-2xl mx-auto">
            <span className="inline-block bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              It's Free. It Takes 2 Minutes.
            </span>
            <h2 className="mb-5">Stop Guessing Why You're Not Ranking</h2>
            <p className="text-white/70 text-xl leading-relaxed mb-10">
              Get the honest, expert analysis your website deserves — completely free, delivered within 24 hours.
            </p>
            <a href="#audit-form"
              className="bg-white text-navy px-8 py-4 rounded-full font-bold text-lg hover:bg-white/90 transition inline-flex items-center gap-2">
              Get My Free SEO Audit <FiArrowRight size={18} />
            </a>
          </motion.div>
        </Container>
      </section>
    </>
  )
}
