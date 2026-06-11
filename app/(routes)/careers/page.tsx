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
    title: 'Content Creator Intern',
    type: 'Internship',
    location: 'In-house — Kathmandu',
    hours: '10:00 AM – 5:00 PM',
    department: 'Marketing',
    description: 'Help us create engaging written, visual, and video content for our website, blog, and social media channels. You\'ll work closely with our marketing team to plan, write, design, and publish content that grows our brand and connects with our audience.',
    requirements: [
      'Currently pursuing or recently completed a degree/diploma in Marketing, Mass Communication, Journalism, or a related field',
      'Strong written and verbal communication skills in English',
      'Basic understanding of social media platforms (Instagram, Facebook, LinkedIn, TikTok)',
      'Familiarity with content tools like Canva, CapCut, or Adobe Express is a plus',
      'Creative mindset, eager to learn, and open to feedback',
      'Able to work in-house at our Kathmandu office, 10:00 AM – 5:00 PM, Sunday to Friday',
    ],
  },
]

const perks = [
  { emoji: '💰', title: 'Competitive Pay',      body: 'Fair, market-aligned salaries reviewed regularly.' },
  { emoji: '🏢', title: 'Great Workspace',      body: 'A modern, collaborative office in the heart of Kathmandu.' },
  { emoji: '📚', title: 'Learning Budget',      body: 'Grow your skills with courses, tools, and conferences.' },
  { emoji: '🚀', title: 'Career Growth',        body: 'Fast-growing company means fast-growing opportunities.' },
  { emoji: '🤝', title: 'Great Culture',        body: 'Collaborative, supportive team that celebrates wins together.' },
  { emoji: '🎉', title: 'Team Outings',         body: 'Regular team lunches, outings, and celebrations.' },
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
            title="Join Our Team"
            description="We're hiring! Take a look at our current opening below."
          />
          <div className="max-w-3xl mx-auto space-y-6">
            {positions.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-navy mb-2">{p.title}</h3>
                    <div className="flex flex-wrap gap-3 text-sm text-navy/60">
                      <span className="inline-flex items-center gap-1.5"><FiBriefcase size={14} /> {p.type}</span>
                      <span className="inline-flex items-center gap-1.5"><FiMapPin size={14} /> {p.location}</span>
                      <span className="inline-flex items-center gap-1.5"><FiClock size={14} /> {p.hours}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleApply(p.title)}
                    className="shrink-0 bg-primary text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-primary/90 transition"
                  >
                    Apply Now
                  </button>
                </div>
                <p className="text-navy/70 text-sm leading-relaxed mb-5">{p.description}</p>
                <div>
                  <p className="text-sm font-semibold text-navy mb-3">Requirements & Qualifications</p>
                  <ul className="space-y-2">
                    {p.requirements.map((r) => (
                      <li key={r} className="flex items-start gap-2.5 text-sm text-navy/60">
                        <FiCheckCircle className="text-primary shrink-0 mt-0.5" size={15} />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-navy/50 text-sm mt-10">
            Don't see a role for you?{' '}
            <a href="mailto:info@digitalmarmat.com?subject=Career Enquiry — Digital Marmat" className="text-primary font-semibold hover:underline">
              Send us your CV anyway
            </a>
            {' '}— we'll keep your profile on file and contact you when a matching role opens.
          </p>
        </Container>
      </section>

      {/* ── Apply Form ── */}
      <section id="apply-form" className="section-padding bg-light-bg">
        <Container>
          <SectionHeader
            badge="Apply Now"
            title="Submit Your Application"
            description="Fill out the form below and attach your CV — we'll get back to you within 3 business days."
          />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-xl mx-auto bg-white rounded-2xl p-8 border border-gray-100"
          >
            {submitted ? (
              <div className="text-center py-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-600 mb-5">
                  <FiCheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-navy mb-2">Application Sent!</h3>
                <p className="text-navy/60 text-sm">Thanks for applying — we'll review your application and get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1.5">Full Name</label>
                  <input
                    type="text" required value={form.name}
                    onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1.5">Email</label>
                  <input
                    type="email" required value={form.email}
                    onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1.5">Position</label>
                  <select
                    required value={form.position}
                    onChange={(e) => setForm(f => ({ ...f, position: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm bg-white"
                  >
                    <option value="">Select a position</option>
                    {positions.map((p) => (
                      <option key={p.title} value={p.title}>{p.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1.5">Cover Note (optional)</label>
                  <textarea
                    rows={4} value={form.message}
                    onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm resize-none"
                    placeholder="Tell us why you're a great fit..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy mb-1.5">CV / Resume</label>
                  <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-gray-300 hover:border-primary cursor-pointer transition-colors text-sm text-navy/60">
                    <FiUpload size={16} />
                    {file ? file.name : 'Upload your CV (PDF, DOC)'}
                    <input
                      type="file" accept=".pdf,.doc,.docx" className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>
                <button
                  type="submit" disabled={loading}
                  className="w-full bg-primary text-white py-3.5 rounded-full font-semibold hover:bg-primary/90 transition disabled:opacity-60"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            )}
          </motion.div>
        </Container>
      </section>
    </>
  )
}
