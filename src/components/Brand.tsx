import { Link } from "react-router-dom";

export function Brand() {
  return (
    <Link className="brand" to="/" aria-label="MathClass Network home">
      <span className="brand-mark" aria-hidden="true">
        ×
      </span>
      <span className="brand-name">
        mathclass<span className="brand-dot">.</span>network
      </span>
    </Link>
  );
}
