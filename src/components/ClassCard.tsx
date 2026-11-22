import { Link } from "react-router-dom";
import type { MathClass } from "../data/classes";

function Arrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ClassCard({ item }: { item: MathClass }) {
  const href = `/classes/${item.slug}`;
  return (
    <article className="class-card" data-reveal>
      <div className="class-top">
        <span className={`class-icon tint-${item.tint}`} aria-hidden="true">
          {item.symbol}
        </span>
        <span className="tag tag-ghost">{item.levelLabel}</span>
      </div>
      <h3>
        <Link className="class-title" to={href}>
          {item.name}
        </Link>
      </h3>
      <p>{item.blurb}</p>
      <div className="class-meta">
        <span>{item.units} units</span>
        <Link className="class-link" to={href}>
          Open class <Arrow />
        </Link>
      </div>
    </article>
  );
}
