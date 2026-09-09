import { useState, useEffect, type FormEvent } from 'react';
import { api } from './api';
import {
  Menu, X, ArrowRight, ChevronRight, CheckCircle2, Building2, CreditCard, Users, Package,
  ShoppingCart, BarChart3, MessageCircle, Phone, Mail, MapPin,
  Scissors, Laptop, Globe2, ShieldCheck,
} from 'lucide-react';
import AdminPage from './AdminPage';
import AnimatedBackground from './components/AnimatedBackground';
import {
  products, industries, processSteps, whyCards, problems, trustBadges,
  enquiryOptions, CONTACT_EMAIL, CONTACT_PHONE,
  defaultSiteSettings, type ProductOS, type SiteSettings,
} from './data';

function AnimatedNumber({ target, prefix = '', duration = 1400 }: { target: number; prefix?: string; duration?: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    let frame = 0;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return <span>{prefix}{value.toLocaleString()}</span>;
}

function SectionHeading({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="max-w-2xl">
      <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">{eyebrow}</span>
      <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white tracking-tight">{title}</h2>
      {sub && <p className="mt-4 text-slate-400">{sub}</p>}
    </div>
  );
}

function Navbar({ logoUrl }: { logoUrl?: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const links: [string, string][] = [
    ['Home', '#/home'], ['Solutions', '#/solutions'], ['Products', '#/products'],
    ['Industries', '#/industries'], ['Why AmaniCode', '#/why'], ['About', '#/about'],
    ['Resources', '#/resources'], ['Contact', '#/contact'],
  ];
  return (
    <header className={'fixed top-0 inset-x-0 z-50 transition-all ' + (scrolled ? 'bg-[#071a3d]/90 backdrop-blur-md border-b border-white/10' : 'bg-transparent')}>
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 py-2">
        <a href="#/home" className="flex items-center gap-3 font-semibold text-white text-xl tracking-tight" aria-label="AmaniCode Solutions home">
          {logoUrl && <img src={logoUrl} alt="AmaniCode Solutions" className="brand-logo" />}
          {!logoUrl && <>AmaniCode <span className="text-blue-400 font-normal hidden sm:inline">Solutions</span></>}
        </a>
        <div className="hidden lg:flex items-center gap-7 text-sm text-slate-300">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="hover:text-white transition-colors">{label}</a>
          ))}
        </div>
        <div className="hidden lg:block">
          <a href="#/contact" className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400 hover:bg-yellow-300 transition-colors px-5 py-2.5 text-sm font-semibold text-[#071a3d]">
            Book a Demo <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <button onClick={() => setOpen(!open)} className="lg:hidden text-white" aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>
      {open && (
        <div className="lg:hidden bg-[#071a3d] border-t border-white/10 px-5 py-4 flex flex-col gap-4">
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="text-slate-300 hover:text-white text-sm">{label}</a>
          ))}
          <a href="#/contact" onClick={() => setOpen(false)} className="rounded-full bg-yellow-400 hover:bg-yellow-300 text-center px-5 py-2.5 text-sm font-semibold text-[#071a3d]">Book a Demo</a>
        </div>
      )}
    </header>
  );
}

function Hero() {
  const metrics: { label: string; value: number; prefix?: string }[] = [
    { label: 'Orders', value: 1284 },
    { label: 'Customers', value: 3927 },
    { label: 'Inventory', value: 5610 },
    { label: 'Appointments', value: 268 },
    { label: 'Branches', value: 6 },
  ];
  return (
    <section id="home" className="relative overflow-hidden pt-36 pb-24 grid-bg">
      <div className="absolute inset-0 glow pointer-events-none" />
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-300 animate-fade-up">
            Built for African businesses
          </span>
          <h1 className="mt-6 text-4xl sm:text-6xl font-semibold tracking-tight text-white leading-[1.08] animate-fade-up">
            Technology that helps African businesses grow.
          </h1>
          <p className="mt-6 text-lg text-slate-400 max-w-xl animate-fade-up">
            AmaniCode Solutions builds powerful business software that helps organizations manage operations, serve customers, increase efficiency and grow with confidence.
          </p>
          <div className="mt-9 flex flex-wrap gap-4 animate-fade-up">
            <a href="#/solutions" className="rounded-full bg-yellow-400 text-[#071a3d] px-6 py-3 text-sm font-semibold hover:bg-yellow-300 transition-colors">Explore Solutions</a>
            <a href="#/contact" className="rounded-full border border-white/20 text-white px-6 py-3 text-sm font-semibold hover:border-white/40 transition-colors inline-flex items-center gap-2">Book a Demo <ArrowRight className="h-4 w-4" /></a>
          </div>
          <p className="mt-6 text-xs uppercase tracking-widest text-slate-500">Kenya &bull; Africa &bull; Global</p>
        </div>

        <div className="mt-16 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 sm:p-6 shadow-2xl shadow-blue-900/20 animate-float">
          <div className="flex items-center gap-2 mb-5">
            <span className="h-3 w-3 rounded-full bg-blue-400/70" /><span className="h-3 w-3 rounded-full bg-yellow-400/70" /><span className="h-3 w-3 rounded-full bg-white/70" />
            <span className="ml-3 text-xs text-slate-500">amanicode-dashboard</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {metrics.map((m) => (
              <div key={m.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs text-slate-500">{m.label}</p>
                <p className="mt-1 text-lg sm:text-xl font-semibold text-white"><AnimatedNumber target={m.value} prefix={m.prefix} /></p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[11px] text-slate-600">Operational activity shown for illustration purposes.</p>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  return (
    <section className="border-y border-white/5 bg-white/5 py-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <p className="text-center text-sm text-slate-400 mb-6">Built for the way African businesses actually work.</p>
        <div className="flex flex-wrap justify-center gap-3">
          {trustBadges.map((b) => (
            <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3.5 py-1.5 text-xs text-slate-300">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" /> {b}
            </span>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-slate-600">Trusted by businesses across Africa &mdash; client showcase coming soon.</p>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">Running a business shouldn't feel harder than it needs to.</h2>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {problems.map((p) => (
            <div key={p} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 shrink-0" /> {p}
            </div>
          ))}
        </div>
        <p className="mt-10 text-xl sm:text-2xl font-medium text-blue-400">AmaniCode brings everything together.</p>
      </div>
    </section>
  );
}

const productIcons: Record<string, typeof Package> = {
  safigroom: Scissors, amanitech: Laptop, malariawatch: Globe2, kgga: Building2, digishield: ShieldCheck,
};

function ProductsSection({ projects = products }: { projects?: ProductOS[] }) {
  return (
    <section id="solutions" className="py-24 border-t border-white/5 bg-white/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeading eyebrow="Solutions & Products" title="Our existing digital systems." sub="Each solution below is a live AmaniCode project. Select any dashboard to open it in a new tab, then return here whenever you are ready." />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => {
            const Icon = productIcons[p.id] || Package;
            return (
              <a key={p.id} href={p.link || '#/contact'} target={p.link?.startsWith('http') ? '_blank' : undefined} rel={p.link?.startsWith('http') ? 'noopener noreferrer' : undefined} className="group rounded-2xl border border-white/10 bg-[#0b2f6b] p-6 flex flex-col hover:border-yellow-400/60 hover:bg-[#1557b0] transition-colors">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-700/10 flex items-center justify-center text-blue-400">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{p.name}</h3>
                <div className="mt-4 h-36 overflow-hidden rounded-xl border border-white/10 bg-[#071a3d] pointer-events-none">
                  <iframe src={p.link} title={p.name + ' dashboard preview'} loading="lazy" className="h-[620px] w-full origin-top scale-[0.42]" />
                </div>
                <p className="mt-1 text-xs text-slate-500">{p.forWho.join(' \u2022 ')}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.features.map((f) => (
                    <span key={f} className="text-[11px] rounded-full border border-white/10 px-2 py-1 text-slate-400">{f}</span>
                  ))}
                </div>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-yellow-300 group-hover:text-yellow-200">Open dashboard <ChevronRight className="h-4 w-4" /></span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function IndustriesSection() {
  const [active, setActive] = useState(0);
  const ind = industries[active];
  return (
    <section id="industries" className="py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeading eyebrow="Industries" title="Built around your industry." />
        <div className="mt-10 grid lg:grid-cols-[280px_1fr] gap-8">
          <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
            {industries.map((it, i) => (
              <button key={it.name} onClick={() => setActive(i)} className={'text-left whitespace-nowrap px-4 py-2.5 rounded-lg text-sm transition-colors ' + (i === active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white')}>
                {it.name}
              </button>
            ))}
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <h3 className="text-2xl font-semibold text-white">{ind.name}</h3>
            <p className="mt-3 text-slate-400">{ind.desc}</p>
            <p className="mt-5 text-sm text-slate-500">Recommended: <span className="text-blue-400 font-medium">{ind.recommended}</span></p>
            <div className="mt-4 flex flex-wrap gap-2">
              {ind.features.map((f) => (
                <span key={f} className="text-xs rounded-full border border-white/10 px-3 py-1 text-slate-300">{f}</span>
              ))}
            </div>
                <a href="#contact" className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-yellow-400 hover:bg-yellow-300 px-5 py-2.5 text-sm font-semibold text-[#071a3d]">Request a System <ArrowRight className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureShowcase() {
  const blocks = [
    { title: 'Sell faster', desc: 'A fast, reliable point-of-sale built for real checkout counters.', items: ['Fast checkout', 'Barcode scanning', 'M-Pesa, cash & card', 'Digital receipts'], Icon: CreditCard },
    { title: 'Know your business', desc: 'Turn every transaction into a clear picture of performance.', items: ['Revenue & profit', 'Orders & expenses', 'Customer trends', 'Inventory levels'], Icon: BarChart3 },
    { title: 'Manage your customers', desc: 'Keep every customer relationship organised and personal.', items: ['Customer profiles', 'Purchase history', 'Loyalty programs', 'Customer segmentation'], Icon: Users },
    { title: 'Take your business online', desc: 'A modern storefront connected to the rest of your operations.', items: ['Product catalogue', 'Cart & checkout', 'M-Pesa payments', 'Order tracking'], Icon: ShoppingCart },
  ];
  return (
    <section className="py-24 border-t border-white/5 bg-white/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 space-y-16">
        {blocks.map((b, i) => (
          <div key={b.title} className={'grid lg:grid-cols-2 gap-10 items-center ' + (i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : '')}>
            <div>
              <div className="h-11 w-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400"><b.Icon className="h-5 w-5" /></div>
              <h3 className="mt-5 text-2xl sm:text-3xl font-semibold text-white">{b.title}</h3>
              <p className="mt-3 text-slate-400">{b.desc}</p>
              <ul className="mt-5 space-y-2">
                {b.items.map((it) => (
                  <li key={it} className="flex items-center gap-2.5 text-sm text-slate-300"><CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0" /> {it}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#0b2f6b] p-6 h-64 flex items-center justify-center text-slate-300 text-sm">
              Interface preview
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhySection() {
  return (
    <section id="why" className="py-24 border-t border-white/5 bg-white/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeading eyebrow="Why AmaniCode" title="Why businesses choose AmaniCode." />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {whyCards.map((c) => (
            <div key={c.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h3 className="font-medium text-white">{c.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VisionSection() {
  return (
    <section className="py-28 border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 glow opacity-60 pointer-events-none" />
      <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center relative">
        <h2 className="text-3xl sm:text-5xl font-semibold text-white tracking-tight leading-tight">Africa doesn't just need technology.<br />
          <span className="text-blue-400">Africa needs technology built for Africa.</span>
        </h2>
        <p className="mt-8 text-slate-400 text-lg">Many African businesses rely on fragmented systems that were designed for different markets and different business realities. AmaniCode Solutions is building a new generation of African business technology &mdash; practical, accessible, intelligent and scalable.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {['Modern', 'Innovative', 'Entrepreneurial', 'Ambitious', 'Connected'].map((w) => (
            <span key={w} className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-300">{w}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="py-24 border-t border-white/5 bg-white/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeading eyebrow="Process" title="From idea to a system your team relies on." />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {processSteps.map((s) => (
            <div key={s.num} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <span className="text-3xl font-semibold text-blue-500/40">{s.num}</span>
              <h3 className="mt-3 font-medium text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  const values = ['Innovation', 'Integrity', 'Simplicity', 'Impact', 'Customer Success', 'African Excellence'];
  return (
    <section id="about" className="py-24 border-t border-white/5">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        <div>
          <SectionHeading eyebrow="About AmaniCode" title="We build technology with purpose." sub="AmaniCode Solutions is a Kenyan technology company focused on building practical digital solutions for businesses and organizations. Our mission is to make powerful technology accessible to businesses across Africa." />
          <div className="mt-8 space-y-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-widest text-blue-400">Vision</p>
              <p className="mt-1.5 text-slate-200">To become one of Africa's most trusted technology companies.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-widest text-blue-400">Mission</p>
              <p className="mt-1.5 text-slate-200">To empower African businesses through intelligent, accessible and scalable technology.</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {values.map((v) => <span key={v} className="text-xs rounded-full border border-white/10 px-3 py-1.5 text-slate-300">{v}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function ResourcesSection() {
  const cats = ['Business Technology', 'Digital Transformation', 'Entrepreneurship', 'POS', 'E-commerce', 'Artificial Intelligence', 'Cybersecurity', 'African Technology', 'Business Management'];
  return (
    <section id="resources" className="py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeading eyebrow="Resources" title="Insights on African business technology." sub="Our resource centre is launching soon, covering the topics below." />
        <div className="mt-10 flex flex-wrap gap-2.5">
          {cats.map((c) => <span key={c} className="text-sm rounded-full border border-white/10 px-4 py-2 text-slate-300">{c}</span>)}
        </div>
      </div>
    </section>
  );
}

interface ContactForm {
  name: string; business: string; email: string; phone: string; country: string;
  industry: string; interest: string; budget: string; message: string;
}

const emptyForm: ContactForm = { name: '', business: '', email: '', phone: '', country: '', industry: '', interest: enquiryOptions[0], budget: '', message: '' };

function ContactSection({ whatsappNumber = CONTACT_PHONE }: { whatsappNumber?: string }) {
  const [form, setForm] = useState<ContactForm>(emptyForm);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const update = (k: keyof ContactForm, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMsg('Please fill in your name, email and message.');
      return;
    }
    setStatus('submitting');
    try {
      await api.post('/api/leads', form);
      setStatus('success');
      setForm(emptyForm);
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong sending your enquiry. Please try again or reach us on WhatsApp.');
    }
  }

  const inputClass = 'w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60';

  return (
    <section id="contact" className="py-24 border-t border-white/5 bg-white/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-14">
        <div>
          <SectionHeading eyebrow="Contact" title="Let's build something that moves your business forward." />
          <div className="mt-8 space-y-4 text-sm text-slate-300">
            <a href={'https://wa.me/' + whatsappNumber.replace(/\D/g, '')} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white"><Phone className="h-4 w-4 text-blue-400" /> {whatsappNumber}</a>
            <p className="flex items-center gap-3"><Mail className="h-4 w-4 text-blue-400" /> {CONTACT_EMAIL}</p>
            <p className="flex items-center gap-3"><MapPin className="h-4 w-4 text-blue-400" /> Nairobi, Kenya</p>
          </div>
          <p className="mt-6 text-xs text-slate-600">Contact details shown are placeholders and should be updated to AmaniCode's real details.</p>
        </div>
        <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-[#0b2f6b] p-6 sm:p-8 space-y-4">
          {status === 'success' ? (
            <div className="text-center py-10">
              <CheckCircle2 className="h-10 w-10 text-blue-400 mx-auto" />
              <p className="mt-4 text-white font-medium">Thank you &mdash; your enquiry has been received.</p>
              <p className="mt-1 text-sm text-slate-400">Our team will get back to you shortly.</p>
              <button type="button" onClick={() => setStatus('idle')} className="mt-6 text-sm text-blue-400 hover:text-blue-300">Send another enquiry</button>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                <input className={inputClass} placeholder="Full name" value={form.name} onChange={(e) => update('name', e.target.value)} />
                <input className={inputClass} placeholder="Business name" value={form.business} onChange={(e) => update('business', e.target.value)} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <input className={inputClass} placeholder="Email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
                <input className={inputClass} placeholder="Phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <input className={inputClass} placeholder="Country" value={form.country} onChange={(e) => update('country', e.target.value)} />
                <input className={inputClass} placeholder="Industry" value={form.industry} onChange={(e) => update('industry', e.target.value)} />
              </div>
              <select className={inputClass} value={form.interest} onChange={(e) => update('interest', e.target.value)}>
                {enquiryOptions.map((o) => <option key={o} value={o} className="bg-[#0b2f6b]">{o}</option>)}
              </select>
              <input className={inputClass} placeholder="Budget range (optional)" value={form.budget} onChange={(e) => update('budget', e.target.value)} />
              <textarea className={inputClass} placeholder="Tell us what you need" rows={4} value={form.message} onChange={(e) => update('message', e.target.value)} />
              {errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}
              <button type="submit" disabled={status === 'submitting'} className="w-full rounded-full bg-yellow-400 hover:bg-yellow-300 disabled:opacity-60 px-6 py-3 text-sm font-semibold text-[#071a3d] transition-colors">
                {status === 'submitting' ? 'Sending...' : 'Send Enquiry'}
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    { title: 'Solutions', items: products.map((p) => p.name) },
    { title: 'Products', items: products.map((p) => p.name) },
    { title: 'Industries', items: industries.slice(0, 6).map((i) => i.name) },
    { title: 'Company', items: ['About', 'Why AmaniCode', 'Careers', 'Contact'] },
  ];
  return (
    <footer className="border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-1">
            <p className="font-semibold text-white">AmaniCode Solutions</p>
            <p className="mt-2 text-sm text-slate-500">Technology that helps African businesses grow.</p>
            <div className="mt-5 flex gap-3 text-slate-500">
              <Globe2 className="h-4 w-4" />
              <MessageCircle className="h-4 w-4" />
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <p className="text-sm font-medium text-white">{c.title}</p>
              <ul className="mt-3 space-y-2">
                {c.items.map((it) => <li key={it} className="text-sm text-slate-500">{it}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-3 text-xs text-slate-600">
          <p>&copy; {new Date().getFullYear()} AmaniCode Solutions. All rights reserved.</p>
          <a href="#/admin" className="hover:text-slate-400">Admin</a>
        </div>
      </div>
    </footer>
  );
}

function WhatsAppButton({ whatsappNumber }: { whatsappNumber: string }) {
  const message = encodeURIComponent('Hello AmaniCode Solutions, I would like to learn more about your business software.');
  return (
    <a
      href={'https://wa.me/' + whatsappNumber.replace(/\D/g, '') + '?text=' + message}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center shadow-xl shadow-green-900/30 transition-colors"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-6 w-6 text-white" />
    </a>
  );
}

function LandingPage({ page }: { page: string }) {
  const [assets, setAssets] = useState<Record<string, string>>({});
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  useEffect(() => {
    api.get('/api/site-assets').then((res) => setAssets(res.data.assets || {})).catch(() => undefined);
    api.get('/api/site-settings').then((res) => {
      if (!res.data.settings) return;
      const savedProjects = Array.isArray(res.data.settings.projects) ? res.data.settings.projects : [];
      setSettings((current) => ({
        ...current,
        ...res.data.settings,
        projects: products.map((product) => ({ ...product, ...savedProjects.find((saved: ProductOS) => saved.id === product.id) })),
        solutions: res.data.settings.solutions || current.solutions,
      }));
    }).catch(() => undefined);
  }, []);
  return (
    <div className="min-h-screen bg-[#071a3d] relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <Navbar logoUrl={assets.logo} />
        {page === 'home' && <><Hero /><TrustStrip /><ProblemSection /><FeatureShowcase /></>}
          {page === 'solutions' && <ProductsSection projects={settings.projects} />}
          {page === 'products' && <ProductsSection projects={settings.projects} />}
        {page === 'industries' && <IndustriesSection />}
        {page === 'why' && <><WhySection /><VisionSection /></>}
        {page === 'about' && <><AboutSection /><ProcessSection /></>}
        {page === 'resources' && <ResourcesSection />}
        {page === 'contact' && <ContactSection whatsappNumber={settings.whatsappNumber} />}
        <Footer />
        <WhatsAppButton whatsappNumber={settings.whatsappNumber} />
      </div>
    </div>
  );
}

function App() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  if (hash.startsWith('#/admin')) return <AdminPage />;
  const page = hash.startsWith('#/') ? hash.slice(2) : 'home';
  const publicPages = ['home', 'solutions', 'products', 'industries', 'why', 'about', 'resources', 'contact'];
  return <LandingPage page={publicPages.includes(page) ? page : 'home'} />;
}

export default App;
