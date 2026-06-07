'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FiCode, FiTrendingUp, FiBarChart2, FiShare2,
  FiLayers, FiShoppingCart, FiSmartphone, FiAward,
  FiZap, FiCpu, FiUpload, FiCheckCircle,
  FiMapPin, FiBriefcase, FiClock,
} from 'react-icons/fi'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'

// ─── Data ─────────────────────────────────────────────────────────────────────

const services = [
  { icon: FiCode,         label: 'Web Development',      color: 'bg-blue-50 text-blue-600'    },
  { icon: FiTrendingUp,   label: 'SEO & Growth',          color: 'bg-green-50 text-green-600'  },
  { icon: FiBarChart2,    label: 'Digital Marketing',     color: 'bg-purple-50 text-purple-600'},
  { icon: FiShare2,       label: 'Social Media',          color: 'bg-pink-50 text-pink-600'    },
  { icon: FiLayers,       label: 'UI/UX Design',          color: 'bg-indigo-50 text-indigo-600'},
  { icon: FiShoppingCart, label: 'E-Commerce',            color: 'bg-orange-50 text-orange-600'},
  { icon: FiCpu,          label: 'Software Development',  color: 'bg-teal-50 text-teal-600'   },
  { icon: FiSmartphone,   label: 'Mobile Apps',           color: 'bg-cyan-50 text-cyan-600'   },
  { icon: FiAward,        label: 'Branding & Design',     color: 'bg-rose-50 text-rose-600'   },
  { icon: FiZap,          label: 'AI Automation',         color: 'bg-yellow-50 text-yellow-600'},
]

const positions = [
  {
    title: 'Web Developer',
    type: 'Full-time',
    location: 'Kathmandu / Remote',
    department: 'Development',
    description: 'Build fast, responsive websites and web applications using modern technologies like Next.js, React, and Tailwind CSS.',
  },
  {
    title: 'SEO Specialist',
    type: 'Full-time',
    location: 'Kathmandu / Remote',
    department: 'SEO & Growth',
    description: 'Drive organic growth through on-page, off-page, and technical SEO strategies. Experience with Google Search Console and analytics tools required.',
  },
  {
    title: 'Digital Marketing Executive',
    type: 'Full-time',
    location: 'Kathmandu / Remote',
    department: 'Marketing',
    description: 'Plan and execute digital campaigns across multiple channels. Hands-on experience with Google Ads, Meta Ads, and email marketing is a plus.',
  },
  {
    title: 'Social Media Manager',
    type: 'Full-time',
    location: 'Kathmandu / Remote',
    department: 'Marketing',
    description: 'Create engaging content, manage brand presence across social platforms, and grow our clients\' audiences with data-driven strategies.',
  },
  {
    title: 'UI/UX Designer',
    type: 'Full-time',
    location: 'Kathmandu / Remote',
    department: 'Design',
    description: 'Design intuitive, user-centered interfaces using Figma. Strong portfolio showcasing web and mobile UI design is essential.',
  },
  {
    title: 'E-Commerce Developer',
    type: 'Full-time',
    location: 'Kathmandu / Remote',
    department: 'Development',
    description: 'Build and optimize e-commerce platforms on Shopify, WooCommerce, or custom stacks. Experience with payment gateways and product management required.',
  },
  {
    title: 'Software Developer',
    type: 'Full-time',
    location: 'Kathmandu / Remote',
    department: 'Development',
    description: 'Develop scalable backend systems and APIs. Proficiency in Node.js, Python, or similar technologies with strong database knowledge.',
  },
  {
    title: 'Mobile App Developer',
    type: 'Full-time',
    location: 'Kathmandu / Remote',
    department: 'Development',
    description: 'Build cross-platform mobile applications using React Native or Flutter. Experience shipping apps to the App Store and Google Play is preferred.',
  },
  {
    title: 'Brand & Graphic Designer',
    type: 'Full-time',
    location: 'Kathmandu / Remote',
    department: 'Design',
    description: 'Create compelling brand identities, logos, and marketing materials. Proficiency in Adobe Creative Suite and a strong portfolio are required.',
  },
  {
    title: 'AI / Automation Engineer',
    type: 'Full-time',
    location: 'Kathmandu / Remote',
    department: 'Technology',
    description: 'Design and implement AI-powered workflows and automation solutions for clients. Experience with LLMs, APIs, and tools like Make or Zapier is a plus.',
  },
]

const perks = [
  { emoji: '💰', title: 'Competitive Pay',      body: 'Fair, market-aligned salaries reviewed regularly.' },
  { emoji: '🏡', title: 'Remote Friendly',      body: 'Work from anywhere — we care about results, not location.' },
  { emoji: '📚', title: 'Learning Budget',      body: 'Grow your skills with courses, tools, and conferences.' },
  { emoji: '🚀', title: 'Career Growth',        body: 'Fast-growing company means fast-growing opportunities.' },
  { emoji: '🤝', title: 'Great Culture',        body: 'Collaborative, supportive team that celebrates wins together.' },
  { emoji: '⏰', title: 'Flexible Hours',       body: 'We trust you to manage your time and deliver great work.' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CareersPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [form, setForm]           = useState({ name: '', email: '', position: '', message: '' })
  const [file, setFile]           = useState<File | null>(null)

  function handleApply(title: string) {
    setForm(f => ({ ...f, position: title }))
    document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('name',     form.name)
      formData.append('email',    form.email)
      formData.append('position', form.position)
      formData.append('message',  form.message)
      if (file) formData.append('cv', file)

      const res = await fetch('/api/careers', { method: 'POST', body: formData })
      if (res.ok) {
        setSubmitted(true)
      } else {
        const json = await res.json().catch(() => null)
        alert(json?.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      alert('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

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
            className="relative max-w-2xl"
          >
            <span className="inline-block text-secondary text-sm font-semibold uppercase tracking-widest mb-5">
              Careers at Digital Marmat
            </span>
            <h1 className="text-white font-bold leading-tight mb-6">
              Build the Future of
              <br />
              <span className="bg-gradient-to-r from-secondary to-blue-300 bg-clip-text text-transparent">
                Digital Nepal With Us
              </span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              Digital Marmat is a fast-growing IT company based in Nepal, delivering world-class web development, digital marketing, SEO, design, and AI automation solutions to businesses globally. We're building a team of passionate people who love what they do — and we'd love for you to be part of it.
            </p>
            <a
              href="#open-positions"
              className="inline-block bg-white text-navy px-8 py-3 rounded-full font-semibold hover:bg-white/90 transition"
            >
              See Open Positions
            </a>
          </motion.div>
        </Container>
      </section>

      {/* ── What We Do ── */}
      <section className="section-padding bg-white">
        <Container>
          <SectionHeader
            badge="What We Do"
            title="Services You'll Work On"
            description="At Digital Marmat, our team works across a wide range of digital disciplines — from building products to growing brands."
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {services.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex flex-col items-center text-center p-5 rounded-2xl border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`inline-flex p-3 rounded-xl ${s.color} mb-3`}>
                  <s.icon size={22} />
                </div>
                <p className="text-sm font-semibold text-navy">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Perks ── */}
      <section className="section-padding bg-light-bg">
        <Container>
          <SectionHeader
            badge="Why Join Us"
            title="Life at Digital Marmat"
            description="We take care of our team so our team can take care of our clients."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <span className="text-3xl">{p.emoji}</span>
                <h3 className="mt-4 text-lg font-bold text-navy">{p.title}</h3>
                <p className="mt-2 text-navy/60 text-sm leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Open Positions ── */}
      <section id="open-positions" className="section-padding bg-white">
        <Container>
          <SectionHeader
            badge="Open Positions"
            title="Find Your Role"
            description="We're hiring across multiple departments. Find a role that matches your skills and passion."
          />
          <div className="grid md:grid-cols-2 gap-6">
            {positions.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="bg-light-bg rounded-2xl p-7 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-lg font-bold text-navy">{p.title}</h3>
                  <span className="shrink-0 text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {p.department}
                  </span>
                </div>
                <p className="text-navy/60 text-sm leading-relaxed mb-5 flex-1">{p.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-navy/50 mb-5">
                  <span className="flex items-center gap-1"><FiBriefcase size={13} /> {p.type}</span>
                  <span className="flex items-center gap-1"><FiMapPin size={13} /> {p.location}</span>
                  <span className="flex items-center gap-1"><FiClock size={13} /> Open now</span>
                </div>
                <button
                  onClick={() => handleApply(p.title)}
                  className="w-full bg-primary text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-primary/90 transition"
                >
                  Apply for this Role
                </button>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Apply Form ── */}
      <section id="apply-form" className="section-padding bg-light-bg">
        <Container>
          <div className="max-w-2xl mx-auto">
            <SectionHeader
              badge="Apply Now"
              title="Send Us Your CV"
              description="Fill in your details, select a position, and upload your CV. We'll get back to you within 3 business days."
            />

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-12 border border-gray-100 text-center"
              >
                <div className="inline-flex p-5 rounded-full bg-green-50 text-green-600 mb-6">
                  <FiCheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-bold text-navy mb-3">Application Received!</h3>
                <p className="text-navy/60">
                  Thanks for applying. We've received your application and will be in touch within 3 business days.
                </p>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 space-y-5"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">Full Name *</label>
                    <input
                      required
                      placeholder="Your full name"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-navy mb-2">Email Address *</label>
                    <input
                      required
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">Position Applying For *</label>
                  <select
                    required
                    value={form.position}
                    onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition bg-white"
                  >
                    <option value="">Select a position</option>
                    {positions.map(p => (
                      <option key={p.title} value={p.title}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">Why do you want to join? (optional)</label>
                  <textarea
                    rows={4}
                    placeholder="Tell us a bit about yourself and why you'd like to work at Digital Marmat..."
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">Upload Your CV *</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition group">
                    <FiUpload size={24} className="text-navy/30 group-hover:text-primary transition mb-2" />
                    <span className="text-sm text-navy/50 group-hover:text-primary transition">
                      {file ? file.name : 'Click to upload PDF or Word doc'}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={e => setFile(e.target.files?.[0] ?? null)}
                      required
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3.5 rounded-xl font-semibold hover:bg-primary/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting…' : 'Submit Application'}
                </button>
              </motion.form>
            )}
          </div>
        </Container>
      </section>
    </>
  )
}
