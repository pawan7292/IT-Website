'use client'
import { useState } from 'react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

export default function CalculatorPage() {
  const [type, setType] = useState('basic')
  const [pages, setPages] = useState(5)
  const [ecommerce, setEcommerce] = useState(false)
  const [seo, setSeo] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  let basePrice = type === 'basic' ? 500 : type === 'business' ? 1500 : 3500
  let total = basePrice + (pages - 5) * 20 + (ecommerce ? 800 : 0) + (seo ? 500 : 0)

  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); await fetch('/api/calculator', { method: 'POST', body: JSON.stringify({ type, pages, ecommerce, seo, total }) }); setSubmitted(true) }

  return (
    <>
      <section className="pt-32 pb-16 bg-light-bg">
        <Container>
          <h1 className="text-4xl font-bold">Website Cost Calculator</h1>
          <p className="text-navy/60">Estimate your project budget instantly.</p>
        </Container>
      </section>
      <section className="pb-20">
        <Container>
          <div className="max-w-3xl mx-auto">
            {submitted ? (
              <div className="bg-green-50 p-8 rounded-xl text-center">
                <p className="text-green-700">Thank you! We'll contact you with a detailed quote.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-semibold">Website Type</label>
                  <select className="w-full p-3 border rounded-lg" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="basic">Basic (5 pages) – $500</option>
                    <option value="business">Business (10-15 pages) – $1500</option>
                    <option value="enterprise">Enterprise (Custom) – $3500+</option>
                  </select>
                </div>
                <div>
                  <label>Number of Pages: {pages}</label>
                  <input type="range" min="1" max="50" value={pages} onChange={(e) => setPages(parseInt(e.target.value))} className="w-full" />
                </div>
                <div>
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={ecommerce} onChange={(e) => setEcommerce(e.target.checked)} />
                    E-Commerce (+$800)
                  </label>
                </div>
                <div>
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={seo} onChange={(e) => setSeo(e.target.checked)} />
                    SEO Package (+$500)
                  </label>
                </div>
                <div className="bg-light-bg p-6 rounded-xl">
                  <p className="text-2xl font-bold">Estimated Cost: ${total}</p>
                  <p className="text-sm text-navy/60">*Final price depends on specific requirements.</p>
                </div>
                <Button type="submit" size="lg" className="w-full">Request Quote</Button>
              </form>
            )}
          </div>
        </Container>
      </section>
    </>
  )
}
