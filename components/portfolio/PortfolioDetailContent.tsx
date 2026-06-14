'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiArrowRight, FiArrowLeft, FiExternalLink, FiCheck, FiInfo } from 'react-icons/fi'
import { Container } from '@/components/ui/Container'
import { getIndustryBySlug } from '@/data/industries'
import type { PortfolioProject } from '@/data/portfolio'

const CAT_STYLE: Record<string, string> = {
  'Website Design': 'bg-blue-100 text-blue-700',
  'E-Commerce':     'bg-teal-100 text-teal-700',
  'Branding':       'bg-purple-100 text-purple-700',
  'Software':       'bg-orange-100 text-orange-700',
}
const catStyle = (c: string) => CAT_STYLE[c] ?? 'bg-gray-100 text-gray-700'

export default function PortfolioDetailContent({ project }: { project: PortfolioProject }) {
  const industry = project.industrySlug ? getIndustryBySlug(project.industrySlug) : undefined

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-navy via-[#1B3A6B] to-primary">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-secondary/15 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />

        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-white/60 text-sm font-medium hover:text-white transition-colors mb-6"
            >
              <FiArrowLeft size={15} /> Back to Portfolio
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${catStyle(project.category)}`}>
                {project.category}
              </span>
              {project.featured && (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-400 text-yellow-900">
                  ⭐ Featured
                </span>
              )}
              {project.isIllustrative && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/70">
                  Illustrative Example
                </span>
              )}
            </div>

            <h1 className="text-white font-bold leading-tight mb-4 max-w-3xl">{project.title}</h1>
            <p className="text-secondary text-sm font-semibold uppercase tracking-widest mb-4">{project.client}</p>
            <p className="text-white/70 text-lg leading-relaxed max-w-2xl mb-8">{project.description}</p>

            <div className="flex flex-wrap gap-3 mb-10">
              {project.tech.map((t) => (
                <span key={t} className="px-3 py-1.5 bg-white/10 border border-white/15 text-white/80 text-xs font-medium rounded-full">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-navy px-7 py-3.5 rounded-full font-bold hover:bg-white/90 transition inline-flex items-center gap-2"
                >
                  <FiExternalLink size={17} /> View Live Site
                </a>
              )}
              <Link
                href="/contact"
                className="border border-white/30 text-white px-7 py-3.5 rounded-full font-semibold hover:bg-white/10 transition inline-flex items-center gap-2"
              >
                Start a Similar Project <FiArrowRight size={17} />
              </Link>
            </div>
          </motion.div>
        </Container>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path d="M0 60H1440V20C1200 55 960 5 720 20C480 35 240 5 0 20V60Z" fill="#F8FAFC" />
          </svg>
        </div>
      </section>

      {/* ── Cover image ── */}
      <section className="bg-light-bg pb-4">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-72 md:h-[420px] rounded-3xl overflow-hidden -mt-16 shadow-xl border border-white"
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover"
              priority
            />
          </motion.div>
        </Container>
      </section>

      {project.isIllustrative && (
        <section className="bg-light-bg pt-8">
          <Container>
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-5 text-sm leading-relaxed">
              <FiInfo size={18} className="shrink-0 mt-0.5" />
              <p>
                This case study is an <strong>illustrative example</strong> showing the type of problem, approach, and
                outcome a project like this typically involves. It represents the kind of work we do — figures shown
                are representative examples, not figures from this specific client.
              </p>
            </div>
          </Container>
        </section>
      )}

      {/* ── Problem / Solution / Result ── */}
      <section className="section-padding bg-light-bg">
        <Container>
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Challenge */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-8 border border-gray-100"
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 text-red-500 font-bold mb-5">1</span>
              <h3 className="text-xl font-bold text-navy mb-3">The Challenge</h3>
              <p className="text-navy/65 leading-relaxed text-sm">{project.problem}</p>
            </motion.div>

            {/* Solution */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl p-8 border border-gray-100"
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-primary font-bold mb-5">2</span>
              <h3 className="text-xl font-bold text-navy mb-4">Our Approach</h3>
              <ul className="space-y-3">
                {project.solution.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-navy/65 text-sm leading-relaxed">
                    <FiCheck className="text-primary shrink-0 mt-0.5" size={16} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Result */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 border border-gray-100"
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-green-50 text-green-600 font-bold mb-5">3</span>
              <h3 className="text-xl font-bold text-navy mb-3">The Result</h3>
              <p className="text-navy/65 leading-relaxed text-sm">{project.result}</p>
            </motion.div>
          </div>

          {/* Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-navy to-primary rounded-3xl p-10 grid sm:grid-cols-3 gap-8 text-center"
          >
            {project.metrics.map((m) => (
              <div key={m.label}>
                <p className="text-white font-bold text-3xl md:text-4xl mb-2">{m.value}</p>
                <p className="text-white/60 text-sm">{m.label}</p>
              </div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* ── Related industry ── */}
      {industry && (
        <section className="section-padding bg-white border-t border-gray-100">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-light-bg rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div>
                <span className="text-primary text-sm font-semibold uppercase tracking-widest">Industry Focus</span>
                <h3 className="text-2xl font-bold text-navy mt-2">
                  See how we help {industry.industryLabel.toLowerCase()}
                </h3>
                <p className="text-navy/60 text-sm mt-2 max-w-lg">{industry.heroDescription}</p>
              </div>
              <Link
                href={`/industries/${industry.slug}`}
                className="shrink-0 bg-primary text-white px-7 py-3.5 rounded-full font-semibold hover:bg-primary/90 transition inline-flex items-center gap-2"
              >
                View Industry Page <FiArrowRight size={16} />
              </Link>
            </motion.div>
          </Container>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-24 bg-gradient-to-r from-navy to-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative text-center text-white max-w-2xl mx-auto"
          >
            <h2 className="mb-5">Want Results Like This for Your Business?</h2>
            <p className="text-white/70 text-lg leading-relaxed mb-10">
              Tell us about your project and we'll show you exactly how we'd approach it — free consultation, no obligation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="bg-white text-navy px-8 py-4 rounded-full font-bold text-lg hover:bg-white/90 transition inline-flex items-center gap-2"
              >
                Get Free Consultation <FiArrowRight size={18} />
              </Link>
              <Link
                href="/portfolio"
                className="border border-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition"
              >
                View More Projects
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
    </>
  )
}
