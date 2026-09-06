import { randomUUID } from 'node:crypto';
import { neon } from '@neondatabase/serverless';

const assetKeys = new Set(['logo']);
const imageDataUrl = /^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/;

function requireEnvironment() {
  const { DATABASE_URL: databaseUrl, ADMIN_KEY: adminKey } = process.env;
  if (!databaseUrl || !adminKey) throw new Error('DATABASE_URL and ADMIN_KEY must be configured in Vercel.');
  return { sql: neon(databaseUrl), adminKey };
}

async function ensureSchema(sql) {
  await sql.query('CREATE TABLE IF NOT EXISTS amanicode_records (collection TEXT NOT NULL, id TEXT NOT NULL, data JSONB NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), PRIMARY KEY (collection, id))');
}

async function listRecords(sql, collection) {
  await ensureSchema(sql);
  const rows = await sql.query('SELECT id, data FROM amanicode_records WHERE collection = $1 ORDER BY created_at DESC', [collection]);
  return rows.map((row) => ({ ...row.data, id: row.id }));
}

async function saveRecord(sql, collection, id, data) {
  await ensureSchema(sql);
  await sql.query('INSERT INTO amanicode_records (collection, id, data) VALUES ($1, $2, $3::jsonb) ON CONFLICT (collection, id) DO UPDATE SET data = EXCLUDED.data', [collection, id, JSON.stringify(data)]);
}

function isAdmin(request, adminKey) {
  const url = new URL(request.url, 'https://amanicodesolutions.vercel.app');
  return url.searchParams.get('key') === adminKey || request.headers['x-admin-key'] === adminKey;
}

export default async function handler(request, response) {
  const path = new URL(request.url, 'https://amanicodesolutions.vercel.app').pathname;
  try {
    const { sql, adminKey } = requireEnvironment();
    if (request.method === 'GET' && path === '/api/_healthcheck') return response.status(200).json({ message: 'Success' });
    if (request.method === 'GET' && path === '/api/database-status') {
      if (!isAdmin(request, adminKey)) return response.status(401).json({ error: 'Unauthorized' });
      await sql.query('SELECT 1 AS connected');
      return response.status(200).json({ connected: true, provider: 'Neon PostgreSQL' });
    }
    if (request.method === 'GET' && path === '/api/site-assets') {
      const assets = (await listRecords(sql, 'site-assets')).reduce((result, asset) => {
        if (assetKeys.has(asset.key) && asset.dataUrl) result[asset.key] = asset.dataUrl;
        return result;
      }, {});
      return response.status(200).json({ assets });
    }
    if (request.method === 'PUT' && path.startsWith('/api/site-assets/')) {
      if (!isAdmin(request, adminKey)) return response.status(401).json({ error: 'Unauthorized' });
      const key = path.split('/').pop();
      const { dataUrl = '' } = request.body || {};
      if (!assetKeys.has(key)) return response.status(400).json({ error: 'Unknown asset.' });
      if (dataUrl && (!imageDataUrl.test(dataUrl) || dataUrl.length > 1_000_000)) return response.status(400).json({ error: 'Use a supported image under 750 KB.' });
      await saveRecord(sql, 'site-assets', key, { key, dataUrl });
      return response.status(200).json({ key, dataUrl });
    }
    if (request.method === 'GET' && path === '/api/site-settings') {
      const settings = (await listRecords(sql, 'site-settings')).find((item) => item.id === 'main') || null;
      return response.status(200).json({ settings });
    }
    if (request.method === 'PUT' && path === '/api/site-settings') {
      if (!isAdmin(request, adminKey)) return response.status(401).json({ error: 'Unauthorized' });
      const settings = request.body || {};
      const whatsappNumber = String(settings.whatsappNumber || '').replace(/[^0-9]/g, '');
      if (whatsappNumber.length < 8 || whatsappNumber.length > 15 || !Array.isArray(settings.projects) || !Array.isArray(settings.solutions)) return response.status(400).json({ error: 'Invalid site settings.' });
      const record = { whatsappNumber, projects: settings.projects, solutions: settings.solutions };
      await saveRecord(sql, 'site-settings', 'main', record);
      return response.status(200).json({ settings: record });
    }
    if (request.method === 'POST' && path === '/api/leads') {
      const body = request.body || {};
      if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) return response.status(400).json({ error: 'Please provide your name, email and message.' });
      const record = { name: String(body.name).slice(0, 200), business: String(body.business || '').slice(0, 200), email: String(body.email).slice(0, 200), phone: String(body.phone || '').slice(0, 50), country: String(body.country || '').slice(0, 100), industry: String(body.industry || '').slice(0, 100), interest: String(body.interest || 'Other').slice(0, 200), budget: String(body.budget || '').slice(0, 100), message: String(body.message).slice(0, 2000), status: 'New', notes: '', createdAt: new Date().toISOString() };
      const id = randomUUID();
      await saveRecord(sql, 'leads', id, record);
      return response.status(201).json({ id, ...record });
    }
    if (request.method === 'GET' && path === '/api/leads') {
      if (!isAdmin(request, adminKey)) return response.status(401).json({ error: 'Unauthorized' });
      const items = (await listRecords(sql, 'leads')).sort((first, second) => second.createdAt.localeCompare(first.createdAt));
      return response.status(200).json({ items });
    }
    if (request.method === 'PUT' && path.startsWith('/api/leads/')) {
      if (!isAdmin(request, adminKey)) return response.status(401).json({ error: 'Unauthorized' });
      const id = path.split('/').pop();
      const current = (await listRecords(sql, 'leads')).find((lead) => lead.id === id);
      if (!current) return response.status(404).json({ error: 'Lead not found' });
      const updated = { ...current, status: request.body?.status ?? current.status, notes: request.body?.notes ?? current.notes };
      await saveRecord(sql, 'leads', id, updated);
      return response.status(200).json({ id, ...updated });
    }
    return response.status(404).json({ error: 'Route not found' });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: 'Server configuration error' });
  }
}