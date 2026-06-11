import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Website Cost Calculator Nepal | Estimate Your Project Price — Digital Marmat',
  description: 'Use our free website cost calculator to get an instant price estimate for your web project in Nepal. Transparent NPR pricing — no hidden fees, no commitment required.',
  keywords: [
    'website cost calculator Nepal', 'website price Nepal',
    'website development cost Nepal', 'web development price Kathmandu',
    'how much does a website cost Nepal', 'website kati lagcha Nepal',
    'website quote Nepal', 'website estimate Nepal',
    'web project cost NPR', 'affordable website price Nepal',
    'website cost 2025 Nepal', 'digital marmat calculator',
    'website budget Nepal', 'web design price Nepal',
  ].join(', '),
  openGraph: {
    title: 'Website Cost Calculator — Digital Marmat Nepal',
    description: 'Instantly estimate your website development cost in Nepal (NPR). Transparent pricing, no hidden fees, no commitment.',
    url: 'https://www.digitalmarmat.com.np/website-cost-calculator',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Website Cost Calculator Nepal — Digital Marmat' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/opengraph-image'],
  },
  alternates: { canonical: 'https://www.digitalmarmat.com.np/website-cost-calculator' },
}

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
