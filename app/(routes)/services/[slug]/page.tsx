import { notFound } from 'next/navigation'
import { getServiceBySlug, getAllServices } from '@/data/services'
import { ServicePageContent } from '@/components/services/ServicePageContent'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  return getAllServices().map((s) => ({ slug: s.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) return {}
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    keywords: service.keywords.join(', '),
    alternates: { canonical: `https://digitalmarmat.com/services/${slug}` },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url: `https://digitalmarmat.com/services/${slug}`,
      images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: service.metaTitle,
      description: service.metaDescription,
    },
  }
}

export default async function ServicePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) notFound()

  const faqSchema = service.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  } : null

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',     item: 'https://digitalmarmat.com' },
      { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://digitalmarmat.com/services' },
      { '@type': 'ListItem', position: 3, name: service.name, item: `https://digitalmarmat.com/services/${slug}` },
    ],
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.metaDescription,
    url: `https://digitalmarmat.com/services/${slug}`,
    provider: {
      '@type': 'Organization',
      name: 'Digital Marmat IT Services',
      url: 'https://digitalmarmat.com',
    },
    areaServed: { '@type': 'Country', name: 'Nepal' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      <ServicePageContent service={service} />
    </>
  )
}
