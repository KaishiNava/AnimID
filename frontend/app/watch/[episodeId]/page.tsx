import { WatchPage } from '@/components/watch-page';
export default async function Page({ params, searchParams }: { params: Promise<{ episodeId: string }>; searchParams: Promise<{ anime?: string }> }) { const { episodeId } = await params; const { anime } = await searchParams; return <WatchPage episodeId={episodeId} animeId={anime || ''} />; }
