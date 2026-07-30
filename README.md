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
4. Wait for the next scheduled build, or trigger one immediately from the Actions tab

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

## Deploy — already live

**https://joehackmann30.github.io/buffel-properties/**

Hosted on GitHub Pages, built by GitHub Actions on every push. Repo:
[joehackmann30/buffel-properties](https://github.com/joehackmann30/buffel-properties).

### Moving to buffelproperties.com

1. In `config.mjs`, set `customDomain: "www.buffelproperties.com"`
2. Point DNS: `CNAME` record for `www` → `joehackmann30.github.io`
3. GitHub repo → Settings → Pages → add the custom domain, tick **Enforce HTTPS**
4. Commit and push

The build writes the `CNAME` file, drops the `/buffel-properties` path prefix from every
internal link, and rewrites all canonical URLs automatically.

---

## Wix connection

Configured in `config.mjs`:

| | |
|---|---|
| Site ID | `676ab4a4-21b1-4ccc-bd06-43e4d9327ca7` |
| Collections | `BillboardLocations`, `SiteContent` |
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

## Forms — where leads go

Both forms on `/contact/` post straight into **Wix → Forms & Submissions**:

| Form | Wix form ID |
|---|---|
| Advertising Inquiry | `4995d310-3731-40ca-8e4e-c6e8b92422c9` |
| Land Evaluation Request | `72a2c518-bb88-4097-8071-ab634b1e1f23` |

Submissions also upsert a **Contact** in your Wix CRM, so leads build a contact list
automatically.

How it works: the browser gets an anonymous Wix visitor token using the public client ID, then
posts the submission. **No secret is ever exposed to the browser.** Phone numbers are converted
to E.164 (`+16362668099`) first — Wix rejects bare 10-digit numbers.

Protections built in: honeypot field, Wix's own `ADVANCED` spam filter, inline validation with
accessible error messages, consent capture with a timestamp, and a fallback message pointing to
your phone and email if the request ever fails.

**Email notifications:** set these in Wix → Forms & Submissions → the form → Settings. Wix owns
notification delivery, not this codebase.

---

## Publishing content changes

Edit in Wix, then the site updates when a build runs:

- **Automatically, every 3 hours** — the scheduled job in `.github/workflows/deploy.yml`
- **Immediately** — GitHub repo → **Actions** tab → **Build and deploy** → **Run workflow**
- **On any push** to `main`

For a true instant webhook, a Wix Automation would need to POST to GitHub's
`repository_dispatch` endpoint with event type `wix-content-update`. That needs an HTTP action
in Wix Automations, which may require a Premium plan — the 3-hour schedule covers it without.

---

## Still to do

- Attach the structure photos to the CMS record (both are already in your Media Manager)
- Owner photo for `/about/`
- A 1200×630 social share image
- Legal review of `/privacy/`
- Lock the CMS collections to `read: ADMIN` (see above)

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
assets/           stylesheet, form script, photos
dist/             generated output — do not edit, it is overwritten every build
```

Copy lives in Wix. `content.mjs` holds the same text as a fallback, so if a row gets deleted or
the CMS is unreachable, the build still succeeds using the built-in version rather than
shipping a blank page.

Brand tokens live at the top of `assets/styles.css`: navy `#081631`, green `#75CD2B`,
warm gray `#F4F5F7`, slate `#5A6478`.

**Green is never used for body text on white** — it fails WCAG contrast at roughly 2.3:1. It is
for button fills, rules, icons, and badges only.
