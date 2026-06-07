import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { FiArrowLeft, FiClock, FiCalendar, FiArrowRight } from 'react-icons/fi'
import { Container } from '@/components/ui/Container'
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/data/blog'

// ─── SEO ─────────────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.keywords.join(', '),
    alternates: { canonical: `https://digitalmarmat.com/blog/${slug}` },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle,
      description: post.metaDescription,
      images: [post.coverImage],
    },
  }
}

// ─── Category colour ──────────────────────────────────────────────────────────

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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const related = getRelatedPosts(slug, 3)

  const canonicalUrl = `https://digitalmarmat.com/blog/${post.slug}`

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.metaDescription,
    image: post.coverImage,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: post.author,
      url: 'https://digitalmarmat.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Digital Marmat IT Services',
      logo: { '@type': 'ImageObject', url: 'https://digitalmarmat.com/logo.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',  item: 'https://digitalmarmat.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog',  item: 'https://digitalmarmat.com/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: canonicalUrl },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* ── Hero ── */}
      <section className="relative pt-24 overflow-hidden">
        <div className="relative h-[420px] md:h-[500px] w-full">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/50 to-navy/20" />

          {/* Overlay content */}
          <div className="absolute inset-0 flex items-end">
            <Container>
              <div className="pb-10 max-w-3xl">

                <span className={`inline-block text-xs font-semibold px-3 py-1.5 rounded-full mb-4 ${catStyle(post.category)}`}>
                  {post.category}
                </span>

                <h1 className="text-white font-bold leading-tight text-3xl md:text-4xl lg:text-5xl mb-5">
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-5 text-white/60 text-sm">
                  <span className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                      DM
                    </div>
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1.5"><FiCalendar size={14} />{post.dateFormatted}</span>
                  <span className="flex items-center gap-1.5"><FiClock size={14} />{post.readTime} read</span>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </section>

      {/* ── Article body ── */}
      <section className="py-16 bg-white">
        <Container>
          <div className="grid lg:grid-cols-[1fr_320px] gap-14 items-start">

            {/* ── Main article ── */}
            <article>
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-primary/8 text-primary text-xs font-medium rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Intro */}
              <p className="text-lg text-navy/80 leading-relaxed font-medium border-l-4 border-primary pl-5 py-1 mb-10 bg-primary/5 rounded-r-xl pr-5">
                {post.intro}
              </p>

              {/* Sections */}
              <div className="space-y-10">
                {post.sections.map((section, i) => (
                  <div key={i}>
                    <h2 className="text-xl md:text-2xl font-bold text-navy mb-4">{section.heading}</h2>
                    {section.body && (
                      <p className="text-navy/70 leading-relaxed mb-4">{section.body}</p>
                    )}
                    {section.items && section.items.length > 0 && (
                      <ul className="space-y-2.5 mt-3">
                        {section.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-3 text-navy/70">
                            <span className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">✓</span>
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {/* Conclusion */}
              <div className="mt-12 p-7 bg-light-bg rounded-2xl border border-gray-100">
                <h3 className="font-bold text-navy text-lg mb-3">Conclusion</h3>
                <p className="text-navy/70 leading-relaxed">{post.conclusion}</p>
              </div>

              {/* Back link */}
              <div className="mt-10 pt-8 border-t border-gray-100">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-primary font-semibold hover:-translate-x-1 transition-transform"
                >
                  <FiArrowLeft size={17} /> Back to All Articles
                </Link>
              </div>
            </article>

            {/* ── Sidebar ── */}
            <aside className="lg:sticky lg:top-28 space-y-8">

              {/* Author card */}
              <div className="bg-light-bg rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shrink-0">
                    DM
                  </div>
                  <div>
                    <p className="font-bold text-navy">{post.author}</p>
                    <p className="text-navy/50 text-sm">{post.authorRole}</p>
                  </div>
                </div>
                <p className="text-navy/60 text-sm leading-relaxed">
                  The Digital Marmat team brings 3+ years of hands-on experience delivering websites, SEO, and digital strategies for Nepal businesses.
                </p>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-primary to-navy rounded-2xl p-6 text-white">
                <h3 className="font-bold text-lg mb-2">Ready to get started?</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-5">
                  Talk to our team about your project. Free consultation, no commitment.
                </p>
                <Link
                  href="/contact"
                  className="w-full bg-white text-navy px-5 py-3 rounded-full font-semibold text-sm hover:bg-white/90 transition flex items-center justify-center gap-2"
                >
                  Get Free Quote <FiArrowRight size={15} />
                </Link>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <p className="font-semibold text-navy text-sm mb-4">Topics</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1.5 bg-light-bg text-navy/60 text-xs font-medium rounded-full border border-gray-100">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

            </aside>
          </div>
        </Container>
      </section>

      {/* ── Related posts ── */}
      {related.length > 0 && (
        <section className="py-16 bg-light-bg border-t border-gray-100">
          <Container>
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-bold text-navy">More Articles</h2>
              <Link href="/blog" className="text-primary text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                View All <FiArrowRight size={15} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((rp) => (
                <Link key={rp.slug} href={`/blog/${rp.slug}`}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col"
                >
                  <div className="relative h-44 overflow-hidden">
                    <Image src={rp.coverImage} alt={rp.title} fill sizes="33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                    <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${catStyle(rp.category)}`}>
                      {rp.category}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-navy text-sm leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">{rp.title}</h3>
                    <p className="text-navy/50 text-xs flex items-center gap-1.5 mt-auto pt-3 border-t border-gray-100">
                      <FiClock size={11} />{rp.readTime} read
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  )
}
