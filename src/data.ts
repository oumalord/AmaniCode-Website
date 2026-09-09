export const WHATSAPP_NUMBER = '254700000000'; // TODO: replace with AmaniCode's real WhatsApp Business number
export const CONTACT_EMAIL = 'hello@amanicode.co.ke'; // TODO: replace with real contact email
export const CONTACT_PHONE = '+254 700 000 000'; // TODO: replace with real phone number

export interface Solution { title: string; desc: string; link?: string; }
export const solutions: Solution[] = [
  { title: 'Business Management Systems', desc: 'Run your entire business from one intelligent platform.' },
  { title: 'POS Systems', desc: 'Fast, reliable point-of-sale systems designed for African businesses.' },
  { title: 'CRM', desc: 'Build stronger customer relationships with powerful customer management.' },
  { title: 'Inventory', desc: 'Know exactly what you have, what is selling and what needs replenishing.' },
  { title: 'E-Commerce', desc: 'Take your business online and sell 24/7.' },
  { title: 'Business Analytics', desc: 'Turn business data into decisions.' },
  { title: 'Custom Software', desc: 'Build software around the exact way your organization operates.' },
  { title: 'Mobile Applications', desc: 'Create powerful mobile experiences for customers, staff and organizations.' },
];

export interface ProductOS { id: string; name: string; forWho: string[]; features: string[]; link?: string; }
export const products: ProductOS[] = [
  { id: 'malariawatch', name: 'Malaria Watch', forWho: ['Healthcare teams', 'Researchers', 'Communities'], features: ['Monitoring', 'Reporting', 'Data insights'], link: 'https://malariawatch.vercel.app' },
  { id: 'kgga', name: 'Kenya Girl Guides Association LMS', forWho: ['Schools', 'Trainers', 'Girl Guides'], features: ['Learning', 'Courses', 'Progress tracking'], link: 'https://kggalms.vercel.app' },
  { id: 'safigroom', name: 'SafiGroom OS', forWho: ['Salons', 'Barbers', 'Spas', 'Beauty businesses'], features: ['POS', 'Appointments', 'Staff', 'Commissions'], link: 'https://braidysms.vercel.app' },
  { id: 'amanitech', name: 'Electronics Shop System', forWho: ['Electronics shops', 'Phone retailers', 'Computer shops'], features: ['POS', 'Inventory', 'Repairs', 'Warranty'], link: 'https://star-electronics-africa.vercel.app/#/login' },
  { id: 'digishield', name: 'Digishield', forWho: ['Businesses', 'Organisations', 'Digital teams'], features: ['Security', 'Digital protection', 'Business tools'], link: 'https://digishield.co.ke' },
];

export interface SiteSettings {
  whatsappNumber: string;
  projects: ProductOS[];
  solutions: Solution[];
}

export const defaultSiteSettings: SiteSettings = {
  whatsappNumber: '+254746542433',
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
  { name: 'Healthcare', desc: 'Clinics and pharmacies handling patient records and stock.', recommended: 'Custom Business OS', features: ['Records', 'Inventory', 'Billing'] },
  { name: 'Education', desc: 'Schools and training centres managing students and payments.', recommended: 'Custom Business OS', features: ['Enrolment', 'Fees', 'Reports'] },
  { name: 'Agriculture', desc: 'Agribusinesses tracking produce, suppliers and sales.', recommended: 'Custom Business OS', features: ['Produce tracking', 'Suppliers', 'Sales'] },
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
  { title: 'Built for Africa', desc: 'We understand the realities of African businesses.' },
  { title: 'Simple', desc: 'Powerful software without unnecessary complexity.' },
  { title: 'Scalable', desc: 'Start small and grow without replacing your system.' },
  { title: 'Connected', desc: 'Payments, customers, inventory and operations work together.' },
  { title: 'Affordable', desc: 'Enterprise-grade technology designed with growing businesses in mind.' },
  { title: 'Human Support', desc: 'Real people who understand your business.' },
];

export const problems: string[] = [
  'Manual record keeping',
  'Lost sales',
  'Poor inventory visibility',
  'Scattered customer information',
  'Difficult payment reconciliation',
  'No reliable business reports',
  'Staff accountability problems',
  'Limited online presence',
  'Poor customer follow-up',
  'Multiple branches managed separately',
];

export const trustBadges: string[] = ['M-Pesa Ready', 'Mobile First', 'Cloud Based', 'Multi-Branch', 'Secure', 'Scalable', 'Real-Time Analytics', 'WhatsApp Ready'];

export interface PricingPlan { name: string; price: string; desc: string; features: string[]; }
export const pricingPlans: PricingPlan[] = [
  { name: 'Starter', price: 'KES 30,000', desc: 'A professional starting point for individuals, startups, and small businesses building their online presence.', features: ['Up to 5 pages', 'Basic UI/UX design', 'Mobile-responsive design', 'Contact/enquiry forms', 'Basic SEO setup', 'Basic deployment support'] },
  { name: 'Business', price: 'KES 80,000+', desc: 'A professional website for growing businesses and organizations that need a stronger digital presence.', features: ['Custom web application', 'Up to 10-15 pages', 'Content management functionality', 'API & database integrations', 'Performance optimization', 'Deployment support'] },
  { name: 'Enterprise', price: 'KES 150,000+', desc: 'Advanced web experiences with custom functionality and integrations beyond a standard business website.', features: ['Fully advanced software application', 'Multiple API integrations', 'AI integrations & automation', 'Scalable future-ready architecture', 'Performance & security optimization', 'User accounts where required'] },
];

export const enquiryOptions: string[] = [
  'I need a business system',
  'I need a website',
  'I need an e-commerce platform',
  'I need a POS',
  'I need a mobile app',
  'I need custom software',
  'I want a demo',
  'I want a partnership',
  'Other',
];
