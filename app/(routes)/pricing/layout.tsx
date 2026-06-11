import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing | Website, SEO & Digital Marketing Packages Nepal — Digital Marmat',
  description: 'Transparent, affordable pricing for website development, SEO, digital marketing, and branding in Nepal. Starter, Business & Enterprise plans. No hidden costs. NPR & USD pricing.',
  keywords: [
    'website development cost Nepal', 'website price Nepal',
    'SEO packages Nepal', 'SEO pricing Nepal',
    'digital marketing pricing Nepal', 'affordable website Nepal',
    'cheap website development Nepal', 'website development price Kathmandu',
    'how much does website cost Nepal', 'website banauney kati lagcha',
    'IT services pricing Nepal', 'digital marketing packages Nepal',
    'affordable IT company Nepal', 'website plan Nepal',
    'NPR website cost', 'digital marmat pricing',
  ].join(', '),
  openGraph: {
    title: 'Pricing Plans — Digital Marmat Nepal',
    description: 'Simple, transparent plans for web development, SEO, digital marketing and branding in Nepal. No hidden costs. NPR & USD pricing.',
    url: 'https://www.digitalmarmat.com.np/pricing',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Digital Marmat Pricing — Nepal IT Services' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/opengraph-image'],
  },
  alternates: { canonical: 'https://www.digitalmarmat.com.np/pricing' },
}

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
