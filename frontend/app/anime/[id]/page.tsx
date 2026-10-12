import { AnimeDetailPage } from '@/components/anime-detail-page';
export default async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <AnimeDetailPage id={id} />; }
