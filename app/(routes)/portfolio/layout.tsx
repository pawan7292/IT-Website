import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio | 50+ Websites & Projects — Digital Marmat Nepal',
  description: 'Browse 50+ completed projects by Digital Marmat — websites, e-commerce stores, mobile apps, branding campaigns, and digital marketing results for businesses across Nepal and globally.',
  keywords: [
    'digital marmat portfolio', 'web design portfolio Nepal',
    'IT company projects Nepal', 'website examples Kathmandu',
    'best websites Nepal', 'Nepal web design examples',
    'e-commerce projects Nepal', 'mobile app portfolio Nepal',
    'branding projects Nepal', 'website work Nepal',
    'Nepal IT portfolio', 'digital marmat work',
    'website design samples Nepal', 'digital marmat case studies',
    '50 projects Nepal IT', 'web development portfolio Nepal',
  ].join(', '),
  openGraph: {
    title: 'Our Work — Digital Marmat Portfolio | 50+ Projects Nepal',
    description: '50+ successful projects across web development, e-commerce, mobile apps, branding and digital marketing for Nepal businesses.',
    url: 'https://www.digitalmarmat.com.np/portfolio',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Digital Marmat Portfolio — 50+ Projects Nepal' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/opengraph-image'],
  },
  alternates: { canonical: 'https://www.digitalmarmat.com.np/portfolio' },
}

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
