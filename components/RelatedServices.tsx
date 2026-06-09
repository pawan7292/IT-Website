import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'
import { serviceLinks } from '@/lib/serviceLinks'

export function RelatedServices({ slug }: { slug: string }) {
  const related = serviceLinks[`/services/${slug}`]
  if (!related || related.length === 0) return null

  return (
    <section className="py-16 bg-light-bg border-t border-gray-100">
      <div className="container-custom">
        <h2 className="text-navy font-bold text-2xl mb-8">Related Services</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {related.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all group flex items-center justify-between"
            >
              <span className="font-semibold text-navy group-hover:text-primary transition-colors">{service.title}</span>
              <FiArrowRight size={18} className="text-primary shrink-0 group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
