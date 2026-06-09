export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'ProfessionalService'],
    '@id': 'https://www.digitalmarmat.com.np/#organization',
    name: 'Digital Marmat IT Services',
    alternateName: ['Digital Marmat', 'Digital Marmat Nepal'],
    url: 'https://www.digitalmarmat.com.np',
    slogan: 'We Build Websites That Actually Work',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.digitalmarmat.com.np/logo.png',
      width: 200,
      height: 200,
    },
    image: 'https://www.digitalmarmat.com.np/logo.png',
    description: 'Nepal\'s trusted IT company providing website development, SEO, digital marketing, UI/UX design, mobile app development, e-commerce, branding, and AI automation solutions. Based in Kathmandu, serving clients across Nepal and globally since 2021.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Kathmandu',
      addressLocality: 'Kathmandu',
      addressRegion: 'Bagmati Province',
      postalCode: '44600',
      addressCountry: 'NP',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 27.7172,
      longitude: 85.3240,
    },
    hasMap: 'https://maps.google.com/?q=P8P3%2BCW+Kathmandu',
    telephone: '+977-9802362213',
    email: 'info@digitalmarmat.com',
    // Nepal work week: Sunday–Friday (Saturday half-day)
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '16:00',
      },
    ],
    priceRange: '$$',
    currenciesAccepted: 'NPR, USD',
    paymentAccepted: 'Cash, Bank Transfer, eSewa, Khalti, Fonepay, Credit Card',
    areaServed: [
      { '@type': 'Country',  name: 'Nepal' },
      { '@type': 'City',     name: 'Kathmandu' },
      { '@type': 'City',     name: 'Lalitpur' },
      { '@type': 'City',     name: 'Bhaktapur' },
      { '@type': 'City',     name: 'Pokhara' },
      { '@type': 'City',     name: 'Birgunj' },
      { '@type': 'City',     name: 'Biratnagar' },
      { '@type': 'City',     name: 'Butwal' },
      { '@type': 'City',     name: 'Dharan' },
      { '@type': 'City',     name: 'Hetauda' },
    ],
    knowsAbout: [
      'Website Development Nepal',
      'Search Engine Optimization Nepal',
      'Digital Marketing Nepal',
      'Social Media Marketing Nepal',
      'UI/UX Design Nepal',
      'E-Commerce Development Nepal',
      'Custom Software Development Nepal',
      'Mobile App Development Nepal',
      'Branding & Logo Design Nepal',
      'AI Automation Nepal',
      'Next.js Development',
      'React Development',
      'WordPress Development',
      'Shopify Development',
      'eSewa Payment Integration',
      'Khalti Payment Integration',
      'Google Ads Management Nepal',
      'Facebook Ads Nepal',
      'Local SEO Nepal',
      'Technical SEO Nepal',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'IT Services Nepal',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Website Development',    url: 'https://www.digitalmarmat.com.np/services/website-development'   } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'SEO Services',           url: 'https://www.digitalmarmat.com.np/services/seo-services'          } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Digital Marketing',      url: 'https://www.digitalmarmat.com.np/services/digital-marketing'     } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Social Media Marketing', url: 'https://www.digitalmarmat.com.np/services/social-media-marketing' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Mobile App Development', url: 'https://www.digitalmarmat.com.np/services/mobile-app-development' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'UI/UX Design',           url: 'https://www.digitalmarmat.com.np/services/ui-ux-design'          } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'E-Commerce Development', url: 'https://www.digitalmarmat.com.np/services/ecommerce-development'  } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Branding & Design',      url: 'https://www.digitalmarmat.com.np/services/branding-design'       } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Software Development',   url: 'https://www.digitalmarmat.com.np/services/software-development'  } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'AI Automation',          url: 'https://www.digitalmarmat.com.np/services/ai-automation'         } },
      ],
    },
    sameAs: [
      'https://www.facebook.com/digitalmarmatit',
      'https://www.instagram.com/digitalmarmat.tech/',
      'https://www.linkedin.com/company/digital-marmat/',
    ],
    founder: [
      { '@type': 'Person', name: 'Pawan Thapa'   },
      { '@type': 'Person', name: 'Sabina Phuyal' },
      { '@type': 'Person', name: 'Rajan Khadka'  },
    ],
    foundingDate: '2021',
    foundingLocation: {
      '@type': 'Place',
      name: 'Kathmandu, Nepal',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Kathmandu',
        addressCountry: 'NP',
      },
    },
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      minValue: 5,
      maxValue: 20,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '50',
      bestRating: '5',
      worstRating: '1',
    },
    review: [
      {
        '@type': 'Review',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        author: { '@type': 'Person', name: 'Rajesh Sharma' },
        reviewBody: 'Digital Marmat built our corporate website from scratch. Fast delivery, beautiful design, and the SEO work has already pushed us to page 1 for our key keywords in Nepal.',
      },
      {
        '@type': 'Review',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        author: { '@type': 'Person', name: 'Sita Thapa' },
        reviewBody: 'The e-commerce site they built for us handles eSewa and Khalti payments flawlessly. Our online sales have doubled since launch. Highly recommend for any Nepal business.',
      },
      {
        '@type': 'Review',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        author: { '@type': 'Person', name: 'Anish Karki' },
        reviewBody: 'Best digital marketing agency in Kathmandu. Our Google Ads ROI improved dramatically within the first month. The team is responsive, transparent, and results-driven.',
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
