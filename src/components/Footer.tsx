import { Link } from "react-router-dom";
import { Brand } from "./Brand";

export function Footer() {
  return (
    <footer className="site-foot">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <Brand />
            <p>
              A peer-led network for people learning math. Built by students, open to anyone — no account
              needed to look around.
            </p>
            <p className="foot-domain">mathclass.uk</p>
          </div>

          <div className="foot-col">
            <h2>Explore</h2>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/classes">Classes</Link>
              </li>
              <li>
                <Link to="/community">Community</Link>
              </li>
              <li>
                <Link to="/#start">Get started</Link>
              </li>
            </ul>
          </div>

          <div className="foot-col">
            <h2>The network</h2>
            <ul>
              <li>
                <Link to="/#features">Class rooms</Link>
              </li>
              <li>
                <Link to="/#explorer">Daily problems</Link>
              </li>
              <li>
                <Link to="/community#rules">House rules</Link>
              </li>
              <li>
                <Link to="/community#sessions">Sessions</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="foot-bar">
          <span>© {new Date().getFullYear()} MathClass Network</span>
          <span>Made for learning · mathclass.uk</span>
        </div>
      </div>
    </footer>
  );
}
