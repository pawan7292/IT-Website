import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'Free Digital Marketing Score Checker | Digital Marmat' },
  description: 'Take our free 2-minute quiz to see how your website, SEO, social media, and digital marketing strategy stack up — and get personalised recommendations instantly.',
  openGraph: {
    title: 'Digital Marketing Score Checker — Digital Marmat Nepal',
    description: 'Find out how strong your business\'s digital presence really is. Free, instant results, no signup required.',
    url: 'https://www.digitalmarmat.com.np/digital-marketing-score',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Digital Marketing Score Checker — Digital Marmat Nepal' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/opengraph-image'],
  },
  alternates: { canonical: 'https://www.digitalmarmat.com.np/digital-marketing-score' },
}

export default function DigitalMarketingScoreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
