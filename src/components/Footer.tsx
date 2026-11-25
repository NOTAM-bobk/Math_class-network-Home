import { Link } from "react-router-dom";
import { Brand } from "./Brand";
import { SITE } from "../data/site";
import "../footer.css";

type FooterLink = { label: string; to?: string; href?: string };

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Explore",
    links: [
      { label: "Home", to: "/" },
      { label: "Classes", to: "/classes" },
      { label: "Community", to: "/community" },
      { label: "Get started", to: "/#start" },
    ],
  },
  {
    title: "The network",
    links: [
      { label: "Class rooms", to: "/#features" },
      { label: "Daily problems", to: "/#explorer" },
      { label: "House rules", to: "/community#rules" },
      { label: "Sessions", to: "/community#sessions" },
    ],
  },
  {
    title: "Elsewhere",
    links: [
      { label: "Unblocked games", href: "https://poly2.benlaunches.icu" },
      { label: "Watch", href: "https://watch.benlaunches.icu" },
      { label: "Chat", href: "https://chat.mathclass.uk" },
      {
        label: "Source on GitHub",
        href: "https://github.com/NOTAM-bobk/Math_class-network-Home",
      },
    ],
  },
];

function Column({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div className="wf-col">
      <p className="wf-col-title">{title}</p>
      <ul className="wf-links">
        {links.map((l) => (
          <li key={l.label}>
            {l.to ? <Link to={l.to}>{l.label}</Link> : <a href={l.href}>{l.label}</a>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="site-foot wordmark-footer">
      <div className="wrap">
        <div className="wf-grid">
          <div className="wf-brand">
            <Brand />
            <p className="wf-description">
              A peer-led network for people learning math. Built by students,
              open to anyone — no account needed to look around.
            </p>
          </div>

          <nav aria-label="Footer" className="wf-nav">
            {columns.map((col) => (
              <Column key={col.title} title={col.title} links={col.links} />
            ))}
          </nav>

          {/* phones: each column folds away; tap a heading to open it */}
          <nav aria-label="Footer" className="wf-fold">
            {columns.map((col) => (
              <details key={col.title} className="wf-details">
                <summary>
                  <span className="wf-col-title">{col.title}</span>
                  <svg className="wf-plus" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M8 3v10M3 8h10" />
                  </svg>
                </summary>
                <ul className="wf-links">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.to ? <Link to={l.to}>{l.label}</Link> : <a href={l.href}>{l.label}</a>}
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </nav>
        </div>

        <div className="wf-bottom">
          <p>
            © {new Date().getFullYear()} {SITE.name}
          </p>
          <a href={SITE.url}>{SITE.domain}</a>
          <span className="wf-credit">Made for learning</span>
        </div>
      </div>

      {/* the name, set large and fading into the background */}
      <p className="wf-giant" aria-hidden="true">
        mathclass.network
      </p>
    </footer>
  );
}
