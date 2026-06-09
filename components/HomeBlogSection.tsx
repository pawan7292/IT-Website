'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiArrowRight, FiClock } from 'react-icons/fi'
import { Container } from '@/components/ui/Container'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { blogPosts } from '@/data/blog'

const recentPosts = [...blogPosts]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 3)

export function HomeBlogSection() {
  return (
    <section className="section-padding bg-white">
      <Container>
        <SectionHeader
          badge="Blog"
          title="Latest Insights from Our Team"
          description="Tips, guides, and strategies to grow your business online in Nepal."
        />
        <div className="grid md:grid-cols-3 gap-6">
          {recentPosts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-light-bg rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="p-6 flex flex-col flex-1">
                <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3 w-fit">
                  {post.category}
                </span>
                <h3 className="font-bold text-navy text-base leading-snug mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-navy/60 text-sm leading-relaxed flex-1 line-clamp-2 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="flex items-center gap-1.5 text-navy/40 text-xs">
                    <FiClock size={12} /> {post.readTime}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold hover:gap-2.5 transition-all duration-200"
                  >
                    Read More <FiArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition"
          >
            View All Posts <FiArrowRight size={18} />
          </Link>
        </div>
      </Container>
    </section>
  )
}
