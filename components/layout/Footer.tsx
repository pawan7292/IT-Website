import Link from 'next/link'
import Image from 'next/image'
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa6'
import { FiMail, FiPhone, FiMapPin, FiMessageCircle } from 'react-icons/fi'

const services = [
  { name: 'Website Development',   slug: 'website-development'    },
  { name: 'SEO Services',           slug: 'seo-services'           },
  { name: 'Digital Marketing',      slug: 'digital-marketing'      },
  { name: 'Social Media Marketing', slug: 'social-media-marketing' },
  { name: 'UI/UX Design',           slug: 'ui-ux-design'           },
  { name: 'E-Commerce Development', slug: 'ecommerce-development'  },
  { name: 'Software Development',   slug: 'software-development'   },
  { name: 'Mobile App Development', slug: 'mobile-app-development' },
  { name: 'Branding & Design',      slug: 'branding-design'        },
  { name: 'AI Automation',          slug: 'ai-automation'          },
]

type QuickLink = { href: string; label: string; external?: boolean }

const quickLinks: QuickLink[] = [
  { href: '/',          label: 'Home'      },
  { href: '/about',     label: 'About Us'  },
  { href: '/pricing',   label: 'Pricing'   },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/blog',      label: 'Blog'      },
  { href: '/careers',   label: 'Careers'   },
  { href: '/contact',   label: 'Contact'   },
  { href: 'https://dashboard-six-inky-68.vercel.app/', label: 'Admin', external: true },
]

const socials = [
  { icon: FaFacebook,  label: 'Facebook',  href: 'https://www.facebook.com/digitalmarmatit'          },
  { icon: FaInstagram, label: 'Instagram',  href: 'https://www.instagram.com/digitalmarmat.tech/'    },
  { icon: FaLinkedin,  label: 'LinkedIn',   href: 'https://www.linkedin.com/company/digital-marmat/' },
]

const contact = [
  { icon: FiPhone,         text: '+977 9802362213',        href: 'tel:+9779802362213'                   },
  { icon: FiMessageCircle, text: 'WhatsApp Us',            href: 'https://wa.me/9779802362213'          },
  { icon: FiMail,          text: 'info@digitalmarmat.com', href: 'mailto:info@digitalmarmat.com'        },
  { icon: FiMapPin,        text: 'Kathmandu, Nepal',       href: 'https://maps.google.com/?q=Kathmandu' },
]

export function Footer() {
  return (
    <footer className="bg-navy text-white/70">

      {/* ── CTA strip ── */}
      <div className="border-b border-white/10">
        <div className="container-custom py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-white font-bold text-lg">Ready to grow your business digitally?</p>
            <p className="text-white/50 text-sm mt-1">Let's build something amazing together — no commitment required.</p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 bg-primary text-white px-7 py-3 rounded-full font-semibold hover:bg-primary/90 transition text-sm"
          >
            Get a Free Consultation
          </Link>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="container-custom pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-12">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-3">
            <Link href="/" className="inline-flex items-center gap-3 mb-5">
              <Image
                src="/logo.png"
                alt="Digital Marmat IT Service"
                width={44}
                height={44}
                className="h-11 w-11 object-contain shrink-0"
              />
              <div className="flex flex-col leading-none">
                <span className="text-base font-bold tracking-tight">
                  <span className="text-primary">Digital</span>
                  <span className="text-white"> Marmat</span>
                </span>
                <span className="text-[10px] text-white/40 font-medium tracking-[0.18em] uppercase mt-0.5">
                  IT Service
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              Nepal-based IT company delivering world-class web development, digital marketing, SEO, and AI solutions for businesses globally.
            </p>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors duration-200"
                >
                  <s.icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  {l.external ? (
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link
                      href={l.href}
                      className="text-sm hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                    >
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Services — 2-column internal grid so height matches others */}
          <div className="sm:col-span-2 lg:col-span-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Our Services</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-sm hover:text-white hover:translate-x-1 transition-all duration-200 inline-block leading-snug"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Get In Touch</h4>
            <ul className="space-y-4">
              {contact.map((c) => (
                <li key={c.text}>
                  <a
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-3 text-sm hover:text-white transition-colors duration-200 group"
                  >
                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors duration-200">
                      <c.icon size={14} />
                    </span>
                    <span>{c.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} Digital Marmat IT Services. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>
      </div>

    </footer>
  )
}
