import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'Free SEO Audit Tool Nepal | Digital Marmat' },
  description: 'Get a completely free SEO audit for your Nepal business website. We identify every SEO problem and give you a clear action plan. Limited spots available.',
  openGraph: {
    title: 'Free SEO Audit Tool — Digital Marmat Nepal',
    description: 'Instantly check your Nepal business website\'s SEO health. Find issues and opportunities — completely free from Digital Marmat.',
    url: 'https://www.digitalmarmat.com.np/free-seo-audit',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Free SEO Audit Tool — Digital Marmat Nepal' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/opengraph-image'],
  },
  alternates: { canonical: 'https://www.digitalmarmat.com.np/free-seo-audit' },
}

export default function FreeSeoAuditLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
