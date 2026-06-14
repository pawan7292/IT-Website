import { notFound } from 'next/navigation'
import { getIndustryBySlug, getAllIndustries } from '@/data/industries'
import { IndustryPageContent } from '@/components/industries/IndustryPageContent'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  return getAllIndustries().map((i) => ({ slug: i.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const industry = getIndustryBySlug(slug)
  if (!industry) return {}
  return {
    title: industry.metaTitle,
    description: industry.metaDescription,
    keywords: industry.keywords.join(', '),
    alternates: { canonical: `https://www.digitalmarmat.com.np/industries/${slug}` },
    openGraph: {
      title: industry.metaTitle,
      description: industry.metaDescription,
      url: `https://www.digitalmarmat.com.np/industries/${slug}`,
      images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: industry.metaTitle,
      description: industry.metaDescription,
    },
  }
}

export default async function IndustryPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const industry = getIndustryBySlug(slug)
  if (!industry) notFound()

  const faqSchema = industry.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: industry.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  } : null

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',       item: 'https://www.digitalmarmat.com.np' },
      { '@type': 'ListItem', position: 2, name: 'Industries', item: 'https://www.digitalmarmat.com.np/industries' },
      { '@type': 'ListItem', position: 3, name: industry.name, item: `https://www.digitalmarmat.com.np/industries/${slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <IndustryPageContent industry={industry} />
    </>
  )
}
