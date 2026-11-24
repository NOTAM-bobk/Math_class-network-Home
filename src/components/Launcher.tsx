import { useMemo, useState, type FormEvent } from "react";
import { HUB_GAMES, MOST_VIEWED, hubSearchUrl, type HubGame } from "../data/games";

const BOOKMARKS = [
  { label: "Videos", href: "https://video.mathclass.uk" },
  { label: "YouTube", href: "https://yt.mathclass.uk" },
  { label: "Chat", href: "https://math-class-chat.vercel.app" },
  { label: "AI", href: "https://math-class-ai.vercel.app" },
];

const VISIBLE_RESULTS = 6;

function formatViews(views: number) {
  if (views < 1000) return `${views} views`;
  const thousands = views / 1000;
  return `${Number.isInteger(thousands) ? thousands : thousands.toFixed(1)}k views`;
}

/** Most viewed first, then editor picks, then alphabetical. */
function rankGames(games: HubGame[]) {
  return [...games].sort(
    (a, b) =>
      (b.views ?? 0) - (a.views ?? 0) ||
      Number(Boolean(b.editorsPick)) - Number(Boolean(a.editorsPick)) ||
      a.name.localeCompare(b.name),
  );
}

function gameMeta(game: HubGame) {
  const values = [game.category, ...(game.tags ?? [])];
  const unique = values.filter(
    (value, index) => values.findIndex((entry) => entry.toLowerCase() === value.toLowerCase()) === index,
  );
  return unique.slice(0, 3).join(" · ");
}

function searchGames(query: string) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return rankGames(HUB_GAMES);

  return rankGames(
    HUB_GAMES.filter((game) => {
      const haystack = [game.name, game.category, ...(game.tags ?? [])].join(" ").toLowerCase();
      return terms.every((term) => haystack.includes(term));
    }),
  );
}

/** Browser-style start page over the math_games catalogue. */
export function Launcher() {
  const [query, setQuery] = useState("");
  const ranked = useMemo(() => searchGames(query), [query]);
  const results = ranked.slice(0, VISIBLE_RESULTS);
  const trimmed = query.trim();

  function openHubSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.location.assign(hubSearchUrl(query));
  }

  return (
    <section className="launcher" aria-labelledby="launcher-title">
      <div className="launcher-inner">
        <div className="launcher-head">
          <h1 className="launcher-title" id="launcher-title">
            What do you want to do
          </h1>
          <p className="launcher-count">
            <strong>{HUB_GAMES.length} games</strong> indexed from{" "}
            <a href="https://games.mathclass.uk">math_games</a>
          </p>
        </div>

        <div className="browser">
          <div className="browser-tabs">
            <span className="browser-tab">
              <span className="browser-tab-dot" aria-hidden="true" />
              math_class:network
            </span>
          </div>

          <div className="browser-toolbar">
            <div className="browser-nav">
              <button
                className="browser-icon-btn"
                type="button"
                aria-label="Go back"
                title="Go back"
                onClick={() => window.history.back()}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                className="browser-icon-btn"
                type="button"
                aria-label="Go forward"
                title="Go forward"
                onClick={() => window.history.forward()}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
              <button
                className="browser-icon-btn"
                type="button"
                aria-label="Reload"
                title="Reload"
                onClick={() => window.location.reload()}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 12a8 8 0 1 1-2.7-6" />
                  <path d="M20 4v5h-5" />
                </svg>
              </button>
            </div>

            <form className="browser-omnibox" role="search" onSubmit={openHubSearch}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="6.5" />
                <path d="M16 16l4.5 4.5" />
              </svg>
              <label className="sr-only" htmlFor="hub-search">
                Search math_games
              </label>
              <input
                id="hub-search"
                className="browser-input"
                type="search"
                placeholder="Search games.mathclass.uk"
                autoComplete="off"
                spellCheck={false}
                enterKeyHint="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <kbd className="browser-kbd" aria-hidden="true">
                Enter
              </kbd>
            </form>
          </div>

          <nav className="browser-bookmarks" aria-label="Bookmarks">
            {BOOKMARKS.map((bookmark) => (
              <a className="browser-bookmark" key={bookmark.label} href={bookmark.href}>
                {bookmark.label}
              </a>
            ))}
          </nav>

          <div className="browser-page">
            <div className="browser-main">
              <p className="results-head" aria-live="polite">
                <span>{trimmed ? <>Results for “{trimmed}”</> : "Games on math_games"}</span>
                <span>
                  <strong>{ranked.length}</strong>{" "}
                  {trimmed ? (ranked.length === 1 ? "match" : "matches") : "games"}
                </span>
              </p>

              {results.length > 0 ? (
                <ul className="hub-results">
                  {results.map((game) => (
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
              ) : (
                <p className="results-empty">No games in the index match “{trimmed}”.</p>
              )}

              <a className="results-all" href={hubSearchUrl(query)}>
                {trimmed ? `See all results for “${trimmed}” on math_games` : "Browse all games on math_games"}
                <span aria-hidden="true">→</span>
              </a>
            </div>

            <aside className="browser-rail" aria-labelledby="rail-title">
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
      </div>
    </section>
  );
}
