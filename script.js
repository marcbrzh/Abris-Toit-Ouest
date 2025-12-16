(() => {
  "use strict";

  // ---------- Helpers ----------
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

  // ---------- Mobile Nav ----------
  const navBtn = qs(".navbtn");
  const nav = qs("#nav");
  const body = document.body;

  const openNav = () => {
    if (!navBtn || !nav) return;
    nav.classList.add("is-open");
    body.classList.add("nav-open");
    navBtn.setAttribute("aria-expanded", "true");
  };

  const closeNav = () => {
    if (!navBtn || !nav) return;
    nav.classList.remove("is-open");
    body.classList.remove("nav-open");
    navBtn.setAttribute("aria-expanded", "false");
  };

  const toggleNav = () => {
    if (!navBtn || !nav) return;
    nav.classList.contains("is-open") ? closeNav() : openNav();
  };

  if (navBtn && nav) {
    if (!navBtn.hasAttribute("aria-expanded")) navBtn.setAttribute("aria-expanded", "false");

    navBtn.addEventListener("click", (e) => {
      e.preventDefault();
      toggleNav();
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });

    document.addEventListener("click", (e) => {
      if (!nav.classList.contains("is-open")) return;
      const target = e.target;
      if (nav.contains(target) || navBtn.contains(target)) return;
      closeNav();
    });

    nav.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      closeNav();
    });
  }

  // ---------- Scroll Reveal ----------
  const revealSelectors = [
    ".hero__content",
    ".hero__media",
    ".proof__item",
    ".card",
    ".tick",
    ".panel",
    ".shot",
    ".quote",
    ".section__head",
    ".ctaStrip__inner",
    ".footer__grid",

    // Contact
    ".formCard",
    ".infoCard",
    ".mapFrame",

    // Services
    ".svcBlock",
    ".faqItem",

    // Réalisations (missing in your version)
    ".baItem",
    ".caseCard",

    // Urgence
    ".emHero__content",
    ".emHero__media",
    ".emStep",
    ".checkCard"
  ];

  const revealItems = revealSelectors
    .flatMap((sel) => qsa(sel))
    .filter((el, idx, arr) => arr.indexOf(el) === idx);

  const injectRevealCSS = () => {
    // Only reveal CSS. Mobile nav CSS now lives in style.css.
    const css = `
      .reveal-init { opacity: 0; transform: translateY(14px); }
      .reveal-in   { opacity: 1; transform: translateY(0); transition: opacity .6s ease, transform .6s ease; }
      .reveal-delay-1 { transition-delay: .06s; }
      .reveal-delay-2 { transition-delay: .12s; }
      .reveal-delay-3 { transition-delay: .18s; }
      .reveal-delay-4 { transition-delay: .24s; }

      @media (prefers-reduced-motion: reduce) {
        .reveal-init, .reveal-in { opacity: 1 !important; transform: none !important; transition: none !important; }
      }
    `;

    // Avoid injecting twice (in case of multiple bundles or hot reload)
    if (document.querySelector('style[data-ui="reveal"]')) return;

    const styleTag = document.createElement("style");
    styleTag.setAttribute("data-ui", "reveal");
    styleTag.textContent = css;
    document.head.appendChild(styleTag);
  };

  injectRevealCSS();

  if (!prefersReducedMotion && revealItems.length) {
    revealItems.forEach((el, i) => {
      el.classList.add("reveal-init");

      // small staggering for lists/grids
      const mod = i % 5;
      if (mod === 1) el.classList.add("reveal-delay-1");
      if (mod === 2) el.classList.add("reveal-delay-2");
      if (mod === 3) el.classList.add("reveal-delay-3");
      if (mod === 4) el.classList.add("reveal-delay-4");
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("reveal-in");
          entry.target.classList.remove("reveal-init");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );

    revealItems.forEach((el) => io.observe(el));
  } else {
    revealItems.forEach((el) => {
      el.classList.remove("reveal-init");
      el.classList.add("reveal-in");
    });
  }

  // ---------- Smooth Anchor Scrolling ----------
  const anchorLinks = qsa('a[href^="#"], a[href*="#"]');

  const getHeaderOffset = () => {
    const header = qs(".header");
    const topbar = qs(".topbar");
    const h = header ? header.getBoundingClientRect().height : 0;
    const t = topbar ? topbar.getBoundingClientRect().height : 0;
    return Math.round(h + t + 12);
  };

  anchorLinks.forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href") || "";
      const hashIndex = href.indexOf("#");
      if (hashIndex === -1) return;

      const base = href.slice(0, hashIndex);
      const hash = href.slice(hashIndex);
      if (!hash || hash === "#") return;

      // Allow cross-page anchors normally
      if (base && base !== "" && base !== window.location.pathname.split("/").pop()) return;

      const targetId = decodeURIComponent(hash.replace("#", ""));
      const target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      closeNav();

      const y = window.scrollY + target.getBoundingClientRect().top - getHeaderOffset();
      window.scrollTo({ top: y, behavior: prefersReducedMotion ? "auto" : "smooth" });

      history.pushState(null, "", hash);
    });
  });

  // ---------- Optional: Active nav link based on section in view ----------
  const navLinks = qsa(".nav__link[href*='#']");
  const sections = navLinks
    .map((link) => {
      const href = link.getAttribute("href") || "";
      const hash = href.includes("#") ? href.slice(href.indexOf("#") + 1) : "";
      return hash ? document.getElementById(decodeURIComponent(hash)) : null;
    })
    .filter(Boolean);

  if (!prefersReducedMotion && navLinks.length && sections.length) {
    const activeIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;

          navLinks.forEach((link) => {
            const href = link.getAttribute("href") || "";
            const isMatch = href.endsWith(`#${id}`) || href.includes(`#${id}`);
            link.classList.toggle("is-active", isMatch);
          });
        });
      },
      { threshold: 0.55, rootMargin: `-${getHeaderOffset()}px 0px -40% 0px` }
    );

    sections.forEach((sec) => activeIO.observe(sec));
  }

  // ---------- Contact form: prevent double submit ----------
  const form = document.getElementById("contact-form");
  const submitBtn = document.getElementById("contact-submit");

  if (form && submitBtn) {
    form.addEventListener("submit", () => {
      submitBtn.disabled = true;
      submitBtn.setAttribute("aria-busy", "true");
      submitBtn.textContent = "Envoi en cours…";
    });
  }

  // ---------- FAQ: keep only one <details> open ----------
  const faqItems = qsa(".faqItem");
  if (faqItems.length) {
    faqItems.forEach((item) => {
      item.addEventListener("toggle", () => {
        if (!item.open) return;
        faqItems.forEach((other) => {
          if (other !== item) other.removeAttribute("open");
        });
      });
    });
  }

  // ---------- Prefill contact form when coming from ?type=urgence ----------
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("type") === "urgence") {
      const timeline = document.getElementById("timeline");
      if (timeline) timeline.value = "urgent";

      const service = document.getElementById("service");
      if (service && !service.value) service.value = "couverture";

      const desc = document.getElementById("description");
      if (desc && !desc.value) {
        desc.value =
          "Urgence fuite :\n" +
          "- Localisation (pièce/zone) :\n" +
          "- Depuis quand :\n" +
          "- Intensité (goutte à goutte / écoulement) :\n" +
          "- Photos/vidéos disponibles : oui/non\n";
      }
    }
  } catch (_) {}

})();
