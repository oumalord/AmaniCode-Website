export const WHATSAPP_NUMBER = '254700000000'; // TODO: replace with AmaniCode's real WhatsApp Business number
export const CONTACT_EMAIL = 'hello@amanicode.co.ke'; // TODO: replace with real contact email
export const CONTACT_PHONE = '+254 700 000 000'; // TODO: replace with real phone number

export interface Solution { title: string; desc: string; link?: string; }
export const solutions: Solution[] = [
  { title: 'Healthcare & Medical Systems', desc: 'Digital tools for care delivery, health monitoring, medical research and community health.' },
  { title: 'Education & LMS', desc: 'Learning platforms that connect educators, learners, courses and progress.' },
  { title: 'AgriTech & Food Systems', desc: 'Technology for agriculture, food production, markets and the communities they support.' },
  { title: 'FinTech & Digital Payments', desc: 'Secure financial services and payment experiences designed for wider access.' },
  { title: 'Public & Civic Technology', desc: 'Useful digital services that help public institutions serve people better.' },
  { title: 'Research & Data Platforms', desc: 'Collect, understand and share information to support better decisions and discovery.' },
  { title: 'Custom Software', desc: 'Purpose-built software for the unique challenges of any organization or field.' },
  { title: 'Mobile Applications', desc: 'Accessible mobile experiences for people, teams and communities.' },
];

export interface ProductOS { id: string; name: string; forWho: string[]; features: string[]; link?: string; }
export const products: ProductOS[] = [
  { id: 'malariawatch', name: 'Malaria Watch', forWho: ['Healthcare teams', 'Researchers', 'Communities'], features: ['Monitoring', 'Reporting', 'Data insights'], link: 'https://malariawatch.vercel.app' },
  { id: 'kgga', name: 'Kenya Girl Guides Association LMS', forWho: ['Schools', 'Trainers', 'Girl Guides'], features: ['Learning', 'Courses', 'Progress tracking'], link: 'https://kggalms.vercel.app' },
  { id: 'safigroom', name: 'Braidys', forWho: ['Salons', 'Barbers', 'Spas', 'Beauty businesses'], features: ['POS', 'Appointments', 'Staff', 'Commissions'], link: 'https://braidysms.vercel.app' },
  { id: 'amanitech', name: 'Star Electronics shop POS', forWho: ['Electronics shops', 'Phone retailers', 'Computer shops'], features: ['POS', 'Inventory', 'Repairs', 'Warranty'], link: 'https://star-electronics-africa.vercel.app/#/login' },
  { id: 'digishield', name: 'Digishield', forWho: ['Businesses', 'Organisations', 'Digital teams'], features: ['Security', 'Digital protection', 'Business tools'], link: 'https://digishield.co.ke' },
];

export interface SiteSettings {
  whatsappNumber: string;
  contactEmail: string;
  projects: ProductOS[];
  solutions: Solution[];
}

export const defaultSiteSettings: SiteSettings = {
  whatsappNumber: '+254746542433',
  contactEmail: CONTACT_EMAIL,
  projects: products.map((product) => ({ ...product })),
  solutions: solutions.map((solution) => ({ ...solution, link: '#/contact' })),
};

export interface Industry { name: string; desc: string; recommended: string; features: string[]; }
export const industries: Industry[] = [
  { name: 'Retail', desc: 'General and specialty retail businesses managing sales, stock and staff across one or many branches.', recommended: 'AmaniRetail OS', features: ['POS', 'Inventory', 'Multi-branch', 'Reports'] },
  { name: 'Electronics', desc: 'Phone, laptop and computer shops that need serial and warranty tracking.', recommended: 'AmaniTech OS', features: ['IMEI tracking', 'Repairs', 'Warranty', 'POS'] },
  { name: 'Fashion', desc: 'Boutiques and clothing stores managing size, colour and seasonal stock.', recommended: 'AmaniFashion OS', features: ['Variant inventory', 'Loyalty', 'E-commerce'] },
  { name: 'Beauty', desc: 'Salons, barbers and spas coordinating appointments, staff and commissions.', recommended: 'SafiGroom OS', features: ['Appointments', 'Staff', 'Commissions'] },
  { name: 'Hospitality', desc: 'Hotels, guesthouses and restaurants managing bookings and service.', recommended: 'Custom Business OS', features: ['Bookings', 'Billing', 'Staff'] },
  { name: 'Healthcare & Medical Research', desc: 'Care providers, public health teams and researchers working with health information and services.', recommended: 'Health & Research Platforms', features: ['Patient services', 'Health data', 'Monitoring', 'Research'] },
  { name: 'Education & Learning', desc: 'Schools, training centres and learning organizations connecting educators and learners.', recommended: 'Education & LMS', features: ['Learning platforms', 'Courses', 'Progress', 'Digital resources'] },
  { name: 'Agriculture & Food Systems', desc: 'Farmers, researchers and food-system organizations connecting production, knowledge and markets.', recommended: 'AgriTech Platforms', features: ['Crop insights', 'Produce tracking', 'Market access', 'Climate data'] },
  { name: 'Finance & FinTech', desc: 'Financial institutions and innovators creating secure, inclusive digital financial services.', recommended: 'FinTech & Payments', features: ['Digital payments', 'Financial access', 'Transactions', 'Security'] },
  { name: 'Public Sector & Civic Services', desc: 'Public institutions and communities improving access to essential information and services.', recommended: 'Civic Technology', features: ['Digital services', 'Public information', 'Community access', 'Data'] },
  { name: 'Research & Nonprofits', desc: 'Research teams and mission-led organizations delivering programs and sharing evidence.', recommended: 'Research & Data Platforms', features: ['Research data', 'Programs', 'Monitoring', 'Reporting'] },
  { name: 'Professional Services', desc: 'Consultancies and agencies managing clients and billing.', recommended: 'CRM + Billing', features: ['Clients', 'Invoicing', 'Projects'] },
  { name: 'Property', desc: 'Property managers tracking units, tenants and payments.', recommended: 'Custom Business OS', features: ['Units', 'Tenants', 'Payments'] },
  { name: 'Restaurants', desc: 'Restaurants and cafes managing orders, tables and kitchen flow.', recommended: 'Custom Business OS', features: ['POS', 'Orders', 'Inventory'] },
  { name: 'Wholesale', desc: 'Wholesalers managing bulk orders and supplier relationships.', recommended: 'AmaniHome OS', features: ['Bulk orders', 'Suppliers', 'Delivery'] },
  { name: 'Logistics', desc: 'Delivery and logistics businesses tracking orders and drivers.', recommended: 'Custom Business OS', features: ['Dispatch', 'Tracking', 'Reports'] },
  { name: 'Nonprofits', desc: 'Organisations managing programs, donors and reporting.', recommended: 'Custom Business OS', features: ['Programs', 'Donors', 'Reporting'] },
];

export interface ProcessStep { num: string; title: string; desc: string; }
export const processSteps: ProcessStep[] = [
  { num: '01', title: 'Discover', desc: 'Understand your business and challenges.' },
  { num: '02', title: 'Design', desc: 'Design the right digital solution.' },
  { num: '03', title: 'Build', desc: 'Develop the system using modern technology.' },
  { num: '04', title: 'Launch', desc: 'Deploy, configure and train your team.' },
  { num: '05', title: 'Grow', desc: 'Support, improve and scale your platform.' },
];

export interface WhyCard { title: string; desc: string; }
export const whyCards: WhyCard[] = [
  { title: 'Built for Africa', desc: 'We understand the people, communities and realities shaping African technology.' },
  { title: 'Human-centred', desc: 'Useful digital experiences designed around the people who rely on them.' },
  { title: 'Scalable', desc: 'Start with a focused solution and expand as needs and impact grow.' },
  { title: 'Connected', desc: 'Bring services, information and people together across systems.' },
  { title: 'Accessible', desc: 'Make digital tools easier to reach and use in diverse contexts.' },
  { title: 'Collaborative', desc: 'Work with teams and communities to solve challenges that matter.' },
];

export const problems: string[] = [
  'Limited access to essential healthcare',
  'Learning resources out of reach',
  'Disconnected health and research data',
  'Farmers cut off from timely insights',
  'Barriers to inclusive digital finance',
  'Public services difficult to access',
  'Vital information scattered across systems',
  'Communities underrepresented in digital tools',
  'Research findings hard to put into practice',
  'Local solutions need room to scale',
];

export const trustBadges: string[] = ['M-Pesa Ready', 'Mobile First', 'Cloud Based', 'Multi-Branch', 'Secure', 'Scalable', 'Real-Time Analytics', 'WhatsApp Ready'];

export interface PricingPlan { name: string; price: string; desc: string; features: string[]; }
export const pricingPlans: PricingPlan[] = [
  { name: 'Starter', price: 'KES 30,000', desc: 'A professional starting point for individuals, startups, and small businesses building their online presence.', features: ['Up to 5 pages', 'Basic UI/UX design', 'Mobile-responsive design', 'Contact/enquiry forms', 'Basic SEO setup', 'Basic deployment support'] },
  { name: 'Business', price: 'KES 80,000+', desc: 'A professional website for growing businesses and organizations that need a stronger digital presence.', features: ['Custom web application', 'Up to 10-15 pages', 'Content management functionality', 'API & database integrations', 'Performance optimization', 'Deployment support'] },
  { name: 'Enterprise', price: 'KES 150,000+', desc: 'Advanced web experiences with custom functionality and integrations beyond a standard business website.', features: ['Fully advanced software application', 'Multiple API integrations', 'AI integrations & automation', 'Scalable future-ready architecture', 'Performance & security optimization', 'User accounts where required'] },
];

export const enquiryOptions: string[] = [
  'Healthcare or medical technology',
  'Education, e-learning or LMS',
  'Agriculture or food systems',
  'FinTech or digital payments',
  'Public or civic technology',
  'Research, data or AI',
  'Custom software or digital platform',
  'Website or mobile application',
  'Partnership or collaboration',
  'Other field or idea',
];
