import { useEffect, useMemo, useState, type FormEvent } from "react";
import { HUB_GAMES, HUB_ORIGIN, MOST_VIEWED, hubSearchUrl, type HubGame } from "../data/games";
import {
  VIDEOS_ORIGIN,
  searchVideos,
  videoWatchUrl,
  videosSearchUrl,
  type VideoResult,
} from "../data/videos";

const BOOKMARKS = [
  { label: "Videos", href: VIDEOS_ORIGIN },
  { label: "YouTube", href: "https://yt.mathclass.uk" },
  { label: "Chat", href: "https://math-class-chat.vercel.app" },
  { label: "AI", href: "https://math-class-ai.vercel.app" },
];

const GAME_RESULTS = 4;
const DEFAULT_RESULTS = 6;
const VIDEO_RESULTS = 4;
const MIN_VIDEO_QUERY = 2;

function formatViews(views: number) {
  if (views < 1000) return `${views} views`;
  const thousands = views / 1000;
  return `${Number.isInteger(thousands) ? thousands : thousands.toFixed(1)}k views`;
}

/** Closest name match first, then most viewed, editor picks, alphabetical. */
function rankGames(games: HubGame[], query = "") {
  const phrase = query.trim().toLowerCase();
  const nameScore = (game: HubGame) => {
    if (!phrase) return 0;
    const name = game.name.toLowerCase();
    if (name === phrase) return 4;
    if (name.startsWith(phrase)) return 3;
    if (name.includes(phrase)) return 2;
    return 1;
  };

  return [...games].sort(
    (a, b) =>
      nameScore(b) - nameScore(a) ||
      (b.views ?? 0) - (a.views ?? 0) ||
      Number(Boolean(b.editorsPick)) - Number(Boolean(a.editorsPick)) ||
      a.name.localeCompare(b.name),
  );
}

function gameMeta(game: HubGame) {
  const values = [game.category, ...(game.tags ?? [])].filter((value): value is string => Boolean(value));
  const unique = values.filter(
    (value, index) => values.findIndex((entry) => entry.toLowerCase() === value.toLowerCase()) === index,
  );
  return unique.slice(0, 3).join(" · ");
}

function videoMeta(video: VideoResult) {
  return [video.type === "series" ? "Series" : "Film", video.year].filter(Boolean).join(" · ");
}

function searchGames(query: string) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return rankGames(HUB_GAMES);

  return rankGames(
    HUB_GAMES.filter((game) => {
      const haystack = [game.name, game.category, game.description, ...(game.tags ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return terms.every((term) => haystack.includes(term));
    }),
    query,
  );
}

/** Search start page over the games hub and the videos catalogue. */
export function Launcher() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [videos, setVideos] = useState<VideoResult[]>([]);
  const [videoState, setVideoState] = useState<"idle" | "loading" | "ready" | "error">("idle");

  const trimmed = query.trim();
  const gameMatches = useMemo(() => searchGames(query), [query]);
  const games = gameMatches.slice(0, trimmed ? GAME_RESULTS : DEFAULT_RESULTS);
  const videoResults = videos.slice(0, VIDEO_RESULTS);
  const videoPending = videoState === "idle" || videoState === "loading";
  const nothingFound = Boolean(trimmed) && gameMatches.length === 0 && videoState === "ready" && videos.length === 0;

  useEffect(() => {
    if (!query.trim()) {
      setDebounced("");
      return;
    }
    const timer = window.setTimeout(() => setDebounced(query), 320);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const term = debounced.trim();
    if (term.length < MIN_VIDEO_QUERY) {
      setVideos([]);
      setVideoState("idle");
      return;
    }

    const controller = new AbortController();
    setVideos([]);
    setVideoState("loading");

    searchVideos(term, controller.signal)
      .then((results) => {
        if (controller.signal.aborted) return;
        setVideos(results);
        setVideoState("ready");
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setVideos([]);
        setVideoState("error");
      });

    return () => controller.abort();
  }, [debounced]);

  function openSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    // A game-only query should not land on the film catalogue's search page.
    const gameOnly = gameMatches.length > 0 && videos.length === 0;
    window.location.assign(gameOnly ? hubSearchUrl(term) : videosSearchUrl(term));
  }

  return (
    <section className="launcher" aria-labelledby="launcher-title">
      <div className="launcher-inner">
        <header className="start-bar">
          <a className="start-brand" href="/">
            <span className="start-brand-dot" aria-hidden="true" />
            math_class:network
          </a>
          <nav className="start-bookmarks" aria-label="Bookmarks">
            {BOOKMARKS.map((bookmark) => (
              <a className="start-bookmark" key={bookmark.label} href={bookmark.href}>
                {bookmark.label}
              </a>
            ))}
          </nav>
        </header>

        <div className="start-hero">
          <h1 className="launcher-title" id="launcher-title">
            What do you want to do
          </h1>
          <p className="start-sub">Search the games hub and the video catalogue.</p>

          <form className="search-shell" role="search" onSubmit={openSearch}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="6.5" />
              <path d="M16 16l4.5 4.5" />
            </svg>
            <label className="sr-only" htmlFor="network-search">
              Search games and videos
            </label>
            <input
              id="network-search"
              className="search-input"
              type="search"
              placeholder="Search games and videos"
              autoComplete="off"
              spellCheck={false}
              enterKeyHint="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <kbd className="search-kbd" aria-hidden="true">
              Enter
            </kbd>
          </form>

          <p className="start-scope">
            <span>
              Games from <a href={HUB_ORIGIN}>math_games</a>
            </span>
            <span className="start-scope-sep" aria-hidden="true">
              ·
            </span>
            <span>
              Videos from <a href={VIDEOS_ORIGIN}>videos.mathclass.uk</a>
            </span>
          </p>
        </div>

        <div className="start-results">
          <div className="results-main">
            <p className="results-head" aria-live="polite">
              <span>{trimmed ? <>Results for “{trimmed}”</> : "Games on math_games"}</span>
              <span>
                <strong>{trimmed ? gameMatches.length : HUB_GAMES.length}</strong>{" "}
                {trimmed ? (gameMatches.length === 1 ? "game" : "games") : "games"}
                {trimmed && videoState === "ready" ? (
                  <>
                    {" · "}
                    <strong>{videos.length}</strong> {videos.length === 1 ? "video" : "videos"}
                  </>
                ) : null}
                {trimmed && (videoState === "idle" || videoState === "loading") ? <> · videos…</> : null}
                {trimmed && videoState === "error" ? <> · videos offline</> : null}
              </span>
            </p>

            {trimmed && nothingFound ? (
              <p className="results-empty">No games or videos match “{trimmed}”.</p>
            ) : (
              <>
                {games.length > 0 ? (
                  <section className="result-group" aria-label="Games">
                    {trimmed ? (
                      <div className="result-group-head">
                        <h2>Games</h2>
                        <span>{gameMatches.length}</span>
                      </div>
                    ) : null}
                    <ul className="hub-results">
                      {games.map((game) => (
                        <li key={game.name}>
                          <a className="hub-result" href={game.url}>
                            <span className="hub-tile" aria-hidden="true">
                              {game.name.charAt(0)}
                            </span>
                            <span className="hub-text">
                              <span className="hub-name">{game.name}</span>
                              <span className="hub-meta">{gameMeta(game)}</span>
                            </span>
                            {game.views ? <span className="hub-views">{formatViews(game.views)}</span> : null}
                            <svg
                              className="hub-arrow"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.1"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}

                {trimmed.length >= MIN_VIDEO_QUERY ? (
                  <section className="result-group" aria-label="Videos" aria-busy={videoPending}>
                    <div className="result-group-head">
                      <h2>Videos</h2>
                      <span>{videoState === "ready" ? videos.length : videoState === "error" ? "offline" : "—"}</span>
                    </div>

                    {videoPending ? <p className="results-note">Searching videos…</p> : null}

                    {videoState === "error" ? (
                      <p className="results-note">
                        Video search is offline.{" "}
                        <a href={videosSearchUrl(query)}>Search videos.mathclass.uk</a>.
                      </p>
                    ) : null}

                    {videoState === "ready" && videoResults.length === 0 ? (
                      <p className="results-note">No videos match “{trimmed}”.</p>
                    ) : null}

                    {videoResults.length > 0 ? (
                      <ul className="hub-results">
                        {videoResults.map((video) => (
                          <li key={video.id}>
                            <a className="hub-result" href={videoWatchUrl(video)}>
                              <span
                                className="video-thumb"
                                style={video.poster ? { backgroundImage: `url("${video.poster}")` } : undefined}
                                aria-hidden="true"
                              >
                                {video.poster ? null : "▶"}
                              </span>
                              <span className="hub-text">
                                <span className="hub-name">{video.name}</span>
                                <span className="hub-meta">{videoMeta(video)}</span>
                              </span>
                              {video.rating ? <span className="hub-views">{video.rating}★</span> : null}
                              <svg
                                className="hub-arrow"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.1"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                              >
                                <path d="M5 12h14M13 6l6 6-6 6" />
                              </svg>
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                ) : null}

                {trimmed && trimmed.length < MIN_VIDEO_QUERY && games.length === 0 ? (
                  <p className="results-empty">
                    No games match “{trimmed}”. Type {MIN_VIDEO_QUERY}+ letters to search videos too.
                  </p>
                ) : null}
              </>
            )}

            <div className="results-actions">
              <a className="results-all" href={hubSearchUrl(query)}>
                {trimmed ? `All games for “${trimmed}” on math_games` : "Browse all games on math_games"}
                <span aria-hidden="true">→</span>
              </a>
              <a className="results-all" href={videosSearchUrl(query)}>
                {trimmed ? `All videos for “${trimmed}” on videos.mathclass.uk` : "Browse videos.mathclass.uk"}
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <aside className="start-rail" aria-labelledby="rail-title">
            <div className="rail-head">
              <h2 id="rail-title">Most viewed</h2>
              <span className="rail-note">2,000+ views</span>
            </div>
            <ul className="rail-list">
              {MOST_VIEWED.map((game, index) => (
                <li key={game.name}>
                  <a className="rail-item" href={game.url}>
                    <span className="rail-rank">{String(index + 1).padStart(2, "0")}</span>
                    <span className="rail-name">{game.name}</span>
                    <span className="rail-views">{game.views ? formatViews(game.views) : ""}</span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
