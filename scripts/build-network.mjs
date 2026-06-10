#!/usr/bin/env node
/* =========================================================================
   Arméniens de Lausanne — Réseau arménien de Suisse builder

   Reads the source spreadsheet
     ArmenianSwissNetwork/ArmenianSwissNetwork.ods
   (one sheet per canton: GENEVA / VAUD / BERN / ZURICH), merges the curation
   layer
     ArmenianSwissNetwork/network.overrides.json
   and regenerates, in place, the marked regions of
     ArmenianSwissNetwork/index.html
     • the canton sections + entry cards   (ASN:CANTONS markers)
     • the EN description dictionary lines  (ASN:EN markers)
     • the HY description dictionary lines  (ASN:HY markers)
     • the hero counts                      (data-asn="total" / "cantons")

   The spreadsheet is the source of truth for *which* entries exist and for
   their contacts (email / website / phone / socials). The overrides file is
   the source of truth for the curated display name and the FR/EN/HY copy —
   so a typo or a raw label in the .ods never clobbers the polished page.
   A new row with no override still renders, using its raw spreadsheet data.

   Zero dependencies. Run locally after editing the spreadsheet:

     node scripts/build-network.mjs

   Defensive: if the sheet yields fewer than MIN_ENTRIES, it exits non-zero
   without touching the page, rather than shipping a gutted directory.
   ========================================================================= */

import { readFileSync, writeFileSync } from "node:fs";
import { inflateRawSync } from "node:zlib";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ODS       = resolve(__dirname, "..", "ArmenianSwissNetwork", "ArmenianSwissNetwork.ods");
const OVERRIDES = resolve(__dirname, "..", "ArmenianSwissNetwork", "network.overrides.json");
const PAGE      = resolve(__dirname, "..", "ArmenianSwissNetwork", "index.html");

const MIN_ENTRIES = 8;

/* Fixed canton order + labels (the HY/EN labels live in the page's own
   i18n dictionary under these keys; here we only need the FR baseline). */
const CANTONS = [
  { sheet: "GENEVA", id: "geneve", key: "c.ge", fr: "Genève" },
  { sheet: "VAUD",   id: "vaud",   key: "c.vd", fr: "Vaud"   },
  { sheet: "BERN",   id: "berne",  key: "c.be", fr: "Berne"  },
  { sheet: "ZURICH", id: "zurich", key: "c.zh", fr: "Zurich" }
];

const TAG_FR = { asso: "Association", food: "Saveurs", craft: "Métier" };

const ICON = {
  mail:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>`,
  web:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/></svg>`,
  facebook:  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v6h3v-6h2.5l.5-3H14V9.5c0-.3.2-.5.5-.5Z"/></svg>`,
  tel:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 4h3l1.5 4.5L7.5 10a12 12 0 0 0 6 6l1.5-2 4.5 1.5V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></svg>`
};

/* ----------------------------------------------------------------- helpers */
const escHtml = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s) => escHtml(s).replace(/"/g, "&quot;");
const pad2    = (n) => String(n).padStart(2, "0");

function toRoman(n) {
  const map = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let out = "";
  for (const [v, s] of map) while (n >= v) { out += s; n -= v; }
  return out;
}

function slugify(s) {
  return String(s)
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function decodeEntities(s) {
  return String(s)
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&amp;/g, "&");
}

function normalizeUrl(u) {
  if (!u) return null;
  u = u.trim()
       .replace(/^https:\/(?!\/)/i, "https://")   // LibreOffice sometimes stores https:/host
       .replace(/^http:\/(?!\/)/i, "http://")
       .replace(/[#\s]+$/g, "");                  // strip trailing '#' / whitespace
  return u || null;
}

/* ------------------------------------------------------------- ODS reading */
// Minimal ZIP reader: walk the central directory, inflate content.xml.
function readContentXml(path) {
  const buf = readFileSync(path);
  let eocd = -1;
  for (let i = buf.length - 22; i >= 0; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error("ODS: end-of-central-directory not found");
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  for (let n = 0; n < count; n++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error("ODS: bad central directory entry");
    const method   = buf.readUInt16LE(p + 10);
    const compSize = buf.readUInt32LE(p + 20);
    const nameLen  = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commLen  = buf.readUInt16LE(p + 32);
    const lfh      = buf.readUInt32LE(p + 42);
    const name     = buf.toString("utf8", p + 46, p + 46 + nameLen);
    if (name === "content.xml") {
      if (buf.readUInt32LE(lfh) !== 0x04034b50) throw new Error("ODS: bad local file header");
      const lNameLen  = buf.readUInt16LE(lfh + 26);
      const lExtraLen = buf.readUInt16LE(lfh + 28);
      const start = lfh + 30 + lNameLen + lExtraLen;
      const data  = buf.subarray(start, start + compSize);
      if (method === 0) return data.toString("utf8");
      if (method === 8) return inflateRawSync(data).toString("utf8");
      throw new Error("ODS: unsupported compression method " + method);
    }
    p += 46 + nameLen + extraLen + commLen;
  }
  throw new Error("ODS: content.xml not found");
}

// Pull the text + first hyperlink out of a single <table:table-cell> body.
function cellValue(inner) {
  if (!inner) return { text: "", href: null };
  const paras = [];
  const re = /<text:p\b[^>]*>([\s\S]*?)<\/text:p>/g;
  let m;
  while ((m = re.exec(inner)) !== null) {
    const txt = decodeEntities(m[1].replace(/<[^>]+>/g, "")).trim();
    if (txt) paras.push(txt);
  }
  const href = (inner.match(/xlink:href="([^"]*)"/) || [])[1] || null;
  return { text: paras.join(" "), href: href ? decodeEntities(href) : null };
}

// Parse one sheet into an array of ordered cell-rows.
function parseSheet(xml) {
  const rows = [];
  const rowRe = /<table:table-row\b[^>]*?>([\s\S]*?)<\/table:table-row>/g;
  let r;
  while ((r = rowRe.exec(xml)) !== null) {
    const cells = [];
    const cellRe = /<table:(table-cell|covered-table-cell)\b([^>]*?)(?:\/>|>([\s\S]*?)<\/table:\1>)/g;
    let c;
    while ((c = cellRe.exec(xml.slice(r.index, r.index + r[0].length))) !== null) {
      const attrs  = c[2] || "";
      const repeat = parseInt((attrs.match(/table:number-columns-repeated="(\d+)"/) || [])[1] || "1", 10);
      const value  = c[1] === "covered-table-cell" ? { text: "", href: null } : cellValue(c[3]);
      // Trailing spacer cells repeat in the thousands — never replicate empties.
      const times  = value.text || value.href ? repeat : 1;
      for (let i = 0; i < Math.min(times, 64); i++) cells.push(value);
    }
    while (cells.length && !cells[cells.length - 1].text && !cells[cells.length - 1].href) cells.pop();
    if (cells.length) rows.push(cells);
  }
  return rows;
}

function sheetXml(content, sheetName) {
  const re = new RegExp(`<table:table\\b[^>]*table:name="${sheetName}"[^>]*>([\\s\\S]*?)<\\/table:table>`, "i");
  return (content.match(re) || [])[1] || null;
}

/* ------------------------------------------------------- column → meaning */
function headerField(label) {
  const l = label.toLowerCase();
  if (l.includes("name"))    return "name";
  if (l.includes("type"))    return "type";
  if (l.includes("desc"))    return "desc";
  if (l.includes("phone"))   return "phone";
  if (l.includes("mail"))    return "email";
  if (l.includes("website")) return "website";
  if (l.includes("social"))  return "social";
  return null;
}

function mapCategory(type) {
  const t = (type || "").toLowerCase();
  if (t.includes("food") || t.includes("beverage")) return "food";
  if (t.includes("assoc")) return "asso";
  return "craft";
}

/* --------------------------------------------------------- contact links */
function displayUrl(u) {
  try {
    const url = new URL(u);
    const host = url.hostname.replace(/^www\./, "");
    const path = url.pathname.replace(/\/+$/, "");
    return host + path;
  } catch {
    return u.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/+$/, "");
  }
}
function pathSegments(u) {
  try { return new URL(u).pathname.split("/").filter(Boolean); }
  catch { return []; }
}
function igHandle(u) {
  const segs = pathSegments(u);
  return segs.length ? segs[segs.length - 1] : displayUrl(u);
}
function fbLabel(u) {
  const segs = pathSegments(u);
  if (segs.length && !/\.php$/i.test(segs[0])) return "facebook.com/" + segs.join("/");
  return "facebook.com";
}
function socialKind(u) {
  const h = (() => { try { return new URL(u).hostname; } catch { return u; } })().toLowerCase();
  if (h.includes("instagram")) return "instagram";
  if (h.includes("facebook"))  return "facebook";
  return "web";
}

function telParts(raw) {
  const digits = raw.replace(/\D/g, "");
  let intl;
  if (digits.startsWith("00")) intl = "+" + digits.slice(2);
  else if (digits.startsWith("0")) intl = "+41" + digits.slice(1); // Swiss national → +41
  else intl = "+" + digits;
  const display = raw.trim().replace(/^0041\s*/, "+41 ");
  return { href: "tel:" + intl, display };
}

function linkLi(kind, href, label) {
  if (kind === "mail")
    return `<li><a href="${escAttr(href)}" data-i18n-title="a.mail" title="Écrire un courriel">${ICON.mail}<span>${escHtml(label)}</span></a></li>`;
  if (kind === "tel")
    return `<li><a href="${escAttr(href)}" data-i18n-title="a.tel" title="Téléphoner">${ICON.tel}<span>${escHtml(label)}</span></a></li>`;
  if (kind === "web")
    return `<li><a href="${escAttr(href)}" target="_blank" rel="noopener" data-i18n-title="a.web" title="Visiter le site">${ICON.web}<span>${escHtml(label)}</span></a></li>`;
  if (kind === "instagram")
    return `<li><a href="${escAttr(href)}" target="_blank" rel="noopener" title="Instagram">${ICON.instagram}<span>@${escHtml(label)}</span></a></li>`;
  if (kind === "facebook")
    return `<li><a href="${escAttr(href)}" target="_blank" rel="noopener" title="Facebook">${ICON.facebook}<span>${escHtml(label)}</span></a></li>`;
  return "";
}

function buildLinks(e) {
  const out = [];
  if (e.email) out.push(linkLi("mail", "mailto:" + e.email, e.email));
  if (e.phone) { const t = telParts(e.phone); out.push(linkLi("tel", t.href, t.display)); }
  if (e.website) out.push(linkLi("web", e.website, displayUrl(e.website)));
  for (const s of e.social) {
    const kind = socialKind(s);
    if (kind === "instagram") out.push(linkLi("instagram", s, igHandle(s)));
    else if (kind === "facebook") out.push(linkLi("facebook", s, fbLabel(s)));
    else out.push(linkLi("web", s, displayUrl(s)));
  }
  return out;
}

/* ----------------------------------------------------------- card / canton */
function cardHtml(e) {
  const links = buildLinks(e).map((l) => "            " + l).join("\n");
  return [
    `        <article class="entry reveal" data-cat="${e.cat}">`,
    `          <div class="entry__head">`,
    `            <h3 class="entry__name">${escHtml(e.name)}</h3>`,
    `            <span class="tag tag--${e.cat}" data-i18n="tag.${e.cat}">${TAG_FR[e.cat]}</span>`,
    `          </div>`,
    `          <p class="entry__desc" data-i18n="d.${e.slug}">${escHtml(e.fr)}</p>`,
    `          <ul class="links">`,
    links,
    `          </ul>`,
    `        </article>`
  ].join("\n");
}

function cantonHtml(meta, num, entries) {
  const cards = entries.map(cardHtml).join("\n\n");
  return [
    ``,
    `    <!-- ---------- ${meta.fr.toUpperCase()} ---------- -->`,
    `    <section class="canton" id="${meta.id}">`,
    `      <div class="canton__head reveal">`,
    `        <span class="canton__num">${num}</span>`,
    `        <h2 class="canton__name" data-i18n="${meta.key}">${escHtml(meta.fr)}</h2>`,
    `        <span class="canton__count"><b>${pad2(entries.length)}</b> <span data-i18n="stat.lieux">lieux</span></span>`,
    `      </div>`,
    `      <div class="entries">`,
    ``,
    cards,
    ``,
    `      </div>`,
    `    </section>`
  ].join("\n");
}

/* --------------------------------------------- region replacement in HTML */
function replaceRegion(src, startTok, endTok, innerLines) {
  const s = src.indexOf(startTok);
  if (s < 0) throw new Error("marker not found: " + startTok);
  const afterStart = s + startTok.length;
  const e = src.indexOf(endTok, afterStart);
  if (e < 0) throw new Error("end marker not found: " + endTok);
  const lineStart = src.lastIndexOf("\n", e) + 1;
  const indent = src.slice(lineStart, e);
  const inner = innerLines.length
    ? indent + innerLines.join("\n" + indent) + "\n" + indent
    : indent;
  return src.slice(0, afterStart) + "\n" + inner + src.slice(e);
}

/* ----------------------------------------------------------------- main */
function main() {
  const content   = readContentXml(ODS);
  const overrides = JSON.parse(readFileSync(OVERRIDES, "utf8"));

  const byCanton = [];
  let total = 0;

  for (const meta of CANTONS) {
    const xml = sheetXml(content, meta.sheet);
    if (!xml) continue;
    const rows = parseSheet(xml);
    if (!rows.length) continue;

    // Header row maps column index → field.
    const cols = rows[0].map((c) => headerField(c.text));
    const pick = (cells, field) => {
      const i = cols.indexOf(field);
      return i >= 0 ? cells[i] : undefined;
    };

    const entries = [];
    for (const cells of rows.slice(1)) {
      const nameCell = pick(cells, "name");
      const rawName = nameCell ? nameCell.text.trim() : "";
      if (!rawName) continue;

      const slug = slugify(rawName);
      const ov   = overrides[slug] || {};

      const emailCell = pick(cells, "email");
      const webCell   = pick(cells, "website");
      const socCell   = pick(cells, "social");
      const phoneCell = pick(cells, "phone");

      const parsedEmail = emailCell ? emailCell.text.replace(/^mailto:/i, "").trim() : "";
      const parsedWeb   = webCell ? normalizeUrl(/^https?:/i.test(webCell.text.trim()) ? webCell.text : (webCell.href || webCell.text)) : null;
      const parsedSoc   = socCell ? normalizeUrl(socCell.href || socCell.text) : null;
      const parsedPhone = phoneCell ? phoneCell.text.trim() : "";

      const social = ov.social ? [].concat(ov.social) : (parsedSoc ? [parsedSoc] : []);

      entries.push({
        slug,
        name:    ov.name || rawName,
        cat:     ov.cat || mapCategory(pick(cells, "type") ? pick(cells, "type").text : ""),
        fr:      ov.fr || (pick(cells, "desc") ? pick(cells, "desc").text : "") || "",
        en:      ov.en || null,
        hy:      ov.hy || null,
        email:   (ov.email !== undefined ? ov.email : parsedEmail) || "",
        website: (ov.website !== undefined ? normalizeUrl(ov.website) : parsedWeb) || null,
        phone:   (ov.phone !== undefined ? ov.phone : parsedPhone) || "",
        social
      });
    }

    if (entries.length) { byCanton.push({ meta, entries }); total += entries.length; }
  }

  if (total < MIN_ENTRIES) {
    console.error(`✗ Only ${total} entries parsed (floor ${MIN_ENTRIES}). Leaving the page untouched.`);
    process.exit(1);
  }

  // Assemble the generated regions.
  const cantonBlocks = byCanton.map((c, i) => cantonHtml(c.meta, toRoman(i + 1), c.entries));
  const cantonsInner = (cantonBlocks.join("\n") + "\n").split("\n");

  const flat = byCanton.flatMap((c) => c.entries);
  const enLines = flat.filter((e) => e.en).map((e) => `"d.${e.slug}": ${JSON.stringify(escHtml(e.en))},`);
  const hyLines = flat.filter((e) => e.hy).map((e) => `"d.${e.slug}": ${JSON.stringify(escHtml(e.hy))},`);

  // Splice everything into the page.
  let html = readFileSync(PAGE, "utf8");
  html = replaceRegion(html,
    "<!-- ASN:CANTONS:START — generated by ../scripts/build-network.mjs · do not hand-edit -->",
    "<!-- ASN:CANTONS:END -->", cantonsInner);
  html = replaceRegion(html,
    "/* ASN:EN:START — generated · do not hand-edit (curate in network.overrides.json) */",
    "/* ASN:EN:END */", enLines);
  html = replaceRegion(html,
    "/* ASN:HY:START — generated · do not hand-edit (curate in network.overrides.json) */",
    "/* ASN:HY:END */", hyLines);
  html = html.replace(/(data-asn="total">)\d+(<)/,   `$1${total}$2`);
  html = html.replace(/(data-asn="cantons">)\d+(<)/, `$1${pad2(byCanton.length)}$2`);

  writeFileSync(PAGE, html, "utf8");

  console.log(`✓ Réseau rebuilt — ${total} entries across ${byCanton.length} cantons`);
  for (const c of byCanton) console.log(`    ${c.meta.fr.padEnd(8)} ${pad2(c.entries.length)}  ${c.entries.map((e) => e.name).join(", ")}`);
  const missing = flat.filter((e) => !e.en || !e.hy).map((e) => e.slug);
  if (missing.length) console.log(`  ⚠ no EN/HY override (falls back to FR): ${missing.join(", ")}`);
}

main();
