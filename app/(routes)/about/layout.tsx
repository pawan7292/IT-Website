import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'About Us | Nepal\'s Trusted IT Company — Digital Marmat' },
  description: 'Digital Marmat is a Kathmandu-based IT company founded in 2021. 50+ projects delivered, 99.9% client satisfaction. Expert team in web development, SEO, digital marketing & AI automation across Nepal.',
  keywords: [
    'about digital marmat', 'digital marmat nepal', 'IT company Nepal',
    'web development company Nepal', 'digital marketing agency Kathmandu',
    'best IT company Kathmandu', 'software company Nepal',
    'IT company founded 2021 Nepal', 'Nepal tech company',
    'digital agency Nepal', 'website company Kathmandu',
    'about us IT services Nepal', 'who is digital marmat',
    'digital marmat team', 'trusted IT company Nepal',
  ].join(', '),
  openGraph: {
    title: 'About Digital Marmat — Nepal\'s Trusted IT Company',
    description: 'Kathmandu-based IT company founded in 2021. 50+ projects delivered, 99.9% satisfaction. Expert web development, SEO & digital marketing team.',
    url: 'https://www.digitalmarmat.com.np/about',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'About Digital Marmat IT Services Nepal' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/opengraph-image'],
  },
  alternates: { canonical: 'https://www.digitalmarmat.com.np/about' },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
