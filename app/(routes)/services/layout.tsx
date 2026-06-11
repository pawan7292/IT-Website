import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'IT Services Nepal | Web Dev, SEO, Digital Marketing & More — Digital Marmat',
  description: 'Full-service IT agency in Kathmandu, Nepal. Website development, SEO, digital marketing, social media, UI/UX design, e-commerce, mobile apps, branding & AI automation — all under one roof.',
  keywords: [
    'IT services Nepal', 'IT services Kathmandu', 'web development services Nepal',
    'SEO services Nepal', 'digital marketing services Nepal',
    'social media marketing Nepal', 'mobile app development Nepal',
    'UI UX design Nepal', 'e-commerce development Nepal',
    'branding services Nepal', 'AI automation Nepal',
    'software development Nepal', 'best IT services Kathmandu',
    'affordable IT services Nepal', 'digital services Nepal',
    'website development Pokhara', 'website development Lalitpur',
    'website development Bhaktapur', 'tech services Nepal',
  ].join(', '),
  openGraph: {
    title: 'IT Services Nepal — Digital Marmat',
    description: 'Web development, SEO, digital marketing, mobile apps, UI/UX design, e-commerce and AI automation under one roof in Nepal.',
    url: 'https://www.digitalmarmat.com.np/services',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Digital Marmat IT Services Nepal' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/opengraph-image'],
  },
  alternates: { canonical: 'https://www.digitalmarmat.com.np/services' },
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
