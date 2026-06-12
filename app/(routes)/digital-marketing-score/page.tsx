'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiArrowRight, FiArrowLeft, FiCheck, FiMonitor, FiSearch, FiShare2,
  FiEdit3, FiBarChart2, FiRefreshCw, FiChevronDown, FiZap,
} from 'react-icons/fi'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'

// ─── Data ─────────────────────────────────────────────────────────────────────

type CategoryKey = 'website' | 'seo' | 'social' | 'content' | 'strategy'

const CATEGORY_META: Record<CategoryKey, { label: string; icon: typeof FiMonitor; color: string }> = {
  website: { label: 'Website',              icon: FiMonitor,   color: 'text-blue-600 bg-blue-100' },
  seo:     { label: 'SEO & Local Search',    icon: FiSearch,    color: 'text-green-600 bg-green-100' },
  social:  { label: 'Social Media',          icon: FiShare2,    color: 'text-pink-600 bg-pink-100' },
  content: { label: 'Content & Branding',    icon: FiEdit3,     color: 'text-purple-600 bg-purple-100' },
  strategy:{ label: 'Strategy & Analytics',  icon: FiBarChart2, color: 'text-orange-600 bg-orange-100' },
}

interface QuizOption { label: string; points: 0 | 1 | 3 }
interface QuizQuestion { category: CategoryKey; question: string; options: QuizOption[] }

const QUESTIONS: QuizQuestion[] = [
  {
    category: 'website',
    question: 'Does your business currently have a website?',
    options: [
      { label: "We don't have a website yet", points: 0 },
      { label: "Yes, but it looks outdated or isn't mobile-friendly", points: 1 },
      { label: "Yes, it's modern, mobile-friendly and easy to use", points: 3 },
    ],
  },
  {
    category: 'website',
    question: "How would you rate your website's loading speed and overall experience?",
    options: [
      { label: 'Not sure — never tested it', points: 0 },
      { label: 'It feels slow or clunky, especially on mobile', points: 1 },
      { label: 'Fast and smooth, tested across devices', points: 3 },
    ],
  },
  {
    category: 'seo',
    question: 'When someone searches for your products or services on Google, does your business show up?',
    options: [
      { label: "We don't appear at all", points: 0 },
      { label: 'We show up, but not on the first page', points: 1 },
      { label: 'We rank on page 1 for our most important keywords', points: 3 },
    ],
  },
  {
    category: 'seo',
    question: 'Is your Google Business Profile (Google Maps listing) set up and active?',
    options: [
      { label: "No, we don't have one", points: 0 },
      { label: "It exists, but isn't updated regularly", points: 1 },
      { label: 'Yes, fully optimised with photos, posts and reviews', points: 3 },
    ],
  },
  {
    category: 'social',
    question: 'How consistently does your business post on Facebook/Instagram?',
    options: [
      { label: 'We rarely or never post', points: 0 },
      { label: 'We post sometimes, without a real plan', points: 1 },
      { label: 'We post consistently with a content calendar', points: 3 },
    ],
  },
  {
    category: 'social',
    question: 'Have you run paid social media or Google Ads campaigns?',
    options: [
      { label: 'Never', points: 0 },
      { label: "We've boosted a few posts but didn't track results", points: 1 },
      { label: 'Yes, we run ongoing campaigns and track ROI', points: 3 },
    ],
  },
  {
    category: 'content',
    question: 'Does your business publish blog posts, videos, or other helpful content?',
    options: [
      { label: 'No', points: 0 },
      { label: 'Occasionally, when we have time', points: 1 },
      { label: 'Yes, on a regular schedule', points: 3 },
    ],
  },
  {
    category: 'content',
    question: 'Is your branding (logo, colours, tone of voice) consistent across your website and social pages?',
    options: [
      { label: "Not really — it varies a lot", points: 0 },
      { label: 'Somewhat consistent', points: 1 },
      { label: 'Yes, our brand looks and feels the same everywhere', points: 3 },
    ],
  },
  {
    category: 'strategy',
    question: 'Do you track website and marketing performance with tools like Google Analytics?',
    options: [
      { label: 'No', points: 0 },
      { label: "It's installed, but we rarely check it", points: 1 },
      { label: 'Yes, we review data regularly to guide decisions', points: 3 },
    ],
  },
  {
    category: 'strategy',
    question: 'Do you have a clear digital marketing plan with goals and a budget?',
    options: [
      { label: 'No formal plan', points: 0 },
      { label: 'We have a rough idea, but nothing written down', points: 1 },
      { label: 'Yes — clear goals, budget and strategy', points: 3 },
    ],
  },
]

const RECOMMENDATIONS: Record<CategoryKey, { title: string; desc: string; href: string; linkLabel: string }> = {
  website: {
    title: 'Upgrade Your Website',
    desc: 'Your website is often the first impression a customer gets. An outdated or slow site quietly turns visitors away before they even see what you offer.',
    href: '/services/website-development',
    linkLabel: 'Explore Website Development',
  },
  seo: {
    title: 'Improve Your SEO & Local Visibility',
    desc: "If customers can't find your business on Google, they'll find a competitor instead. SEO and Google Business Profile optimisation fix exactly that.",
    href: '/services/seo-services',
    linkLabel: 'See Our SEO Services',
  },
  social: {
    title: 'Build a Social Media Presence',
    desc: 'Active, consistent social media builds trust and keeps your brand top-of-mind — especially for local Nepal businesses where word-of-mouth still travels online.',
    href: '/services/social-media-marketing',
    linkLabel: 'Explore Social Media Marketing',
  },
  content: {
    title: 'Strengthen Your Content & Branding',
    desc: 'Helpful content and a consistent brand identity build long-term trust and make your business memorable — instead of blending into the crowd.',
    href: '/services/branding-design',
    linkLabel: 'Explore Branding & Design',
  },
  strategy: {
    title: 'Build a Clear Marketing Strategy',
    desc: 'Without a plan and analytics, marketing becomes guesswork. A clear strategy with measurable goals turns your budget into predictable growth.',
    href: '/services/digital-marketing',
    linkLabel: 'Explore Digital Marketing',
  },
}

const GRADES = [
  { min: 0,  max: 33,  title: 'Just Getting Started',  desc: 'Your digital presence has a lot of untapped potential. The good news: every business that\'s strong online today started exactly where you are now.' },
  { min: 34, max: 66,  title: 'Building Momentum',     desc: "You've got some pieces in place, but there are clear gaps holding back your growth. A few focused improvements could make a big difference." },
  { min: 67, max: 89,  title: 'Strong Foundation',     desc: "You're doing well across most areas. Tightening up a few weak spots could take your digital presence from good to genuinely competitive." },
  { min: 90, max: 100, title: 'Digital Leader',         desc: "Impressive — your business is ahead of most Nepal SMEs online. Keep refining and stay consistent to maintain your edge." },
]

const FAQS = [
  { q: 'Is this score checker really free?', a: 'Yes, 100% free with instant results. No email, signup, or credit card required — just answer 10 quick questions.' },
  { q: 'How is the score calculated?', a: 'We score five core areas of digital presence — Website, SEO & Local Search, Social Media, Content & Branding, and Strategy & Analytics — based on your answers, then combine them into one overall percentage.' },
  { q: 'Is this an official audit?', a: "It's a quick self-assessment to help you spot gaps, not a full technical audit. For a detailed, in-depth analysis of your website's SEO, try our free SEO audit." },
  { q: 'What should I do after getting my score?', a: "Focus on the categories where you scored lowest first — those are the areas costing you the most opportunities. We've linked relevant services to help with each one." },
  { q: 'Can I retake the quiz?', a: "Of course. If your business has made changes since your last check, retake it anytime to see how your score has improved." },
]

// ─── FAQ accordion item ─────────────────────────────────────────────────────

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DigitalMarketingScorePage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<(0 | 1 | 3 | null)[]>(Array(QUESTIONS.length).fill(null))

  const totalSteps = QUESTIONS.length
  const showResults = step >= totalSteps
  const current = QUESTIONS[step]

  function selectOption(points: 0 | 1 | 3) {
    const next = [...answers]
    next[step] = points
    setAnswers(next)
    setTimeout(() => setStep((s) => s + 1), 280)
  }

  function goBack() {
    setStep((s) => Math.max(0, s - 1))
  }

  function restart() {
    setAnswers(Array(QUESTIONS.length).fill(null))
    setStep(0)
  }

  const maxScore = QUESTIONS.length * 3
  const totalScore = answers.reduce<number>((sum, a) => sum + (a ?? 0), 0)
  const percentage = Math.round((totalScore / maxScore) * 100)

  const categoryKeys = Object.keys(CATEGORY_META) as CategoryKey[]
  const categoryScores = categoryKeys.map((key) => {
    const indices = QUESTIONS.map((q, i) => (q.category === key ? i : -1)).filter((i) => i >= 0)
    const max = indices.length * 3
    const score = indices.reduce((sum, i) => sum + (answers[i] ?? 0), 0)
    return { key, score, max, pct: Math.round((score / max) * 100) }
  })

  const weakAreas = [...categoryScores].sort((a, b) => a.pct - b.pct).filter((c) => c.pct <= 50)

  const grade = GRADES.find((g) => percentage >= g.min && percentage <= g.max) ?? GRADES[0]

  return (
    <>
      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-navy via-[#1B3A6B] to-primary">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-secondary/15 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />

        <Container>
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <span className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 text-green-300 text-sm font-semibold px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Free · 2 Minutes · Instant Results
              </span>
              <h1 className="text-white font-bold leading-[1.08] mb-6">
                What's Your Digital
                <br />
                <span className="bg-gradient-to-r from-secondary to-blue-300 bg-clip-text text-transparent">
                  Marketing Score?
                </span>
              </h1>
              <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-xl">
                Answer 10 quick questions about your website, SEO, social media, content and strategy. Get an instant score and personalised recommendations to grow your Nepal business online.
              </p>
              <div className="flex flex-wrap gap-3">
                {['No signup required', '5 key areas checked', 'Personalised tips'].map((item) => (
                  <span key={item} className="flex items-center gap-2 bg-white/10 border border-white/15 text-white/85 text-sm px-4 py-2 rounded-full">
                    <FiCheck size={13} className="text-green-400" /> {item}
                  </span>
                ))}
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

      {/* ══ QUIZ ════════════════════════════════════════════════════════════ */}
      <section className="section-padding bg-white">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">

              {/* Header bar */}
              <div className="bg-gradient-to-r from-navy to-primary p-7">
                <h2 className="text-white font-bold text-xl mb-1">Digital Marketing Score Checker</h2>
                {!showResults ? (
                  <>
                    <p className="text-white/65 text-sm mb-4">Question {step + 1} of {totalSteps}</p>
                    <div className="h-2 rounded-full bg-white/15 overflow-hidden">
                      <motion.div
                        className="h-full bg-secondary rounded-full"
                        animate={{ width: `${((step) / totalSteps) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </>
                ) : (
                  <p className="text-white/65 text-sm">Your results are ready</p>
                )}
              </div>

              <div className="p-7 md:p-9">
                <AnimatePresence mode="wait">
                  {!showResults ? (
                    <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${CATEGORY_META[current.category].color}`}>
                          {(() => { const Icon = CATEGORY_META[current.category].icon; return <Icon size={17} /> })()}
                        </span>
                        <span className="text-navy/50 text-xs font-semibold uppercase tracking-widest">
                          {CATEGORY_META[current.category].label}
                        </span>
                      </div>
                      <h3 className="text-navy font-bold text-lg md:text-xl mb-6 leading-snug">
                        {current.question}
                      </h3>
                      <div className="space-y-3">
                        {current.options.map((opt) => (
                          <button
                            key={opt.label}
                            onClick={() => selectOption(opt.points)}
                            className={`w-full text-left px-5 py-4 rounded-xl border text-sm font-medium transition-all ${
                              answers[step] === opt.points
                                ? 'border-primary bg-primary/8 text-primary'
                                : 'border-gray-200 text-navy/75 hover:border-primary/40 hover:bg-primary/5'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      {step > 0 && (
                        <button onClick={goBack} className="mt-6 inline-flex items-center gap-2 text-navy/40 text-sm font-medium hover:text-primary transition-colors">
                          <FiArrowLeft size={14} /> Back
                        </button>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div key="results" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}>

                      {/* Score ring */}
                      <div className="flex flex-col items-center text-center mb-8">
                        <div className="relative w-36 h-36 mb-5">
                          <div
                            className="absolute inset-0 rounded-full"
                            style={{ background: `conic-gradient(#1E73D8 ${percentage * 3.6}deg, #E5E7EB 0deg)` }}
                          />
                          <div className="absolute inset-[7px] rounded-full bg-white flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-navy">{percentage}%</span>
                            <span className="text-xs text-navy/40 font-medium">Overall Score</span>
                          </div>
                        </div>
                        <h3 className="text-navy font-bold text-xl mb-2">{grade.title}</h3>
                        <p className="text-navy/60 text-sm leading-relaxed max-w-md">{grade.desc}</p>
                      </div>

                      {/* Category breakdown */}
                      <div className="space-y-4 mb-8">
                        {categoryScores.map((c) => {
                          const Icon = CATEGORY_META[c.key].icon
                          return (
                            <div key={c.key}>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="flex items-center gap-2 text-sm font-semibold text-navy">
                                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${CATEGORY_META[c.key].color}`}>
                                    <Icon size={13} />
                                  </span>
                                  {CATEGORY_META[c.key].label}
                                </span>
                                <span className="text-navy/50 text-sm font-medium">{c.pct}%</span>
                              </div>
                              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                                <motion.div
                                  className="h-full bg-primary rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${c.pct}%` }}
                                  transition={{ duration: 0.6, delay: 0.1 }}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Recommendations */}
                      {weakAreas.length > 0 ? (
                        <div className="space-y-4 mb-8">
                          <p className="font-bold text-navy text-sm uppercase tracking-widest">Where to Focus Next</p>
                          {weakAreas.map((c) => {
                            const rec = RECOMMENDATIONS[c.key]
                            return (
                              <div key={c.key} className="bg-light-bg rounded-2xl p-5 border border-gray-100">
                                <h4 className="font-bold text-navy mb-1.5">{rec.title}</h4>
                                <p className="text-navy/60 text-sm leading-relaxed mb-3">{rec.desc}</p>
                                <Link href={rec.href} className="inline-flex items-center gap-2 text-primary text-sm font-semibold hover:gap-3 transition-all">
                                  {rec.linkLabel} <FiArrowRight size={14} />
                                </Link>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-8 text-center">
                          <p className="font-bold text-green-800 mb-1">🎉 Great work!</p>
                          <p className="text-green-700 text-sm leading-relaxed">
                            Your business has a solid digital foundation across the board. Keep it up — and consider a free SEO audit to find the next level of optimisation.
                          </p>
                        </div>
                      )}

                      {/* CTAs */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link href="/contact"
                          className="flex-1 bg-primary text-white px-6 py-3.5 rounded-full font-semibold text-sm hover:bg-primary/90 transition flex items-center justify-center gap-2">
                          Get a Free Consultation <FiArrowRight size={15} />
                        </Link>
                        <button onClick={restart}
                          className="flex-1 border border-gray-200 text-navy/60 px-6 py-3.5 rounded-full font-semibold text-sm hover:border-primary hover:text-primary transition flex items-center justify-center gap-2">
                          <FiRefreshCw size={15} /> Retake Quiz
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ══ WHY THIS MATTERS ═══════════════════════════════════════════════ */}
      <section className="section-padding bg-light-bg">
        <Container>
          <SectionHeader
            badge="Why It Matters"
            title="Your Digital Presence Is Often the First Impression"
            description="Before a customer ever calls or visits your shop, they search for you online. What they find — or don't find — shapes whether they trust your business."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {categoryKeys.map((key, i) => {
              const Icon = CATEGORY_META[key].icon
              return (
                <motion.div key={key} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${CATEGORY_META[key].color}`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="font-bold text-navy text-base mb-1">{CATEGORY_META[key].label}</h3>
                  <p className="text-navy/60 text-sm leading-relaxed">
                    {key === 'website' && 'A fast, modern website builds instant trust and turns visitors into enquiries.'}
                    {key === 'seo' && 'Ranking on Google means customers find you instead of your competitors.'}
                    {key === 'social' && 'Active social profiles keep your brand visible and credible day-to-day.'}
                    {key === 'content' && 'Helpful content and consistent branding make your business memorable.'}
                    {key === 'strategy' && 'A clear plan and data turn marketing spend into predictable results.'}
                  </p>
                </motion.div>
              )
            })}
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
              <p className="mt-4 text-navy/60 leading-relaxed">Everything you want to know about the score checker.</p>
              <Link href="/free-seo-audit"
                className="mt-8 inline-flex items-center gap-2 bg-primary text-white px-7 py-3.5 rounded-full font-semibold hover:bg-primary/90 transition">
                Get a Free SEO Audit <FiArrowRight size={17} />
              </Link>
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
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <FiZap size={14} /> Ready to Improve Your Score?
            </span>
            <h2 className="mb-5">Let's Build a Digital Presence That Wins Customers</h2>
            <p className="text-white/70 text-xl leading-relaxed mb-10">
              Whatever your score, our team can help you close the gaps — from a new website to SEO, social media, and full digital marketing strategy.
            </p>
            <Link href="/contact"
              className="bg-white text-navy px-8 py-4 rounded-full font-bold text-lg hover:bg-white/90 transition inline-flex items-center gap-2">
              Talk to Our Team <FiArrowRight size={18} />
            </Link>
          </motion.div>
        </Container>
      </section>
    </>
  )
}
