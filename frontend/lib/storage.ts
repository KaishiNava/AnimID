import type { Anime } from './types';
export type CollectionKind = 'favorites' | 'watchlist';
const key = (kind: CollectionKind) => `animid:${kind}:v1`;
export function readCollection(kind: CollectionKind): Anime[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(key(kind)) || '[]') as Anime[]; } catch { return []; }
}
export function toggleCollection(kind: CollectionKind, anime: Anime): boolean {
  const list = readCollection(kind); const exists = list.some(x => String(x.id) === String(anime.id));
  const next = exists ? list.filter(x => String(x.id) !== String(anime.id)) : [anime, ...list];
  localStorage.setItem(key(kind), JSON.stringify(next));
  window.dispatchEvent(new CustomEvent('animid:collections-changed'));
  return !exists;
}
export function isInCollection(kind: CollectionKind, id: Anime['id']) { return readCollection(kind).some(x => String(x.id) === String(id)); }
