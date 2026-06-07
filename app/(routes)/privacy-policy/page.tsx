import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'

export const metadata: Metadata = {
  title: 'Privacy Policy | Digital Marmat IT Services',
  description: 'Read the Privacy Policy of Digital Marmat IT Services. Learn how we collect, use, and protect your personal data in accordance with applicable laws.',
  alternates: { canonical: 'https://digitalmarmat.com/privacy-policy' },
  openGraph: {
    title: 'Privacy Policy — Digital Marmat IT Services',
    description: 'How Digital Marmat collects, uses, and protects your personal information.',
    url: 'https://digitalmarmat.com/privacy-policy',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Privacy Policy — Digital Marmat' }],
  },
  robots: { index: true, follow: true },
}

const LAST_UPDATED = 'June 5, 2025'
const COMPANY      = 'Digital Marmat IT Services'
const WEBSITE      = 'https://digitalmarmat.com'
const EMAIL        = 'techdigitalmarmat@gmail.com'
const PHONE        = '+977 9802362213'
const ADDRESS      = 'Kathmandu, Bagmati Province, Nepal'

export default function PrivacyPolicyPage() {
  return (
    <main className="pt-28 pb-20 bg-white min-h-screen">
      <Container>
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-12">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Legal</span>
            <h1 className="text-4xl font-bold text-navy mt-2 mb-4">Privacy Policy</h1>
            <p className="text-navy/50 text-sm">Last updated: {LAST_UPDATED}</p>
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl text-navy/70 text-sm leading-relaxed">
              This Privacy Policy describes how <strong>{COMPANY}</strong> ("we", "us", or "our") collects, uses, and protects information when you visit <strong>{WEBSITE}</strong> or use our services.
            </div>
          </div>

          <div className="prose prose-navy max-w-none space-y-10 text-navy/70 leading-relaxed">

            {/* 1 */}
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">1. Information We Collect</h2>
              <p className="mb-3">We collect information you provide directly to us when you:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Fill out our <strong>contact form</strong> (name, email address, phone number, service interest, budget, message)</li>
                <li>Request a <strong>free SEO audit</strong> (name, email, phone, website URL, business name, monthly visitors, goal)</li>
                <li>Use our <strong>website cost calculator</strong></li>
                <li>Apply for a <strong>career</strong> position</li>
                <li>Communicate with us via email, WhatsApp, or phone</li>
              </ul>
              <p className="mt-3">We also automatically collect certain technical information including:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>IP address and browser type</li>
                <li>Pages visited and time spent on the site</li>
                <li>Referring website or search query</li>
                <li>Device type (desktop, mobile, tablet)</li>
              </ul>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">2. How We Use Your Information</h2>
              <p className="mb-3">We use the information we collect to:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Respond to your enquiries and provide the services you request</li>
                <li>Send you a confirmation email when you submit a contact or audit request</li>
                <li>Deliver and improve our IT services, website development, SEO, and digital marketing offerings</li>
                <li>Send project proposals, quotations, and relevant business communications</li>
                <li>Analyse website usage to improve user experience</li>
                <li>Comply with legal obligations</li>
              </ul>
              <p className="mt-3">We do <strong>not</strong> sell, rent, or share your personal data with third parties for marketing purposes.</p>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">3. Cookies & Analytics</h2>
              <p className="mb-3">Our website may use cookies and analytics tools to understand how visitors interact with our content. This may include:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Essential cookies</strong> — necessary for the website to function</li>
                <li><strong>Analytics cookies</strong> — help us understand traffic and usage patterns (e.g., Google Analytics)</li>
              </ul>
              <p className="mt-3">You can disable cookies in your browser settings. Note that disabling cookies may affect some functionality of the website.</p>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">4. Third-Party Services</h2>
              <p className="mb-3">We use select third-party services to operate our website and business:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Google Analytics</strong> — website traffic analysis</li>
                <li><strong>Google Search Console</strong> — search performance monitoring</li>
                <li><strong>Gmail (SMTP)</strong> — sending email notifications and confirmations</li>
                <li><strong>WhatsApp</strong> — client communication</li>
                <li><strong>Vercel / Netlify</strong> — website hosting and deployment</li>
              </ul>
              <p className="mt-3">These services have their own privacy policies and we encourage you to review them. We only share information necessary to provide our services.</p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">5. Data Security</h2>
              <p>We implement appropriate technical and organisational measures to protect your personal information from unauthorised access, disclosure, alteration, or destruction. Your data is transmitted over HTTPS (SSL/TLS encryption). However, no method of transmission over the internet is 100% secure and we cannot guarantee absolute security.</p>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">6. Data Retention</h2>
              <p>We retain your personal information only for as long as necessary to fulfil the purposes described in this policy, or as required by applicable law. Contact form submissions are retained for a period sufficient to respond to your enquiry and maintain business records. You may request deletion of your data at any time (see Section 7).</p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">7. Your Rights</h2>
              <p className="mb-3">You have the right to:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Access</strong> — request a copy of the personal data we hold about you</li>
                <li><strong>Correction</strong> — request correction of inaccurate or incomplete data</li>
                <li><strong>Deletion</strong> — request deletion of your personal data</li>
                <li><strong>Objection</strong> — object to processing of your data for direct marketing</li>
                <li><strong>Portability</strong> — request transfer of your data in a structured, machine-readable format</li>
              </ul>
              <p className="mt-3">To exercise any of these rights, contact us at <a href={`mailto:${EMAIL}`} className="text-primary hover:underline">{EMAIL}</a>.</p>
            </section>

            {/* 8 */}
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">8. Children's Privacy</h2>
              <p>Our website and services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately and we will take steps to delete it.</p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">9. Links to Other Websites</h2>
              <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of those websites. We encourage you to review the privacy policies of any external sites you visit.</p>
            </section>

            {/* 10 */}
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">10. Governing Law</h2>
              <p>This Privacy Policy is governed by the laws of Nepal. Any disputes arising from this policy shall be subject to the jurisdiction of the courts of Kathmandu, Nepal.</p>
            </section>

            {/* 11 */}
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">11. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. The "Last updated" date at the top of this page will reflect any changes. We encourage you to review this policy periodically. Continued use of our website after any changes constitutes your acceptance of the updated policy.</p>
            </section>

            {/* 12 */}
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">12. Contact Us</h2>
              <p className="mb-4">If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:</p>
              <div className="bg-light-bg rounded-2xl p-6 border border-gray-100 space-y-2 text-sm">
                <p><strong className="text-navy">{COMPANY}</strong></p>
                <p>{ADDRESS}</p>
                <p>Email: <a href={`mailto:${EMAIL}`} className="text-primary hover:underline">{EMAIL}</a></p>
                <p>Phone: <a href="tel:+9779802362213" className="text-primary hover:underline">{PHONE}</a></p>
                <p>Website: <a href={WEBSITE} className="text-primary hover:underline">{WEBSITE}</a></p>
              </div>
            </section>

          </div>

          {/* Footer nav */}
          <div className="mt-14 pt-8 border-t border-gray-100 flex flex-wrap gap-4 text-sm">
            <Link href="/terms" className="text-primary font-semibold hover:underline">Terms of Service →</Link>
            <Link href="/contact" className="text-navy/50 hover:text-primary transition">Contact Us</Link>
          </div>

        </div>
      </Container>
    </main>
  )
}
