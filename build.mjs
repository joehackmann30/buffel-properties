#!/usr/bin/env node
// BUFFEL Properties — static site generator.
// Pulls billboard locations from the Wix CMS and writes a complete static site to dist/.
//
//   node build.mjs
//
// Set WIX_CLIENT_SECRET to fetch as admin (recommended — lets the collection stay private).

import { mkdir, writeFile, rm, cp } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { CONFIG } from "./config.mjs";
import { fetchLocations, fetchContent, trafficCount, isPending } from "./wix.mjs";
import { setContent, CONTENT } from "./content.mjs";
import * as P from "./pages.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, "dist");

const warnings = [];
const written = [];

// When the site is served from a subpath (a GitHub Pages *project* site, e.g.
// /buffel-properties/), absolute root URLs would 404. Rewrite them at write time.
// With a custom domain the site is at the root and BASE is empty, so this is a no-op.
const BASE = (() => {
  try {
    const u = new URL(CONFIG.baseUrl);
    const p = u.pathname.replace(/\/$/, "");
    return p === "" ? "" : p;
  } catch { return ""; }
})();

function applyBasePath(html) {
  if (!BASE) return html;
  return html
    .replace(/(href|src)="\/(?!\/)/g, `$1="${BASE}/`)
    .replace(/(href|src)="\/"/g, `$1="${BASE}/"`);
}

async function emit(routePath, html) {
  const dir = routePath === "/" ? DIST : path.join(DIST, routePath);
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, "index.html");
  await writeFile(file, applyBasePath(html), "utf8");
  written.push(routePath);
}

/** Scans built HTML for anything that must not ship. */
function audit(routePath, html) {
  const banned = [
    [/\[PENDING\s*—\s*DO NOT PUBLISH\]/i, "contains a DO-NOT-PUBLISH marker"],
    [/Marthasville Community Club/i, "contains a landowner name"],
    [/On-?Site Storage/i, "contains a landowner name"],
    [/Campbell (Complete Solutions|Carpentry)/i, "contains an advertiser name"],
  ];
  for (const [re, msg] of banned) {
    if (re.test(html)) warnings.push(`BLOCKER  ${routePath} — ${msg}`);
  }
  const placeholders = html.match(/\[PLACEHOLDER[^\]]*\]|\[AADT[^\]]*\]|\[REVIEW[^\]]*\]/gi) || [];
  for (const p of new Set(placeholders)) {
    warnings.push(`placeholder  ${routePath} — ${p}`);
  }
}

function sitemap(routes) {
  const base = CONFIG.baseUrl.replace(/\/$/, "");
  const today = new Date().toISOString().slice(0, 10);
  const urls = routes
    .filter((r) => r !== "/privacy/")
    .map(
      (r) =>
        `  <url><loc>${base}${r}</loc><lastmod>${today}</lastmod><changefreq>${r === "/" ? "weekly" : "monthly"}</changefreq><priority>${r === "/" ? "1.0" : r === "/landowners/" || r === "/locations/" ? "0.9" : "0.7"}</priority></url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function robots() {
  const base = CONFIG.baseUrl.replace(/\/$/, "");
  return `User-agent: *
Allow: /
Disallow: /privacy/

Sitemap: ${base}/sitemap.xml
`;
}

async function main() {
  console.log("BUFFEL Properties — build\n");

  console.log("Fetching locations from Wix CMS…");
  const { locations, totalInCms, hidden, mode } = await fetchLocations();
  console.log(`  auth mode:  ${mode}${mode === "anonymous" ? "  (set WIX_CLIENT_SECRET for admin)" : ""}`);
  console.log(`  in CMS:     ${totalInCms}`);
  console.log(`  published:  ${locations.length}`);
  console.log(`  hidden:     ${hidden}  (publicly_visible = false — excluded from build)\n`);

  if (!locations.length) warnings.push("NOTE  no publicly_visible locations — location pages will be empty");

  console.log("Fetching page copy from Wix CMS…");
  const copy = await fetchContent();
  setContent(copy);
  const fromCms = Object.keys(copy).length;
  console.log(`  copy blocks: ${fromCms} from CMS, ${Math.max(0, CONTENT.length - fromCms)} from built-in defaults\n`);
  for (const c of CONTENT) {
    if (!(c.key in copy)) warnings.push(`copy  missing in CMS, using default — ${c.key}`);
  }

  for (const l of locations) {
    if (!l.slug) warnings.push(`BLOCKER  location "${l.name}" has no slug — cannot build its page`);
    if (isPending(trafficCount(l))) warnings.push(`data  ${l.name} — traffic count unverified`);
  }

  if (existsSync(DIST)) await rm(DIST, { recursive: true });
  await mkdir(DIST, { recursive: true });

  const routes = [];
  const add = async (route, html) => { audit(route, html); await emit(route, html); routes.push(route); };

  await add("/", P.home(locations));
  await add("/locations/", P.locationsIndex(locations));
  for (const loc of locations.filter((l) => l.slug)) {
    const others = locations.filter((o) => o.slug !== loc.slug);
    await add(`/locations/${loc.slug}/`, P.locationDetail(loc, others));
  }
  await add("/why-billboards/", P.whyBillboards());
  await add("/landowners/", P.landowners());
  await add("/about/", P.about());
  await add("/contact/", P.contact(locations));
  await add("/privacy/", P.privacy());

  await cp(path.join(ROOT, "assets"), path.join(DIST, "assets"), { recursive: true });
  await writeFile(path.join(DIST, "sitemap.xml"), sitemap(routes), "utf8");
  await writeFile(path.join(DIST, "robots.txt"), robots(), "utf8");
  // GitHub Pages needs .nojekyll or it ignores files/folders beginning with _
  await writeFile(path.join(DIST, ".nojekyll"), "", "utf8");
  if (CONFIG.customDomain) {
    const host = CONFIG.customDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");
    await writeFile(path.join(DIST, "CNAME"), host + "\n", "utf8");
    console.log(`Custom domain: ${host}\n`);
  } else {
    console.log(`Publishing to: ${CONFIG.baseUrl}  (no custom domain set yet)\n`);
  }

  console.log(`Wrote ${written.length} pages:`);
  written.forEach((r) => console.log(`  ${r}`));
  console.log("  /sitemap.xml\n  /robots.txt\n  /assets/styles.css\n");

  const blockers = warnings.filter((w) => w.startsWith("BLOCKER"));
  const rest = warnings.filter((w) => !w.startsWith("BLOCKER"));

  if (rest.length) {
    console.log("Outstanding items:");
    [...new Set(rest)].forEach((w) => console.log(`  ${w}`));
    console.log("");
  }
  if (blockers.length) {
    console.error("BUILD BLOCKED — confidential or unpublishable content reached the output:");
    blockers.forEach((w) => console.error(`  ${w}`));
    process.exit(1);
  }
  console.log("Build OK. Serve locally with:  npx serve dist");
}

main().catch((e) => { console.error("\nBuild failed:", e.message); process.exit(1); });
