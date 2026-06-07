import { Container } from '@/components/ui/Container'
import Link from 'next/link'
import { getAllServices } from '@/data/services'

export default function ServicesListPage() {
  const services = getAllServices()
  return (
    <>
      <section className="pt-32 pb-16 bg-light-bg">
        <Container>
          <h1 className="text-4xl font-bold">All Services</h1>
          <p className="text-xl text-navy/60 mt-2">Comprehensive digital solutions under one roof.</p>
        </Container>
      </section>
      <section className="section-padding">
        <Container>
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service) => (
              <Link key={service.id} href={`/services/${service.slug}`} className="block p-8 border rounded-2xl hover:shadow-lg transition group">
                <h2 className="text-2xl font-bold group-hover:text-primary transition">{service.name}</h2>
                <p className="text-navy/60 mt-2">{service.description}</p>
                <span className="inline-block mt-4 text-primary font-medium">Learn more →</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
