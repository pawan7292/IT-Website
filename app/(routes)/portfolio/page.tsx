'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FiExternalLink, FiArrowRight } from 'react-icons/fi'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    id: 1,
    title: 'Shivanta Interior & Furnishing',
    category: 'Website Design',
    description: 'Premium interior design studio website for Kathmandu\'s leading furnishing company — elegant gallery showcase, project portfolio, service pages, and consultation booking.',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    url: 'https://shivanta.com.np',
    tech: ['Next.js', 'Tailwind CSS', 'SEO', 'Responsive Design'],
    featured: true,
    client: 'Shivanta Interior & Furnishing Pvt. Ltd.',
  },
  {
    id: 2,
    title: 'Digital Marmat IT Service',
    category: 'Website Design',
    description: 'Full-featured IT company website with 10 service pages, animated hero, blog system, contact form with email automation, SEO setup, and sitemap.',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    url: 'https://digitalmarmat.com',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Nodemailer'],
    featured: true,
    client: 'Digital Marmat',
  },
  {
    id: 3,
    title: 'TrekNepal Adventures',
    category: 'Website Design',
    description: 'Travel and trekking company website with itinerary pages, online inquiry forms, photo gallery, and local SEO optimisation targeting international trekkers.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    url: null,
    tech: ['WordPress', 'Custom Theme', 'SEO', 'Gallery'],
    featured: false,
    client: 'TrekNepal Adventures',
  },
  {
    id: 4,
    title: 'SwiftMart Nepal',
    category: 'E-Commerce',
    description: 'High-converting fashion and lifestyle e-commerce store with eSewa & Khalti payment integration, product catalogue management, order tracking, and discount engine.',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=800&q=80',
    url: null,
    tech: ['Shopify', 'Custom Theme', 'eSewa', 'Khalti'],
    featured: false,
    client: 'SwiftMart Nepal',
  },
  {
    id: 5,
    title: 'Himalayan Clinic',
    category: 'Website Design',
    description: 'Professional medical clinic website with doctor profiles, department pages, appointment booking system, and patient information resources.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    url: null,
    tech: ['WordPress', 'Appointment Booking', 'SEO', 'Mobile-First'],
    featured: false,
    client: 'Himalayan Clinic',
  },
  {
    id: 6,
    title: 'NamasteEats Restaurant',
    category: 'Website Design',
    description: 'Modern restaurant website with interactive menu, table reservation system, food gallery, delivery integration, and Google Maps embed.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    url: null,
    tech: ['Next.js', 'Online Ordering', 'Google Maps', 'Tailwind'],
    featured: false,
    client: 'NamasteEats',
  },
  {
    id: 7,
    title: 'GreenBuild Foundation',
    category: 'Branding',
    description: 'Complete brand identity and website for an environmental NGO — logo design, brand guidelines, color system, social media kit, and a donation-focused website.',
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=800&q=80',
    url: null,
    tech: ['Logo Design', 'Brand Identity', 'WordPress', 'Donation System'],
    featured: false,
    client: 'GreenBuild Foundation Nepal',
  },
  {
    id: 8,
    title: 'NepaliCraft Store',
    category: 'E-Commerce',
    description: 'Online marketplace for authentic Nepali handicrafts and handmade products — multi-vendor setup, artisan profiles, global shipping integration, and product SEO.',
    image: 'https://images.unsplash.com/photo-1606041011872-596597976b25?auto=format&fit=crop&w=800&q=80',
    url: null,
    tech: ['WooCommerce', 'Multi-vendor', 'PayPal', 'International Shipping'],
    featured: false,
    client: 'NepaliCraft',
  },
  {
    id: 9,
    title: 'PropertyHub Nepal',
    category: 'Software',
    description: 'Custom real estate listing platform with property search by location/type/price, agent dashboards, enquiry management, map integration, and SEO-optimised listing pages.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    url: null,
    tech: ['React', 'Node.js', 'PostgreSQL', 'Google Maps API'],
    featured: false,
    client: 'PropertyHub Nepal',
  },
  {
    id: 10,
    title: 'AcademyPro Learning',
    category: 'Software',
    description: 'Online learning management system with course creation, student enrollment, video hosting, assignment submission, progress tracking, and certificate generation.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    url: null,
    tech: ['Next.js', 'Supabase', 'Video Hosting', 'Auth System'],
    featured: false,
    client: 'AcademyPro',
  },
  {
    id: 11,
    title: 'Vertex Financial Services',
    category: 'Website Design',
    description: 'Corporate financial services website with service pages, team profiles, calculator tools, compliance documents, and a lead capture system integrated with CRM.',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    url: null,
    tech: ['WordPress', 'ACF Pro', 'CRM Integration', 'SEO'],
    featured: false,
    client: 'Vertex Financial',
  },
  {
    id: 12,
    title: 'SunRise Organic Foods',
    category: 'E-Commerce',
    description: 'Organic food and grocery e-commerce store with subscription delivery model, recipe blog, loyalty rewards program, and eSewa / Khalti payment integration.',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80',
    url: null,
    tech: ['Shopify', 'Subscriptions', 'eSewa', 'Email Marketing'],
    featured: false,
    client: 'SunRise Organic',
  },
]

const CATEGORIES = ['All', 'Website Design', 'E-Commerce', 'Branding', 'Software']

const CAT_STYLE: Record<string, string> = {
  'Website Design': 'bg-blue-100 text-blue-700',
  'E-Commerce':     'bg-teal-100 text-teal-700',
  'Branding':       'bg-purple-100 text-purple-700',
  'Software':       'bg-orange-100 text-orange-700',
}
const catStyle = (c: string) => CAT_STYLE[c] ?? 'bg-gray-100 text-gray-700'

// ─── Project card ─────────────────────────────────────────────────────────────

function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${catStyle(project.category)}`}>
            {project.category}
          </span>
          {project.featured && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-400 text-yellow-900">
              ⭐ Featured
            </span>
          )}
        </div>

        {/* Live site button on hover */}
        {project.url && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="bg-white text-navy px-5 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 shadow-lg hover:bg-primary hover:text-white transition"
            >
              <FiExternalLink size={15} /> View Live Site
            </a>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <p className="text-navy/40 text-xs font-medium mb-1">{project.client}</p>
        <h3 className="font-bold text-navy text-lg mb-2 leading-snug">{project.title}</h3>
        <p className="text-navy/60 text-sm leading-relaxed flex-1">{project.description}</p>

        {/* Tech stack */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span key={t} className="px-2.5 py-1 bg-light-bg text-navy/60 text-xs font-medium rounded-full border border-gray-100">
              {t}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-5 pt-4 border-t border-gray-100">
          {project.url ? (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold hover:gap-2.5 transition-all"
            >
              <FiExternalLink size={14} /> Visit Live Site
            </a>
          ) : (
            <span className="text-navy/35 text-sm font-medium">Completed Project</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PortfolioPage() {
  const [active, setActive] = useState('All')

  const filtered = active === 'All'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === active)

  const counts = CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] = cat === 'All' ? PROJECTS.length : PROJECTS.filter((p) => p.category === cat).length
    return acc
  }, {})

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-navy via-[#1B3A6B] to-primary">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '64px 64px' }}
        />
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-secondary/15 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />

        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
              <span className="inline-block text-secondary text-sm font-semibold uppercase tracking-widest mb-5">
                Our Work
              </span>
              <h1 className="text-white font-bold leading-[1.08] mb-6">
                Real Projects,<br />
                <span className="bg-gradient-to-r from-secondary to-blue-300 bg-clip-text text-transparent">
                  Real Results
                </span>
              </h1>
              <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-xl">
                Every project in our portfolio represents a business goal achieved — a brand launched, a store that sells, a website that ranks. Here's a sample of our work.
              </p>
              <Link href="/contact"
                className="bg-white text-navy px-7 py-3.5 rounded-full font-bold hover:bg-white/90 transition inline-flex items-center gap-2"
              >
                Start Your Project <FiArrowRight size={17} />
              </Link>
            </motion.div>

            {/* Right: stats */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { val: '50+',   label: 'Projects Delivered',   icon: '🚀' },
                  { val: '10+',   label: 'Industries Served',    icon: '🏢' },
                  { val: '99.9%', label: 'Client Satisfaction',  icon: '⭐' },
                  { val: '3+',    label: 'Years of Experience',  icon: '📅' },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-5 text-center"
                  >
                    <span className="text-2xl">{s.icon}</span>
                    <p className="text-white font-bold text-2xl mt-2">{s.val}</p>
                    <p className="text-white/55 text-xs mt-0.5">{s.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </Container>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path d="M0 60H1440V20C1200 55 960 5 720 20C480 35 240 5 0 20V60Z" fill="#F8FAFC" />
          </svg>
        </div>
      </section>

      {/* ── Projects ── */}
      <section className="section-padding bg-light-bg">
        <Container>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  active === cat
                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                    : 'bg-white text-navy/60 hover:text-primary hover:bg-primary/5 border border-gray-200'
                }`}
              >
                {cat}
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-medium ${active === cat ? 'bg-white/20' : 'bg-gray-100 text-navy/40'}`}>
                  {counts[cat]}
                </span>
              </button>
            ))}
          </div>

          {/* Grid */}
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-navy font-semibold">No projects in this category yet.</p>
            </div>
          )}
        </Container>
      </section>

      {/* ── Testimonials strip ── */}
      <section className="section-padding bg-white">
        <Container>
          <SectionHeader
            badge="Client Feedback"
            title="What Our Clients Say About Our Work"
            description="We measure success by the impact our work has on our clients' businesses."
          />
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Rajesh Sharma',
                role: 'CEO, TechNepal',
                text: 'Digital Marmat delivered a website that completely transformed how customers perceive our brand. The design is stunning and the SEO results are already showing.',
              },
              {
                name: 'Sita Thapa',
                role: 'Director, EcoShop Nepal',
                text: 'Our e-commerce revenue doubled in the 3 months after launch. The team was professional, delivered on time, and the eSewa integration worked flawlessly from day one.',
              },
              {
                name: 'Anish Karki',
                role: 'Founder, StartupHub',
                text: 'They understood our vision better than we explained it. The final product was cleaner, faster, and more impressive than we imagined. Highly recommended.',
              },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-light-bg rounded-2xl p-8 border border-gray-100 flex flex-col"
              >
                <div className="text-yellow-400 text-lg mb-4">★★★★★</div>
                <p className="text-navy/70 leading-relaxed italic flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-5 mt-5 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-navy text-sm">{t.name}</p>
                    <p className="text-navy/50 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Industries ── */}
      <section className="py-16 bg-light-bg border-y border-gray-100">
        <Container>
          <p className="text-center text-navy/40 text-xs font-semibold uppercase tracking-widest mb-8">
            Industries We've Worked In
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Interior Design', 'Travel & Trekking', 'Fashion & Retail',
              'Healthcare', 'Food & Restaurant', 'NGO & Non-Profit',
              'Real Estate', 'Education', 'Finance', 'Technology',
              'Handicrafts & Artisan', 'E-Commerce',
            ].map((industry) => (
              <span key={industry}
                className="px-5 py-2.5 bg-white rounded-full text-sm font-medium text-navy/65 border border-gray-200 hover:border-primary/30 hover:text-primary transition"
              >
                {industry}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 bg-gradient-to-r from-navy to-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative text-center text-white max-w-2xl mx-auto"
          >
            <span className="inline-block bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              Your Business Could Be Next
            </span>
            <h2 className="mb-5">Ready to Add Your Project to This List?</h2>
            <p className="text-white/70 text-xl leading-relaxed mb-10">
              Let's build something you'll be proud to show. Free consultation, transparent pricing, on-time delivery — guaranteed.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact"
                className="bg-white text-navy px-8 py-4 rounded-full font-bold text-lg hover:bg-white/90 transition inline-flex items-center gap-2"
              >
                Start Your Project <FiArrowRight size={18} />
              </Link>
              <Link href="/services"
                className="border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition"
              >
                View Services
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
    </>
  )
}
