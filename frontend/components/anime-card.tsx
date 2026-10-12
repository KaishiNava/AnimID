'use client';
import Link from 'next/link';
import { Heart, Bookmark, Play, ImageOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Anime } from '@/lib/types';
import { isInCollection, toggleCollection } from '@/lib/storage';
export function AnimeCard({ anime }: { anime: Anime }) {
  const [favorite, setFavorite] = useState(false); const [saved, setSaved] = useState(false); const [broken, setBroken] = useState(false);
  useEffect(()=>{setFavorite(isInCollection('favorites',anime.id));setSaved(isInCollection('watchlist',anime.id));},[anime.id]);
  const toggle = (kind:'favorites'|'watchlist') => { const added = toggleCollection(kind, anime); if(kind==='favorites') setFavorite(added); else setSaved(added); };
  return <article className="anime-card"><Link href={`/anime/${encodeURIComponent(String(anime.id))}`} className="poster-wrap" aria-label={`Lihat ${anime.title}`}>
    {anime.poster && !broken ? <img src={anime.poster} alt={anime.title} loading="lazy" referrerPolicy="no-referrer" onError={()=>setBroken(true)}/> : <div className="poster-placeholder"><ImageOff size={26}/><span>AnimID</span></div>}
    <div className="poster-overlay"><span className="play-bubble"><Play size={18} fill="currentColor"/></span></div>
    <span className="poster-type">{anime.type || 'Anime'}</span>
  </Link><div className="card-meta"><Link href={`/anime/${encodeURIComponent(String(anime.id))}`} className="anime-title" title={anime.title}>{anime.title}</Link><div className="card-bottom"><span>{anime.year || anime.status || 'Anime'}</span><div className="card-actions"><button className={`mini-action ${favorite?'selected':''}`} onClick={()=>toggle('favorites')} aria-label={favorite?'Hapus dari favorit':'Tambah ke favorit'} title="Favorit"><Heart size={15} fill={favorite?'currentColor':'none'}/></button><button className={`mini-action ${saved?'selected':''}`} onClick={()=>toggle('watchlist')} aria-label={saved?'Hapus dari watchlist':'Tambah ke watchlist'} title="Watchlist"><Bookmark size={15} fill={saved?'currentColor':'none'}/></button></div></div></div></article>;
}
