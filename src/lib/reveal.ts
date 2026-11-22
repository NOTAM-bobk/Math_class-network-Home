import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Adds the reveal animation to elements marked with `data-reveal`.
 * Runs per route so newly mounted pages animate in, and leaves content
 * visible when JavaScript or motion preferences say so.
 */
export function useReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!nodes.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    nodes.forEach((node, index) => {
      node.classList.add("reveal");
      node.style.transitionDelay = `${Math.min(index % 4, 3) * 60}ms`;
      observer.observe(node);
    });

    return () => {
      observer.disconnect();
      nodes.forEach((node) => {
        node.classList.remove("reveal", "is-in");
        node.style.transitionDelay = "";
      });
    };
  }, [pathname]);
}
