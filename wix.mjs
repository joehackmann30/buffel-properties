// Fetches billboard locations from the Wix CMS at build time.
//
// Auth: uses admin credentials (client_credentials) when WIX_CLIENT_SECRET is set,
// otherwise falls back to an anonymous visitor token. Admin is preferred — it lets the
// collection be locked to read:ADMIN so unbuilt sites are never publicly queryable.

import { CONFIG } from "./config.mjs";

const TOKEN_URL = "https://www.wixapis.com/oauth2/token";
const QUERY_URL = "https://www.wixapis.com/wix-data/v2/items/query";

async function getToken() {
  const secret = process.env.WIX_CLIENT_SECRET;
  const body = secret
    ? { clientId: CONFIG.wix.clientId, clientSecret: secret, grantType: "client_credentials" }
    : { clientId: CONFIG.wix.clientId, grantType: "anonymous" };

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Token request failed (${res.status}): ${await res.text()}`);
  const json = await res.json();
  if (!json.access_token) throw new Error("No access_token in token response");
  return { token: json.access_token, mode: secret ? "admin" : "anonymous" };
}

/** Returns only locations flagged publicly_visible, sorted with Available first. */
export async function fetchLocations() {
  const { token, mode } = await getToken();

  const res = await fetch(QUERY_URL, {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
    body: JSON.stringify({
      dataCollectionId: CONFIG.wix.collection,
      query: { paging: { limit: 200 } },
    }),
  });
  if (!res.ok) throw new Error(`Query failed (${res.status}): ${await res.text()}`);

  const json = await res.json();
  const all = (json.dataItems || []).map((i) => i.data || i);

  // HARD GATE: only publicly_visible records ever reach the built site.
  const visible = all.filter((d) => d.publicly_visible === true);

  const rank = { Available: 0, "Fully Booked": 1, "In Development": 2 };
  visible.sort((a, b) => (rank[a.status] ?? 9) - (rank[b.status] ?? 9));

  return { locations: visible, totalInCms: all.length, hidden: all.length - visible.length, mode };
}

/**
 * Renders the traffic-count cell.
 * NEVER prints a bare number without its source, and never prints 0 or blank
 * for an unverified count — it falls through to the pending placeholder.
 */
export function trafficCount(loc) {
  const n = loc.aadt;
  const src = (loc.aadt_source || "").trim();
  if (typeof n === "number" && Number.isFinite(n) && n > 0) {
    const formatted = n.toLocaleString("en-US");
    return src ? `${formatted} — ${src}` : `${formatted}`;
  }
  return src || "[AADT — PENDING MoDOT VERIFICATION]";
}

export function isPending(text) {
  return typeof text === "string" && /^\s*\[(PLACEHOLDER|PENDING|AADT)/i.test(text);
}

/** Pulls editable page copy from the Site Content collection. Returns {key: html}. */
export async function fetchContent() {
  const { token } = await getToken();
  const res = await fetch(QUERY_URL, {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
    body: JSON.stringify({ dataCollectionId: "SiteContent", query: { paging: { limit: 500 } } }),
  });
  if (!res.ok) {
    console.warn(`  ! Site Content unavailable (${res.status}) — using built-in copy`);
    return {};
  }
  const json = await res.json();
  const map = {};
  for (const item of json.dataItems || []) {
    const d = item.data || item;
    if (d.key) map[d.key] = d.content;
  }
  return map;
}
