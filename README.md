# BUFFEL Properties — Website

Static site for **buffelproperties.com**, generated from your Wix CMS.

Wix is the content backend. You keep editing billboard locations in the Wix dashboard exactly
as you would normally. A build step pulls that data and writes plain HTML files, which is why
the site loads fast and ranks well — search engines get real HTML, not JavaScript.

---

## Build it

```bash
cd "/Users/joehackmann/BUFFEL Website/site"
node build.mjs
```

Output lands in `dist/`. No dependencies to install — plain Node.

Preview locally:

```bash
npx serve dist
```

---

## What you can edit yourself, in Wix

Two collections in **Wix dashboard → CMS**:

**Billboard Locations** — every billboard. Specs, AADT, status, photos, descriptions.

**Site Content** — every headline and paragraph on the site. 88 blocks, each labelled in plain
English ("Hero headline", "Step 1 — body", "Landowner CTA — heading"). Filter by the **Page**
column to find what you want. Edit the **Text** column.

Between them, essentially all words and images on the site are yours. Things that still need a
file edit: phone/email/response time (`config.mjs`), page layout, colors, and adding a brand
new page.

---

## Add or change a billboard location

1. Go to your Wix dashboard → **CMS** → **Billboard Locations**
2. Add a row, or edit an existing one
3. Set **Publicly Visible** to `true` when you want it on the site
4. Run `node build.mjs` and redeploy

**The build only publishes rows where `publicly_visible` is `true`.** Everything else is
excluded — it never reaches the HTML. That is a hard gate in `wix.mjs`, not a display setting.

### The traffic count field

`aadt` is a **number** field. Leave it empty unless you have a verified MoDOT figure.

- Empty `aadt` → the page prints whatever is in `aadt_source`, currently
  `[AADT — PENDING MoDOT VERIFICATION]`
- Filled `aadt` → the page prints `14,200 — MoDOT 2024 traffic count`

It will never print `0` or a blank cell. Put the source and year in `aadt_source` when you fill
in a real number.

---

## The build audit

Every build scans the generated HTML and refuses to finish if it finds:

- a `[PENDING — DO NOT PUBLISH]` marker
- a landowner name (Marthasville Community Club, On-Site Storage)
- an advertiser name (Campbell Complete Solutions, Campbell Carpentry)

It also lists every remaining `[PLACEHOLDER]` so you know what is still outstanding. Those are
warnings, not blockers — the site still builds.

---

## Deploy

Any static host works. Cloudflare Pages is free and fast:

1. Push this folder to a GitHub repo
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → connect the repo
3. Build command: `node build.mjs`
4. Build output directory: `dist`
5. Environment variable: `WIX_CLIENT_SECRET` (see below)
6. Add `buffelproperties.com` as a custom domain

Netlify and Vercel work the same way with the same two settings.

After that, "publishing" a content change is: edit in Wix → trigger a rebuild. You can wire a
Wix automation to hit your host's deploy webhook so it happens automatically.

---

## Wix connection

Configured in `config.mjs`:

| | |
|---|---|
| Site ID | `676ab4a4-21b1-4ccc-bd06-43e4d9327ca7` |
| Collection | `BillboardLocations` |
| OAuth client ID | `db9159b9-6418-4c51-9fa2-c2b4434cfeca` |

The **client ID is public** and safe to commit.

The **client secret is not.** It is deliberately not stored in this repo. It lives in the
`WIX_CLIENT_SECRET` environment variable:

```bash
export WIX_CLIENT_SECRET="…"
node build.mjs
```

### Why the secret matters — recommended change

Right now `BillboardLocations` is set `read: ANYONE`. The build works without the secret, but
it also means **anyone who knows the client ID can query the collection directly and read your
hidden in-development locations.**

Nothing sensitive is exposed today, because those rows contain only placeholders and no
landowner names. But once you start filling in real details on sites you haven't decided to
announce, that changes.

**`WIX_CLIENT_SECRET` is already set in GitHub Actions secrets, and the admin-authenticated
build is verified working.** So the only remaining step is flipping the permission — and it has
to be done by hand, because the Wix REST API refuses permission changes (`WDE0075`) on both the
update and patch endpoints. It is a dashboard-only setting.

**Do this in Wix:**

1. Dashboard → **CMS**
2. Open **Billboard Locations**
3. **More Actions** (or the settings/gear icon) → **Permissions**
4. Set **read / "Who can view content"** to **Admin**
5. Repeat for **Site Content**

Deploys keep working afterward because Actions has the secret. Local builds will need it too:

```bash
export WIX_CLIENT_SECRET="…"
node build.mjs
```

---

## Still to do

- **Forms have no endpoint yet.** Both forms on `/contact/` post to
  `[PLACEHOLDER — FORM ENDPOINT]`. A static site cannot process submissions on its own. Options
  in rough order of least work: your host's built-in form handling (Netlify Forms, Cloudflare),
  a service like Formspree, or posting to the Wix Forms API so submissions land in your Wix
  dashboard alongside everything else.
- Real photographs of the Hwy 47 structure
- Response-time commitment in `config.mjs`
- Illumination type and nearby landmarks for Hwy 47 & Hwy O
- Founding year and owner photo
- A 1200×630 social share image
- Legal review of `/privacy/`

---

## Files

```
config.mjs        contact details, site URL, Wix connection — edit this first
content.mjs       default copy + the CMS override resolver
seed-content.mjs  pushes new copy blocks into Wix (safe to re-run)
wix.mjs           fetches CMS data; owns the publicly_visible gate
layout.mjs        page shell, header, footer, cards, CTAs, schema
pages.mjs         page structure
build.mjs         the generator + content audit
assets/           stylesheet
dist/             generated output — do not edit, it is overwritten every build
```

Copy lives in Wix. `content.mjs` holds the same text as a fallback, so if a row gets deleted or
the CMS is unreachable, the build still succeeds using the built-in version rather than
shipping a blank page.

Brand tokens live at the top of `assets/styles.css`: navy `#081631`, green `#75CD2B`,
warm gray `#F4F5F7`, slate `#5A6478`.

**Green is never used for body text on white** — it fails WCAG contrast at roughly 2.3:1. It is
for button fills, rules, icons, and badges only.
