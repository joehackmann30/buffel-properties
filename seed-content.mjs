#!/usr/bin/env node
// Pushes the defaults in content.mjs into the Wix "Site Content" collection.
//
//   WIX_CLIENT_SECRET=… node seed-content.mjs
//
// Safe to re-run: existing rows keep whatever Joe has edited. Only missing keys are added.
// Pass --force to overwrite every row back to the code defaults.

import { CONFIG } from "./config.mjs";
import { CONTENT } from "./content.mjs";

const TOKEN_URL = "https://www.wixapis.com/oauth2/token";
const BASE = "https://www.wixapis.com/wix-data/v2";
const COLLECTION = "SiteContent";
const FORCE = process.argv.includes("--force");

async function token() {
  const secret = process.env.WIX_CLIENT_SECRET;
  const body = secret
    ? { clientId: CONFIG.wix.clientId, clientSecret: secret, grantType: "client_credentials" }
    : { clientId: CONFIG.wix.clientId, grantType: "anonymous" };
  const r = await fetch(TOKEN_URL, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`token ${r.status}: ${await r.text()}`);
  return (await r.json()).access_token;
}

async function api(t, path, body) {
  const r = await fetch(BASE + path, {
    method: "POST",
    headers: { Authorization: t, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`${path} ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return r.json();
}

const main = async () => {
  const t = await token();

  const existing = await api(t, "/items/query", {
    dataCollectionId: COLLECTION, query: { paging: { limit: 500 } },
  });
  const byKey = new Map(
    (existing.dataItems || []).map((i) => [(i.data || i).key, i.data || i])
  );
  console.log(`Existing rows in Wix: ${byKey.size}`);

  const toInsert = [];
  const toUpdate = [];

  CONTENT.forEach((c, i) => {
    const row = { key: c.key, page: c.page, label: c.label, content: c.content, sort_order: i };
    const found = byKey.get(c.key);
    if (!found) toInsert.push({ data: row });
    else if (FORCE) toUpdate.push({ id: found._id, data: { ...row, _id: undefined } });
  });

  if (toInsert.length) {
    for (let i = 0; i < toInsert.length; i += 50) {
      await api(t, "/bulk/items/insert", {
        dataCollectionId: COLLECTION, dataItems: toInsert.slice(i, i + 50),
      });
    }
    console.log(`Inserted ${toInsert.length} new content blocks`);
  } else {
    console.log("No new blocks to insert");
  }

  if (toUpdate.length) {
    for (let i = 0; i < toUpdate.length; i += 50) {
      await api(t, "/bulk/items/update", {
        dataCollectionId: COLLECTION, dataItems: toUpdate.slice(i, i + 50),
      });
    }
    console.log(`Reset ${toUpdate.length} blocks to code defaults (--force)`);
  }

  console.log("\nDone. Edit these in Wix → CMS → Site Content, then rebuild.");
};

main().catch((e) => { console.error("Seed failed:", e.message); process.exit(1); });
