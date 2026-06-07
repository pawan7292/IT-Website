




'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiArrowRight, FiSearch, FiClock, FiCalendar } from 'react-icons/fi'
import { Container } from '@/components/ui/Container'
import { getAllPosts } from '@/data/blog'

// ─── Category colour map ──────────────────────────────────────────────────────

const CAT_STYLES: Record<string, string> = {
  'Development':    'bg-blue-100 text-blue-700',
  'SEO':            'bg-green-100 text-green-700',
  'Marketing':      'bg-orange-100 text-orange-700',
  'Social Media':   'bg-pink-100 text-pink-700',
  'Design':         'bg-purple-100 text-purple-700',
  'E-Commerce':     'bg-teal-100 text-teal-700',
  'Branding':       'bg-yellow-100 text-yellow-800',
  'AI & Automation':'bg-violet-100 text-violet-700',
}

const catStyle = (cat: string) => CAT_STYLES[cat] ?? 'bg-gray-100 text-gray-700'

const CATEGORIES = ['All', 'Development', 'SEO', 'Marketing', 'Social Media', 'Design', 'E-Commerce', 'Branding', 'AI & Automation']

// ─── Blog card ───────────────────────────────────────────────────────────────

function BlogCard({ post, index }: { post: ReturnType<typeof getAllPosts>[0]; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
    >
      {/* Cover image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <span className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${catStyle(post.category)}`}>
          {post.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h2 className="text-base font-bold text-navy leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h2>
        <p className="text-navy/60 text-sm leading-relaxed flex-1 line-clamp-3">{post.excerpt}</p>

        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3 text-navy/40 text-xs">
            <span className="flex items-center gap-1"><FiCalendar size={12} />{post.dateFormatted}</span>
            <span className="flex items-center gap-1"><FiClock size={12} />{post.readTime}</span>
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
          >
            Read <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function BlogPage() {
  const allPosts = getAllPosts()
  const [query, setQuery]     = useState('')
  const [category, setCategory] = useState('All')

  const featured = allPosts[0]
  const rest = allPosts.slice(1)

  const filtered = useMemo(() => {
    return rest.filter((p) => {
      const matchesCat   = category === 'All' || p.category === category
      const matchesQuery = p.title.toLowerCase().includes(query.toLowerCase()) ||
                           p.excerpt.toLowerCase().includes(query.toLowerCase())
      return matchesCat && matchesQuery
    })
  }, [query, category, rest])

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-navy via-[#1B3A6B] to-primary">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '64px 64px' }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
        <Container>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="inline-block text-secondary text-sm font-semibold uppercase tracking-widest mb-4">
              Digital Marmat · Blog
            </span>
            <h1 className="text-white font-bold leading-tight mb-4">
              Insights, Tips &<br />
              <span className="bg-gradient-to-r from-secondary to-blue-300 bg-clip-text text-transparent">Digital Growth Ideas</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed mb-8">
              Expert articles on web development, SEO, digital marketing, and technology — written for Nepal businesses ready to grow online.
            </p>
            {/* Search */}
            <div className="relative max-w-md">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                type="text"
                placeholder="Search articles…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/40 rounded-full pl-11 pr-5 py-3 text-sm focus:outline-none focus:border-white/50 transition"
              />
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

      {/* ── Featured post ── */}
      {!query && category === 'All' && (
        <section className="pt-16 pb-4 bg-white">
          <Container>
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-6">Featured Article</p>
            <Link href={`/blog/${featured.slug}`} className="group">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-500"
              >
                {/* Image */}
                <div className="relative h-64 lg:h-auto min-h-[300px] overflow-hidden">
                  <Image
                    src={featured.coverImage}
                    alt={featured.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
                </div>
                {/* Content */}
                <div className="bg-light-bg p-8 lg:p-10 flex flex-col justify-center">
                  <span className={`self-start text-xs font-semibold px-3 py-1.5 rounded-full mb-5 ${catStyle(featured.category)}`}>
                    {featured.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-navy leading-snug mb-4 group-hover:text-primary transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-navy/60 leading-relaxed mb-6">{featured.excerpt}</p>
                  <div className="flex items-center gap-5 text-navy/40 text-sm mb-7">
                    <span className="flex items-center gap-1.5"><FiCalendar size={14} />{featured.dateFormatted}</span>
                    <span className="flex items-center gap-1.5"><FiClock size={14} />{featured.readTime} read</span>
                  </div>
                  <span className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                    Read Full Article <FiArrowRight size={17} />
                  </span>
                </div>
              </motion.div>
            </Link>
          </Container>
        </section>
      )}

      {/* ── Category filters + grid ── */}
      <section className="section-padding bg-white">
        <Container>
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === cat
                    ? 'bg-primary text-white shadow-sm shadow-primary/25'
                    : 'bg-light-bg text-navy/60 hover:text-primary hover:bg-primary/5 border border-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results count */}
          {(query || category !== 'All') && (
            <p className="text-navy/50 text-sm mb-8">
              {filtered.length === 0
                ? 'No articles found. Try a different search or category.'
                : `${filtered.length} article${filtered.length !== 1 ? 's' : ''} found`}
            </p>
          )}

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post, i) => (
                <BlogCard key={post.slug} post={post} index={i} />
              ))}
            </div>
          ) : (query || category !== 'All') ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-navy font-semibold text-lg">No articles found</p>
              <p className="text-navy/50 mt-2">Try a different search term or category.</p>
              <button
                onClick={() => { setQuery(''); setCategory('All') }}
                className="mt-6 text-primary font-semibold hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : null}
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-gradient-to-r from-navy to-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-white max-w-2xl mx-auto"
          >
            <h2 className="mb-4">Ready to Grow Your Business Online?</h2>
            <p className="text-white/70 text-lg mb-8">
              Read enough? Let's put these ideas into action for your business. Get a free consultation from Digital Marmat.
            </p>
            <Link href="/contact"
              className="bg-white text-navy px-8 py-4 rounded-full font-bold text-lg hover:bg-white/90 transition inline-flex items-center gap-2"
            >
              Get Free Consultation <FiArrowRight size={18} />
            </Link>
          </motion.div>
        </Container>
      </section>
    </>
  )
}
