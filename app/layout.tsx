import type { Metadata } from 'next'
import './globals.css'
import ClientLayout from '@/components/layout/ClientLayout'
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp'
import { LocalBusinessSchema } from '@/components/seo/LocalBusinessSchema'

export const metadata: Metadata = {
  title: {
    default: 'Digital Marmat IT Services | Web Development & Digital Marketing Nepal',
    template: '%s | Digital Marmat IT Services',
  },
  description: 'Nepal\'s trusted IT company in Kathmandu. Expert website development, SEO, digital marketing, mobile apps, UI/UX design & AI automation — 50+ projects delivered, 99.9% client satisfaction.',
  keywords: [
    // Core service + location
    'IT company Nepal', 'IT company Kathmandu', 'digital agency Nepal',
    'web development Nepal', 'website development Nepal', 'website design Nepal',
    'website development Kathmandu', 'web design Kathmandu',
    'website development Pokhara', 'website development Lalitpur',
    // SEO
    'SEO services Nepal', 'SEO company Nepal', 'SEO agency Kathmandu',
    'Google ranking Nepal', 'local SEO Nepal', 'SEO expert Nepal',
    // Marketing
    'digital marketing Nepal', 'digital marketing Kathmandu',
    'Google Ads Nepal', 'Facebook Ads Nepal', 'online marketing Nepal',
    // Apps & software
    'mobile app development Nepal', 'app development Nepal',
    'software development Nepal', 'software company Nepal',
    // Design & e-commerce
    'UI UX design Nepal', 'logo design Nepal', 'branding Nepal',
    'ecommerce website Nepal', 'online store Nepal', 'Shopify Nepal',
    // AI
    'AI automation Nepal', 'chatbot Nepal',
    // Trust / brand
    'best IT company Nepal', 'affordable website Nepal',
    'digital marmat', 'Digital Marmat IT Services',
  ],
  authors: [{ name: 'Digital Marmat IT Services', url: 'https://digitalmarmat.com' }],
  creator: 'Digital Marmat IT Services',
  publisher: 'Digital Marmat IT Services',
  metadataBase: new URL('https://digitalmarmat.com'),
  alternates: { canonical: 'https://digitalmarmat.com' },
  openGraph: {
    title: 'Digital Marmat IT Services | Web Development & Digital Marketing Nepal',
    description: 'Top-rated IT company in Nepal delivering world-class websites, SEO, digital marketing & AI automation solutions.',
    url: 'https://digitalmarmat.com',
    siteName: 'Digital Marmat IT Services',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Digital Marmat IT Services' }],
    locale: 'en_US',
    alternateLocale: ['ne_NP'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Marmat IT Services | Nepal',
    description: 'Top-rated IT company in Nepal — web development, SEO, digital marketing & AI automation.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  verification: {
    google: 'AkPoVJAks05rEYsrwfInUTMFH9kPV-nrwD2o0LVK3IE',
  },
  other: {
    'geo.region':   'NP-BA',
    'geo.placename':'Kathmandu',
    'geo.position': '27.7172;85.3240',
    'ICBM':         '27.7172, 85.3240',
    'place:location:latitude':  '27.7172',
    'place:location:longitude': '85.3240',
  },
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Digital Marmat IT Services',
  url: 'https://digitalmarmat.com',
  description: 'Top-rated IT company in Kathmandu, Nepal — web development, SEO, digital marketing & AI automation.',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: 'https://digitalmarmat.com/blog?q={search_term_string}' },
    'query-input': 'required name=search_term_string',
  },
  publisher: {
    '@type': 'Organization',
    '@id': 'https://digitalmarmat.com/#organization',
    name: 'Digital Marmat IT Services',
    url: 'https://digitalmarmat.com',
    logo: { '@type': 'ImageObject', url: 'https://digitalmarmat.com/logo.png' },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kathmandu',
      addressRegion: 'Bagmati Province',
      addressCountry: 'NP',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+977-9802362213',
      contactType: 'customer service',
      areaServed: 'NP',
      availableLanguage: ['English', 'Nepali'],
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="alternate" hrefLang="en-NP" href="https://digitalmarmat.com" />
        <link rel="alternate" hrefLang="en"    href="https://digitalmarmat.com" />
        <link rel="alternate" hrefLang="x-default" href="https://digitalmarmat.com" />
      </head>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <ClientLayout>
          {children}
          <FloatingWhatsApp />
          <LocalBusinessSchema />
        </ClientLayout>
      </body>
    </html>
  )
}
