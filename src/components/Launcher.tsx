import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { HUB_GAMES, hubSearchUrl, type HubGame } from "../data/games";
import {
  searchVideos,
  videoWatchUrl,
  videosSearchUrl,
  type VideoResult,
} from "../data/videos";

const GAME_RESULTS = 5;
const VIDEO_RESULTS = 4;
const MIN_VIDEO_QUERY = 2;

function formatViews(views: number) {
  if (views < 1000) return `${views} views`;
  const thousands = views / 1000;
  return `${Number.isInteger(thousands) ? thousands : thousands.toFixed(1)}k views`;
}

/** Weighted best match: exact/prefix names first, then title terms, tags and descriptions. */
function rankGames(games: HubGame[], query = "") {
  const phrase = query.trim().toLowerCase();
  const terms = phrase.split(/\s+/).filter(Boolean);

  if (!terms.length) {
    return [...games].sort(
      (a, b) =>
        (b.views ?? 0) - (a.views ?? 0) ||
        Number(Boolean(b.editorsPick)) - Number(Boolean(a.editorsPick)) ||
        a.name.localeCompare(b.name),
    );
  }

  const relevance = (game: HubGame) => {
    const name = game.name.toLowerCase();
    const tags = (game.tags ?? []).join(" ").toLowerCase();
    const description = (game.description ?? "").toLowerCase();
    const nameHits = terms.filter((term) => name.includes(term)).length;
    const tagHits = terms.filter((term) => tags.includes(term)).length;
    const descriptionHits = terms.filter((term) => description.includes(term)).length;

    let score = nameHits * 60 + tagHits * 20 + descriptionHits * 4;
    if (name === phrase) score += 1000;
    else if (name.startsWith(phrase)) score += 500;
    else if (name.includes(phrase)) score += 250;
    if (terms.length > 1 && nameHits === terms.length) score += 120;
    if (name.startsWith(phrase)) score += Math.max(0, 40 - (name.length - phrase.length));
    return score;
  };

  return games
    .map((game) => ({ game, score: relevance(game) }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        (b.game.views ?? 0) - (a.game.views ?? 0) ||
        Number(Boolean(b.game.editorsPick)) - Number(Boolean(a.game.editorsPick)) ||
        a.game.name.localeCompare(b.game.name),
    )
    .map(({ game }) => game);
}

function searchGames(query: string) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];

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

/** Full-screen start page: one round search bar over the games and videos catalogues. */
export function Launcher() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [dismissed, setDismissed] = useState(false);
  const [active, setActive] = useState(-1);
  const [videos, setVideos] = useState<VideoResult[]>([]);
  const [videoState, setVideoState] = useState<"idle" | "loading" | "ready" | "error">("idle");

  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const trimmed = query.trim();
  const open = trimmed.length > 0 && !dismissed;

  const gameMatches = useMemo(() => searchGames(query), [query]);
  const games = gameMatches.slice(0, GAME_RESULTS);
  const videoResults = videos.slice(0, VIDEO_RESULTS);
  const videoPending = videoState === "idle" || videoState === "loading";
  const videoSearchable = trimmed.length >= MIN_VIDEO_QUERY;
  const nothingFound =
    Boolean(trimmed) && gameMatches.length === 0 && videoState === "ready" && videos.length === 0;

  // Row order matches the rendered list so arrow keys and Enter agree.
  const entries = useMemo(
    () => [
      ...games.map((game) => game.url),
      ...videoResults.map((video) => videoWatchUrl(video)),
    ],
    [games, videoResults],
  );

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

  useEffect(() => {
    setActive(-1);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setDismissed(true);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;
    const href = entries[active >= 0 ? active : 0];
    window.location.assign(href ?? videosSearchUrl(term));
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setDismissed(true);
      input.current?.blur();
      return;
    }
    if (!open) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!entries.length) return;
      setActive((current) => (current + 1) % entries.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!entries.length) return;
      setActive((current) => (current <= 0 ? entries.length - 1 : current - 1));
    }
  }

  return (
    <section className="launcher" aria-label="Search math_class">
      <header className="start-bar">
        <a className="start-brand" href="/" aria-label="MathClass Network home">
          <img className="start-brand-logo" src="/favicon.svg" alt="" width={20} height={20} />
          mathclass<span className="start-brand-sep">;</span>network
        </a>
      </header>

      <div className="start-hub">
        <h1 className="sr-only">Search Anything</h1>

        <div className="start-search" ref={root}>
          <form className="search-shell" role="search" onSubmit={submit}>
            <svg
              className="search-icon"
              width="21"
              height="21"
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
              Search Anything
            </label>
            <input
              ref={input}
              id="network-search"
              className="search-input"
              type="text"
              placeholder="Search Anything."
              autoComplete="off"
              spellCheck={false}
              enterKeyHint="search"
              role="combobox"
              aria-expanded={open}
              aria-controls="search-drop"
              aria-autocomplete="list"
              aria-activedescendant={open && active >= 0 ? `search-opt-${active}` : undefined}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setDismissed(false);
              }}
              onFocus={() => setDismissed(false)}
              onKeyDown={onKeyDown}
            />
            <kbd className="search-kbd" aria-hidden="true">
              Enter
            </kbd>
          </form>

          {open ? (
            <div className="search-drop" id="search-drop" role="listbox" aria-label="Search results">
              {games.length > 0 ? (
                <section className="drop-group">
                  <div className="drop-head">
                    <h2>Games</h2>
                    <span>{gameMatches.length}</span>
                  </div>
                  <ul className="drop-list">
                    {games.map((game, index) => (
                      <li key={game.id}>
                        <a
                          id={`search-opt-${index}`}
                          className={`drop-row${active === index ? " is-active" : ""}`}
                          role="option"
                          aria-selected={active === index}
                          href={game.url}
                          onMouseEnter={() => setActive(index)}
                        >
                          {game.cover ? (
                            <img className="drop-cover" src={game.cover} alt="" loading="lazy" decoding="async" />
                          ) : (
                            <span className="drop-cover drop-cover-fallback" aria-hidden="true">
                              {game.name.charAt(0)}
                            </span>
                          )}
                          <span className="drop-text">
                            <span className="drop-name">{game.name}</span>
                            <span className="drop-meta">{gameMeta(game)}</span>
                          </span>
                          {game.views ? <span className="drop-side">{formatViews(game.views)}</span> : null}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {videoSearchable ? (
                <section className="drop-group">
                  <div className="drop-head">
                    <h2>Videos</h2>
                    <span>
                      {videoState === "ready"
                        ? videos.length
                        : videoState === "error"
                          ? "offline"
                          : "…"}
                    </span>
                  </div>

                  {videoState === "error" ? (
                    <p className="drop-note">
                      Video search is offline.{" "}
                      <a href={videosSearchUrl(query)}>Search videos.mathclass.uk</a>.
                    </p>
                  ) : null}

                  {videoPending ? <p className="drop-note">Searching videos…</p> : null}

                  {videoState === "ready" && videoResults.length === 0 ? (
                    <p className="drop-note">No videos match “{trimmed}”.</p>
                  ) : null}

                  {videoResults.length > 0 ? (
                    <ul className="drop-list">
                      {videoResults.map((video, index) => {
                        const option = games.length + index;
                        return (
                          <li key={video.id}>
                            <a
                              id={`search-opt-${option}`}
                              className={`drop-row${active === option ? " is-active" : ""}`}
                              role="option"
                              aria-selected={active === option}
                              href={videoWatchUrl(video)}
                              onMouseEnter={() => setActive(option)}
                            >
                              <span
                                className="drop-thumb"
                                style={video.poster ? { backgroundImage: `url("${video.poster}")` } : undefined}
                                aria-hidden="true"
                              >
                                {video.poster ? null : "▶"}
                              </span>
                              <span className="drop-text">
                                <span className="drop-name">{video.name}</span>
                                <span className="drop-meta">{videoMeta(video)}</span>
                              </span>
                              {video.rating ? <span className="drop-side">{video.rating}★</span> : null}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </section>
              ) : null}

              {nothingFound ? <p className="drop-empty">No games or videos match “{trimmed}”.</p> : null}

              {!videoSearchable && gameMatches.length === 0 ? (
                <p className="drop-empty">
                  No games match “{trimmed}”. Type {MIN_VIDEO_QUERY}+ letters to search videos too.
                </p>
              ) : null}

              <div className="drop-actions">
                <a href={hubSearchUrl(query)}>
                  All games for “{trimmed}”
                  <span aria-hidden="true">→</span>
                </a>
                <a href={videosSearchUrl(query)}>
                  All videos for “{trimmed}”
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
