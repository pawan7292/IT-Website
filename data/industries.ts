export interface IndustryData {
  slug: string
  name: string
  industryLabel: string
  title: string
  heroDescription: string
  challenges: { title: string; description: string }[]
  solutions: { title: string; description: string }[]
  features: string[]
  faqs: { question: string; answer: string }[]
  relatedServiceSlugs: string[]
  metaTitle: string
  metaDescription: string
  keywords: string[]
}

export const industriesData: IndustryData[] = [
  // ── 1. Healthcare ────────────────────────────────────────────────────────
  {
    slug: 'healthcare',
    name: 'Healthcare',
    industryLabel: 'Hospitals, Clinics & Pharmacies',
    title: 'Website Development & Digital Marketing for Hospitals & Clinics in Nepal',
    heroDescription: 'Patients search Google before they pick a hospital or doctor. We build fast, trustworthy websites and local SEO campaigns that help healthcare providers in Nepal get found, build trust, and fill appointment slots.',
    challenges: [
      { title: 'Invisible on Google',          description: 'Most clinics rely on word-of-mouth — when someone searches "clinic near me" or "best dentist in Kathmandu", they never show up.' },
      { title: 'No Online Appointment Booking', description: 'Patients have to call during office hours just to book a check-up, leading to missed leads after hours.' },
      { title: 'Outdated, Unclear Information', description: 'Old websites with no doctor profiles, department details, or service lists leave patients confused before they even visit.' },
      { title: 'Low Trust From First-Time Visitors', description: 'Without reviews, credentials, and a professional design, new patients are hesitant to choose an unfamiliar provider.' },
      { title: 'Poor Mobile Experience',        description: 'Most patients search on their phones — slow, hard-to-navigate sites lose visitors before they even see your services.' },
    ],
    solutions: [
      { title: 'Online Appointment Booking',   description: 'A simple booking form or scheduling widget that lets patients request appointments any time, day or night.' },
      { title: 'Doctor & Department Profiles', description: 'Dedicated pages for each doctor and department, building credibility and helping patients choose the right specialist.' },
      { title: 'Local SEO for "Near Me" Searches', description: 'Google Business Profile optimization and location-based SEO so you appear when patients search for care nearby.' },
      { title: 'WhatsApp & Call Integration',   description: 'One-tap WhatsApp and call buttons make it effortless for patients to reach you directly from their phone.' },
      { title: 'Health Blog & Patient Resources', description: 'Educational content that builds trust, answers common questions, and ranks for health-related searches.' },
      { title: 'Mobile-First, Fast-Loading Design', description: 'A clean, accessible website that loads quickly on any device — critical for patients searching urgently.' },
    ],
    features: [
      'Online appointment / consultation booking form',
      'Doctor profiles with specialties & qualifications',
      'Department & service pages (OPD, emergency, labs, pharmacy, etc.)',
      'Google Maps & local SEO setup for "near me" searches',
      'WhatsApp click-to-chat for quick patient queries',
      'Health tips blog for SEO and patient education',
      'Patient testimonials & trust signals',
      'Mobile-first, fast, secure (SSL) website',
    ],
    faqs: [
      { question: 'Can you build an appointment booking system for our clinic?', answer: 'Yes. We build booking forms that email or notify your front desk instantly, and can integrate with calendar tools or a custom admin dashboard if you need more advanced scheduling.' },
      { question: 'Do you help hospitals show up for "near me" searches?',       answer: 'Yes — this is local SEO. We optimize your Google Business Profile, add location schema markup, and create location-specific content so your hospital or clinic appears in local search results and Google Maps.' },
      { question: 'Can the website include multiple doctors and departments?',  answer: 'Absolutely. We design scalable structures with individual profile pages for every doctor and department, making it easy for patients to find the right specialist.' },
      { question: 'Is patient data handled securely on the website?',           answer: 'Yes. Every site we build includes SSL encryption, secure form handling, and we follow data-minimization best practices — we only collect what\'s needed for appointment requests.' },
      { question: 'How long does a hospital or clinic website take to build?',  answer: 'A standard clinic website with appointment booking and a handful of department pages typically takes 3–5 weeks. Larger hospital sites with many departments and doctors may take 6–8 weeks.' },
    ],
    relatedServiceSlugs: ['website-development', 'seo-services', 'digital-marketing'],
    metaTitle: 'Website Development for Hospitals & Clinics in Nepal | Digital Marmat',
    metaDescription: 'Websites and local SEO for hospitals, clinics, and pharmacies in Nepal. Online appointment booking, doctor profiles, and Google "near me" visibility. Free consultation.',
    keywords: [
      'website for hospitals Nepal', 'clinic website Nepal', 'hospital website development Nepal',
      'healthcare website Nepal', 'doctor website Nepal', 'clinic SEO Nepal',
      'medical website Kathmandu', 'appointment booking website Nepal',
      'pharmacy website Nepal', 'hospital digital marketing Nepal',
    ],
  },

  // ── 2. Education ─────────────────────────────────────────────────────────
  {
    slug: 'education',
    name: 'Education',
    industryLabel: 'Schools, Colleges & Training Institutes',
    title: 'Website Development & Digital Marketing for Schools & Colleges in Nepal',
    heroDescription: 'Parents and students research schools online before ever visiting. We build modern, informative websites and marketing campaigns that help educational institutions in Nepal attract more admissions and build a trusted reputation.',
    challenges: [
      { title: 'Admissions Info Is Hard to Find', description: 'Parents can\'t easily find fee structures, admission deadlines, or application forms — so they call competitors instead.' },
      { title: 'No Online Application Process',  description: 'Without an online inquiry or application form, every lead requires a phone call or in-person visit, slowing down enrollment.' },
      { title: 'Outdated Notices & Events',       description: 'Static, rarely-updated websites mean parents and students miss important notices, results, and events.' },
      { title: 'Weak Social Media Presence',      description: 'Competing schools showcase events, achievements, and campus life on social media — institutions without this presence look less active.' },
      { title: 'Low Visibility in Local Search',  description: 'When parents search "best school in [city]" or "college for [program] Nepal", the institution doesn\'t appear.' },
    ],
    solutions: [
      { title: 'Admission & Inquiry Forms',     description: 'Easy-to-use online forms for admission inquiries, applications, and prospectus downloads — captured directly to your email or CRM.' },
      { title: 'Notice Board & Events Section', description: 'A simple, editable section for exam results, notices, holidays, and events — keeping parents and students always informed.' },
      { title: 'Faculty & Course Pages',        description: 'Dedicated pages showcasing teaching staff, course curriculum, and facilities that build confidence in your academic quality.' },
      { title: 'Local & Program SEO',           description: 'Optimization for searches like "best +college Nepal" or "[program] college in [city]" to attract prospective students actively searching.' },
      { title: 'Social Media Management',       description: 'Regular posts covering campus life, events, achievements, and announcements — building an active, trustworthy online presence.' },
      { title: 'Photo & Video Galleries',        description: 'Showcase campus facilities, labs, sports, and events with rich media that helps families picture their child there.' },
    ],
    features: [
      'Online admission inquiry / application form',
      'Notice board & events section (easy to update)',
      'Faculty profiles & course/program pages',
      'Fee structure & scholarship information pages',
      'Photo and video gallery of campus & events',
      'Local SEO for "school/college in [city]" searches',
      'Social media content calendar & management',
      'Mobile-friendly design for parents browsing on phones',
    ],
    faqs: [
      { question: 'Can you build an online admission form for our institution?', answer: 'Yes. We build inquiry and application forms tailored to your admission process — submissions can be emailed to your admissions team or stored in a simple dashboard.' },
      { question: 'Can we update notices and events ourselves after launch?',     answer: 'Yes. We set up an easy-to-use content section (or CMS) so your staff can publish notices, results, and events without needing a developer.' },
      { question: 'Do you help schools rank for local searches?',                answer: 'Yes — we optimize for searches like "best school in [your city]" or "[program] college Nepal" through local SEO, Google Business Profile setup, and content targeting parent search behavior.' },
      { question: 'Can you manage our school\'s Facebook and Instagram pages?',  answer: 'Yes. We offer social media management packages covering content creation, posting schedules, and community engagement to keep your institution visible and active online.' },
      { question: 'How much does a school or college website cost?',             answer: 'Pricing depends on the number of pages, features (admissions forms, galleries, notice boards), and design complexity. Most institutional websites start from NPR 35,000 — contact us for a tailored quote.' },
    ],
    relatedServiceSlugs: ['website-development', 'seo-services', 'social-media-marketing'],
    metaTitle: 'Website Development for Schools & Colleges in Nepal | Digital Marmat',
    metaDescription: 'Websites and digital marketing for schools, colleges, and training institutes in Nepal. Admission forms, notice boards, faculty pages, and local SEO. Free consultation.',
    keywords: [
      'school website Nepal', 'college website development Nepal', 'education website Nepal',
      'website for schools Kathmandu', 'admission website Nepal', 'school SEO Nepal',
      'training institute website Nepal', 'school digital marketing Nepal',
      'college website Nepal', 'education marketing Nepal',
    ],
  },

  // ── 3. Restaurants & Hotels ─────────────────────────────────────────────
  {
    slug: 'restaurants-hotels',
    name: 'Restaurants & Hotels',
    industryLabel: 'Restaurants, Cafes & Hotels',
    title: 'Website Development & Social Media Marketing for Restaurants & Hotels in Nepal',
    heroDescription: 'Hungry customers and travelers search online before they choose where to eat or stay. We build mouth-watering websites, manage social media, and optimize local SEO so restaurants and hotels in Nepal get discovered and booked.',
    challenges: [
      { title: 'No Online Menu or Booking',     description: 'Customers can\'t see your menu, prices, or room availability online — so they choose a competitor who makes it easy.' },
      { title: 'Invisible on Google Maps',      description: 'When people search "restaurant near me" or "hotel in [city]", your business doesn\'t appear in local results.' },
      { title: 'Inconsistent Social Media',      description: 'Inactive or unappealing Instagram/Facebook pages fail to showcase food, ambiance, and rooms — a huge missed opportunity for hospitality businesses.' },
      { title: 'No Reservation or Inquiry System', description: 'Without an online table or room reservation option, potential guests give up and book elsewhere.' },
      { title: 'Poor Photos & Presentation',     description: 'Low-quality images and outdated designs make even great food or rooms look unappealing online.' },
    ],
    solutions: [
      { title: 'Digital Menu & Online Ordering', description: 'A beautifully presented digital menu, with optional online ordering or delivery partner integration.' },
      { title: 'Table & Room Reservation Forms', description: 'Simple booking/reservation forms that send requests straight to your team — no missed bookings.' },
      { title: 'Local SEO & Google Maps Setup', description: 'Optimized Google Business Profile and local SEO so you rank for "restaurant near me" and "hotel in [city]" searches.' },
      { title: 'Instagram & Facebook Management', description: 'Consistent, scroll-stopping content showcasing your food, drinks, rooms, and experience — driving bookings and walk-ins.' },
      { title: 'Photo & Video Content',          description: 'Professional-style photography guidance and editing to make your food and spaces look irresistible online.' },
      { title: 'Reviews & Reputation Management', description: 'Strategies to encourage happy customers to leave reviews — building trust and improving local rankings.' },
    ],
    features: [
      'Digital menu with categories, prices & photos',
      'Table reservation / room booking inquiry form',
      'Google Maps & local SEO ("restaurant near me")',
      'Instagram & Facebook content management',
      'Photo gallery of food, drinks, rooms & ambiance',
      'Online ordering / delivery platform integration',
      'Customer review collection & display',
      'Mobile-first design for on-the-go diners & travelers',
    ],
    faqs: [
      { question: 'Can you add an online menu to our website?',                  answer: 'Yes. We design clean, easy-to-browse digital menus with categories, photos, and prices — and can update them anytime your menu changes.' },
      { question: 'Do you help restaurants and hotels rank on Google Maps?',     answer: 'Yes — we optimize your Google Business Profile, add location and review schema, and create content targeting "near me" searches so local customers find you first.' },
      { question: 'Can you manage our Instagram and Facebook pages?',            answer: 'Yes. We offer full social media management — content creation, posting schedules, and engagement — tailored to showcase your food, drinks, and ambiance.' },
      { question: 'Can you integrate online ordering or delivery apps?',         answer: 'Yes. We can link your website to popular delivery platforms or build a simple online ordering form depending on your operational setup.' },
      { question: 'How quickly can a restaurant or hotel website be launched?',  answer: 'A menu-and-info website with a reservation form typically takes 2–4 weeks. Hotels with room listings and booking inquiries may take 4–6 weeks depending on content readiness.' },
    ],
    relatedServiceSlugs: ['website-development', 'social-media-marketing', 'seo-services'],
    metaTitle: 'Website & Social Media Marketing for Restaurants & Hotels in Nepal | Digital Marmat',
    metaDescription: 'Websites, online menus, booking forms, and social media management for restaurants, cafes, and hotels in Nepal. Get found on Google Maps and Instagram. Free consultation.',
    keywords: [
      'restaurant website Nepal', 'hotel website development Nepal', 'cafe website Nepal',
      'restaurant digital marketing Nepal', 'hotel SEO Nepal', 'restaurant social media Nepal',
      'online menu website Nepal', 'restaurant near me SEO Nepal',
      'hotel booking website Nepal', 'hospitality marketing Nepal',
    ],
  },

  // ── 4. Real Estate ──────────────────────────────────────────────────────
  {
    slug: 'real-estate',
    name: 'Real Estate',
    industryLabel: 'Real Estate Agencies & Property Developers',
    title: 'Website Development & Digital Marketing for Real Estate Businesses in Nepal',
    heroDescription: 'Property buyers and renters start their search on Google. We build searchable property listing websites and run targeted digital marketing campaigns that connect Nepal real estate businesses with serious buyers and tenants.',
    challenges: [
      { title: 'Listings Buried in PDFs or Social Posts', description: 'Properties scattered across Facebook posts and PDFs are hard to browse, search, or share — buyers give up quickly.' },
      { title: 'No Search & Filter Options',     description: 'Without filters for location, price, or property type, visitors can\'t find what they\'re looking for and leave.' },
      { title: 'No Lead Capture System',          description: 'Interested buyers have no easy way to inquire — missed leads mean missed sales and rentals.' },
      { title: 'Low Visibility for Location Searches', description: '"Land for sale in [location]" or "apartment for rent in [city]" searches never surface your listings.' },
      { title: 'No Map Integration',              description: 'Buyers want to see exactly where a property is located — without maps, they can\'t evaluate the location.' },
    ],
    solutions: [
      { title: 'Searchable Property Listings',  description: 'A clean property catalog with filters for location, price, type, and size — making browsing effortless.' },
      { title: 'Lead Capture & Inquiry Forms',  description: 'Every listing includes an inquiry form that routes directly to your sales team — no missed opportunities.' },
      { title: 'Google Maps Integration',       description: 'Embedded maps on every listing so buyers can instantly see the location, nearby landmarks, and surroundings.' },
      { title: 'Location-Based SEO',            description: 'Optimization for searches like "house for sale in [location] Nepal" or "land for sale [city]" to attract high-intent buyers.' },
      { title: 'Property Photo & Video Tours',  description: 'Galleries and embedded video walkthroughs that help buyers shortlist properties before visiting in person.' },
      { title: 'Agent & Developer Profiles',    description: 'Profile pages for agents or developer companies that build credibility and trust with prospective buyers.' },
    ],
    features: [
      'Searchable property listings with filters (location, price, type)',
      'Property detail pages with photos, specs & Google Maps',
      'Inquiry / "Request a Viewing" lead capture forms',
      'Location-based SEO for "[property type] in [city]" searches',
      'Agent or developer profile pages',
      'Featured & sold/rented property status tags',
      'Mobile-first design for on-the-go property searches',
      'Integration with WhatsApp for instant inquiries',
    ],
    faqs: [
      { question: 'Can you build a searchable property listing website?',        answer: 'Yes. We build listing websites with filters for location, price range, and property type, plus individual property pages with photos, details, and maps.' },
      { question: 'Can the listings be managed without a developer?',            answer: 'Yes. We set up an admin panel or CMS so your team can add, edit, and mark properties as sold or rented without needing technical help.' },
      { question: 'Do you optimize for location-specific searches?',             answer: 'Yes — this is a core part of real estate SEO. We create and optimize content for searches like "land for sale in [location] Nepal" or "apartment for rent in [city]".' },
      { question: 'Can you integrate Google Maps for each property?',            answer: 'Yes. Every property listing can include an embedded map showing the exact location, which builds buyer confidence and improves engagement.' },
      { question: 'How long does a real estate website take to build?',         answer: 'A listing website with search/filter functionality and lead capture typically takes 4–6 weeks, depending on the number of property categories and custom features.' },
    ],
    relatedServiceSlugs: ['website-development', 'software-development', 'seo-services'],
    metaTitle: 'Website Development for Real Estate Businesses in Nepal | Digital Marmat',
    metaDescription: 'Property listing websites and digital marketing for real estate agencies and developers in Nepal. Searchable listings, lead capture forms, and location SEO. Free consultation.',
    keywords: [
      'real estate website Nepal', 'property website development Nepal', 'real estate SEO Nepal',
      'property listing website Nepal', 'real estate digital marketing Nepal',
      'land for sale website Nepal', 'real estate agency website Nepal',
      'property portal Nepal', 'real estate lead generation Nepal',
    ],
  },

  // ── 5. NGOs & Non-Profits ───────────────────────────────────────────────
  {
    slug: 'ngo-nonprofit',
    name: 'NGOs & Non-Profits',
    industryLabel: 'NGOs, INGOs & Non-Profit Organizations',
    title: 'Website Development & Branding for NGOs & Non-Profits in Nepal',
    heroDescription: 'Donors, volunteers, and partner organizations research NGOs online before getting involved. We build storytelling websites, donation pages, and brand identities that help non-profits in Nepal build trust and grow their impact.',
    challenges: [
      { title: 'Weak Storytelling',              description: 'Without a clear way to share mission, projects, and impact, it\'s hard for donors and partners to understand why your work matters.' },
      { title: 'No Donation or Volunteer Forms', description: 'Interested supporters have no easy way to donate or sign up to volunteer — reducing engagement and funding.' },
      { title: 'Outdated or Missing Project Pages', description: 'Funders want to see what projects you\'ve completed and their impact — old or missing project pages hurt credibility.' },
      { title: 'Inconsistent Branding',          description: 'A weak or inconsistent visual identity makes it harder to be taken seriously by international donors and government partners.' },
      { title: 'Low Visibility for Grant Applications', description: 'Many grant and partnership applications require a professional web presence — without one, opportunities are lost.' },
    ],
    solutions: [
      { title: 'Mission & Impact Storytelling',  description: 'A homepage and about page that clearly communicate your mission, history, and the real-world impact of your work.' },
      { title: 'Donation & Volunteer Forms',     description: 'Simple, trustworthy donation pages (with eSewa/Khalti or international gateways) and volunteer sign-up forms.' },
      { title: 'Project & Program Pages',        description: 'Dedicated pages for each project showing goals, activities, beneficiaries, and outcomes — built for donor and grant reporting.' },
      { title: 'Brand Identity Design',          description: 'A professional logo, color palette, and brand guidelines that build recognition and trust with partners and donors.' },
      { title: 'Social Media for Awareness',     description: 'Content strategies that raise awareness for campaigns, events, and fundraising drives across social platforms.' },
      { title: 'Annual Report & Resource Pages', description: 'Downloadable annual reports, publications, and resources presented professionally for transparency and credibility.' },
    ],
    features: [
      'Mission, vision & impact storytelling pages',
      'Donation page with local (eSewa/Khalti) & international payment options',
      'Volunteer & partnership sign-up forms',
      'Project/program pages with goals & outcomes',
      'Team & board member profile pages',
      'Resource library for reports & publications',
      'Brand identity (logo, colors, guidelines)',
      'Social media content for campaigns & events',
    ],
    faqs: [
      { question: 'Can you add a donation page with local payment options?',     answer: 'Yes. We integrate eSewa, Khalti, and Fonepay alongside international options like PayPal or Stripe, so both local and international donors can contribute easily.' },
      { question: 'Can the website showcase multiple projects and their impact?', answer: 'Yes. We build structured project/program pages that present goals, activities, and outcomes — useful for both website visitors and grant reporting.' },
      { question: 'Do you design logos and branding for NGOs?',                  answer: 'Yes. We create complete brand identities — logo, color palette, typography, and guidelines — that help your organization look professional to donors and partners.' },
      { question: 'Can supporters sign up to volunteer through the website?',    answer: 'Yes. We build volunteer and partnership inquiry forms that route submissions directly to your team via email or a simple dashboard.' },
      { question: 'Do you offer discounted pricing for non-profits?',            answer: 'We understand budget constraints for NGOs and are happy to discuss flexible packages — reach out for a conversation about your goals and budget.' },
    ],
    relatedServiceSlugs: ['website-development', 'branding-design', 'social-media-marketing'],
    metaTitle: 'Website Development for NGOs & Non-Profits in Nepal | Digital Marmat',
    metaDescription: 'Websites, branding, and donation pages for NGOs and non-profits in Nepal. Mission storytelling, project pages, volunteer forms, and eSewa/Khalti donations. Free consultation.',
    keywords: [
      'NGO website Nepal', 'non-profit website development Nepal', 'NGO branding Nepal',
      'donation website Nepal', 'NGO digital marketing Nepal', 'INGO website Nepal',
      'charity website Nepal', 'NGO website design Kathmandu',
      'non-profit branding Nepal', 'NGO logo design Nepal',
    ],
  },

  // ── 6. Travel & Trekking Agencies ──────────────────────────────────────
  {
    slug: 'travel-trekking',
    name: 'Travel & Trekking',
    industryLabel: 'Travel Agencies & Trekking Companies',
    title: 'Website Development & SEO for Travel & Trekking Agencies in Nepal',
    heroDescription: 'International trekkers and travelers research and book trips online — often months in advance. We build stunning itinerary-driven websites and SEO campaigns that help Nepal\'s trekking and travel agencies get found by travelers worldwide.',
    challenges: [
      { title: 'Competing With Global Booking Platforms', description: 'Large international platforms dominate search results, making it hard for independent agencies to be found directly.' },
      { title: 'No Clear Itinerary Pages',       description: 'Without day-by-day itineraries, pricing, and inclusions clearly laid out, travelers can\'t evaluate or compare your packages.' },
      { title: 'Weak English-Language SEO',      description: 'Most international searches happen in English — agencies without optimized English content miss this traffic entirely.' },
      { title: 'No Online Inquiry/Booking',       description: 'Travelers expect to inquire or request a booking online — agencies without this lose leads to competitors who make it easy.' },
      { title: 'Underwhelming Visual Presentation', description: 'Trekking and travel are visual experiences — low-quality photos and outdated designs fail to inspire trust or excitement.' },
    ],
    solutions: [
      { title: 'Itinerary & Package Pages',      description: 'Detailed day-by-day itinerary pages with pricing, inclusions/exclusions, difficulty level, and best seasons — built to convert browsers into bookings.' },
      { title: 'Inquiry & Booking Request Forms', description: 'Simple multi-step inquiry forms that capture trip dates, group size, and preferences — sent straight to your team.' },
      { title: 'International SEO (English Content)', description: 'Keyword research and content optimized for how international trekkers search — "Everest Base Camp trek cost", "best time to trek Annapurna", and more.' },
      { title: 'Photo & Video Galleries',        description: 'Stunning visual galleries and embedded videos that showcase the experience and build excitement before booking.' },
      { title: 'Reviews & Trust Signals',        description: 'Display of past traveler reviews, certifications, and safety information to build confidence with international visitors.' },
      { title: 'Multi-Currency & Multi-Language Ready', description: 'Designs that can display pricing in multiple currencies and support multiple languages for a global audience.' },
    ],
    features: [
      'Itinerary pages with day-by-day plans & pricing',
      'Trip inquiry / booking request forms',
      'English-language SEO for international search terms',
      'Photo & video galleries for treks and destinations',
      'Traveler reviews & testimonials section',
      'Blog content targeting trekking & travel keywords',
      'Mobile-first design for travelers researching on the go',
      'WhatsApp integration for quick international inquiries',
    ],
    faqs: [
      { question: 'Can you build itinerary pages for each trekking package?',    answer: 'Yes. We design detailed itinerary pages with day-by-day breakdowns, pricing, inclusions/exclusions, difficulty levels, and photo galleries for each trip you offer.' },
      { question: 'Do you optimize for international (English) search terms?',  answer: 'Yes — this is essential for travel businesses. We research and target the exact phrases international trekkers search, like "Everest Base Camp trek itinerary" or "Annapurna Circuit cost".' },
      { question: 'Can travelers send booking inquiries through the website?',   answer: 'Yes. We build inquiry forms that capture trip details, preferred dates, and group size, sending submissions directly to your team via email or WhatsApp.' },
      { question: 'Can the website support multiple currencies?',               answer: 'Yes. We can display pricing in multiple currencies (USD, EUR, NPR, etc.) to make it easier for international travelers to understand costs.' },
      { question: 'How long does a travel agency website take to build?',       answer: 'A website with 5–10 itinerary pages, galleries, and inquiry forms typically takes 4–6 weeks. Larger sites with many packages may take longer depending on content readiness.' },
    ],
    relatedServiceSlugs: ['website-development', 'seo-services', 'digital-marketing'],
    metaTitle: 'Website Development & SEO for Travel & Trekking Agencies in Nepal | Digital Marmat',
    metaDescription: 'Websites and international SEO for trekking and travel agencies in Nepal. Itinerary pages, booking inquiry forms, and English-language SEO for global travelers. Free consultation.',
    keywords: [
      'trekking agency website Nepal', 'travel agency website development Nepal',
      'trekking website design Nepal', 'travel agency SEO Nepal',
      'tour operator website Nepal', 'trekking company digital marketing Nepal',
      'travel website Kathmandu', 'Nepal trekking SEO',
      'itinerary website design Nepal', 'travel agency marketing Nepal',
    ],
  },

  // ── 7. Startups ──────────────────────────────────────────────────────────
  {
    slug: 'startups',
    name: 'Startups',
    industryLabel: 'Startups & New Businesses',
    title: 'Website & App Development for Startups in Nepal',
    heroDescription: 'Launching a startup means moving fast on a tight budget while still looking credible to investors and customers. We build MVP websites, apps, and brand identities that help Nepali startups launch quickly, look professional, and scale as they grow.',
    challenges: [
      { title: 'No Budget for a Full Tech Team',          description: 'Hiring in-house developers, designers, and marketers isn\'t realistic in the early stage — but you still need all three to launch properly.' },
      { title: 'Need to Launch Fast',                     description: 'Investors and early customers expect a working product quickly. Long development timelines kill momentum and burn runway.' },
      { title: 'Looking Credible to Investors & Customers', description: 'A weak, template-looking website or app undermines trust during fundraising pitches and first sales conversations.' },
      { title: 'Uncertain Future Requirements',           description: 'Startups pivot. Building something too rigid or over-engineered early on wastes money when the direction changes.' },
      { title: 'No In-House Marketing or SEO Knowledge',  description: 'Founders are busy building the product — there\'s rarely time to figure out SEO, social media, or analytics from scratch.' },
    ],
    solutions: [
      { title: 'MVP-Focused Website & App Development', description: 'Lean, fast-to-build websites and apps that cover your core value proposition first, so you can launch and start getting feedback sooner.' },
      { title: 'Scalable Architecture From Day One',     description: 'Built on modern frameworks (Next.js, React Native) that can grow with your business without needing a costly rebuild later.' },
      { title: 'Investor-Ready Branding & Design',       description: 'A professional logo, brand identity, and polished website that builds instant credibility in pitch decks and first impressions.' },
      { title: 'Affordable Phased Development',          description: 'Launch with core features now, and add advanced functionality in later phases as your budget and user base grow.' },
      { title: 'SEO & Social Media Setup From Launch',   description: 'Get discovered on Google and social platforms from day one, instead of playing catch-up months after launch.' },
      { title: 'Ongoing Support as You Grow',            description: 'Flexible maintenance and feature additions on demand — pay for development only when you need it.' },
    ],
    features: [
      'MVP website or web app built for fast launch',
      'Scalable Next.js / React architecture ready to grow',
      'Investor-ready branding, logo, and pitch-deck-matching design',
      'Mobile app development (iOS & Android) for startups ready to scale',
      'SEO foundation set up from day one',
      'Social media presence setup & content templates',
      'Lead capture forms & analytics integrated from launch',
      'Flexible, phased development to match your runway',
    ],
    faqs: [
      { question: 'We have a very limited budget — can you still help us?',          answer: 'Yes. We work with startups to scope an MVP that covers your core functionality within your budget, then add features in phases as you raise funding or generate revenue.' },
      { question: 'Can you build just an MVP first and add features later?',         answer: 'Absolutely — this is how we recommend most startups approach development. We design the architecture to support future features from the start, so later additions don\'t require a rebuild.' },
      { question: 'Do you build mobile apps for startups, or only websites?',        answer: 'Both. Our [mobile app development](/services/mobile-app-development) team builds iOS and Android apps, and many startups start with a web app or website before investing in native apps.' },
      { question: 'Can you help with branding too, not just the website or app?',    answer: 'Yes — our [branding & design](/services/branding-design) service covers logo design, brand guidelines, and visual identity, often bundled with your MVP build for a consistent launch.' },
      { question: 'How fast can you launch a startup website or MVP?',               answer: 'A focused MVP website typically takes 2–4 weeks. Web or mobile app MVPs depend on feature scope, but we always prioritize getting a usable version live as quickly as possible.' },
    ],
    relatedServiceSlugs: ['website-development', 'software-development', 'mobile-app-development'],
    metaTitle: 'Website & App Development for Startups in Nepal | Digital Marmat',
    metaDescription: 'MVP websites, apps, and branding for Nepali startups — launch fast, look credible to investors and customers, and scale with affordable, phased development. Free consultation.',
    keywords: [
      'startup website development Nepal', 'MVP development Nepal', 'website for startups Nepal',
      'app development for startups Nepal', 'startup branding Nepal', 'IT solutions for startups Nepal',
      'startup web design Nepal', 'tech for startups Nepal', 'startup digital marketing Nepal',
      'build MVP Nepal',
    ],
  },
]

export const getAllIndustries = () => industriesData
export const getIndustryBySlug = (slug: string) => industriesData.find((i) => i.slug === slug)
