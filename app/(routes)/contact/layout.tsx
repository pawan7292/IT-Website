import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'Contact Us | Digital Marmat IT Services — Kathmandu, Nepal' },
  description: 'Contact Digital Marmat in Kathmandu, Nepal. Call, WhatsApp or email us for website development, SEO, digital marketing, and IT service inquiries. Free consultation, reply within 24 hours.',
  keywords: [
    'contact digital marmat', 'IT company contact Nepal',
    'web development inquiry Kathmandu', 'digital marketing agency contact Nepal',
    'hire web developer Nepal', 'get quote website Nepal',
    'contact IT company Kathmandu', 'website development quote Nepal',
    'free consultation IT Nepal', 'digital marmat phone number',
    'digital marmat email', 'IT support Nepal',
    'website help Nepal', 'SEO consultation Nepal',
  ].join(', '),
  openGraph: {
    title: 'Contact Digital Marmat — Kathmandu, Nepal',
    description: 'Reach out for web development, SEO, digital marketing and IT service inquiries. Based in Kathmandu, Nepal. Free consultation, 24-hour reply.',
    url: 'https://www.digitalmarmat.com.np/contact',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Contact Digital Marmat — Kathmandu, Nepal' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/opengraph-image'],
  },
  alternates: { canonical: 'https://www.digitalmarmat.com.np/contact' },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
