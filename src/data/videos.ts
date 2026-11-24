export const VIDEOS_ORIGIN = "https://videos.mathclass.uk";

/** The public catalogue API the videos app reads from. */
const CATALOG_ORIGIN = "https://v3-cinemeta.strem.io";

export type VideoResult = {
  id: string;
  type: "movie" | "series";
  name: string;
  year?: string;
  poster?: string;
  rating?: string;
};

type CinemetaMeta = {
  id?: string;
  imdb_id?: string;
  type?: string;
  name?: string;
  releaseInfo?: string | number;
  year?: string | number;
  poster?: string;
  imdbRating?: string | number;
};

/** Search page on the videos app, e.g. https://videos.mathclass.uk/q/matrix */
export function videosSearchUrl(query: string) {
  const trimmed = query.trim();
  return trimmed ? `${VIDEOS_ORIGIN}/q/${encodeURIComponent(trimmed)}` : `${VIDEOS_ORIGIN}/`;
}

/** Same slug rules the videos app uses for detail URLs. */
export function slugifyTitle(title: string) {
  return (
    title
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 72)
      .replace(/-+$/g, "") || "title"
  );
}

/** Detail page on the videos app, e.g. /movie/the-matrix-tt0133093 */
export function videoWatchUrl(video: VideoResult) {
  return `${VIDEOS_ORIGIN}/${video.type}/${slugifyTitle(video.name)}-${video.id}`;
}

/** Searches films and series in the catalogue the videos app uses. */
export async function searchVideos(query: string, signal?: AbortSignal): Promise<VideoResult[]> {
  const term = encodeURIComponent(query.trim());
  const responses = await Promise.allSettled(
    (["movie", "series"] as const).map((type) =>
      fetch(`${CATALOG_ORIGIN}/catalog/${type}/top/search=${term}.json`, { signal }).then((response) => {
        if (!response.ok) throw new Error(`Cinemeta responded ${response.status}`);
        return response.json() as Promise<{ metas?: CinemetaMeta[] }>;
      }),
    ),
  );

  if (responses.every((response) => response.status === "rejected")) {
    throw new Error("Video search is unavailable");
  }

  const seen = new Set<string>();
  const videos: VideoResult[] = [];

  for (const response of responses) {
    if (response.status !== "fulfilled") continue;

    for (const meta of response.value?.metas ?? []) {
      const id = String(meta.id ?? meta.imdb_id ?? "").toLowerCase();
      if (!id || !meta.name || seen.has(id)) continue;
      seen.add(id);

      const year = meta.releaseInfo ?? meta.year;
      videos.push({
        id,
        type: meta.type === "series" ? "series" : "movie",
        name: String(meta.name),
        year: year ? String(year) : undefined,
        poster: typeof meta.poster === "string" ? meta.poster : undefined,
        rating: meta.imdbRating ? String(meta.imdbRating) : undefined,
      });
    }
  }

  return videos;
}
