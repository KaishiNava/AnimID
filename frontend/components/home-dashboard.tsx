'use client';
import Link from 'next/link';
import { ArrowRight, Sparkles, Search, Play, TrendingUp, Clock3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getHome, getLatest, getPopular, imageUrl } from '@/lib/api';
import type { Anime, AnimeHome } from '@/lib/types';
import { AnimeSection } from './section';
const fallback: AnimeHome = {today:[],popular:[],new:[],hot:[],slider:[],waiting:[]};
export function HomeDashboard() {
 const [home,setHome]=useState<AnimeHome>(fallback); const [latest,setLatest]=useState<Anime[]>([]); const [popular,setPopular]=useState<Anime[]>([]); const [loading,setLoading]=useState(true); const [error,setError]=useState(''); const [query,setQuery]=useState('');
 useEffect(()=>{let alive=true;Promise.all([getHome(),getLatest(),getPopular()]).then(([h,l,p])=>{if(!alive)return;setHome(h);setLatest(l);setPopular(p);}).catch(()=>{if(alive)setError('Data anime belum bisa dimuat. Periksa koneksi API backend AnimID.');}).finally(()=>alive&&setLoading(false));return()=>{alive=false}},[]);
 const hero=home.slider?.[0]||home.hot?.[0]||home.popular?.[0];
 return <><section className="hero"><div className="hero-glow"/><div className="hero-copy"><span className="eyebrow"><Sparkles size={14}/> ANIME DISCOVERY, MADE SIMPLE</span><h1>Cerita hebat,<br/><span>dimulai di sini.</span></h1><p>Temukan anime yang cocok dengan suasana hatimu. Simpan favorit, jelajahi dunia baru, dan lanjutkan petualanganmu.</p><form className="hero-search" action="/explore"><Search size={19}/><input name="q" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari judul anime..." aria-label="Cari judul anime"/><button type="submit">Cari</button></form><div className="hero-quicklinks"><span><TrendingUp size={14}/> Populer hari ini</span><span><Clock3 size={14}/> Update terbaru</span></div></div>{hero&&<Link href={`/anime/${hero.id}`} className="hero-art" aria-label={`Lihat ${hero.title}`}><div className="hero-art-backdrop" style={{backgroundImage:`linear-gradient(90deg,rgba(13,11,18,.1),rgba(13,11,18,.05)),url("${imageUrl(hero.cover||hero.poster||'')}")`}}/><div className="hero-art-content"><span className="hero-tag">PILIHAN ANIMID</span><h2>{hero.title}</h2><span className="hero-watch">Lihat anime <ArrowRight size={15}/></span></div></Link>}</section>
 {error&&<div className="notice"><div><strong>API belum tersambung</strong><p>{error}</p></div><Link href="/explore">Coba jelajahi <ArrowRight size={15}/></Link></div>}
 {loading&&<div className="loading-row"><span className="spinner"/> Mengambil daftar anime...</div>}
 <AnimeSection title="Sedang populer" subtitle="Anime yang sedang banyak dicari" items={home.popular?.length?home.popular:popular} href="/explore?sort=views"/>
 <AnimeSection title="Episode & anime terbaru" subtitle="Jangan sampai ketinggalan update" items={home.new?.length?home.new:latest} href="/explore?sort=latest"/>
 <AnimeSection title="Pilihan untuk kamu" subtitle="Mulai petualangan berikutnya" items={home.hot?.length?home.hot:home.today}/>
 {!loading&&!error&&!latest.length&&!popular.length&&!home.popular.length&&<div className="empty-state"><div className="empty-icon"><Search size={24}/></div><h3>Belum ada data anime</h3><p>Pastikan backend Railway sudah berjalan dan URL API diatur dengan benar.</p><Link className="button-primary" href="/explore">Jelajahi anime</Link></div>}
 <section className="community-banner"><div><span className="eyebrow">RUANG ANIME-MU</span><h2>Semua tontonan, tersimpan rapi.</h2><p>Buat daftar favorit dan watchlist agar kamu tidak kehilangan anime yang ingin ditonton.</p></div><Link href="/favorites" className="button-light">Buka koleksi <ArrowRight size={16}/></Link></section></>;
}
