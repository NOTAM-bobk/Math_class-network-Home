import { Link, useParams } from "react-router-dom";
import { ClassCard } from "../components/ClassCard";
import { getClass, relatedClasses } from "../data/classes";
import { useSeo } from "../lib/seo";

export default function ClassDetail() {
  const { slug } = useParams();
  const item = getClass(slug);

  useSeo({
    title: item ? `${item.name} — MathClass Network` : "Class not found — MathClass Network",
    description: item ? item.blurb : "That class room does not exist yet. Browse the catalogue instead.",
    path: `/classes/${slug ?? ""}`,
  });

  if (!item) {
    return (
      <section className="page-head">
        <div className="wrap">
          <p className="kicker">
            <span>404</span> Missing room
          </p>
          <h1>That class room is not open yet.</h1>
          <p className="lead">
            The address might be mistyped, or the room may still be on the list to build. The catalogue has
            everything that exists today.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/classes">
              Back to classes
            </Link>
            <Link className="btn btn-ghost" to="/">
              Home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const related = relatedClasses(item);

  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/classes">Classes</Link>
            <span aria-hidden="true">/</span>
            <span>{item.name}</span>
          </nav>

          <div className="detail-head">
            <div>
              <div className="detail-tags">
                <span className="tag tag-ghost">{item.levelLabel}</span>
                <span className="tag">{item.units} units</span>
              </div>
              <h1>{item.name}</h1>
              <p className="lead">{item.blurb}</p>
            </div>
            <span className={`detail-symbol tint-${item.tint}`} aria-hidden="true">
              {item.symbol}
            </span>
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap detail-grid">
          <div className="detail-main">
            <div className="block" data-reveal>
              <h2>What you will cover</h2>
              <ul className="topic-list">
                {item.topics.map((topic) => (
                  <li key={topic}>
                    <span className="check" aria-hidden="true">
                      ✓
                    </span>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>

            <div className="block" data-reveal>
              <h2>Try a question</h2>
              <div className="sample">
                <p className="sample-q">{item.sample.question}</p>
                <details className="reveal-answer">
                  <summary>Show the answer</summary>
                  <p>{item.sample.answer}</p>
                </details>
              </div>
            </div>

            <div className="block" data-reveal>
              <h2>How this room works</h2>
              <ol className="room-steps">
                <li>
                  <strong>Read the pinned notes.</strong> They hold the current unit and the questions
                  everyone keeps asking.
                </li>
                <li>
                  <strong>Post the step you are on.</strong> A screenshot of your working beats a screenshot
                  of the question.
                </li>
                <li>
                  <strong>Answer one thing back.</strong> Explaining a step you just learned is the fastest
                  way to keep it.
                </li>
              </ol>
            </div>
          </div>

          <aside className="detail-aside">
            <div className="panel" data-reveal>
              <div className="panel-title">
                <h3>Room details</h3>
                <span className="status">Peer-led</span>
              </div>
              <dl className="fact-list">
                <div>
                  <dt>Level</dt>
                  <dd>{item.levelLabel}</dd>
                </div>
                <div>
                  <dt>Units</dt>
                  <dd>{item.units}</dd>
                </div>
                <div>
                  <dt>Topics</dt>
                  <dd>{item.topics.length}</dd>
                </div>
                <div>
                  <dt>Cost</dt>
                  <dd>Free</dd>
                </div>
              </dl>
              <Link className="btn btn-primary panel-cta" to="/community#rooms">
                Join the room
              </Link>
              <p className="panel-note">
                Rooms are opening progressively. Community page lists what is live this week.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="kicker">
                <span>Next</span> Keep going
              </p>
              <h2>Rooms that sit next to this one.</h2>
            </div>
            <Link className="class-link" to="/classes">
              All classes <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="class-grid">
            {related.map((entry) => (
              <ClassCard key={entry.slug} item={entry} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
