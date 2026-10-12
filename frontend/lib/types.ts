export type Anime = {
  id: string | number; title: string; synonyms?: string | null; url?: string;
  type?: string | null; status?: string | null; day?: string | null; year?: string | number | null;
  views?: number | null; favorites?: number | null; genres?: string[]; poster?: string | null;
  cover?: string | null; aired_start?: string | null; synopsis?: string | null; studio?: string | null;
  total_episodes?: number; episodes?: Episode[];
};
export type Episode = { id: string | number; episode_number?: number | string; title?: string; image?: string | null; release_date?: string | null; is_new?: boolean; stream_api_url?: string };
export type AnimeHome = { today: Anime[]; popular: Anime[]; new: Anime[]; hot: Anime[]; slider: Anime[]; waiting: Anime[] };
