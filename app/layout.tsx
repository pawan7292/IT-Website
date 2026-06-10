import type { Metadata } from 'next'
import './globals.css'
import ClientLayout from '@/components/layout/ClientLayout'
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp'
import { LocalBusinessSchema } from '@/components/seo/LocalBusinessSchema'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import ClarityScript from '@/components/ClarityScript'

export const metadata: Metadata = {
  title: {
    default: 'Digital Marmat IT Services | Web Development & Digital Marketing Nepal',
    template: '%s | Digital Marmat IT Services',
  },
  description: "Nepal's trusted IT company in Kathmandu. Web development, SEO & digital marketing experts. 50+ projects delivered. Get a free consultation today.",
  authors: [{ name: 'Digital Marmat IT Services', url: 'https://www.digitalmarmat.com.np' }],
  creator: 'Digital Marmat IT Services',
  publisher: 'Digital Marmat IT Services',
  metadataBase: new URL('https://www.digitalmarmat.com.np'),
  alternates: { canonical: 'https://www.digitalmarmat.com.np' },
  openGraph: {
    title: 'Digital Marmat IT Services | Web Development & Digital Marketing Nepal',
    description: 'Top-rated IT company in Nepal delivering world-class websites, SEO, digital marketing & AI automation solutions.',
    url: 'https://www.digitalmarmat.com.np',
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
  url: 'https://www.digitalmarmat.com.np',
  description: 'Top-rated IT company in Kathmandu, Nepal — web development, SEO, digital marketing & AI automation.',
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: 'https://www.digitalmarmat.com.np/blog?q={search_term_string}' },
    'query-input': 'required name=search_term_string',
  },
  publisher: {
    '@type': 'Organization',
    '@id': 'https://www.digitalmarmat.com.np/#organization',
    name: 'Digital Marmat IT Services',
    url: 'https://www.digitalmarmat.com.np',
    logo: { '@type': 'ImageObject', url: 'https://www.digitalmarmat.com.np/logo.png' },
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
        <link rel="alternate" hrefLang="en-NP" href="https://www.digitalmarmat.com.np" />
        <link rel="alternate" hrefLang="en"    href="https://www.digitalmarmat.com.np" />
        <link rel="alternate" hrefLang="x-default" href="https://www.digitalmarmat.com.np" />
      </head>
      <body className="font-sans">
        <GoogleAnalytics />
        <ClarityScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <ClientLayout>
          {children}
        </ClientLayout>
        <FloatingWhatsApp />
        <LocalBusinessSchema />
      </body>
    </html>
  )
}
