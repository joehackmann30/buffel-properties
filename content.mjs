// Every editable string on the site.
//
// These are DEFAULTS. At build time each one is overridden by the matching row in the
// Wix "Site Content" collection, so Joe edits copy in the Wix dashboard.
// If a row is missing or the CMS is unreachable, the default below is used and the
// build still succeeds.
//
// To add a new editable block: add it here, then run `node seed-content.mjs`.

export const CONTENT = [
  /* ---------------- shared ---------------- */
  { key: "cta.adv.heading", page: "Shared", label: "Advertiser CTA — heading", content: "Put your business on the highway." },
  { key: "cta.adv.body", page: "Shared", label: "Advertiser CTA — body", content: "Contact us for current availability and rates." },
  { key: "cta.adv.button", page: "Shared", label: "Advertiser CTA — button", content: "Check Availability" },
  { key: "cta.land.heading", page: "Shared", label: "Landowner CTA — heading", content: "Think your property might work?" },
  { key: "cta.land.body", page: "Shared", label: "Landowner CTA — body", content: "We pay rent on qualifying sites. Evaluations are free and carry no obligation." },
  { key: "cta.land.button", page: "Shared", label: "Landowner CTA — button", content: "Get a Free Site Evaluation" },
  { key: "footer.service_area", page: "Shared", label: "Footer — service area blurb", content: "Billboard advertising and land leasing across Missouri. Home corridors: Highway 47, Highway 100, and I-44 in Franklin and Warren Counties." },

  /* ---------------- home ---------------- */
  { key: "home.hero.headline", page: "Home", label: "Hero headline", content: "Seen by every driver, every day." },
  { key: "home.hero.subhead", page: "Home", label: "Hero subheading", content: "Billboard structures built and operated across Missouri, from our home corridors on Highway 47, Highway 100, and I-44 in Franklin and Warren Counties. Locally owned, locally built, locally maintained." },
  { key: "home.hero.cta1", page: "Home", label: "Hero — green button", content: "View Our Locations" },
  { key: "home.hero.cta2", page: "Home", label: "Hero — outline button", content: "Lease Your Land" },

  { key: "home.value1.title", page: "Home", label: "Value 1 — title", content: "Local Ownership" },
  { key: "home.value1.body", page: "Home", label: "Value 1 — body", content: "You talk to the person who owns the structures. No regional sales office, no call center, no waiting three weeks on a corporate approval for a change to your copy." },
  { key: "home.value2.title", page: "Home", label: "Value 2 — title", content: "Prime Corridors" },
  { key: "home.value2.body", page: "Home", label: "Value 2 — body", content: "Our structures sit on roads Missouri traffic actually uses. Commuters heading to work, freight running the corridor, and weekend travelers heading out to the river and the wineries." },
  { key: "home.value3.title", page: "Home", label: "Value 3 — title", content: "Straightforward Terms" },
  { key: "home.value3.body", page: "Home", label: "Value 3 — body", content: "Clear agreements, flexible lengths, and a real conversation about what fits your budget. Contact us for current rates." },

  { key: "home.locations.heading", page: "Home", label: "Locations preview — heading", content: "Where We Are" },
  { key: "home.locations.body", page: "Home", label: "Locations preview — body", content: "Our first structure stands on the Highway 47 corridor in Warren County, with additional sites in development and new locations under evaluation across Missouri. Inventory changes as we build and as contracts come up for renewal." },

  { key: "home.why.heading", page: "Home", label: "Why Billboards teaser — heading", content: "A billboard doesn't get skipped." },
  { key: "home.why.body", page: "Home", label: "Why Billboards teaser — body", content: "Nobody closes a billboard. Nobody blocks it, mutes it, or scrolls past it. It is working every hour your customers are on the road, and it keeps working after your ad budget meeting is over." },

  { key: "home.land.heading", page: "Home", label: "Landowner band — heading", content: "Own highway frontage anywhere in Missouri?" },
  { key: "home.land.kicker", page: "Home", label: "Landowner band — green line", content: "We pay you to put a billboard on it." },
  { key: "home.land.body", page: "Home", label: "Landowner band — body", content: "If your property has frontage on a highway with real traffic, it may qualify for a structure. We handle permitting, construction, insurance, maintenance, and advertiser sales. You collect a rent check on ground you already own and already pay taxes on." },

  /* ---------------- locations ---------------- */
  { key: "locations.heading", page: "Locations", label: "Page heading", content: "Our Locations" },
  { key: "locations.intro", page: "Locations", label: "Intro paragraph", content: "BUFFEL Properties builds and operates billboard structures in Missouri. Our home corridors are Highway 47, Highway 100, and I-44 through Franklin and Warren Counties, and we are actively developing new sites elsewhere in the state. Every structure listed here is owned and maintained by us, not subleased from a national operator." },
  { key: "locations.intro2", page: "Locations", label: "Second paragraph", content: "We are a growing company, and this list reflects what we have built so far rather than what we are capable of building. If a location shows as booked, contact us anyway — we can tell you when it opens and what is coming online next." },
  { key: "locations.mapnote", page: "Locations", label: "Caption under the map", content: "Map shows BUFFEL structures with published coordinates. The card list below is the complete inventory." },
  { key: "locations.footnote", page: "Locations", label: "Note below the cards", content: "Inventory changes. Contact us for current availability, or ask to be notified when a specific location opens." },
  { key: "location.cta.heading", page: "Locations", label: "Location page — CTA heading", content: "Interested in this location?" },
  { key: "location.cta.body", page: "Locations", label: "Location page — CTA body", content: "Contact us for current availability and rates." },

  /* ---------------- why billboards ---------------- */
  { key: "why.heading", page: "Why Billboards", label: "Page heading", content: "Why Billboards" },
  { key: "why.intro", page: "Why Billboards", label: "Intro paragraph", content: "Most advertising asks for permission. A billboard doesn't. Here is the honest case for outdoor advertising for a local business, and the equally honest case for when it isn't the right fit." },

  { key: "why.s1.title", page: "Why Billboards", label: "Section 1 — title", content: "It can't be skipped, blocked, or muted" },
  { key: "why.s1.body", page: "Why Billboards", label: "Section 1 — body", content: "<p>Every other channel you buy has an off switch. Streaming ads get skipped. Radio spots get changed. Email gets filtered. Social posts get scrolled past in under a second, and a growing share of your audience runs an ad blocker that means they never loaded your ad at all.</p><p>A billboard has no off switch. It is part of the road. The only way to avoid it is to not drive that highway.</p>" },
  { key: "why.s2.title", page: "Why Billboards", label: "Section 2 — title", content: "It works while you sleep" },
  { key: "why.s2.body", page: "Why Billboards", label: "Section 2 — body", content: "<p>A face is up 24 hours a day, seven days a week, for the length of your contract. It is working at 6 a.m. when the trades are heading out and at 11 p.m. when second shift is heading home.</p><p>There is no daypart to buy and no impressions budget to run out of partway through the month.</p>" },
  { key: "why.s3.title", page: "Why Billboards", label: "Section 3 — title", content: "Repetition is the whole point" },
  { key: "why.s3.body", page: "Why Billboards", label: "Section 3 — body", content: "<p>The same people drive the same road twice a day, five days a week. Over a few months that adds up to real familiarity — not a single exposure they forget by lunch, but a name they have seen so many times it feels like a business they already know.</p><p>That compounding is the thing most local advertising can't buy. A digital ad is gone the instant it scrolls. A billboard on a commuter's route becomes part of the landscape.</p>" },
  { key: "why.s4.title", page: "Why Billboards", label: "Section 4 — title", content: "Geographic precision" },
  { key: "why.s4.body", page: "Why Billboards", label: "Section 4 — body", content: "<p>You are not paying to reach somebody three counties over who is never going to drive to you. You are reaching people who are already on the road that leads to your door, often within a few minutes of your location.</p><p>For a business that serves a defined trade area — and most local businesses do — that is the difference between advertising and paying to advertise to strangers.</p>" },
  { key: "why.s5.title", page: "Why Billboards", label: "Section 5 — title", content: "Cost efficiency" },
  { key: "why.s5.body", page: "Why Billboards", label: "Section 5 — body", content: "<p>A single face reaches every vehicle on that stretch of road for a flat monthly cost that doesn't move whether traffic is heavy or light. There is no bidding, no auction, no cost that climbs because a national brand entered your market this quarter. Contact us for current rates.</p>" },
  { key: "why.s6.title", page: "Why Billboards", label: "Section 6 — title", content: "It makes your other advertising work harder" },
  { key: "why.s6.body", page: "Why Billboards", label: "Section 6 — body", content: "<p>Billboards are not a replacement for your digital spend. They make it work better. Somebody who has driven past your name four hundred times is far more likely to stop scrolling when your ad shows up in their feed, and far more likely to click a search result they recognize. Outdoor builds the recognition. Digital closes it.</p>" },

  { key: "why.fit.heading", page: "Why Billboards", label: "Good fit — heading", content: "Is billboard advertising right for my business?" },
  { key: "why.fit.intro", page: "Why Billboards", label: "Good fit — intro", content: "Not always. Here is where we have seen it work and where we haven't." },
  { key: "why.fit.good.title", page: "Why Billboards", label: "Good fit — left column title", content: "It tends to work well for" },
  { key: "why.fit.good.list", page: "Why Billboards", label: "Good fit — left column list (one item per line)", content: "Businesses with a physical location people drive to\nBroad local appeal — something most drivers on that road could plausibly need\nA simple offer that reads in about four seconds\nA long sales cycle, where recognition built over months pays off at the moment somebody finally needs you\nTrades, restaurants, dealerships, medical and dental practices, banks, self-storage, agricultural suppliers, and home services" },
  { key: "why.fit.bad.title", page: "Why Billboards", label: "Good fit — right column title", content: "It tends to work poorly for" },
  { key: "why.fit.bad.list", page: "Why Billboards", label: "Good fit — right column list (one item per line)", content: "Highly specialized B2B, where your entire customer list is a few dozen companies\nAnything that needs explaining — if the pitch takes a paragraph, it will not survive a four-second read at highway speed\nOne-time promotions and short-window events, since the value comes from repetition over months\nBusinesses with no defined trade area" },
  { key: "why.fit.close", page: "Why Billboards", label: "Good fit — closing line", content: "If you are in the second column, we will tell you. We would rather turn down a bad fit than sell you twelve months of something that was never going to work." },

  /* ---------------- landowners ---------------- */
  { key: "land.hero.headline", page: "For Landowners", label: "Hero headline", content: "We pay you to put a billboard on your land." },
  { key: "land.hero.body", page: "For Landowners", label: "Hero body", content: "You are already paying taxes on that highway frontage. A billboard structure takes up a few square feet of it, costs you nothing to build, nothing to insure, and nothing to maintain — and it pays you every month the lease runs." },
  { key: "land.hero.kicker", page: "For Landowners", label: "Hero green line", content: "We build it. We maintain it. We find the advertisers. You cash the check." },
  { key: "land.hero.button", page: "For Landowners", label: "Hero button", content: "Request a Free Site Evaluation" },

  { key: "land.money.heading", page: "For Landowners", label: "The Money — heading", content: "The Money" },
  { key: "land.money.body", page: "For Landowners", label: "The Money — body", content: "<p>We lease the ground under the structure and pay you rent for it. Not a one-time payment for an easement — ongoing rent, for the life of the lease.</p><p>Rent varies with the site. Traffic, visibility, how many faces the structure carries, and what the location can command from advertisers all factor in, which is why we quote it per property rather than publishing a number that would be wrong for most of them.</p><p><strong>Tell us where your land is and we will tell you what it is worth. Contact us for current lease terms.</strong></p>" },

  { key: "land.how.heading", page: "For Landowners", label: "How It Works — heading", content: "How It Works" },
  { key: "land.step1.title", page: "For Landowners", label: "Step 1 — title", content: "You submit your property." },
  { key: "land.step1.body", page: "For Landowners", label: "Step 1 — body", content: "Fill out the form with your address or nearest cross streets. It takes about two minutes." },
  { key: "land.step2.title", page: "For Landowners", label: "Step 2 — title", content: "We evaluate it at no cost to you." },
  { key: "land.step2.body", page: "For Landowners", label: "Step 2 — body", content: "We look at location, traffic, sightlines, spacing from existing structures, and whether the site can actually be permitted. You pay nothing and you are not committing to anything." },
  { key: "land.step3.title", page: "For Landowners", label: "Step 3 — title", content: "If it qualifies, we present a lease offer with a rent figure." },
  { key: "land.step3.body", page: "For Landowners", label: "Step 3 — body", content: "Straightforward terms, explained in plain language, with time to think it over and to have anyone you want look at it." },
  { key: "land.step4.title", page: "For Landowners", label: "Step 4 — title", content: "We handle everything else. You get paid." },
  { key: "land.step4.body", page: "For Landowners", label: "Step 4 — body", content: "Permitting, construction, insurance, maintenance, and finding the advertisers are all ours. Your rent does not depend on whether we keep the faces sold." },

  { key: "land.good.heading", page: "For Landowners", label: "Good site checklist — heading", content: "What makes a good billboard site" },
  { key: "land.good.intro", page: "For Landowners", label: "Good site checklist — intro", content: "Before you fill anything out, here is roughly what we are looking for. If your property has most of these, it is worth a conversation." },
  { key: "land.good.list", page: "For Landowners", label: "Good site checklist — list (one item per line)", content: "Frontage on a highway with meaningful traffic. Route 47, Route 100, I-44, Route 54, Route 61, and similar corridors anywhere in Missouri.\nClear sightlines from the main-traveled way. Drivers need an unobstructed look at the face for several seconds. Tree lines, cuts, curves, and grade changes all matter.\nCommercial or industrial zoning, or qualifying unzoned commercial activity.\nAdequate spacing from existing structures. Missouri regulates how close signs can be to one another, and this disqualifies more sites than anything else on this list.\nReasonable access for construction and maintenance. We need to get equipment in to build it and a bucket truck to it afterward." },

  { key: "land.nothing.heading", page: "For Landowners", label: "Your responsibility — heading", content: "What you are responsible for: nothing" },
  { key: "land.nothing.body", page: "For Landowners", label: "Your responsibility — body", content: "<p>We carry the permitting. We carry the construction cost. We carry the insurance. We carry the maintenance. We find and manage the advertisers.</p><p>You are not out a dollar at any point in this process — not for the evaluation, not for the build, not for upkeep. Your involvement after signing is cashing the rent.</p>" },

  { key: "land.straight.heading", page: "For Landowners", label: "Straight talk — heading", content: "Straight talk: not every property qualifies" },
  { key: "land.straight.body", page: "For Landowners", label: "Straight talk — body", content: "<p>We would rather tell you no in week one than string you along.</p><p>Missouri and MoDOT regulate billboard spacing, zoning, and placement, and plenty of otherwise excellent sites are disqualified by rules that neither of us controls. A property can have perfect frontage, perfect visibility, and a willing owner, and still not be permittable because of a structure a half mile up the road. Nobody gets paid on a site that cannot be built.</p><p>If yours doesn't work, we will tell you why in plain terms. If it does, we will tell you that too.</p>" },

  { key: "land.disclaimer", page: "For Landowners", label: "Legal disclaimer", content: "Site evaluation is free and carries no obligation. Any lease is subject to MoDOT permitting, local zoning approval, and mutual agreement on terms. Nothing on this page is an offer." },

  /* ---------------- about ---------------- */
  { key: "about.heading", page: "About", label: "Page heading", content: "About BUFFEL Properties" },
  { key: "about.body", page: "About", label: "Intro body", content: "<p>BUFFEL Properties is an owner-operated outdoor advertising company based in Marthasville, Missouri. We build, own, and maintain billboard structures, and we work statewide.</p><p>We started on the Highway 47, Highway 100, and I-44 corridors through Franklin and Warren Counties, and that is still home. We are actively evaluating sites across Missouri, including Lincoln County and the Highway 54 and Highway 61 corridors. If you own highway frontage somewhere we have not built yet, that is a conversation worth having.</p>" },
  { key: "about.founded", page: "About", label: "Founding year line", content: "[PLACEHOLDER — founding year: \"We've been doing this since ____.\"]" },
  { key: "about.why.heading", page: "About", label: "Local ownership — heading", content: "Why local ownership matters" },
  { key: "about.why.body", page: "About", label: "Local ownership — body", content: "<p>When you call a national operator you get a sales rep working a territory and a quota. When you call us you get the person who owns the structure.</p><p>That has practical consequences. Decisions get made on the phone instead of routed to a regional office. Terms flex, because there is nobody above us enforcing a rate card. And when something needs fixing, the person responsible for fixing it lives here.</p><p>We are also accountable in a way a regional chain isn't. Our structures sit on our neighbors' land, along the roads we drive every day. That tends to keep a company honest.</p>" },

  /* ---------------- contact ---------------- */
  { key: "contact.heading", page: "Contact", label: "Page heading", content: "Contact" },
  { key: "contact.intro", page: "Contact", label: "Intro paragraph", content: "Whether you are looking for advertising space or you own land you think might work, this is the place to start." },
  { key: "contact.service_area", page: "Contact", label: "Service area line", content: "Statewide Missouri. Home corridors are Highway 47, Highway 100, and I-44 through Franklin and Warren Counties, with site evaluation and development anywhere in the state." },
  { key: "contact.rep.heading", page: "Contact", label: "Regional rep — heading", content: "Central Missouri" },
  { key: "contact.adv.heading", page: "Contact", label: "Advertising form — heading", content: "Advertising Inquiry" },
  { key: "contact.adv.intro", page: "Contact", label: "Advertising form — intro", content: "Looking for space on one of our structures? Tell us what you need and we will come back with current availability and rates." },
  { key: "contact.land.heading", page: "Contact", label: "Land form — heading", content: "Land Evaluation Request" },
  { key: "contact.land.intro", page: "Contact", label: "Land form — intro", content: "Own property with highway frontage anywhere in Missouri? Send us the details and we will evaluate it at no cost to you. If it qualifies, we pay you rent." },
];

/** Fast lookup by key. */
export const DEFAULTS = Object.fromEntries(CONTENT.map((c) => [c.key, c.content]));

/* ---------------- resolver ----------------
   build.mjs calls setContent() with whatever came back from the Wix CMS.
   Anything missing falls back to the defaults above, so the build never breaks
   on a deleted or renamed row. */

let OVERRIDES = {};
export function setContent(map) { OVERRIDES = map || {}; }

/** Raw value for a key — CMS first, then the code default. */
export function t(key) {
  const v = OVERRIDES[key];
  if (typeof v === "string" && v.trim() !== "") return v;
  if (!(key in DEFAULTS)) throw new Error(`Unknown content key: ${key}`);
  return DEFAULTS[key];
}

/** Plain text — strips the <p> wrapper Wix adds to rich-text fields. Use for headings. */
export function tp(key) {
  return t(key)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** HTML body — ensures the value is wrapped in at least one paragraph. */
export function th(key) {
  const v = t(key).trim();
  return /^\s*<(p|ul|ol|h[1-6]|div|blockquote)/i.test(v) ? v : `<p>${v}</p>`;
}

/** List items. Accepts newline-separated text or Wix rich text with <p>/<li>/<br>. */
export function tl(key) {
  return t(key)
    .replace(/<\/(p|li|div)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .split("\n")
    .map((s) => s.replace(/&nbsp;/g, " ").trim())
    .filter(Boolean);
}
