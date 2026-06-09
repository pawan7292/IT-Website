'use client'

import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
  FiArrowRight, FiCheck, FiCode, FiTrendingUp,
  FiSmartphone, FiLayers, FiShoppingCart,
  FiBarChart2, FiShare2, FiStar,
} from 'react-icons/fi'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { HomeBlogSection } from '@/components/HomeBlogSection'

// ─── Animated counter ─────────────────────────────────────────────────────────

function CounterStat({
  end, suffix, label, index, isDecimal = false,
}: {
  end: number; suffix: string; label: string; index: number; isDecimal?: boolean
}) {
  const [count, setCount] = useState(end)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    if (isDecimal) { setCount(end); return }
    const startValue = Math.max(0, end - 5)
    const duration = 1800
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.floor(startValue + eased * (end - startValue)))
      if (p < 1) requestAnimationFrame(tick)
      else setCount(end)
    }
    requestAnimationFrame(tick)
  }, [inView, end, isDecimal])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-bold text-white">
        {isDecimal ? `${end}${suffix}` : `${count}${suffix}`}
      </div>
      <p className="mt-2 text-white/70 font-medium text-sm md:text-base">{label}</p>
    </motion.div>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const featuredServices = [
  { icon: FiCode,         name: 'Website Development',   desc: 'Custom, fast, and responsive websites built with React and Next.js. We develop business websites, portfolios, and web apps for companies across Nepal — built to rank on Google and convert visitors.',       slug: 'website-development'   },
  { icon: FiTrendingUp,   name: 'SEO Services',           desc: "Data-driven SEO strategies tailored for Nepal's market. We improve your Google rankings through technical SEO, content optimization, and local SEO — helping Kathmandu businesses get found online.",        slug: 'seo-services'          },
  { icon: FiBarChart2,    name: 'Digital Marketing',      desc: 'Full-funnel digital marketing campaigns across Google Ads, Facebook, and Instagram. We help Nepal businesses generate leads and grow revenue through paid and organic channels.',                           slug: 'digital-marketing'     },
  { icon: FiShare2,       name: 'Social Media Marketing', desc: 'Strategic social media management for Facebook, Instagram, TikTok, and LinkedIn. We create content, run paid campaigns, and grow engaged audiences for businesses across Nepal.',                           slug: 'social-media-marketing'},
  { icon: FiLayers,       name: 'UI/UX Design',           desc: "User-centered design that turns visitors into customers. We create wireframes, prototypes, and polished interfaces for websites and mobile apps — beautiful, functional, and built for Nepal's market.",      slug: 'ui-ux-design'          },
  { icon: FiShoppingCart, name: 'E-Commerce Development', desc: 'High-converting online stores built on Shopify, WooCommerce, or custom platforms. From product listings to payment gateways — we build e-commerce businesses across Nepal to sell 24/7.',                    slug: 'ecommerce-development' },
]

const processSteps = [
  { num: '01', title: 'Discovery',   desc: 'We listen, research, and understand your goals before writing a single line of code.' },
  { num: '02', title: 'Design',      desc: 'Wireframes and high-fidelity mockups crafted for your brand and target audience.' },
  { num: '03', title: 'Development', desc: 'Clean, fast code built with modern frameworks and SEO best practices from day one.' },
  { num: '04', title: 'Launch',      desc: 'Thorough testing, smooth go-live, and dedicated post-launch support.' },
]

const testimonials = [
  { name: 'Rajesh Sharma', role: 'CEO, TechNepal',             text: 'Digital Marmat transformed our online presence completely. Their attention to detail and professionalism exceeded every expectation.' },
  { name: 'Sita Thapa',    role: 'Managing Director, EcoShop', text: 'The team delivered our e-commerce site on time and it has significantly boosted our sales. Absolutely recommended.' },
  { name: 'Anish Karki',   role: 'Founder, StartupHub',        text: 'Professional, creative, and highly skilled. Digital Marmat is our go-to partner for every digital project.' },
]

const technologies = ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'WordPress', 'Shopify', 'Google Ads', 'Figma', 'Node.js', 'SEMrush']

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-24 pb-0 overflow-hidden bg-gradient-to-br from-navy via-[#1B3A6B] to-[#1251A3]">

        {/* Background atmosphere */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/25 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />
          {/* Subtle grid overlay */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '64px 64px' }}
          />
        </div>

        <Container>
          <div className="relative grid lg:grid-cols-2 gap-12 items-center pb-24">

            {/* ── Left: Copy ── */}
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>

              {/* Live badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white/90 text-sm font-medium">Nepal's Trusted IT Company · Est. 2021</span>
              </motion.div>

              <h1 className="text-white font-bold leading-[1.08] mb-6">
                Nepal's IT Company for<br />
                <span className="bg-gradient-to-r from-secondary to-blue-300 bg-clip-text text-transparent">
                  Website Development, SEO & Digital Marketing
                </span>
              </h1>

              <p className="text-white/70 text-xl leading-relaxed mb-8 max-w-xl">
                Digital Marmat is Nepal's hands-on IT company — 50+ websites delivered, 99.9% client satisfaction, and a genuine passion for helping businesses grow online.
              </p>

              {/* Trust chips */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-2 mb-10">
                {['50+ Websites Delivered', '99.9% Client Satisfaction', 'On-Time, Every Time'].map((item) => (
                  <span key={item} className="flex items-center gap-2 text-white/80 text-sm">
                    <FiCheck className="text-green-400 shrink-0" size={15} />
                    {item}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="bg-white text-navy px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-base md:text-lg hover:bg-white/90 transition inline-flex items-center gap-2"
                >
                  Start Your Project <FiArrowRight size={18} />
                </Link>
                <Link
                  href="/portfolio"
                  className="border border-white/30 text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold text-base md:text-lg hover:bg-white/10 transition"
                >
                  View Our Work
                </Link>
              </div>
            </motion.div>

            {/* ── Right: Browser mockup ── */}
            <motion.div
              initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative w-full max-w-sm">
                {/* Main card */}
                <div className="bg-white rounded-3xl shadow-2xl p-6">
                  {/* Browser chrome */}
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <div className="flex-1 bg-gray-100 rounded-full h-5 ml-2 flex items-center px-3">
                      <span className="text-xs text-gray-400 truncate">digitalmarmat.tech</span>
                    </div>
                  </div>
                  {/* Skeleton blocks */}
                  <div className="h-5 bg-primary/20 rounded-md w-3/4 mb-3" />
                  <div className="h-3 bg-gray-100 rounded w-full mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-5/6 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-4/6 mb-5" />
                  <div className="flex gap-3 mb-5">
                    <div className="h-9 bg-primary rounded-lg w-28" />
                    <div className="h-9 border-2 border-gray-200 rounded-lg w-24" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-50 rounded-xl border border-gray-100" />
                    ))}
                  </div>
                </div>

                {/* Floating badges */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -top-4 -right-6 bg-green-500 text-white rounded-2xl px-4 py-2 shadow-xl text-sm font-bold flex items-center gap-2"
                >
                  <FiCheck size={14} /> 99.9% Satisfaction
                </motion.div>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                  className="absolute -bottom-4 -left-6 bg-primary text-white rounded-2xl px-4 py-2 shadow-xl text-sm font-bold"
                >
                  🚀 50+ Projects Done
                </motion.div>
              </div>
            </motion.div>

          </div>
        </Container>

        {/* Wave cut */}
        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 72" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path d="M0 72H1440V28C1200 68 960 8 720 28C480 48 240 8 0 28V72Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ══ TECH STRIP ══════════════════════════════════════════════════════ */}
      <section className="py-12 bg-white border-b border-gray-100">
        <Container>
          <p className="text-center text-navy/40 text-xs font-semibold uppercase tracking-widest mb-6">
            Technologies &amp; Tools We Work With
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {technologies.map((tech) => (
              <span key={tech} className="px-5 py-2 bg-light-bg rounded-full text-navy/60 text-sm font-medium border border-gray-100 hover:border-primary/30 hover:text-primary transition">
                {tech}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* ══ STATS ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-r from-navy to-primary">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {([
              { end: 3,    suffix: '+',  label: 'Years of Experience', isDecimal: false },
              { end: 50,   suffix: '+',  label: 'Projects Delivered',  isDecimal: false },
              { end: 99.9, suffix: '%',  label: 'Client Satisfaction', isDecimal: true  },
              { end: 100,  suffix: '+',  label: 'Happy Clients',       isDecimal: false },
            ] as const).map((s, i) => (
              <CounterStat key={s.label} end={s.end} suffix={s.suffix} label={s.label} isDecimal={s.isDecimal} index={i} />
            ))}
          </div>
        </Container>
      </section>

      {/* ══ SERVICES ════════════════════════════════════════════════════════ */}
      <section className="section-padding bg-light-bg">
        <Container>
          <SectionHeader
            badge="What We Do"
            title="Services Built for Growth"
            description="From your first website to a full digital strategy — we cover everything your business needs to succeed online."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((s, i) => (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col"
              >
                <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-5 w-fit group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <s.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-navy mb-2">{s.name}</h3>
                <p className="text-navy/60 text-sm leading-relaxed flex-1">{s.desc}</p>
                <Link
                  href={`/services/${s.slug}`}
                  className="mt-5 inline-flex items-center gap-1.5 text-primary text-sm font-semibold hover:gap-2.5 transition-all duration-200"
                >
                  Learn More <FiArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition"
            >
              View All Services <FiArrowRight size={18} />
            </Link>
          </div>
        </Container>
      </section>

      {/* ══ HOW WE WORK ════════════════════════════════════════════════════ */}
      <section className="section-padding bg-white">
        <Container>
          <SectionHeader
            badge="Our Process"
            title="How We Bring Ideas to Life"
            description="A clear, proven 4-step process that keeps you in the loop and confident at every stage."
          />

          <div className="relative grid md:grid-cols-4 gap-8 mt-6">
            {/* Connecting line — desktop only */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

            {processSteps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-6 ring-4 ring-white">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-navy mb-2">{step.title}</h3>
                <p className="text-navy/60 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ══ WHY CHOOSE US ══════════════════════════════════════════════════ */}
      <section className="section-padding bg-gradient-to-br from-[#0B1F3A] via-[#1B3A6B] to-[#1251A3] overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '64px 64px' }}
        />
        <Container>
          <SectionHeader
            badge="Why Digital Marmat"
            title="The Digital Marmat Difference"
            description="We're not just another web agency — we're hands-on partners who care about your results."
            inverted
          />
          <div className="relative grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🎯', title: 'Customized for You',   body: 'Every project is built from scratch around your brand, goals, and audience.' },
              { icon: '⏰', title: 'On-Time Delivery',     body: 'We plan precisely and execute reliably. Deadlines are commitments, not suggestions.' },
              { icon: '💡', title: 'Hands-On Experience',  body: '3+ years of real project delivery across e-commerce, corporate, NGOs, and startups.' },
              { icon: '📈', title: 'Results Focused',      body: 'We measure success by your results — traffic, conversions, and revenue, not just pixels.' },
              { icon: '🤝', title: 'Client-First Always',  body: "Your vision leads every decision. We're transparent, honest, and always responsive." },
              { icon: '🛡️', title: 'Post-Launch Support', body: "We don't disappear after launch. Ongoing maintenance and support keep you covered." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white/[0.08] backdrop-blur-sm border border-white/20 rounded-2xl p-7 hover:bg-white/[0.14] hover:border-white/30 transition-all duration-300"
              >
                <span className="text-3xl mb-4 block">{item.icon}</span>
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ══ TESTIMONIALS ═══════════════════════════════════════════════════ */}
      <section className="section-padding bg-light-bg">
        <Container>
          <SectionHeader
            badge="Client Reviews"
            title="Trusted by Businesses Across Nepal"
            description="Don't just take our word for it — here's what our clients say."
          />
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-5 text-yellow-400 text-lg">
                  {'★★★★★'}
                </div>
                <p className="text-navy/70 leading-relaxed italic flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-5 mt-5 border-t border-gray-100">
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

      {/* ══ BLOG ═══════════════════════════════════════════════════════════ */}
      <HomeBlogSection />

      {/* ══ CTA ════════════════════════════════════════════════════════════ */}
      <section className="py-28 bg-gradient-to-r from-navy to-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative text-center text-white max-w-3xl mx-auto"
          >
            <span className="inline-block bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              Free Consultation — No Commitment Required
            </span>
            <h2 className="mb-5">Ready to Grow Your Business Online?</h2>
            <p className="text-white/70 text-xl leading-relaxed mb-10">
              Tell us about your project. We'll give you a clear plan, an honest timeline, and the best solution for your budget.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="bg-white text-navy px-8 py-4 rounded-full font-bold text-lg hover:bg-white/90 transition inline-flex items-center gap-2"
              >
                Get Free Consultation <FiArrowRight size={18} />
              </Link>
              <Link
                href="/free-seo-audit"
                className="border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition"
              >
                Free SEO Audit
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
    </>
  )
}
