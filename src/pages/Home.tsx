import { Link } from "react-router-dom";
import { ProblemCard } from "../components/ProblemCard";
import { TopicTabs } from "../components/TopicTabs";
import { useSeo } from "../lib/seo";
import { SITE } from "../data/site";
import "../quick-links.css";

const topicStrip = [
  "Algebra",
  "Geometry",
  "Trigonometry",
  "Pre-calculus",
  "Calculus",
  "Statistics",
  "Number theory",
  "Proofs",
  "Olympiad prep",
];

const quickLinks = [
  {
    href: "https://video.mathclass.uk",
    label: "Watch math videos",
    domain: "video.mathclass.uk",
    tone: "tint-sky",
    icon: (
      <>
        <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" />
        <path d="M7 5.5v13M17 5.5v13M2.5 12h19" />
      </>
    ),
  },
  {
    href: "https://games.mathclass.uk",
    label: "Play math games",
    domain: "games.mathclass.uk",
    tone: "tint-lime",
    icon: (
      <>
        <rect x="2" y="7" width="20" height="10" rx="3.5" />
        <path d="M7 11v3M5.5 12.5h3" />
        <path d="M16.5 11.5h.01M18.5 14h.01" />
      </>
    ),
  },
  {
    href: "https://yt.mathclass.uk",
    label: "Watch on YouTube",
    domain: "yt.mathclass.uk",
    tone: "tint-coral",
    icon: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="4.5" />
        <path d="M10.5 9.5l5 2.5-5 2.5z" />
      </>
    ),
  },
];

const levels = [
  "Pre-algebra",
  "Algebra I",
  "Algebra II",
  "Geometry",
  "Trigonometry",
  "Pre-calculus",
  "Calculus I",
  "Calculus II",
  "Statistics",
  "Proofs",
  "Number theory",
  "Olympiad prep",
];

export default function Home() {
  useSeo({
    title: `${SITE.name} — math makes more sense together`,
    description: SITE.description,
    path: "/",
  });

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="eyebrow-pill">
              <span className="dot" aria-hidden="true" />A study network for math people
            </p>
            <h1>
              Math makes more sense <em className="accent">together</em>.
            </h1>
            <p className="lead">
              Pick a class, drop into a room, and work through problems with people learning the exact
              same thing. No sign-up maze, no gatekeeping — just math.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" to="/classes">
                Find your class
                <svg
                  className="ico"
                  width="16"
                  height="16"
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
              </Link>
              <Link className="btn btn-ghost" to="/community">
                Meet the rooms
              </Link>
            </div>
            <ul className="hero-meta">
              <li>Free to join</li>
              <li>Peer-led rooms</li>
              <li>No account needed</li>
            </ul>
          </div>

          <div className="hero-visual">
            <span className="floater f1" aria-hidden="true">
              Σ
            </span>
            <span className="floater f2" aria-hidden="true">
              √
            </span>
            <span className="floater f3" aria-hidden="true">
              π
            </span>
            <span className="floater f4" aria-hidden="true">
              ∞
            </span>
            <ProblemCard />
          </div>
        </div>
      </section>

      <section className="quick-links" aria-labelledby="quick-links-title">
        <div className="wrap">
          <h2 className="quick-links-head" id="quick-links-title">
            Jump straight in
          </h2>
          <ul className="quick-grid">
            {quickLinks.map((link) => (
              <li key={link.domain}>
                <a className="quick-link" href={link.href}>
                  <span className={`quick-icon ${link.tone}`} aria-hidden="true">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {link.icon}
                    </svg>
                  </span>
                  <span className="quick-text">
                    <span className="quick-label">{link.label}</span>
                    <span className="quick-domain">{link.domain}</span>
                  </span>
                  <svg
                    className="quick-arrow"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M7 17L17 7M9 7h8v8" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="topics" aria-hidden="true">
        <div className="topics-track">
          {[0, 1].map((copy) => (
            <ul className="topics-list" key={copy}>
              {topicStrip.map((topic) => (
                <li key={`${copy}-${topic}`}>{topic}</li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <section className="section" id="features">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <div>
              <p className="kicker">
                <span>01</span> What&rsquo;s inside
              </p>
              <h2>Everything a math class needs, minus the lecture.</h2>
            </div>
            <p>
              A room per class, problems worth arguing about, and people who remember what it felt like to
              be stuck.
            </p>
          </div>

          <div className="feature-grid">
            <article className="feature" data-reveal>
              <div className="feature-top">
                <span className="chip-icon tint-lime" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="12" rx="2" />
                    <path d="M8 20h8M12 16v4" />
                  </svg>
                </span>
                <span className="feature-num">01</span>
              </div>
              <h3>Class rooms</h3>
              <p>One room per course. Share notes, post a question, or follow along with the week&rsquo;s topic.</p>
            </article>

            <article className="feature" data-reveal>
              <div className="feature-top">
                <span className="chip-icon tint-sky" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 7l2 2 3-4" />
                    <path d="M13 8h7" />
                    <path d="M4 15l2 2 3-4" />
                    <path d="M13 16h7" />
                  </svg>
                </span>
                <span className="feature-num">02</span>
              </div>
              <h3>Problem sets</h3>
              <p>Short sets with hints that nudge instead of spoil, sorted by topic and difficulty.</p>
            </article>

            <article className="feature" data-reveal>
              <div className="feature-top">
                <span className="chip-icon tint-coral" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.4-.7L3 21l1.6-4.5A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z" />
                  </svg>
                </span>
                <span className="feature-num">03</span>
              </div>
              <h3>Peer tutors</h3>
              <p>Students a chapter ahead, not a textbook. Ask anything without feeling behind.</p>
            </article>

            <article className="feature" data-reveal>
              <div className="feature-top">
                <span className="chip-icon tint-indigo" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 20V11M11 20V5M17 20v-6" />
                    <path d="M3 20h18" />
                  </svg>
                </span>
                <span className="feature-num">04</span>
              </div>
              <h3>Progress that sticks</h3>
              <p>See which topics you have actually got, and which ones are still a little wobbly.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section" id="explorer">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <div>
              <p className="kicker">
                <span>02</span> Try one
              </p>
              <h2>Math is a thing you do, not a thing you watch.</h2>
            </div>
            <p>Four topics, four questions, no timer. Open the working only when you want it.</p>
          </div>
          <div data-reveal>
            <TopicTabs />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head" data-reveal>
            <div>
              <p className="kicker">
                <span>03</span> How it works
              </p>
              <h2>Three steps, then you&rsquo;re in.</h2>
            </div>
          </div>

          <div className="steps">
            <article className="step" data-reveal>
              <span className="step-num">01</span>
              <h3>Pick your class</h3>
              <p>Browse by level — middle school through college, plus a corner for contest math.</p>
            </article>
            <article className="step" data-reveal>
              <span className="step-num">02</span>
              <h3>Join the room</h3>
              <p>Read the pinned notes, then see what everyone is working on this week.</p>
            </article>
            <article className="step" data-reveal>
              <span className="step-num">03</span>
              <h3>Ask, solve, explain</h3>
              <p>Post what is blocking you. The fastest way to learn something is to explain it next.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <div data-reveal>
            <p className="kicker">
              <span>04</span> Built to be useful
            </p>
            <h2>For the 11pm homework crowd.</h2>
            <p className="lead">
              MathClass is a network, not a course. There is no video to sit through and no test at the
              end — just the class you are already taking, with more people in it.
            </p>
            <ul className="checks">
              <li>
                <span className="check" aria-hidden="true">
                  ✓
                </span>
                <span>
                  <strong>Stuck on one line?</strong>
                  Paste the step you are on. Someone has been there this week.
                </span>
              </li>
              <li>
                <span className="check" aria-hidden="true">
                  ✓
                </span>
                <span>
                  <strong>Want to go deeper?</strong>
                  Follow the proof threads and contest problems that never made it into class.
                </span>
              </li>
              <li>
                <span className="check" aria-hidden="true">
                  ✓
                </span>
                <span>
                  <strong>Like helping?</strong>
                  Answer two questions a week. Explaining is the best revision there is.
                </span>
              </li>
            </ul>
          </div>

          <div className="panel" data-reveal>
            <div className="panel-title">
              <h3>Where you can start</h3>
              <span className="tag tag-ghost">K–12 + college</span>
            </div>
            <ul className="pill-list">
              {levels.map((level) => (
                <li className="pill" key={level}>
                  {level}
                </li>
              ))}
            </ul>
            <p className="panel-note">
              Don&rsquo;t see your class? The foundation release focuses on the core sequence — more rooms
              arrive as the network grows.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-wrap" id="start">
        <div className="wrap">
          <div className="cta-inner" data-reveal>
            <p className="eyebrow-pill">
              <span className="dot" aria-hidden="true" />
              Start here
            </p>
            <h2>Your next math class is already here.</h2>
            <p>
              Browse the rooms, find the class you are taking, and see how other people are thinking about
              it. The network is just getting started.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-lime" to="/classes">
                Browse classes
              </Link>
              <Link className="btn btn-outline-light" to="/community">
                See the rooms
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
