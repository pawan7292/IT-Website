import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'Industries We Serve | Digital Marmat Nepal' },
  description: 'Specialized website development and digital marketing for hospitals, schools, restaurants, hotels, real estate, NGOs, and travel agencies in Nepal.',
  keywords: [
    'industry specific websites Nepal', 'website for hospitals Nepal', 'website for schools Nepal',
    'website for restaurants Nepal', 'website for real estate Nepal', 'website for NGOs Nepal',
    'website for travel agencies Nepal', 'industry digital marketing Nepal',
  ].join(', '),
  openGraph: {
    title: 'Industries We Serve — Digital Marmat',
    description: 'Specialized website development and digital marketing for hospitals, schools, restaurants, hotels, real estate, NGOs, and travel agencies in Nepal.',
    url: 'https://www.digitalmarmat.com.np/industries',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Digital Marmat — Industries We Serve' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/opengraph-image'],
  },
  alternates: { canonical: 'https://www.digitalmarmat.com.np/industries' },
}

export default function IndustriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
