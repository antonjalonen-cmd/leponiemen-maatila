(function () {
  "use strict";

  var root = document.documentElement;

  var STRINGS = {
    title: {
      fi: "Leponiemen Maatila – Luomua ylämaankarjaa Vetelin Tunkkarissa",
      sv: "Leponiemi Gård – Ekologiskt höglandsboskap i Tunkkari, Veteli",
      en: "Leponiemen Maatila – Organic Highland Cattle in Tunkkari, Veteli"
    },
    desc: {
      fi: "Leponiemen maatila on kasvattanut ylämaankarjaa ja viljaa Vetelin Tunkkarissa vuodesta 1888. Viidennen sukupolven luomutila, jossa eläimet elävät ulkona ympäri vuoden.",
      sv: "Leponiemi gård har fött upp höglandsboskap och odlat spannmål i Tunkkari, Veteli sedan 1888. En ekologisk familjegård i femte generationen, där djuren lever utomhus året runt.",
      en: "Leponiemen Maatila has raised Highland cattle and grain in Tunkkari, Veteli since 1888. A fifth generation organic family farm where the animals live outdoors all year round."
    }
  };

  function setLanguage(lang) {
    if (["fi", "sv", "en"].indexOf(lang) === -1) lang = "fi";
    root.setAttribute("data-lang", lang);
    root.setAttribute("lang", lang);
    document.title = STRINGS.title[lang];
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", STRINGS.desc[lang]);

    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      var active = btn.getAttribute("data-lang-btn") === lang;
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    try { localStorage.setItem("leponiemi-lang", lang); } catch (e) {}
  }

  function initLanguage() {
    /* Finnish is always the default on a first-time visit.
       Only an explicit prior choice via the switcher changes that. */
    var stored = null;
    try { stored = localStorage.getItem("leponiemi-lang"); } catch (e) {}
    setLanguage(stored || "fi");
  }

  document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setLanguage(btn.getAttribute("data-lang-btn"));
      var nav = document.querySelector("[data-nav]");
      var toggle = document.querySelector("[data-nav-toggle]");
      if (nav && nav.classList.contains("open")) { nav.classList.remove("open"); toggle.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }
    });
  });

  initLanguage();

  /* Header scroll state */
  var header = document.querySelector("[data-header]");
  function onScroll() {
    if (window.scrollY > 24) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile nav toggle */
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.classList.toggle("open", isOpen);
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Current year */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
