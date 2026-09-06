import { useState, useEffect, useCallback } from 'react';
import { api } from './api';
import { ArrowLeft, RefreshCw, Lock, ImagePlus, Trash2 } from 'lucide-react';
import { defaultSiteSettings, type ProductOS, type SiteSettings, type Solution } from './data';

interface Lead {
  id: string;
  name: string;
  business: string;
  email: string;
  phone: string;
  country: string;
  industry: string;
  interest: string;
  budget: string;
  message: string;
  status: string;
  notes: string;
  createdAt: string;
}

const STATUSES = ['New', 'Contacted', 'Qualified', 'Demo Scheduled', 'Proposal Sent', 'Won', 'Lost'];
const TEAM_ASSETS = [
  { key: 'founder-ceo', label: 'Founder & CEO' },
  { key: 'lead-developer', label: 'Lead Developer' },
  { key: 'product-designer', label: 'Product Designer' },
  { key: 'business-development', label: 'Business Development' },
  { key: 'customer-success', label: 'Customer Success' },
];

function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Unable to read image.'));
    reader.onerror = () => reject(new Error('Unable to read image.'));
    reader.readAsDataURL(file);
  });
}

export default function AdminPage() {
  const [key, setKey] = useState('');
  const [unlockedKey, setUnlockedKey] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState<'leads' | 'assets' | 'content'>('leads');
  const [assets, setAssets] = useState<Record<string, string>>({});
  const [savingAsset, setSavingAsset] = useState('');
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [savingSettings, setSavingSettings] = useState(false);

  const loadLeads = useCallback(async (k: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/api/leads?key=' + encodeURIComponent(k));
      setLeads(res.data.items || []);
      setUnlockedKey(k);
    } catch {
      setError('Invalid access key.');
      setUnlockedKey(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSettings = useCallback(async () => {
    try {
      const res = await api.get('/api/site-settings');
      if (res.data.settings) setSettings((current) => ({ ...current, ...res.data.settings, projects: res.data.settings.projects || current.projects, solutions: res.data.settings.solutions || current.solutions }));
    } catch {
      setError('Failed to load website settings.');
    }
  }, []);

  const loadAssets = useCallback(async () => {
    try {
      const res = await api.get('/api/site-assets');
      setAssets(res.data.assets || {});
    } catch {
      setError('Failed to load website assets.');
    }
  }, []);

  useEffect(() => {
    document.title = 'AmaniCode Admin';
  }, []);

  async function updateStatus(id: string, status: string) {
    if (!unlockedKey) return;
    try {
      await api.put('/api/leads/' + id + '?key=' + encodeURIComponent(unlockedKey), { status });
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    } catch {
      setError('Failed to update lead status.');
    }
  }

  async function saveAsset(assetKey: string, dataUrl: string) {
    if (!unlockedKey) return;
    setSavingAsset(assetKey);
    setError('');
    try {
      await api.put('/api/site-assets/' + assetKey + '?key=' + encodeURIComponent(unlockedKey), { dataUrl });
      setAssets((current) => ({ ...current, [assetKey]: dataUrl }));
    } catch {
      setError('Could not save the image. Use a PNG, JPEG, WebP, or GIF under 750 KB.');
    } finally {
      setSavingAsset('');
    }
  }

  async function uploadAsset(assetKey: string, file?: File) {
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 750_000) {
      setError('Use an image file smaller than 750 KB.');
      return;
    }
    try {
      await saveAsset(assetKey, await readImage(file));
    } catch {
      setError('Could not read that image.');
    }
  }

  function updateProject(index: number, field: keyof ProductOS, value: string) {
    setSettings((current) => ({
      ...current,
      projects: current.projects.map((project, projectIndex) => projectIndex === index ? {
        ...project,
        [field]: field === 'forWho' || field === 'features' ? value.split(',').map((item) => item.trim()).filter(Boolean) : value,
      } : project),
    }));
  }

  function updateSolution(index: number, field: keyof Solution, value: string) {
    setSettings((current) => ({
      ...current,
      solutions: current.solutions.map((solution, solutionIndex) => solutionIndex === index ? { ...solution, [field]: value } : solution),
    }));
  }

  async function saveSettings() {
    if (!unlockedKey) return;
    setSavingSettings(true);
    setError('');
    try {
      await api.put('/api/site-settings?key=' + encodeURIComponent(unlockedKey), settings);
    } catch {
      setError('Could not save site content. Check the WhatsApp number and project details.');
    } finally {
      setSavingSettings(false);
    }
  }

  if (!unlockedKey) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center px-5">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-8">
          <div className="h-11 w-11 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400"><Lock className="h-5 w-5" /></div>
          <h1 className="mt-4 text-lg font-semibold text-white">AmaniCode Admin</h1>
          <p className="mt-1 text-sm text-slate-500">Enter the admin access key to view leads.</p>
          <form onSubmit={(e) => { e.preventDefault(); loadLeads(key); }} className="mt-6 space-y-3">
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Access key"
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/60"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="submit" disabled={loading} className="w-full rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 px-6 py-2.5 text-sm font-semibold text-white">
              {loading ? 'Checking...' : 'Unlock'}
            </button>
          </form>
          <a href="#home" className="mt-6 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300"><ArrowLeft className="h-3.5 w-3.5" /> Back to website</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050810] px-5 sm:px-8 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-semibold text-white">AmaniCode Admin</h1>
            <p className="text-sm text-slate-500">Manage enquiries and website content</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => activeView === 'leads' ? loadLeads(unlockedKey) : activeView === 'assets' ? loadAssets() : loadSettings()} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 hover:text-white">
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
            <a href="#home" className="text-sm text-slate-500 hover:text-slate-300">Back to website</a>
          </div>
        </div>
        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
        <div className="mb-6 flex gap-2 border-b border-white/10">
          <button onClick={() => setActiveView('leads')} className={'px-4 py-2.5 text-sm ' + (activeView === 'leads' ? 'border-b-2 border-blue-400 text-white' : 'text-slate-500 hover:text-slate-300')}>Leads ({leads.length})</button>
          <button onClick={() => { setActiveView('assets'); loadAssets(); }} className={'px-4 py-2.5 text-sm ' + (activeView === 'assets' ? 'border-b-2 border-blue-400 text-white' : 'text-slate-500 hover:text-slate-300')}>Website Assets</button>
          <button onClick={() => { setActiveView('content'); loadSettings(); }} className={'px-4 py-2.5 text-sm ' + (activeView === 'content' ? 'border-b-2 border-blue-400 text-white' : 'text-slate-500 hover:text-slate-300')}>Site Content</button>
        </div>
        {activeView === 'content' ? (
          <div className="max-w-3xl space-y-8">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              <label className="block text-sm font-medium text-white">WhatsApp number</label>
              <input value={settings.whatsappNumber} onChange={(e) => setSettings((current) => ({ ...current, whatsappNumber: e.target.value }))} placeholder="+254746542433" className="mt-3 w-full rounded-lg border border-white/10 bg-[#080c17] px-3 py-2.5 text-sm text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Projects</h2>
              <p className="mt-1 text-sm text-slate-400">Edit the public product cards and enter a website URL or a page link such as #/contact.</p>
              <div className="mt-5 space-y-5">
                {settings.projects.map((project, index) => (
                  <div key={project.id} className="rounded-xl border border-white/10 bg-white/5 p-5 grid gap-4 sm:grid-cols-2">
                    <label className="text-xs text-slate-400">Project name<input value={project.name} onChange={(e) => updateProject(index, 'name', e.target.value)} className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#080c17] px-3 py-2 text-sm text-white" /></label>
                    <label className="text-xs text-slate-400">Project link<input value={project.link || ''} onChange={(e) => updateProject(index, 'link', e.target.value)} className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#080c17] px-3 py-2 text-sm text-white" /></label>
                    <label className="text-xs text-slate-400">Audience, separated by commas<input value={project.forWho.join(', ')} onChange={(e) => updateProject(index, 'forWho', e.target.value)} className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#080c17] px-3 py-2 text-sm text-white" /></label>
                    <label className="text-xs text-slate-400">Features, separated by commas<input value={project.features.join(', ')} onChange={(e) => updateProject(index, 'features', e.target.value)} className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#080c17] px-3 py-2 text-sm text-white" /></label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Solutions</h2>
              <p className="mt-1 text-sm text-slate-400">Enter the homepage URL for each business system. Clicking its public card opens that system.</p>
              <div className="mt-5 space-y-5">
                {settings.solutions.map((solution, index) => (
                  <div key={solution.title} className="rounded-xl border border-white/10 bg-white/5 p-5 grid gap-4 sm:grid-cols-2">
                    <label className="text-xs text-slate-400">Solution name<input value={solution.title} onChange={(e) => updateSolution(index, 'title', e.target.value)} className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#080c17] px-3 py-2 text-sm text-white" /></label>
                    <label className="text-xs text-slate-400">System homepage link<input value={solution.link || ''} onChange={(e) => updateSolution(index, 'link', e.target.value)} placeholder="https://your-system.com" className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#080c17] px-3 py-2 text-sm text-white" /></label>
                    <label className="text-xs text-slate-400 sm:col-span-2">Description<textarea value={solution.desc} onChange={(e) => updateSolution(index, 'desc', e.target.value)} rows={2} className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#080c17] px-3 py-2 text-sm text-white" /></label>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={saveSettings} disabled={savingSettings} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60">{savingSettings ? 'Saving...' : 'Save Site Content'}</button>
          </div>
        ) : activeView === 'assets' ? (
          <div>
            <p className="mb-6 text-sm text-slate-400">Upload a logo and team photos. Images appear on the public website immediately after saving.</p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[{ key: 'logo', label: 'Company Logo' }, ...TEAM_ASSETS].map((asset) => (
                <div key={asset.key} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="aspect-square overflow-hidden rounded-lg bg-[#080c17] flex items-center justify-center">
                    {assets[asset.key] ? <img src={assets[asset.key]} alt={asset.label} className="h-full w-full object-cover" /> : <ImagePlus className="h-7 w-7 text-slate-600" />}
                  </div>
                  <p className="mt-3 text-sm font-medium text-white">{asset.label}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <label className="cursor-pointer rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-500">
                      {savingAsset === asset.key ? 'Saving...' : 'Upload'}
                      <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" disabled={savingAsset === asset.key} onChange={(e) => uploadAsset(asset.key, e.target.files?.[0])} />
                    </label>
                    {assets[asset.key] && <button onClick={() => saveAsset(asset.key, '')} disabled={savingAsset === asset.key} className="rounded-lg border border-white/10 p-2 text-slate-400 hover:text-red-400" aria-label={'Remove ' + asset.label}><Trash2 className="h-4 w-4" /></button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-white/10">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Business</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Interest</th>
                <th className="px-4 py-3 font-medium">Message</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-600">No leads yet.</td></tr>
              )}
              {leads.map((l) => (
                <tr key={l.id} className="border-b border-white/5 align-top">
                  <td className="px-4 py-3 text-white">{l.name}</td>
                  <td className="px-4 py-3 text-slate-400">{l.business || '\u2014'}</td>
                  <td className="px-4 py-3 text-slate-400">
                    <p>{l.email}</p>
                    <p className="text-xs text-slate-600">{l.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{l.interest}</td>
                  <td className="px-4 py-3 text-slate-400 max-w-xs">{l.message}</td>
                  <td className="px-4 py-3">
                    <select value={l.status} onChange={(e) => updateStatus(l.id, e.target.value)} className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-1.5 text-xs text-white">
                      {STATUSES.map((s) => <option key={s} value={s} className="bg-[#080c17]">{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}
      </div>
    </div>
  );
}
