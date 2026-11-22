import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Brand } from "./Brand";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/classes", label: "Classes", end: false },
  { to: "/community", label: "Community", end: false },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className={open ? "site-head is-open" : "site-head"}>
      <div className="wrap nav">
        <Brand />
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="nav-toggle-bars" aria-hidden="true">
            <span />
            <span />
          </span>
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
        <nav id="nav-menu" className="nav-menu" aria-label="Main">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}>
              {link.label}
            </NavLink>
          ))}
          <Link className="btn btn-primary nav-cta" to="/#start">
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}
