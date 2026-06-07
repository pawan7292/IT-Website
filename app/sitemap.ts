import { MetadataRoute } from 'next'
import { blogPosts } from '@/data/blog'

const base = 'https://digitalmarmat.com'

const serviceSlugs = [
  'website-development',
  'seo-services',
  'digital-marketing',
  'social-media-marketing',
  'ui-ux-design',
  'ecommerce-development',
  'software-development',
  'mobile-app-development',
  'branding-design',
  'ai-automation',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: base,                              lastModified: now, priority: 1.0, changeFrequency: 'weekly'  },
    { url: `${base}/about`,                   lastModified: now, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${base}/services`,                lastModified: now, priority: 0.9, changeFrequency: 'weekly'  },
    { url: `${base}/pricing`,                 lastModified: now, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${base}/portfolio`,               lastModified: now, priority: 0.8, changeFrequency: 'weekly'  },
    { url: `${base}/blog`,                    lastModified: now, priority: 0.8, changeFrequency: 'daily'   },
    { url: `${base}/contact`,                 lastModified: now, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${base}/careers`,                 lastModified: now, priority: 0.7, changeFrequency: 'weekly'  },
    { url: `${base}/free-seo-audit`,          lastModified: now, priority: 0.8, changeFrequency: 'monthly' },
    { url: `${base}/website-cost-calculator`, lastModified: now, priority: 0.75, changeFrequency: 'monthly' },
    { url: `${base}/privacy-policy`,          lastModified: now, priority: 0.3, changeFrequency: 'yearly'  },
    { url: `${base}/terms`,                   lastModified: now, priority: 0.3, changeFrequency: 'yearly'  },
  ]

  const servicePages: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: `${base}/services/${slug}`,
    lastModified: now,
    priority: 0.85,
    changeFrequency: 'monthly',
  }))

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    priority: 0.75,
    changeFrequency: 'monthly',
  }))

  return [...staticPages, ...servicePages, ...blogPages]
}
