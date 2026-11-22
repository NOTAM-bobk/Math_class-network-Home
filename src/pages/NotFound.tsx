import { Link } from "react-router-dom";
import { useSeo } from "../lib/seo";

export default function NotFound() {
  useSeo({
    title: "Page not found — MathClass Network",
    description: "That page does not exist. Browse the class catalogue or head back home.",
    path: "/404",
  });

  return (
    <section className="not-found">
      <div className="wrap">
        <p className="not-found-code" aria-hidden="true">
          404
        </p>
        <h1>This page is not in the syllabus.</h1>
        <p className="lead">
          The address may be mistyped, or the page may not exist yet. The catalogue is the safest place to
          restart.
        </p>
        <div className="hero-actions">
          <Link className="btn btn-primary" to="/classes">
            Browse classes
          </Link>
          <Link className="btn btn-ghost" to="/">
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}
