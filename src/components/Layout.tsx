import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "./Footer";
import { Nav } from "./Nav";
import { useReveal } from "../lib/reveal";

export function Layout() {
  const { pathname, hash } = useLocation();
  useReveal();

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        window.requestAnimationFrame(() => {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
