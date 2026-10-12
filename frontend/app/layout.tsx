import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SiteShell } from '@/components/site-shell';
export const metadata: Metadata = {
  title: { default: 'AnimID — Temukan anime favoritmu', template: '%s | AnimID' },
  description: 'Temukan anime baru, simpan favorit, dan lanjutkan tontonanmu di AnimID.',
  applicationName: 'AnimID',
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
};
export const viewport: Viewport = { themeColor: '#0d0b12', width: 'device-width', initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body><SiteShell>{children}</SiteShell></body></html>;
}
