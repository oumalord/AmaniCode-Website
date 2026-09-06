import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { neon } from '@neondatabase/serverless';

const port = Number(process.env.PORT || 3002);
const adminKey = process.env.ADMIN_KEY;
const databaseUrl = process.env.DATABASE_URL;
const assetKeys = new Set(['logo']);
const imageDataUrl = /^data:image\/(png|jpeg|webp|gif);base64,[A-Za-z0-9+/=]+$/;

if (!databaseUrl || !adminKey) {
  const missing = [!databaseUrl && 'DATABASE_URL', !adminKey && 'ADMIN_KEY'].filter(Boolean).join(' and ');
  throw new Error(`${missing} is required. Add it to amanicode-source/.env before starting the API server.`);
}
const sql = neon(databaseUrl);

async function ensureSchema() {
  await sql.query('CREATE TABLE IF NOT EXISTS amanicode_records (collection TEXT NOT NULL, id TEXT NOT NULL, data JSONB NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), PRIMARY KEY (collection, id))');
}

async function listRecords(collection) {
  await ensureSchema();
  const rows = await sql.query('SELECT id, data FROM amanicode_records WHERE collection = $1 ORDER BY created_at DESC', [collection]);
  return rows.map((row) => ({ ...row.data, id: row.id }));
}

async function saveRecord(collection, id, data) {
  await ensureSchema();
  await sql.query('INSERT INTO amanicode_records (collection, id, data) VALUES ($1, $2, $3::jsonb) ON CONFLICT (collection, id) DO UPDATE SET data = EXCLUDED.data', [collection, id, JSON.stringify(data)]);
}

function send(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key' });
  response.end(JSON.stringify(body));
}

function isAdmin(requestUrl, request) {
  return requestUrl.searchParams.get('key') === adminKey || request.headers['x-admin-key'] === adminKey;
}

async function readBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : {};
}

const server = createServer(async (request, response) => {
  if (request.method === 'OPTIONS') return send(response, 204, {});
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const path = requestUrl.pathname;
  try {
    if (request.method === 'GET' && path === '/api/_healthcheck') return send(response, 200, { message: 'Success' });
    if (request.method === 'GET' && path === '/api/database-status') {
      if (!isAdmin(requestUrl, request)) return send(response, 401, { error: 'Unauthorized' });
      await sql.query('SELECT 1 AS connected');
      return send(response, 200, { connected: true, provider: 'Neon PostgreSQL' });
    }
    if (request.method === 'GET' && path === '/api/site-assets') {
      const assets = (await listRecords('site-assets')).reduce((result, asset) => {
        if (assetKeys.has(asset.key) && asset.dataUrl) result[asset.key] = asset.dataUrl;
        return result;
      }, {});
      return send(response, 200, { assets });
    }
    if (request.method === 'PUT' && path.startsWith('/api/site-assets/')) {
      if (!isAdmin(requestUrl, request)) return send(response, 401, { error: 'Unauthorized' });
      const key = path.split('/').pop();
      const { dataUrl = '' } = await readBody(request);
      if (!assetKeys.has(key)) return send(response, 400, { error: 'Unknown asset.' });
      if (dataUrl && (!imageDataUrl.test(dataUrl) || dataUrl.length > 1_000_000)) return send(response, 400, { error: 'Use a supported image under 750 KB.' });
      await saveRecord('site-assets', key, { key, dataUrl });
      return send(response, 200, { key, dataUrl });
    }
    if (request.method === 'GET' && path === '/api/site-settings') {
      const settings = (await listRecords('site-settings')).find((item) => item.id === 'main') || null;
      return send(response, 200, { settings });
    }
    if (request.method === 'PUT' && path === '/api/site-settings') {
      if (!isAdmin(requestUrl, request)) return send(response, 401, { error: 'Unauthorized' });
      const settings = await readBody(request);
      const whatsappNumber = String(settings.whatsappNumber || '').replace(/[^0-9]/g, '');
      if (whatsappNumber.length < 8 || whatsappNumber.length > 15 || !Array.isArray(settings.projects) || !Array.isArray(settings.solutions)) return send(response, 400, { error: 'Invalid site settings.' });
      await saveRecord('site-settings', 'main', { whatsappNumber, projects: settings.projects, solutions: settings.solutions });
      return send(response, 200, { settings: { whatsappNumber, projects: settings.projects, solutions: settings.solutions } });
    }
    if (request.method === 'POST' && path === '/api/leads') {
      const body = await readBody(request);
      if (!body.name?.trim() || !body.email?.trim() || !body.message?.trim()) return send(response, 400, { error: 'Please provide your name, email and message.' });
      const record = { name: String(body.name).slice(0, 200), business: String(body.business || '').slice(0, 200), email: String(body.email).slice(0, 200), phone: String(body.phone || '').slice(0, 50), country: String(body.country || '').slice(0, 100), industry: String(body.industry || '').slice(0, 100), interest: String(body.interest || 'Other').slice(0, 200), budget: String(body.budget || '').slice(0, 100), message: String(body.message).slice(0, 2000), status: 'New', notes: '', createdAt: new Date().toISOString() };
      const id = randomUUID();
      await saveRecord('leads', id, record);
      return send(response, 201, { id, ...record });
    }
    if (request.method === 'GET' && path === '/api/leads') {
      if (!isAdmin(requestUrl, request)) return send(response, 401, { error: 'Unauthorized' });
      const items = (await listRecords('leads')).sort((first, second) => second.createdAt.localeCompare(first.createdAt));
      return send(response, 200, { items });
    }
    if (request.method === 'PUT' && path.startsWith('/api/leads/')) {
      if (!isAdmin(requestUrl, request)) return send(response, 401, { error: 'Unauthorized' });
      const id = path.split('/').pop();
      const current = (await listRecords('leads')).find((lead) => lead.id === id);
      if (!current) return send(response, 404, { error: 'Lead not found' });
      const body = await readBody(request);
      const updated = { ...current, status: body.status ?? current.status, notes: body.notes ?? current.notes };
      await saveRecord('leads', id, updated);
      return send(response, 200, { id, ...updated });
    }
    return send(response, 404, { error: 'Route not found' });
  } catch (error) {
    console.error(error);
    return send(response, 500, { error: 'Server error' });
  }
});

server.listen(port, () => console.log(`Neon API listening on http://127.0.0.1:${port}`));