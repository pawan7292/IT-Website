import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free SEO Audit Tool | Check Your Website Score — Digital Marmat Nepal',
  description: 'Get a free SEO audit for your Nepal business website instantly. Identify technical issues, on-page SEO problems, and growth opportunities. Free tool by Digital Marmat, Kathmandu.',
  keywords: [
    'free SEO audit Nepal', 'website SEO check Nepal',
    'SEO score tool Nepal', 'website audit Kathmandu',
    'free SEO analysis Nepal', 'check website SEO Nepal',
    'website health check Nepal', 'Google ranking check Nepal',
    'SEO test website Nepal', 'how is my website SEO Nepal',
    'website optimization check', 'free SEO tool Nepal',
    'website score Nepal', 'SEO checker Nepal',
    'Nepal website audit free', 'website performance check Nepal',
  ].join(', '),
  openGraph: {
    title: 'Free SEO Audit Tool — Digital Marmat Nepal',
    description: 'Instantly check your Nepal business website\'s SEO health. Find issues and opportunities — completely free from Digital Marmat.',
    url: 'https://digitalmarmat.com/free-seo-audit',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Free SEO Audit Tool — Digital Marmat Nepal' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/opengraph-image'],
  },
  alternates: { canonical: 'https://digitalmarmat.com/free-seo-audit' },
}

export default function FreeSeoAuditLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
