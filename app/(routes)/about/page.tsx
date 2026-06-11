'use client'

import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {
  FiCheckCircle, FiTarget, FiEye, FiHeart,
  FiAward, FiClock, FiStar, FiTrendingUp,
  FiShield, FiZap, FiGlobe,
} from 'react-icons/fi'
import { FaLinkedinIn } from 'react-icons/fa'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'

// ─── Animated counter ────────────────────────────────────────────────────────

function CounterStat({
  end, suffix, label, icon: Icon, isDecimal = false, index,
}: {
  end: number; suffix: string; label: string
  icon: React.ElementType; isDecimal?: boolean; index: number
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    if (isDecimal) { setCount(end); return }
    const duration = 1800
    const startTime = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * end))
      if (progress < 1) requestAnimationFrame(tick)
      else setCount(end)
    }
    const id = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(id)
  }, [inView, end, isDecimal])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className="flex flex-col items-center text-center"
    >
      <div className="inline-flex p-4 rounded-2xl bg-primary/10 text-primary mb-4">
        <Icon size={28} />
      </div>
      <span className="text-4xl md:text-5xl font-bold text-navy">
        {isDecimal ? `${end}${suffix}` : `${count}${suffix}`}
      </span>
      <p className="mt-2 text-navy/60 font-medium">{label}</p>
    </motion.div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const stats = [
  { end: 5,    suffix: '+',  label: 'Years of Experience',  icon: FiClock },
  { end: 50,   suffix: '+',  label: 'Projects Delivered',   icon: FiTrendingUp },
  { end: 99.9, suffix: '%',  label: 'Client Satisfaction',  icon: FiStar,  isDecimal: true },
  { end: 100,  suffix: '+',  label: 'Happy Clients',        icon: FiAward },
]

const reasons = [
  { icon: FiCheckCircle, title: 'Customized Solutions',   description: 'Every project is built from scratch to match your specific business goals — no one-size-fits-all templates.' },
  { icon: FiAward,       title: 'Proven Track Record',    description: '50+ successful projects and a 99.9% satisfaction rate. Our results do the talking.' },
  { icon: FiZap,         title: 'Diverse Expertise',      description: 'Web design, development, SEO, and digital marketing — all under one roof.' },
  { icon: FiHeart,       title: 'Client-Centric Approach',description: 'Your vision drives everything. We listen first, then build something you\'ll be proud of.' },
  { icon: FiClock,       title: 'On-Time Delivery',       description: 'Deadlines are commitments, not suggestions. We plan carefully and deliver punctually.' },
  { icon: FiShield,      title: 'Dedicated Support',      description: 'Ongoing maintenance and support to keep your digital presence running smoothly.' },
]

const team = [
  {
    name: 'Pawan Thapa',
    role: 'CEO / Founder',
    bio: "Founded Digital Marmat with a vision to bring world-class digital solutions to Nepal, driving the company's overall strategy, business growth, and client relationships to deliver excellence on every project.",
    image: '/team/pawan-thapa.jpg',
    photoPosition: 'object-center',
    socials: {
      website: '',
      linkedin: '',
    },
  },
  {
    name: 'Sabina Phuyal',
    role: 'Co-Founder',
    bio: "Co-founded Digital Marmat with a passion for building meaningful client relationships and delivering digital excellence, playing a key role in shaping the company's vision, culture, and growth.",
    image: '/team/sabina-phuyal.jpg',
    photoPosition: 'object-center',
    socials: {
      website: '',
      linkedin: '',
    },
  },
  {
    name: 'Rajan Khadka',
    role: 'Co-Founder',
    bio: "Co-founded Digital Marmat and contributes to strategic planning and business development, helping drive the company's mission to deliver world-class digital solutions across Nepal and beyond.",
    image: '/team/rajan-khadka.jpg',
    photoPosition: 'object-center',
    socials: {
      website: '',
      linkedin: '',
    },
  },
  {
    name: 'Aayush Mainali',
    role: 'IT Head',
    bio: "Leads Digital Marmat's IT and digital marketing operations, overseeing SEO strategy, system development, Google My Business growth, and all digital initiatives that power the company forward.",
    image: '/team/aayush-mainali.jpg',
    photoPosition: 'object-[center_15%]',
    socials: {
      website: 'https://aayushmainali.me/',
      linkedin: 'https://www.linkedin.com/in/aayushmainali/',
    },
  },
]

const testimonials = [
  {
    name: 'Rajesh Sharma',
    role: 'CEO, TechNepal',
    text: 'Digital Marmat transformed our online presence completely. Their attention to detail and professional approach exceeded every expectation.',
  },
  {
    name: 'Sita Thapa',
    role: 'Managing Director, EcoShop',
    text: 'Outstanding work! The team delivered our e-commerce site on time and it has significantly boosted our online sales.',
  },
  {
    name: 'Anish Karki',
    role: 'Founder, StartupHub',
    text: 'Professional, creative, and highly skilled. Digital Marmat is our go-to partner for all digital solutions — highly recommended.',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-navy via-[#1B3A6B] to-primary">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl pointer-events-none" />

        <Container>
          <div className="relative grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block text-secondary text-sm font-semibold uppercase tracking-widest mb-5">
                About Digital Marmat
              </span>
              <h1 className="text-white font-bold leading-tight mb-6">
                Making Digital
                <br />
                <span className="bg-gradient-to-r from-secondary to-blue-300 bg-clip-text text-transparent">
                  Dreams Possible
                </span>
              </h1>
              <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-xl">
                We are a hands-on IT company from Nepal, passionate about crafting high-performance websites and digital experiences that drive real results for real businesses.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="bg-white text-navy px-7 py-3 rounded-full font-semibold hover:bg-white/90 transition"
                >
                  Work With Us
                </Link>
                <Link
                  href="/portfolio"
                  className="border border-white/30 text-white px-7 py-3 rounded-full font-semibold hover:bg-white/10 transition"
                >
                  See Our Work
                </Link>
              </div>
            </motion.div>

            {/* Right — service cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🌐', label: 'Web Design' },
                { icon: '📱', label: 'Mobile First' },
                { icon: '🚀', label: 'SEO & Growth' },
                { icon: '🎯', label: 'Digital Marketing' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center"
                >
                  <span className="text-4xl">{item.icon}</span>
                  <p className="mt-3 text-white font-medium">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Stats ── */}
      <section className="py-20 bg-white border-b border-gray-100">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {stats.map((s, i) => (
              <CounterStat key={s.label} {...s} index={i} />
            ))}
          </div>
        </Container>
      </section>

      {/* ── Our Story ── */}
      <section className="section-padding bg-light-bg">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-primary text-sm font-semibold uppercase tracking-widest">Our Story</span>
              <h2 className="mt-3 text-navy">Who We Are</h2>
              <div className="mt-6 space-y-4 text-navy/70 leading-relaxed text-base">
                <p>
                  Founded in 2021, Digital Marmat is a Nepal-based IT company specializing in building powerful digital solutions for businesses of all sizes. We combine creativity, technology, and strategy to deliver websites that don't just look great — they perform.
                </p>
                <p>
                  In just over 5 years we've delivered 50+ projects across e-commerce, corporate, startups, and NGOs, earning a near-perfect satisfaction rate of 99.9%. That track record is built on genuine care for every client we work with.
                </p>
                <p>
                  Every business deserves a strong digital presence. Whether you're launching a new brand or scaling an existing one, Digital Marmat is the partner that gets it done.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-block mt-8 bg-primary text-white px-7 py-3 rounded-full font-semibold hover:bg-primary/90 transition"
              >
                Start a Project
              </Link>
            </motion.div>

            {/* Info card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative bg-gradient-to-br from-primary to-navy rounded-3xl p-10 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 space-y-6">
                  {[
                    { label: 'Founded',            value: '2021' },
                    { label: 'Location',           value: 'Nepal' },
                    { label: 'Specialization',     value: 'Web Design & Development' },
                    { label: 'Industries Served',  value: 'E-commerce, Corporate, Startups, NGOs' },
                  ].map((item) => (
                    <div key={item.label} className="border-b border-white/20 pb-5 last:border-0 last:pb-0">
                      <p className="text-white/60 text-sm">{item.label}</p>
                      <p className="text-white font-semibold mt-1">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── Mission / Vision / Values ── */}
      <section className="section-padding bg-white">
        <Container>
          <SectionHeader
            badge="Our Foundation"
            title="What Drives Us"
            description="Our mission, vision, and values shape every single project we take on."
          />
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FiTarget,
                title: 'Our Mission',
                color: 'bg-blue-50 text-primary',
                body: 'To empower businesses with cutting-edge digital solutions — websites that convert, strategies that grow, and support that lasts long after launch.',
              },
              {
                icon: FiEye,
                title: 'Our Vision',
                color: 'bg-indigo-50 text-indigo-600',
                body: "To become Nepal's most trusted digital partner, setting the standard for quality, innovation, and client satisfaction in the IT industry.",
              },
              {
                icon: FiHeart,
                title: 'Our Values',
                color: 'bg-pink-50 text-pink-600',
                body: 'Integrity in every interaction. Excellence in every deliverable. Innovation in every solution. Client-first in every decision we make.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-light-bg rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className={`inline-flex p-3 rounded-xl ${item.color} mb-5`}>
                  <item.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-navy mb-3">{item.title}</h3>
                <p className="text-navy/60 leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="section-padding bg-light-bg">
        <Container>
          <SectionHeader
            badge="Why Us"
            title="Why Choose Digital Marmat?"
            description="We don't just build websites — we build businesses. Here's what makes us different."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reasons.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-5 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <r.icon size={22} />
                </div>
                <h3 className="text-lg font-bold text-navy mb-2">{r.title}</h3>
                <p className="text-navy/60 text-sm leading-relaxed">{r.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Testimonials ── */}
      <section className="section-padding bg-white">
        <Container>
          <SectionHeader
            badge="Client Reviews"
            title="What Our Clients Say"
            description="Real words from real clients. We let our work speak for itself."
          />
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-light-bg rounded-2xl p-8 border border-gray-100"
              >
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <FiStar key={j} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-navy/70 leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
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

      {/* ── Our Team ── */}
      <section className="section-padding bg-light-bg">
        <Container>
          <SectionHeader
            badge="Our Team"
            title="Meet the People Behind Digital Marmat"
            description="Passionate professionals dedicated to building digital experiences that drive real results."
          />
          <div className="flex flex-wrap justify-center gap-8">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center w-full max-w-sm"
              >
                {/* Photo */}
                <div className="relative w-36 h-36 rounded-full overflow-hidden mb-6 ring-4 ring-primary/20">
                  <div className="absolute inset-0 flex items-center justify-center bg-primary text-white text-4xl font-bold z-0">
                    {member.name.charAt(0)}
                  </div>
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className={`object-cover z-10 ${member.photoPosition}`}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                  />
                </div>

                {/* Info */}
                <h3 className="text-xl font-bold text-navy">{member.name}</h3>
                <span className="mt-1 text-sm font-semibold text-primary uppercase tracking-widest">{member.role}</span>
                <p className="mt-4 text-navy/60 text-sm leading-relaxed">{member.bio}</p>

                {/* Socials */}
                <div className="flex gap-3 mt-6">
                  {member.socials.website && (
                    <a
                      href={member.socials.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors duration-200"
                      aria-label="Website"
                    >
                      <FiGlobe size={18} />
                    </a>
                  )}
                  {member.socials.linkedin && (
                    <a
                      href={member.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors duration-200"
                      aria-label="LinkedIn"
                    >
                      <FaLinkedinIn size={18} />
                    </a>
                  )}
                </div>
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
            <h2 className="mb-4">Ready to Start Your Digital Journey?</h2>
            <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
              Let's build something amazing together. Get a free consultation today — no commitment required.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="bg-white text-navy px-8 py-3 rounded-full font-semibold hover:bg-white/90 transition"
              >
                Contact Us
              </Link>
              <Link
                href="/portfolio"
                className="border border-white/30 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition"
              >
                View Portfolio
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
    </>
  )
}
