import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AnimeInScraper } from './animein-original.js';

const app = express();
const port = Number(process.env.PORT || 4000);
const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:3000').split(',').map(x => x.trim()).filter(Boolean);
const scraper = new AnimeInScraper();
app.disable('x-powered-by');
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin(origin, cb) { if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) return cb(null, true); return cb(new Error('Origin tidak diizinkan')); }, methods: ['GET'], maxAge: 600 }));
app.use(express.json({ limit: '32kb' }));
app.use('/api', rateLimit({ windowMs: 60_000, limit: 90, standardHeaders: 'draft-7', legacyHeaders: false, message: { status: false, error: 'Terlalu banyak request. Coba lagi sebentar.' } }));
app.get('/health', (_req, res) => res.json({ status: true, service: 'AnimID API', timestamp: new Date().toISOString() }));
app.get('/api/anime/home', async (req, res) => { try { const r = await scraper.getHome(typeof req.query.day === 'string' ? req.query.day : null); res.json(r); } catch (e) { fail(res, e); } });
app.get('/api/anime/search', async (req, res) => { try { const q = String(req.query.q || '').trim().slice(0, 120); if (!q) return res.status(400).json({ status: false, error: 'Kata kunci pencarian wajib diisi.' }); const page = safePage(req.query.page); const sort = safeSort(req.query.sort); res.json(await scraper.search(q, page, sort)); } catch (e) { fail(res, e); } });
app.get('/api/anime/latest', async (req, res) => { try { res.json(await scraper.getLatest(safePage(req.query.page))); } catch (e) { fail(res, e); } });
app.get('/api/anime/popular', async (req, res) => { try { res.json(await scraper.getPopular(safePage(req.query.page))); } catch (e) { fail(res, e); } });
app.get('/api/anime/genres', async (_req, res) => { try { res.json(await scraper.getGenres()); } catch (e) { fail(res, e); } });
app.get('/api/anime/schedule', async (req, res) => { try { const day = typeof req.query.day === 'string' ? req.query.day.slice(0, 12) : null; res.json(await scraper.getSchedule(day)); } catch (e) { fail(res, e); } });
app.get('/api/anime/:id/episodes', async (req, res) => { try { const id = cleanId(req.params.id); res.json({ status: true, anime_id: id, data: await scraper.getEpisodes(id, safePage(req.query.page)) }); } catch (e) { fail(res, e); } });
app.get('/api/anime/:id', async (req, res) => { try { const id = cleanId(req.params.id); res.json(await scraper.getDetail(id, true)); } catch (e) { fail(res, e); } });
app.get('/api/episode/:id/stream', async (req, res) => { try { const id = cleanId(req.params.id); res.json(await scraper.getStream(id)); } catch (e) { fail(res, e); } });
app.use((err, _req, res, _next) => { if (err?.message === 'Origin tidak diizinkan') return res.status(403).json({ status: false, error: err.message }); console.error('[api]', err?.message || err); return res.status(500).json({ status: false, error: 'Terjadi kesalahan internal.' }); });
app.listen(port, () => console.log(`AnimID API listening on ${port}`));
function safePage(value) { const n = Number.parseInt(String(value ?? '0'), 10); return Number.isFinite(n) ? Math.min(500, Math.max(0, n)) : 0; }
function safeSort(value) { const s = String(value || 'views'); return ['views', 'latest'].includes(s) ? s : 'views'; }
function cleanId(value) { const s = String(value || '').trim().replace(/^https?:\/\/animeinweb\.com\/(anime|watch)\//i, '').split(/[/?#]/)[0]; if (!s || !/^[a-zA-Z0-9_-]{1,100}$/.test(s)) throw new Error('ID anime tidak valid.'); return s; }
function fail(res, error) { console.error('[anime-source]', error?.message || error); const message = process.env.NODE_ENV === 'production' ? 'Sumber anime sedang tidak tersedia. Coba lagi nanti.' : (error?.message || 'Sumber anime sedang tidak tersedia.'); res.status(502).json({ status: false, error: message }); }
