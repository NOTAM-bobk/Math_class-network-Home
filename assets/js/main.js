/* MathClass Network — foundation scripts (no dependencies) */
(function () {
  "use strict";

  /* ---------- mobile navigation ---------- */
  var head = document.querySelector(".site-head");
  var toggle = document.querySelector(".nav-toggle");

  if (head && toggle) {
    var setNav = function (open) {
      head.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    };

    toggle.addEventListener("click", function () {
      setNav(!head.classList.contains("is-open"));
    });

    head.querySelectorAll(".nav-menu a").forEach(function (link) {
      link.addEventListener("click", function () {
        setNav(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && head.classList.contains("is-open")) {
        setNav(false);
        toggle.focus();
      }
    });
  }

  /* ---------- daily problem ---------- */
  var problem = document.querySelector("[data-problem]");

  if (problem) {
    var feedback = document.querySelector("[data-feedback]");
    var solved = false;

    problem.addEventListener("click", function (event) {
      var button = event.target.closest(".answer");
      if (!button || solved) return;

      if (button.hasAttribute("data-correct")) {
        solved = true;
        button.classList.add("is-correct");
        problem.querySelectorAll(".answer").forEach(function (answer) {
          answer.disabled = true;
        });
        if (feedback) {
          feedback.textContent =
            "Correct — 12 × 8 = 96, 96 ÷ 6 = 16, and 16 + 4 = 20. Multiplication and division first.";
          feedback.classList.add("is-good");
        }
      } else {
        button.classList.add("is-wrong");
        if (feedback) {
          feedback.textContent =
            "Not quite. Order of operations: handle × and ÷ before + and −.";
          feedback.classList.remove("is-good");
        }
        window.setTimeout(function () {
          button.classList.remove("is-wrong");
        }, 900);
      }
    });
  }

  /* ---------- class filters ---------- */
  var chips = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-level]"));

  if (chips.length && cards.length) {
    var count = document.querySelector("[data-count]");

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var level = chip.getAttribute("data-filter");

        chips.forEach(function (other) {
          other.setAttribute("aria-pressed", String(other === chip));
        });

        var shown = 0;
        cards.forEach(function (card) {
          var visible = level === "all" || card.getAttribute("data-level") === level;
          card.hidden = !visible;
          if (visible) shown += 1;
        });

        if (count) {
          count.textContent = shown + (shown === 1 ? " class" : " classes");
        }
      });
    });
  }

  /* ---------- current year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  /* ---------- reveal on scroll (JS-only, so content stays visible without it) ---------- */
  var revealItems = document.querySelectorAll("[data-reveal]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (revealItems.length && "IntersectionObserver" in window && !reduceMotion) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );

    revealItems.forEach(function (item) {
      item.classList.add("reveal");
      observer.observe(item);
    });
  }
})();
