import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Anime } from '@/lib/types';
import { AnimeCard } from './anime-card';
export function AnimeSection({ title, subtitle, items, href }: { title:string; subtitle?:string; items:Anime[]; href?:string }) {
  if (!items?.length) return null;
  return <section className="content-section"><div className="section-heading"><div><h2>{title}</h2>{subtitle&&<p>{subtitle}</p>}</div>{href&&<Link className="text-link" href={href}>Lihat semua <ArrowRight size={15}/></Link>}</div><div className="anime-grid">{items.slice(0,10).map((anime,i)=><AnimeCard key={`${anime.id}-${i}`} anime={anime}/>)}</div></section>;
}
