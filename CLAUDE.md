# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

ArmeniensDeLausanne — a website for the Armenian community of Lausanne. A
**static HTML/CSS/JS site with no build step**. Browsers load the source files
directly; there is no bundler, transpiler, or framework.

This folder is one project inside the parent repo `C:\Users\nareg\Documents\Claude code`
(git root is the parent, not this folder). Sibling projects (pltr-dashboard,
Youtube-Spotify-Songs, etc.) are unrelated — do not pull their tooling here.

Primary language of the content is **French** (Lausanne is French-speaking). A
small amount of Armenian script appears decoratively (`lang="hy"`).

## Commands

No build, lint, or test tooling. To develop, serve the folder over HTTP
(don't open `index.html` via `file://` — webp/relative paths and the Google
Fonts request behave better over HTTP):

```bash
python -m http.server 5500   # then open http://localhost:5500
# or: npx serve .
```

## Architecture

Single-page site; everything is in **`index.html`** as anchored `<section>`s
(`#accueil`, `#communaute`, `#histoire`, `#culture`, `#cuisine`, `#evenements`,
`#contact`). Navigation is in-page anchor links with CSS smooth-scroll.

- **`css/styles.css`** — all styling. Colors/spacing are CSS custom properties
  in `:root` (pomegranate/apricot/blue = Armenian flag palette). Responsive
  breakpoints at 900/720/420px. The mobile nav and scroll-reveal **initial
  hidden state are scoped under `html.js`** so the site is fully readable
  without JavaScript.
- **`js/main.js`** — vanilla, no deps, IIFE. Handles: footer year, sticky-header
  `is-scrolled` state, mobile nav toggle, scroll-spy active nav link, and
  `IntersectionObserver` reveal animations. All progressive enhancement.
- **`js/i18n.js`** — FR / EN / HY dictionaries + a `data-i18n` runtime swap.
  Loads before `main.js` (both `defer` → order preserved). Reads initial
  language from `?lang=` then `localStorage["alausanne.lang"]`, defaults to FR.
  Exposes `window.ALI18n.t(key)` and dispatches `i18n:applied` on every change
  — `main.js` listens to that to refresh the mobile-nav `aria-label`.
- **`index.html`** sets `document.documentElement.classList.add('js')` inline in
  `<head>` — this is what gates the JS-only CSS. Don't remove it.
- **`Images/`** — source photos/paintings, referenced in place. One filename has
  a space and parentheses (`images (1).jpeg`) → referenced URL-encoded as
  `Images/images%20(1).jpeg`. Keep that encoding if you touch it.
- **`favicon.svg`** — inline SVG (stylized Ararat + tricolor bar).

## Content & conventions

- **Copy lives in two places.** The default-FR copy is in `index.html` next to
  its `data-i18n="…"` key. The EN and HY translations for the same key live in
  `js/i18n.js`. Adding or changing user-visible text means editing **both**:
  the HTML (FR + the key) **and** all three dictionaries in `i18n.js`. Missing
  keys silently fall back to FR.
- **Events (`#evenements`) are auto-generated** from a daily snapshot of
  [armenopole.com/ArmenianEvents](https://armenopole.com/ArmenianEvents) by
  `.github/workflows/agenda-refresh.yml` (cron) → `scripts/scrape-armenopole.mjs`
  → `js/agenda-data.js`. The renderer (`js/agenda.js`) groups the events by
  country → region → city. **Never hand-edit `js/agenda-data.js`** — it's
  overwritten on every scrape. To change the visual layout, edit `js/agenda.js`
  or the `.agenda*` block in `css/styles.css`. To change which source feeds
  the agenda, edit `scripts/scrape-armenopole.mjs`. Country labels in the
  three languages live in the `COUNTRY_LABELS` table in `js/agenda.js`.
- **The "snapshot date" label is also auto-maintained.** The
  `events.source` line ("instantané du …" / "snapshot dated …" / "…
  դրությամբ") is rewritten by `scripts/scrape-armenopole.mjs`
  (`updateSnapshotLabels`) in **`index.html`** (FR) and **`js/i18n.js`**
  (FR/EN/HY) every time the dataset changes, so the date can't drift from
  the data. Don't hand-edit the date. If you reword that sentence, keep the
  literal anchors the scraper greps for — `instantané du …<date>.`,
  `snapshot dated …<date>.`, and `<year> թ. <month> <day>-ի դրությամբ` —
  or update the regexes in `updateSnapshotLabels` to match.
- **The "Réseau" page (`ArmenianSwissNetwork/index.html`) is auto-generated**
  from the spreadsheet `ArmenianSwissNetwork/ArmenianSwissNetwork.ods`
  (one sheet per canton) by `scripts/build-network.mjs` — a zero-dependency
  Node script (`node scripts/build-network.mjs`; it unzips the .ods with
  built-in `node:zlib`, no libraries). It rewrites, **in place** between
  sentinel markers, the canton cards (`ASN:CANTONS`), the EN/HY description
  dictionary lines (`ASN:EN` / `ASN:HY`), and the hero counts
  (`data-asn="total"`/`"cantons"`). **Never hand-edit those marked regions** —
  they're overwritten on every build. The spreadsheet is the source of truth
  for *which* entries exist and their contacts (email/website/phone/socials);
  the curated display name + FR/EN/HY copy live in
  `ArmenianSwissNetwork/network.overrides.json`, keyed by a slug of the row's
  name, so raw labels/typos never reach the page (a new row with no override
  still renders, in FR, from raw data). To change the layout/styling, edit the
  markup/CSS *outside* the markers. This page is linked from the main nav
  (`nav.network` in `index.html` + `js/i18n.js`) and, like `doudouk.html` /
  `peintres.html`, carries its **own inline FR/EN/HY i18n + switcher**
  (separate from `js/i18n.js`; FR baseline from the markup, EN/HY in its
  in-page `DICT`).
- Contact details (`#contact`) are placeholder/example content; unknown
  real-world facts are marked `[à compléter]` (and `[to complete]` /
  `[լրացնելու]` in the other languages). Do not invent specific facts
  (address, founding year, real email, member counts) — keep them as
  placeholders.
- **Contact section is mailto-only** (static site, no server). The
  `link-submit` is a plain `<a href="mailto:…">`, not a form — no fields,
  no JS submit handler. To add a real form with input fields: route through
  a form service (e.g. Formspree) — don't add a backend without discussing it.
- **No build-only syntax** (no JSX/TS/SCSS, no bare `import` specifiers). ES
  modules and Google Fonts via `<link>` are fine. Keep relative asset paths.
- **i18n** is FR (default) / EN / HY, swapped client-side by `js/i18n.js`.
  Translatable text uses `data-i18n="key"` (innerHTML), translatable attrs
  use `data-i18n-alt`, `data-i18n-aria-label`, `data-i18n-title`. The visible
  switcher lives in the utility bar at the top of the header.
