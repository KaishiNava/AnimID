'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Compass, Heart, Bookmark, UserRound, Clapperboard, Menu, X } from 'lucide-react';
import { useState } from 'react';
const nav = [
  { href: '/', label: 'Beranda', Icon: Clapperboard },
  { href: '/explore', label: 'Jelajahi', Icon: Compass },
  { href: '/favorites', label: 'Favorit', Icon: Heart },
  { href: '/watchlist', label: 'Watchlist', Icon: Bookmark },
];
export function SiteShell({ children }: { children: React.ReactNode }) {
  const path = usePathname(); const [open, setOpen] = useState(false);
  return <><header className="topbar"><div className="topbar-inner"><Link href="/" className="brand"><span className="brand-mark"><svg viewBox="0 0 36 36" aria-hidden="true"><path d="M7 27 17.8 6 29 27h-6l-5.2-10-5 10Z" fill="currentColor"/><path d="M13 23h10" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round"/></svg></span><span>Anim<span>ID</span></span></Link><nav className={`nav-links ${open ? 'nav-open' : ''}`}>{nav.map(({href,label,Icon}) => <Link key={href} href={href} onClick={()=>setOpen(false)} className={`nav-link ${path === href ? 'active' : ''}`}><Icon size={17} strokeWidth={1.8}/>{label}</Link>)}</nav><div className="header-actions"><Link className="icon-button search-shortcut" href="/explore" aria-label="Cari anime"><Search size={19}/></Link><Link className="profile-button" href="/login"><UserRound size={17}/><span>Masuk</span></Link><button className="icon-button mobile-menu" onClick={()=>setOpen(!open)} aria-label="Menu">{open?<X size={20}/>:<Menu size={20}/>}</button></div></div></header><main className="main-container">{children}</main><footer className="footer"><div className="footer-brand"><span className="brand-mark small"><svg viewBox="0 0 36 36"><path d="M7 27 17.8 6 29 27h-6l-5.2-10-5 10Z" fill="currentColor"/><path d="M13 23h10" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round"/></svg></span>AnimID</div><span>Temukan cerita yang ingin kamu ikuti.</span><span className="footer-copy">© {new Date().getFullYear()} AnimID</span></footer></>;
}
