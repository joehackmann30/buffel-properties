// Shared page shell, header, footer, and reusable components.
import { CONFIG, NAV } from "./config.mjs";
import { tp } from "./content.mjs";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Content hash per asset, so a deploy invalidates browser caches. Without this,
// visitors keep running the previous forms.js/styles.css after an update.
const ASSET_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "assets");
const hashCache = {};
export function asset(file) {
  if (!hashCache[file]) {
    try {
      hashCache[file] = createHash("sha1")
        .update(readFileSync(path.join(ASSET_DIR, file)))
        .digest("hex").slice(0, 8);
    } catch { hashCache[file] = "0"; }
  }
  return `/assets/${file}?v=${hashCache[file]}`;
}

export const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const FONTS =
  "https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=Barlow:wght@400;500;600&display=swap";

export function header(active) {
  const links = NAV.map(
    (n) => `<a href="${n.href}"${n.key === active ? ' class="active" aria-current="page"' : ""}>${n.label}</a>`
  ).join("\n        ");
  return `<a class="skip" href="#main">Skip to content</a>
<header>
  <div class="wrap navbar">
    <a class="logo" href="/" aria-label="${esc(CONFIG.siteName)} home">
      <img src="${CONFIG.logos.wordmarkHeader}" alt="${esc(CONFIG.siteName)}" width="300" height="64">
    </a>
    <nav class="main" id="nav" aria-label="Main">
        ${links}
    </nav>
    <a class="btn btn-green" href="/contact/">Check Availability</a>
    <button class="burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="nav">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>`;
}

export function footer() {
  const links = NAV.map((n) => `<a href="${n.href}">${n.label}</a>`).join("\n        ");
  return `<footer>
  <img class="mark" src="${CONFIG.logos.bison}" alt="" aria-hidden="true">
  <div class="wrap">
    <div class="fgrid">
      <div>
        <img src="${CONFIG.logos.wordmark}" alt="${esc(CONFIG.siteName)}" style="width:150px" width="150" height="37">
        <p style="margin-top:18px;font-weight:600;font-size:15px">${esc(CONFIG.legalName).toUpperCase()}</p>
        <p class="dim">${esc(CONFIG.city)}, ${esc(CONFIG.state)}</p>
      </div>
      <div><div class="fhead">Navigate</div>
        ${links}
      </div>
      <div><div class="fhead">Contact</div>
        <a href="${CONFIG.phoneHref}">${esc(CONFIG.phone)}</a>
        <a href="mailto:${esc(CONFIG.email)}">${esc(CONFIG.email)}</a>
      </div>
      <div><div class="fhead">Service Area</div>
        <p class="dim">${esc(tp("footer.service_area"))}</p>
      </div>
    </div>
    <div class="fbot">
      <span>&copy; ${new Date().getFullYear()} ${esc(CONFIG.legalName)}. All rights reserved.</span>
      <a href="/privacy/">Privacy Policy</a>
    </div>
  </div>
</footer>
<script>
(function(){
  var b=document.getElementById('burger'), n=document.getElementById('nav');
  if(b&&n){b.addEventListener('click',function(){
    var open=n.classList.toggle('open');
    b.setAttribute('aria-expanded',open);
    b.setAttribute('aria-label',open?'Close menu':'Open menu');
  });}
})();
</script>`;
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: CONFIG.legalName,
    description:
      "Owner-operated outdoor advertising company building and operating billboard structures across Missouri.",
    url: CONFIG.baseUrl,
    telephone: CONFIG.phone,
    email: CONFIG.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: CONFIG.city,
      addressRegion: CONFIG.stateCode,
      addressCountry: "US",
    },
    areaServed: { "@type": "State", name: "Missouri" },
  };
}

/** Full HTML document. */
export function page({ title, description, path, active, body, schema, noindex = false, scripts = [] }) {
  const canonical = CONFIG.baseUrl.replace(/\/$/, "") + path;
  const blocks = [localBusinessSchema()];
  if (schema) blocks.push(schema);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
${noindex ? '<meta name="robots" content="noindex,follow">\n' : ""}<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:site_name" content="${esc(CONFIG.siteName)}">
<meta property="og:image" content="${CONFIG.baseUrl}/assets/photos/og-share.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="BUFFEL Properties">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${CONFIG.baseUrl}/assets/photos/og-share.jpg">
<link rel="icon" href="${CONFIG.logos.bison}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${FONTS}" rel="stylesheet">
<link rel="stylesheet" href="${asset("styles.css")}">
<script type="application/ld+json">${JSON.stringify(blocks.length === 1 ? blocks[0] : blocks)}</script>
</head>
<body data-wix-client="${CONFIG.wix.clientId}" data-phone="${esc(CONFIG.phone)}" data-email="${esc(CONFIG.email)}">
${header(active)}
<main id="main">
${body}
</main>
${footer()}
${scripts.map((s) => `<script src="${asset(s)}" defer></script>`).join("\n")}
</body>
</html>
`;
}

/* ---------------- components ---------------- */

export const rule = '<div class="rule"></div>';

export function badge(status) {
  const cls =
    status === "Available" ? "b-avail" : status === "Fully Booked" ? "b-booked" : "b-dev";
  return `<span class="badge ${cls}">${esc(status || "")}</span>`;
}

export function locationCard(loc) {
  const href = `/locations/${encodeURIComponent(loc.slug)}/`;
  const img = loc.hero_image
    ? `<img src="${esc(loc.hero_image)}" alt="${esc(loc.name)} billboard structure on ${esc(loc.highway)} near ${esc(loc.city)}, Missouri" loading="lazy" style="width:100%;height:100%;object-fit:cover;opacity:1">`
    : `<img src="${CONFIG.logos.bison}" alt="" aria-hidden="true">`;
  return `<a class="card" href="${href}">
  <div class="thumb">${img}</div>
  <div class="body">
    ${badge(loc.status)}
    <h3 style="font-size:20px;text-transform:none;letter-spacing:0">${esc(loc.name)}</h3>
    <div class="cap">${esc(loc.highway)} &middot; ${esc(loc.city)}, ${esc(loc.county)} County</div>
    <span class="more">View Details &rarr;</span>
  </div>
</a>`;
}

export function ctaAdvertiser() {
  return `<section class="bg-gray">
  <div class="wrap" style="text-align:center">
    <h2>${esc(tp("cta.adv.heading"))}</h2>
    <p class="lede" style="margin-top:18px;color:var(--slate)">${esc(tp("cta.adv.body"))}</p>
    <div class="btnrow" style="justify-content:center"><a class="btn btn-navy" href="/contact/">${esc(tp("cta.adv.button"))}</a></div>
  </div>
</section>`;
}

export function ctaLandowner() {
  return `<section class="bg-navy">
  <div class="wrap" style="text-align:center">
    <h2>${esc(tp("cta.land.heading"))}</h2>
    <p class="lede" style="margin-top:18px">${esc(tp("cta.land.body"))}</p>
    <div class="btnrow" style="justify-content:center"><a class="btn btn-green" href="/contact/">${esc(tp("cta.land.button"))}</a></div>
  </div>
</section>`;
}

export function mapEmbed(bbox, marker, title, height = 420) {
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik${marker ? `&marker=${encodeURIComponent(marker)}` : ""}`;
  return `<div class="map" style="height:${height}px"><iframe title="${esc(title)}" loading="lazy" src="${src}"></iframe></div>`;
}
