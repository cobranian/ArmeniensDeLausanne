/* =========================================================================
   Arméniens de Lausanne — Agenda renderer

   Reads window.AL_AGENDA (from js/agenda-data.js), sorts the events
   alphabetically by country → region → city → date → time, and renders
   them into #agendaList. Each country becomes a collapsible <details>
   block; Switzerland is opened by default (this is a Lausanne site).

   Translation strategy:
     - Country names are translated here (small inline dictionary).
     - Region / city / event titles are kept as in source (mixing FR, EN,
       DE, NL, Armenian, etc.) — translating ~200 events into three
       languages would be impractical and the source phrasing is part of
       the event's identity.
     - The renderer listens for `i18n:applied` (dispatched by js/i18n.js)
       and re-renders so country names and date formats follow the active
       language.
   ========================================================================= */
(function () {
  "use strict";

  var SUPPORTED = ["fr", "en", "hy"];
  var DEFAULT_LANG = "fr";

  /* Country labels — keep keys in canonical English form used by the data file. */
  var COUNTRY_LABELS = {
    "Argentina":      { fr: "Argentine",         en: "Argentina",        hy: "Արգենտինա" },
    "Armenia":        { fr: "Arménie",           en: "Armenia",          hy: "Հայաստան" },
    "Australia":      { fr: "Australie",         en: "Australia",        hy: "Ավստրալիա" },
    "Austria":        { fr: "Autriche",          en: "Austria",          hy: "Ավստրիա" },
    "Belgium":        { fr: "Belgique",          en: "Belgium",          hy: "Բելգիա" },
    "Brazil":         { fr: "Brésil",            en: "Brazil",           hy: "Բրազիլիա" },
    "Bulgaria":       { fr: "Bulgarie",          en: "Bulgaria",         hy: "Բուլղարիա" },
    "Canada":         { fr: "Canada",            en: "Canada",           hy: "Կանադա" },
    "Chile":          { fr: "Chili",             en: "Chile",            hy: "Չիլի" },
    "Cyprus":         { fr: "Chypre",            en: "Cyprus",           hy: "Կիպրոս" },
    "Czechia":        { fr: "Tchéquie",          en: "Czechia",          hy: "Չեխիա" },
    "France":         { fr: "France",            en: "France",           hy: "Ֆրանսիա" },
    "Germany":        { fr: "Allemagne",         en: "Germany",          hy: "Գերմանիա" },
    "Greece":         { fr: "Grèce",             en: "Greece",           hy: "Հունաստան" },
    "Hungary":        { fr: "Hongrie",           en: "Hungary",          hy: "Հունգարիա" },
    "Italy":          { fr: "Italie",            en: "Italy",            hy: "Իտալիա" },
    "Lebanon":        { fr: "Liban",             en: "Lebanon",          hy: "Լիբանան" },
    "Netherlands":    { fr: "Pays-Bas",          en: "Netherlands",      hy: "Նիդեռլանդներ" },
    "Romania":        { fr: "Roumanie",          en: "Romania",          hy: "Ռումինիա" },
    "Russia":         { fr: "Russie",            en: "Russia",           hy: "Ռուսաստան" },
    "Singapore":      { fr: "Singapour",         en: "Singapore",        hy: "Սինգապուր" },
    "Spain":          { fr: "Espagne",           en: "Spain",            hy: "Իսպանիա" },
    "Switzerland":    { fr: "Suisse",            en: "Switzerland",      hy: "Շվեյցարիա" },
    "Türkiye":        { fr: "Türkiye",           en: "Türkiye",          hy: "Թուրքիա" },
    "United Arab Emirates": { fr: "Émirats arabes unis", en: "United Arab Emirates", hy: "Արաբական Միացյալ Էմիրություններ" },
    "United Kingdom": { fr: "Royaume-Uni",       en: "United Kingdom",   hy: "Միացյալ Թագավորություն" },
    "United States":  { fr: "États-Unis",        en: "United States",    hy: "Միացյալ Նահանգներ" },
    "Venezuela":      { fr: "Venezuela",         en: "Venezuela",        hy: "Վենեսուելա" }
  };

  /* UI labels for the agenda chrome (count badge, no-region heading). */
  var UI = {
    fr: { count1: " évén.", countN: " évén.", region_unknown: "Autres lieux", noscript: "Voir l'agenda complet sur armenopole.com." },
    en: { count1: " event",  countN: " events", region_unknown: "Other locations", noscript: "See the full agenda on armenopole.com." },
    hy: { count1: " միջոցառում", countN: " միջոցառում", region_unknown: "Այլ վայրեր", noscript: "Տե՛ս ամբողջական օրակարգը armenopole.com-ում:" }
  };

  var INTL_LOCALE = { fr: "fr-FR", en: "en-GB", hy: "hy-AM" };

  /* Open these countries by default — host country first. */
  var OPEN_BY_DEFAULT = { "Switzerland": true };

  /* Country sort priority — host country pinned to the top, others alphabetical. */
  var COUNTRY_PRIORITY = { "Switzerland": 0 };

  function countryRank(name) {
    return Object.prototype.hasOwnProperty.call(COUNTRY_PRIORITY, name)
      ? COUNTRY_PRIORITY[name]
      : 1; // everything else sorts after the pinned countries, then alphabetically
  }

  function lookupLang() {
    var l = (document.documentElement.getAttribute("lang") || "").toLowerCase();
    return SUPPORTED.indexOf(l) !== -1 ? l : DEFAULT_LANG;
  }

  function tCountry(name, lang) {
    var rec = COUNTRY_LABELS[name];
    if (rec && rec[lang]) return rec[lang];
    return name;
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (ch) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch];
    });
  }

  function formatDate(iso, lang) {
    if (!iso) return "";
    var parts = iso.split("-");
    if (parts.length !== 3) return iso;
    var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    if (isNaN(d.getTime())) return iso;
    try {
      return new Intl.DateTimeFormat(INTL_LOCALE[lang] || "fr-FR", {
        day: "numeric", month: "short"
      }).format(d);
    } catch (e) {
      return iso;
    }
  }

  function groupEvents(events) {
    var sorted = events.slice().sort(function (a, b) {
      return (countryRank(a.c) - countryRank(b.c))
          || (a.c || "").localeCompare(b.c || "")
          || (a.r || "").localeCompare(b.r || "")
          || (a.ct || "").localeCompare(b.ct || "")
          || (a.d || "").localeCompare(b.d || "")
          || (a.t || "").localeCompare(b.t || "");
    });

    var groups = [];
    sorted.forEach(function (e) {
      var country = groups[groups.length - 1];
      if (!country || country.name !== e.c) {
        country = { name: e.c, regions: [] };
        groups.push(country);
      }
      var region = country.regions[country.regions.length - 1];
      var regionName = e.r || "";
      if (!region || region.name !== regionName) {
        region = { name: regionName, events: [] };
        country.regions.push(region);
      }
      region.events.push(e);
    });
    return groups;
  }

  function render(lang) {
    var root = document.getElementById("agendaList");
    if (!root) return;
    var events = window.AL_AGENDA;
    if (!Array.isArray(events) || !events.length) return;

    var ui = UI[lang] || UI[DEFAULT_LANG];
    var groups = groupEvents(events);
    var out = "";

    groups.forEach(function (country) {
      var totalEvents = country.regions.reduce(function (acc, r) { return acc + r.events.length; }, 0);
      var openAttr = OPEN_BY_DEFAULT[country.name] ? " open" : "";
      var countLabel = totalEvents + (totalEvents === 1 ? ui.count1 : ui.countN);

      out += '<details class="agenda-country"' + openAttr + '>';
      out += '<summary>';
      out += '<span class="ag-country-name">' + escapeHtml(tCountry(country.name, lang)) + '</span>';
      out += '<span class="ag-count">' + escapeHtml(countLabel) + '</span>';
      out += '</summary>';

      out += '<div class="agenda-country-body">';
      country.regions.forEach(function (region) {
        out += '<section class="agenda-region">';
        var heading = region.name || ui.region_unknown;
        out += '<h4 class="ag-region-name">' + escapeHtml(heading) + '</h4>';
        out += '<ol class="agenda-events">';
        region.events.forEach(function (e) {
          out += '<li class="ag-evt">';
          out += '<time class="ag-when" datetime="' + escapeHtml(e.d) + (e.t ? "T" + escapeHtml(e.t) : "") + '">';
          out += '<span class="ag-date">' + escapeHtml(formatDate(e.d, lang)) + '</span>';
          if (e.t) out += '<span class="ag-time">' + escapeHtml(e.t) + '</span>';
          out += '</time>';
          if (e.ct) {
            out += '<span class="ag-city">' + escapeHtml(e.ct) + '</span>';
          } else {
            out += '<span class="ag-city ag-city-empty" aria-hidden="true"></span>';
          }
          out += '<a class="ag-title" href="' + escapeHtml(e.u) + '" target="_blank" rel="noopener noreferrer">'
              +  escapeHtml(e.n)
              +  '<span class="ag-arr" aria-hidden="true">→</span>'
              +  '</a>';
          out += '</li>';
        });
        out += '</ol>';
        out += '</section>';
      });
      out += '</div>';
      out += '</details>';
    });

    root.innerHTML = out;
  }

  function init() {
    render(lookupLang());
    document.addEventListener("i18n:applied", function (e) {
      var lang = (e && e.detail && e.detail.lang) ? e.detail.lang : lookupLang();
      render(lang);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
