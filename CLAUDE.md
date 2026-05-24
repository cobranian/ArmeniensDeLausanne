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
- **`index.html`** sets `document.documentElement.classList.add('js')` inline in
  `<head>` — this is what gates the JS-only CSS. Don't remove it.
- **`Images/`** — source photos/paintings, referenced in place. One filename has
  a space and parentheses (`images (1).jpeg`) → referenced URL-encoded as
  `Images/images%20(1).jpeg`. Keep that encoding if you touch it.
- **`favicon.svg`** — inline SVG (stylized Ararat + tricolor bar).

## Content & conventions

- **All copy lives in `index.html`.** Events (`#evenements`) and contact details
  (`#contact`) are placeholder/example content; unknown real-world facts are
  marked `[à compléter]`. Do not invent specific facts (address, founding year,
  real email, member counts) — keep them as `[à compléter]` placeholders.
- **Contact form is non-functional by design** (static site, no server). It
  `preventDefault`s and alerts. To make it real: set the `action` to a form
  service (e.g. Formspree) — don't add a backend without discussing it.
- **No build-only syntax** (no JSX/TS/SCSS, no bare `import` specifiers). ES
  modules and Google Fonts via `<link>` are fine. Keep relative asset paths.
- **Open decision (deferred):** how non-technical volunteers will manage events
  long-term (headless CMS with public read token vs. tiny serverless proxy).
  Until decided, events stay hand-edited in `index.html`. See README.
- **i18n** is not implemented; French only. Revisit if multilingual is needed.
