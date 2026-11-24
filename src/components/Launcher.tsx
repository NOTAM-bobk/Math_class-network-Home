import { useEffect, useMemo, useState, type FormEvent } from "react";
import { HUB_GAMES, HUB_ORIGIN, hubSearchUrl, type HubGame } from "../data/games";
import {
  VIDEOS_ORIGIN,
  searchVideos,
  videosSearchUrl,
  type VideoResult,
} from "../data/videos";

const BOOKMARKS = [
  { label: "Videos", href: VIDEOS_ORIGIN },
  { label: "YouTube", href: "https://yt.mathclass.uk" },
  { label: "Chat", href: "https://math-class-chat.vercel.app" },
  { label: "AI", href: "https://math-class-ai.vercel.app" },
];

const MIN_VIDEO_QUERY = 2;
const TITLE = "What do you want to do";
const DECODE_GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+={}/<>_";

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

/** Reveal the title letter by letter, cycling scrambled glyphs until each one resolves. */
function useDecodedText(text: string) {
  const [decoded, setDecoded] = useState(text);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDecoded(text);
      return;
    }

    const scramble = (revealed: number) =>
      Array.from(text, (character, index) => {
        if (character === " ") return " ";
        if (index < revealed) return character;
        return DECODE_GLYPHS[Math.floor(Math.random() * DECODE_GLYPHS.length)];
      }).join("");

    let revealed = 0;
    let lastStep = 0;
    let frame = 0;

    setDecoded(scramble(0));

    const step = (now: number) => {
      if (now - lastStep >= 45) {
        lastStep = now;
        revealed = Math.min(revealed + 1, text.length);
        setDecoded(scramble(revealed));
      }
      if (revealed < text.length) frame = window.requestAnimationFrame(step);
    };

    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [text]);

  return decoded;
}

/** Search start page over the games hub and the videos catalogue. */
export function Launcher() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [videos, setVideos] = useState<VideoResult[]>([]);
  const title = useDecodedText(TITLE);

  const gameMatches = useMemo(() => searchGames(query), [query]);

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
      return;
    }

    const controller = new AbortController();
    setVideos([]);

    searchVideos(term, controller.signal)
      .then((results) => {
        if (controller.signal.aborted) return;
        setVideos(results);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setVideos([]);
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
            <img className="start-brand-logo" src="/favicon.svg" alt="" width={20} height={20} />
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
            <span className="sr-only">{TITLE}</span>
            <span aria-hidden="true">{title}</span>
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
      </div>
    </section>
  );
}
