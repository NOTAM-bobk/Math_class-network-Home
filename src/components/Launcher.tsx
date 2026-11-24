import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

type Destination = {
  id: string;
  label: string;
  domain: string;
  href: string;
  keywords: string[];
  icon: ReactNode;
};

const DESTINATIONS: Destination[] = [
  {
    id: "games",
    label: "Games",
    domain: "games.mathclass.uk",
    href: "https://games.mathclass.uk",
    keywords: ["games", "game", "play", "arcade", "browser games"],
    icon: (
      <>
        <rect x="2" y="7" width="20" height="10" rx="3.5" />
        <path d="M7 11v3M5.5 12.5h3" />
        <path d="M16.5 11.5h.01M18.5 14h.01" />
      </>
    ),
  },
  {
    id: "videos",
    label: "Videos",
    domain: "video.mathclass.uk",
    href: "https://video.mathclass.uk",
    keywords: ["videos", "video", "watch", "movies", "shows"],
    icon: (
      <>
        <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" />
        <path d="M7 5.5v13M17 5.5v13M2.5 12h19" />
      </>
    ),
  },
  {
    id: "youtube",
    label: "YouTube",
    domain: "yt.mathclass.uk",
    href: "https://yt.mathclass.uk",
    keywords: ["youtube", "yt", "shorts", "tube"],
    icon: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="4.5" />
        <path d="M10.5 9.5l5 2.5-5 2.5z" />
      </>
    ),
  },
  {
    id: "chat",
    label: "Chat",
    domain: "math-class-chat.vercel.app",
    href: "https://math-class-chat.vercel.app",
    keywords: ["chat", "chats", "talk", "message", "messages", "friends", "groups"],
    icon: (
      <>
        <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.4-.7L3 21l1.6-4.5A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z" />
      </>
    ),
  },
  {
    id: "ai",
    label: "AI",
    domain: "math-class-ai.vercel.app",
    href: "https://math-class-ai.vercel.app",
    keywords: ["ai", "assistant", "essay", "essays", "homework", "write"],
    icon: (
      <>
        <path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z" />
        <path d="M18 15.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z" />
      </>
    ),
  },
];

/** Higher is a better match; -1 drops the destination from the list. */
function scoreDestination(destination: Destination, query: string) {
  if (!query) return 0;

  const label = destination.label.toLowerCase();
  const keys = [destination.id, ...destination.keywords].map((key) => key.toLowerCase());

  if (label === query) return 100;
  if (label.startsWith(query)) return 80;
  if (keys.some((key) => key === query)) return 70;
  if (keys.some((key) => key.startsWith(query))) return 60;
  if (label.includes(query)) return 50;
  if (keys.some((key) => key.includes(query))) return 40;
  if (destination.domain.includes(query)) return 20;
  return -1;
}

function rankDestinations(query: string) {
  const normalised = query.trim().toLowerCase();
  if (!normalised) return DESTINATIONS;

  return DESTINATIONS.map((destination, index) => ({
    destination,
    index,
    score: scoreDestination(destination, normalised),
  }))
    .filter((entry) => entry.score >= 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.destination);
}

/** Browser-style start bar: type part of a destination name and press Enter. */
export function Launcher() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const matches = useMemo(() => rankDestinations(query), [query]);
  const active = Math.min(activeIndex, Math.max(matches.length - 1, 0));

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const openDestination = (destination: Destination) => {
    setOpen(false);
    window.location.assign(destination.href);
  };

  return (
    <section className="launcher" aria-labelledby="launcher-title">
      <div className="launcher-inner">
        <p className="launcher-eyebrow">
          <span className="launcher-dot" aria-hidden="true" />
          math_class:network
        </p>

        <h1 className="launcher-title" id="launcher-title">
          What do you want to do
        </h1>

        <div className="launcher-search" ref={rootRef}>
          <div
            className={open ? "launcher-field is-open" : "launcher-field"}
            onClick={() => {
              inputRef.current?.focus();
              setOpen(true);
            }}
          >
            <svg
              className="launcher-search-icon"
              width="20"
              height="20"
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

            <input
              ref={inputRef}
              className="launcher-input"
              type="text"
              role="combobox"
              aria-label="Search games, videos, YouTube, chat or AI"
              aria-expanded={open}
              aria-controls="launcher-results"
              aria-autocomplete="list"
              aria-activedescendant={
                open && matches[active] ? `launcher-option-${matches[active].id}` : undefined
              }
              placeholder="Search games, videos, YouTube, chat, AI"
              autoComplete="off"
              spellCheck={false}
              enterKeyHint="go"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setOpen(true);
                  setActiveIndex((index) => Math.min(index + 1, matches.length - 1));
                } else if (event.key === "ArrowUp") {
                  event.preventDefault();
                  setActiveIndex((index) => Math.max(index - 1, 0));
                } else if (event.key === "Enter") {
                  event.preventDefault();
                  const destination = matches[active] ?? matches[0];
                  if (destination) openDestination(destination);
                } else if (event.key === "Escape") {
                  setOpen(false);
                  inputRef.current?.blur();
                }
              }}
            />

            <kbd className="launcher-kbd" aria-hidden="true">
              Enter
            </kbd>
          </div>

          {open && (
            <div className="launcher-panel" id="launcher-results" role="listbox" aria-label="Places to go">
              {matches.length === 0 ? (
                <p className="launcher-empty">
                  No match for “{query.trim()}”. Try games, videos, YouTube, chat or AI.
                </p>
              ) : (
                matches.map((destination, index) => (
                  <a
                    key={destination.id}
                    id={`launcher-option-${destination.id}`}
                    className="launcher-option"
                    role="option"
                    aria-selected={index === active}
                    href={destination.href}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => setOpen(false)}
                  >
                    <span className="launcher-icon" aria-hidden="true">
                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {destination.icon}
                      </svg>
                    </span>
                    <span className="launcher-option-text">
                      <span className="launcher-option-label">{destination.label}</span>
                      <span className="launcher-option-domain">{destination.domain}</span>
                    </span>
                    <svg
                      className="launcher-option-arrow"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </a>
                ))
              )}
            </div>
          )}
        </div>

        <div className="launcher-meta">
          <p className="launcher-hint">Type a name and press Enter.</p>
          <p className="launcher-links">
            <Link to="/classes">Classes</Link>
            <Link to="/community">Community</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
