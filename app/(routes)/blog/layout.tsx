import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Digital Marketing, SEO & Web Dev Insights Nepal — Digital Marmat',
  description: 'Expert tips, guides and insights on web development, SEO, digital marketing, social media, e-commerce and AI automation for Nepal businesses. Updated regularly by the Digital Marmat team.',
  keywords: [
    'digital marketing blog Nepal', 'SEO tips Nepal',
    'web development blog Nepal', 'IT blog Kathmandu',
    'website tips Nepal', 'SEO guide Nepal 2025',
    'digital marketing guide Nepal', 'how to rank on Google Nepal',
    'Nepal business digital tips', 'website development tips Nepal',
    'online marketing blog Nepal', 'e-commerce tips Nepal',
    'AI automation blog Nepal', 'social media tips Nepal',
    'digital marmat blog', 'IT insights Nepal',
  ].join(', '),
  openGraph: {
    title: 'Blog — Digital Marmat | SEO, Web Dev & Marketing Insights Nepal',
    description: 'Expert tips on web development, SEO, digital marketing and AI automation from Nepal\'s leading IT team. Updated regularly.',
    url: 'https://digitalmarmat.com/blog',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Digital Marmat Blog — SEO & Web Dev Insights Nepal' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/opengraph-image'],
  },
  alternates: { canonical: 'https://digitalmarmat.com/blog' },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
