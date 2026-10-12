import type { Anime, AnimeHome, Episode } from './types';
const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api').replace(/\/$/, '');
async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const json = await res.json();
  if (json?.status === false) throw new Error(json.error || 'Request gagal');
  return json as T;
}
export async function getHome(): Promise<AnimeHome> {
  const r = await request<{ data: AnimeHome }>('/anime/home');
  return r.data;
}
export async function getLatest(page = 0): Promise<Anime[]> { return (await request<{data: Anime[]}>('/anime/latest?page=' + page)).data || []; }
export async function getPopular(page = 0): Promise<Anime[]> { return (await request<{data: Anime[]}>('/anime/popular?page=' + page)).data || []; }
export async function searchAnime(q: string, page = 0, sort = 'views'): Promise<Anime[]> {
  if (!q.trim()) return getLatest(page);
  return (await request<{data: Anime[]}>('/anime/search?q=' + encodeURIComponent(q) + '&page=' + page + '&sort=' + sort)).data || [];
}
export async function getDetail(id: string): Promise<Anime> { return (await request<{data: Anime}>('/anime/' + encodeURIComponent(id))).data; }
export async function getEpisodes(id: string): Promise<Episode[]> { return (await request<{data: Episode[]}>('/anime/' + encodeURIComponent(id) + '/episodes')).data || []; }
export function imageUrl(src?: string | null) { return src || ''; }
export type StreamServer = { id: string | number; name?: string; quality?: string; type?: string; url?: string; file_size_mb?: number | null };
export async function getStream(id: string): Promise<{ episode?: { id: string | number; title?: string; episode_number?: number | string; next_episode_id?: string | number | null }; servers: StreamServer[] }> {
  return request<{ episode?: { id: string | number; title?: string; episode_number?: number | string; next_episode_id?: string | number | null }; servers: StreamServer[] }>('/episode/' + encodeURIComponent(id) + '/stream');
}
