import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ClassCard } from "../components/ClassCard";
import { classes, levels, type Level } from "../data/classes";
import { useSeo } from "../lib/seo";

export default function Classes() {
  const [level, setLevel] = useState<"all" | Level>("all");
  const [query, setQuery] = useState("");

  useSeo({
    title: "Classes — MathClass Network",
    description:
      "Browse MathClass Network class rooms from pre-algebra to calculus, statistics and number theory. Filter by level or search by topic.",
    path: "/classes",
  });

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return classes.filter((item) => {
      const matchesLevel = level === "all" || item.level === level;
      const haystack = [item.name, item.blurb, item.levelLabel, ...item.topics].join(" ").toLowerCase();
      return matchesLevel && (search.length === 0 || haystack.includes(search));
    });
  }, [level, query]);

  const isFiltered = level !== "all" || query.trim().length > 0;

  function reset() {
    setLevel("all");
    setQuery("");
  }

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <p className="kicker">
            <span>Classes</span> The catalogue
          </p>
          <h1>Find the class you are actually taking.</h1>
          <p className="lead">
            Every room follows a real course sequence, so the questions inside look like the questions on
            your homework. Filter by level, or search for a topic.
          </p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap">
          <div className="toolbar">
            <div className="chips" role="group" aria-label="Filter classes by level">
              {levels.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="chip"
                  aria-pressed={level === item.id}
                  onClick={() => setLevel(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="search">
              <label className="sr-only" htmlFor="class-search">
                Search classes or topics
              </label>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
              <input
                id="class-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search classes or topics"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="results-bar">
            <span>
              Showing <strong>{filtered.length}</strong> of {classes.length} classes
            </span>
            {isFiltered ? (
              <button type="button" className="link-btn" onClick={reset}>
                Clear filters
              </button>
            ) : (
              <span>Free · peer-led · no prerequisites to look around</span>
            )}
          </div>

          {filtered.length > 0 ? (
            <div className="class-grid">
              {filtered.map((item) => (
                <ClassCard key={item.slug} item={item} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No classes match that yet.</h2>
              <p>Try a broader search, or clear the filters to see the whole catalogue.</p>
              <button type="button" className="btn btn-ghost" onClick={reset}>
                Clear filters
              </button>
            </div>
          )}

          <p className="note-bar">
            This is the foundation release: every room is a working skeleton, and unit counts are
            placeholders. New rooms open as tutors and students join.
          </p>
        </div>
      </section>

      <section className="cta-wrap">
        <div className="wrap">
          <div className="cta-inner" data-reveal>
            <p className="eyebrow-pill">
              <span className="dot" aria-hidden="true" />
              Missing a class?
            </p>
            <h2>Tell us what to build next.</h2>
            <p>
              The network grows in the order people need it. If your course is not here yet, it is a good
              candidate for the next room.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-lime" to="/community#rooms">
                Visit the community
              </Link>
              <Link className="btn btn-outline-light" to="/">
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
