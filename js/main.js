/* =========================================================================
   Communauté Arménienne de Lausanne — interactions
   JavaScript natif, sans dépendance. Amélioration progressive :
   sans JS, le site reste entièrement lisible.
   ========================================================================= */
(function () {
  "use strict";

  /* ---- Année courante dans le pied de page ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---- En-tête : état « scrollé » ---- */
  var header = document.getElementById("siteHeader");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Menu mobile ---- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("primaryNav");

  function tr(key, fallback) {
    if (window.ALI18n && typeof window.ALI18n.t === "function") {
      return window.ALI18n.t(key);
    }
    return fallback;
  }

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", tr("nav.open", "Ouvrir le menu"));
  }

  // Set initial aria-label from the active language and refresh when language changes.
  if (toggle) {
    toggle.setAttribute("aria-label", tr("nav.open", "Ouvrir le menu"));
    document.addEventListener("i18n:applied", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-label", open ? tr("nav.close", "Fermer le menu") : tr("nav.open", "Ouvrir le menu"));
    });
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? tr("nav.close", "Fermer le menu") : tr("nav.open", "Ouvrir le menu"));
    });

    // Fermer après clic sur un lien (navigation par ancre).
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });

    // Fermer avec Échap.
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ---- Lien de navigation actif selon la section visible ---- */
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]')) : [];
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var id = entry.target.id;
          navLinks.forEach(function (a) {
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---- Apparition au défilement ---- */
  var revealTargets = document.querySelectorAll(
    ".section-head, .feature, .pillars li, .gallery figure, .timeline, .event-card, .contact-form, .contact-info"
  );
  Array.prototype.forEach.call(revealTargets, function (el) {
    el.classList.add("reveal");
  });

  if ("IntersectionObserver" in window) {
    var revealer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    Array.prototype.forEach.call(revealTargets, function (el) {
      revealer.observe(el);
    });
  } else {
    // Pas d'IntersectionObserver : tout afficher immédiatement.
    Array.prototype.forEach.call(revealTargets, function (el) {
      el.classList.add("is-visible");
    });
  }

})();
