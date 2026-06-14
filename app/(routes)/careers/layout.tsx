import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { absolute: 'Careers | IT Jobs in Nepal — Join Digital Marmat Kathmandu' },
  description: 'Join Digital Marmat\'s growing team in Kathmandu, Nepal. Open roles in web development, SEO, digital marketing, UI/UX design, mobile apps, and AI automation. Competitive salary, learning culture.',
  keywords: [
    'IT jobs Nepal', 'web developer jobs Kathmandu',
    'digital marketing jobs Nepal', 'SEO specialist jobs Nepal',
    'UI UX designer jobs Nepal', 'software developer Nepal',
    'app developer jobs Nepal', 'careers digital marmat',
    'IT career Nepal', 'tech jobs Kathmandu 2025',
    'Nepal IT company hiring', 'digital marmat jobs',
    'front end developer Nepal', 'back end developer Nepal',
    'graphic designer jobs Nepal', 'content writer jobs Nepal',
  ].join(', '),
  openGraph: {
    title: 'Careers at Digital Marmat — IT Jobs Nepal',
    description: 'Open roles in web development, digital marketing, SEO, UI/UX and more. Build the future of digital Nepal with us in Kathmandu.',
    url: 'https://www.digitalmarmat.com.np/careers',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Careers at Digital Marmat — IT Jobs Nepal' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/opengraph-image'],
  },
  alternates: { canonical: 'https://www.digitalmarmat.com.np/careers' },
}

export default function CareersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
