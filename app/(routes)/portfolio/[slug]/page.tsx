import { notFound } from 'next/navigation'
import { getProjectBySlug, getAllProjects } from '@/data/portfolio'
import PortfolioDetailContent from '@/components/portfolio/PortfolioDetailContent'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return {}

  const title = `${project.title} — Case Study | Digital Marmat`
  const description = `${project.description} See the challenge, our approach, and the results.`

  return {
    title,
    description,
    alternates: { canonical: `https://www.digitalmarmat.com.np/portfolio/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://www.digitalmarmat.com.np/portfolio/${slug}`,
      images: [{ url: project.image, width: 1200, height: 630, alt: project.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function PortfolioDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',      item: 'https://www.digitalmarmat.com.np' },
      { '@type': 'ListItem', position: 2, name: 'Portfolio', item: 'https://www.digitalmarmat.com.np/portfolio' },
      { '@type': 'ListItem', position: 3, name: project.title, item: `https://www.digitalmarmat.com.np/portfolio/${slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <PortfolioDetailContent project={project} />
    </>
  )
}
