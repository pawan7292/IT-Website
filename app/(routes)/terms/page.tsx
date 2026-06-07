import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'

export const metadata: Metadata = {
  title: 'Terms of Service | Digital Marmat IT Services',
  description: 'Read the Terms of Service for Digital Marmat IT Services. Understand the terms governing use of our website and professional IT services in Nepal.',
  alternates: { canonical: 'https://digitalmarmat.com/terms' },
  openGraph: {
    title: 'Terms of Service — Digital Marmat IT Services',
    description: 'Terms and conditions governing the use of Digital Marmat IT Services website and professional services.',
    url: 'https://digitalmarmat.com/terms',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Terms of Service — Digital Marmat' }],
  },
  robots: { index: true, follow: true },
}

const LAST_UPDATED = 'June 5, 2025'
const COMPANY      = 'Digital Marmat IT Services'
const WEBSITE      = 'https://digitalmarmat.com'
const EMAIL        = 'techdigitalmarmat@gmail.com'
const PHONE        = '+977 9802362213'
const ADDRESS      = 'Kathmandu, Bagmati Province, Nepal'

export default function TermsPage() {
  return (
    <main className="pt-28 pb-20 bg-white min-h-screen">
      <Container>
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-12">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Legal</span>
            <h1 className="text-4xl font-bold text-navy mt-2 mb-4">Terms of Service</h1>
            <p className="text-navy/50 text-sm">Last updated: {LAST_UPDATED}</p>
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl text-navy/70 text-sm leading-relaxed">
              Please read these Terms of Service carefully before using the website at <strong>{WEBSITE}</strong> or engaging <strong>{COMPANY}</strong> for any services. By accessing our website or engaging our services, you agree to be bound by these terms.
            </div>
          </div>

          <div className="prose prose-navy max-w-none space-y-10 text-navy/70 leading-relaxed">

            {/* 1 */}
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">1. About Us</h2>
              <p>{COMPANY} is a professional IT services company registered and operating in Kathmandu, Nepal. We provide website development, SEO, digital marketing, UI/UX design, mobile app development, branding, software development, and AI automation services to clients in Nepal and globally.</p>
              <div className="mt-4 bg-light-bg rounded-xl p-4 border border-gray-100 text-sm space-y-1">
                <p><strong className="text-navy">Company:</strong> {COMPANY}</p>
                <p><strong className="text-navy">Address:</strong> {ADDRESS}</p>
                <p><strong className="text-navy">Email:</strong> <a href={`mailto:${EMAIL}`} className="text-primary hover:underline">{EMAIL}</a></p>
                <p><strong className="text-navy">Phone:</strong> {PHONE}</p>
              </div>
            </section>

            {/* 2 */}
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">2. Use of This Website</h2>
              <p className="mb-3">By using this website, you agree that you will:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Use the website for lawful purposes only</li>
                <li>Not attempt to gain unauthorised access to any part of the website or its servers</li>
                <li>Not transmit any harmful, offensive, or disruptive content</li>
                <li>Not use automated tools to scrape or extract content without prior written permission</li>
                <li>Not impersonate {COMPANY} or any of its employees or representatives</li>
              </ul>
              <p className="mt-3">We reserve the right to restrict access to the website for any user who violates these terms.</p>
            </section>

            {/* 3 */}
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">3. Our Services</h2>
              <p className="mb-3">We offer the following professional IT services:</p>
              <ul className="list-disc pl-5 space-y-1.5 columns-2">
                <li>Website Development</li>
                <li>SEO Services</li>
                <li>Digital Marketing</li>
                <li>Social Media Marketing</li>
                <li>UI/UX Design</li>
                <li>E-Commerce Development</li>
                <li>Software Development</li>
                <li>Mobile App Development</li>
                <li>Branding & Design</li>
                <li>AI Automation</li>
              </ul>
              <p className="mt-3">All services are subject to a separate written agreement or proposal that outlines the specific scope, timeline, deliverables, and payment terms for each project.</p>
            </section>

            {/* 4 */}
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">4. Project Agreements & Proposals</h2>
              <p className="mb-3">Every project engagement is governed by a project-specific proposal or contract which includes:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Detailed scope of work and deliverables</li>
                <li>Project timeline and milestones</li>
                <li>Payment schedule and amounts</li>
                <li>Revision policy</li>
                <li>Ownership and intellectual property terms</li>
              </ul>
              <p className="mt-3">A project commences only after the proposal is accepted in writing (email or signed document) and the agreed deposit is received.</p>
            </section>

            {/* 5 */}
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">5. Payments & Pricing</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>All prices are quoted in <strong>Nepali Rupees (NPR)</strong> unless otherwise stated. International clients may be quoted in USD.</li>
                <li>A <strong>50% advance payment</strong> is required before project commencement unless otherwise agreed in writing.</li>
                <li>The remaining balance is due upon project completion or as per the milestone schedule in the project agreement.</li>
                <li>Accepted payment methods: <strong>Cash, Bank Transfer, eSewa, Khalti</strong>.</li>
                <li>Late payments may incur a delay in project delivery. We reserve the right to pause work on overdue accounts.</li>
                <li>All quoted prices are exclusive of any applicable government taxes unless otherwise stated.</li>
              </ul>
            </section>

            {/* 6 */}
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">6. Revisions & Change Requests</h2>
              <p>The number of included revisions is specified in the project proposal. Additional revisions or scope changes beyond the agreed terms will be quoted separately and require written approval before work commences. Major scope changes may affect the project timeline and total cost.</p>
            </section>

            {/* 7 */}
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">7. Intellectual Property</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Upon receipt of full payment, the client receives full ownership of all custom deliverables created specifically for their project (designs, code, content).</li>
                <li>{COMPANY} retains the right to use completed projects in our portfolio and marketing materials unless the client specifically requests otherwise in writing.</li>
                <li>All proprietary tools, frameworks, libraries, and methodologies developed by {COMPANY} remain our exclusive intellectual property.</li>
                <li>Third-party components (open-source libraries, stock images, fonts) are subject to their respective licences.</li>
              </ul>
            </section>

            {/* 8 */}
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">8. Client Responsibilities</h2>
              <p className="mb-3">Successful project delivery depends on the client fulfilling their responsibilities, including:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Providing accurate and complete project requirements</li>
                <li>Supplying content (text, images, logos) within the agreed timeline</li>
                <li>Providing timely feedback and approvals at each milestone</li>
                <li>Providing access to necessary platforms, hosting accounts, or third-party tools</li>
                <li>Making payments as per the agreed schedule</li>
              </ul>
              <p className="mt-3">Delays caused by the client's failure to fulfil these responsibilities may extend the project timeline without fault on our part.</p>
            </section>

            {/* 9 */}
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">9. Cancellation & Refunds</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Either party may cancel a project by providing written notice.</li>
                <li>Work completed up to the point of cancellation will be billed at the agreed rate.</li>
                <li>Advance payments are <strong>non-refundable</strong> once work has commenced unless {COMPANY} is unable to deliver the agreed scope.</li>
                <li>If {COMPANY} cancels a project without client fault, any unused portion of the advance will be refunded within 14 business days.</li>
              </ul>
            </section>

            {/* 10 */}
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">10. Post-Launch Support & Maintenance</h2>
              <p>Unless a separate maintenance agreement is in place, {COMPANY} provides <strong>30 days of post-launch support</strong> for bug fixes directly related to the delivered work at no extra cost. Support after this period, or for issues caused by third-party changes, client modifications, or new feature requests, is billed separately.</p>
            </section>

            {/* 11 */}
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">11. Limitation of Liability</h2>
              <p className="mb-3">To the maximum extent permitted by applicable law:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>{COMPANY} shall not be liable for any indirect, incidental, consequential, or punitive damages arising from use of our services or website.</li>
                <li>Our total liability for any claim shall not exceed the total amount paid by the client for the specific service giving rise to the claim.</li>
                <li>We are not responsible for third-party service outages (hosting providers, payment gateways, social media platforms) that affect project delivery.</li>
                <li>SEO and digital marketing results are not guaranteed, as search engine rankings depend on many factors outside our control.</li>
              </ul>
            </section>

            {/* 12 */}
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">12. Confidentiality</h2>
              <p>Both parties agree to keep confidential all non-public information shared during the course of a project engagement. This includes business strategies, technical specifications, client data, and pricing. This obligation survives the termination of any project agreement.</p>
            </section>

            {/* 13 */}
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">13. Website Content & Accuracy</h2>
              <p>The content on this website is provided for general information purposes only. While we strive to keep information accurate and up to date, we make no warranties about the completeness, accuracy, or suitability of the information. Pricing and service details shown on the website are indicative and subject to change without notice.</p>
            </section>

            {/* 14 */}
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">14. Governing Law & Dispute Resolution</h2>
              <p>These Terms of Service are governed by and construed in accordance with the laws of <strong>Nepal</strong>. Any disputes arising from these terms or our services shall first be attempted to be resolved through mutual discussion. If no resolution is reached, disputes shall be subject to the exclusive jurisdiction of the courts of <strong>Kathmandu, Nepal</strong>.</p>
            </section>

            {/* 15 */}
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">15. Changes to These Terms</h2>
              <p>We reserve the right to update these Terms of Service at any time. The "Last updated" date at the top of this page reflects the most recent revision. Continued use of our website or services after any changes constitutes your acceptance of the revised terms. We encourage you to review this page periodically.</p>
            </section>

            {/* 16 */}
            <section>
              <h2 className="text-xl font-bold text-navy mb-3">16. Contact Us</h2>
              <p className="mb-4">If you have any questions about these Terms of Service, please contact us:</p>
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
            <Link href="/privacy-policy" className="text-primary font-semibold hover:underline">Privacy Policy →</Link>
            <Link href="/contact" className="text-navy/50 hover:text-primary transition">Contact Us</Link>
          </div>

        </div>
      </Container>
    </main>
  )
}
