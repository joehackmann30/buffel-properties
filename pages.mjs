// Page bodies. All prose comes from the Wix "Site Content" collection via t/tp/th/tl,
// falling back to the defaults in content.mjs if a row is missing.

import { CONFIG } from "./config.mjs";
import { tp, th, tl } from "./content.mjs";
import {
  esc, page, rule, badge, locationCard, ctaAdvertiser, ctaLandowner, mapEmbed,
} from "./layout.mjs";
import { trafficCount, isPending } from "./wix.mjs";

const pendingCell = (v) => (isPending(v) ? `<span class="pending">${esc(v)}</span>` : esc(v || ""));
const items = (key) => tl(key).map((s) => `<li>${s}</li>`).join("\n          ");

/* ================= HOME ================= */
export function home(locations) {
  const cards = locations.slice(0, 3).map(locationCard).join("\n");
  const shot = locations.find((l) => l.hero_image);
  const heroPhoto = shot
    ? `<div class="photo" style="background-image:url('${esc(shot.hero_image)}');background-size:cover;background-position:center;opacity:1"></div>`
    : `<div class="photo"></div>`;
  const heroNote = shot
    ? (shot.hero_caption ? `<div class="photo-note">${esc(shot.hero_caption)}</div>` : "")
    : '<div class="photo-note">[PLACEHOLDER &mdash; hero photo of Hwy 47 &amp; Hwy O structure]</div>';
  const body = `
<div class="hero">
  ${heroPhoto}<div class="veil"></div>
  <div class="wrap">
    <h1>${esc(tp("home.hero.headline"))}</h1>
    <p class="lede">${esc(tp("home.hero.subhead"))}</p>
    <div class="btnrow">
      <a class="btn btn-green" href="/locations/">${esc(tp("home.hero.cta1"))}</a>
      <a class="btn btn-outline" href="/landowners/">${esc(tp("home.hero.cta2"))}</a>
    </div>
  </div>
  ${heroNote}
</div>

<section class="bg-white">
  <div class="wrap grid3">
    <div>${rule}<h3>${esc(tp("home.value1.title"))}</h3>
      <p style="color:var(--slate);margin-top:16px">${esc(tp("home.value1.body"))}</p></div>
    <div>${rule}<h3>${esc(tp("home.value2.title"))}</h3>
      <p style="color:var(--slate);margin-top:16px">${esc(tp("home.value2.body"))}</p></div>
    <div>${rule}<h3>${esc(tp("home.value3.title"))}</h3>
      <p style="color:var(--slate);margin-top:16px">${esc(tp("home.value3.body"))}</p></div>
  </div>
</section>

<section class="bg-gray">
  <div class="wrap">
    ${rule}<h2>${esc(tp("home.locations.heading"))}</h2>
    <p class="lede" style="margin-top:20px;max-width:70ch;color:var(--slate)">${esc(tp("home.locations.body"))}</p>
    <div class="grid-cards" style="margin-top:48px">
${cards}
    </div>
    <div class="btnrow"><a class="btn btn-navy" href="/locations/">View All Locations</a></div>
  </div>
</section>

<section class="bg-navy">
  <div class="wrap" style="max-width:820px">
    ${rule}<h2>${esc(tp("home.why.heading"))}</h2>
    <p class="lede" style="margin-top:20px">${esc(tp("home.why.body"))}</p>
    <div class="btnrow"><a class="btn btn-outline" href="/why-billboards/">Why Billboards</a></div>
  </div>
</section>

<section class="bg-navy mark-band" style="border-top:1px solid rgba(255,255,255,.12)">
  <img class="mark" src="${CONFIG.logos.bison}" alt="" aria-hidden="true">
  <div class="wrap" style="max-width:760px">
    <h2>${esc(tp("home.land.heading"))}</h2>
    <p style="font-family:var(--head);font-weight:700;font-size:22px;color:var(--green);margin-top:20px">${esc(tp("home.land.kicker"))}</p>
    <p class="lede" style="margin-top:18px">${esc(tp("home.land.body"))}</p>
    <div class="btnrow"><a class="btn btn-green" href="/landowners/">Learn About Land Leasing</a></div>
  </div>
</section>

${ctaAdvertiser()}`;
  return page({
    title: "Billboard Advertising in Missouri | BUFFEL Properties",
    description:
      "Locally owned billboard advertising on the Highway 47, 100, and I-44 corridors of Franklin and Warren Counties, Missouri. Contact us for current availability.",
    path: "/", active: "home", body,
  });
}

/* ================= LOCATIONS INDEX ================= */
export function locationsIndex(locations) {
  const cards = locations.map(locationCard).join("\n");
  const marker =
    locations.length === 1 && locations[0].latitude
      ? `${locations[0].latitude},${locations[0].longitude}` : null;
  const body = `
<section class="bg-navy" style="padding-top:88px;padding-bottom:72px">
  <div class="wrap">${rule}<h1 style="font-size:52px">${esc(tp("locations.heading"))}</h1></div>
</section>

<section class="bg-white">
  <div class="wrap">
    <p class="lede" style="max-width:74ch">${esc(tp("locations.intro"))}</p>
    <p style="max-width:74ch;margin-top:20px;color:var(--slate)">${esc(tp("locations.intro2"))}</p>

    <div style="margin-top:48px">${mapEmbed(CONFIG.map.bbox, marker, "Map of BUFFEL Properties billboard locations in Missouri")}</div>
    <p class="cap" style="margin-top:12px">${esc(tp("locations.mapnote"))}</p>

    <div class="grid-cards" style="margin-top:56px">
${cards}
    </div>

    <p style="margin-top:44px;color:var(--slate)">${esc(tp("locations.footnote"))}</p>
  </div>
</section>

${ctaAdvertiser()}`;
  return page({
    title: "Billboard Locations | BUFFEL Properties",
    description:
      "See where our billboard structures stand across Missouri, with traffic direction, face sizes, and current availability.",
    path: "/locations/", active: "locations", body,
  });
}

/* ================= LOCATION DETAIL ================= */
export function locationDetail(loc, others) {
  const lat = loc.latitude, lng = loc.longitude;
  const hasCoords = typeof lat === "number" && typeof lng === "number";
  const bbox = hasCoords
    ? `${(lng - 0.06).toFixed(4)},${(lat - 0.04).toFixed(4)},${(lng + 0.06).toFixed(4)},${(lat + 0.04).toFixed(4)}`
    : CONFIG.map.bbox;

  const row = (label, value) => `<tr><th>${label}</th><td>${pendingCell(value)}</td></tr>`;

  const hero = loc.hero_image
    ? `<div class="photo" style="background-image:url('${esc(loc.hero_image)}');background-size:cover;background-position:center;opacity:1"></div>`
    : `<div class="photo"></div>`;

  const otherCards = others.length
    ? `<section class="bg-gray">
  <div class="wrap">${rule}<h3>Other Locations</h3>
    <div class="grid-cards" style="margin-top:32px">
${others.slice(0, 3).map(locationCard).join("\n")}
    </div>
  </div>
</section>` : "";

  const body = `
<div class="hero" style="min-height:56vh">
  ${hero}<div class="veil"></div>
  <div class="wrap">
    <p class="crumb"><a href="/locations/">Locations</a> &rsaquo; ${esc(loc.name)}</p>
    ${badge(loc.status)}
    <h1 style="font-size:52px;margin-top:8px">${esc(loc.name)}</h1>
    <p class="lede" style="margin-top:14px">${esc(loc.highway)} &middot; ${esc(loc.city)}, ${esc(loc.county)} County</p>
  </div>
  ${loc.hero_image
      ? (loc.hero_caption ? `<div class="photo-note">${esc(loc.hero_caption)}</div>` : "")
      : '<div class="photo-note">[PLACEHOLDER &mdash; structure photo]</div>'}
</div>

<section class="bg-white">
  <div class="wrap grid2">
    <div>
      ${rule}<h3>Specifications</h3>
      <table class="spec">
        ${row("Structure", loc.structure_type)}
        ${row("Ad faces", loc.face_count)}
        ${row("Face size", loc.face_dimensions)}
        ${row("Traffic direction", loc.direction)}
        ${row("Illumination", loc.illumination)}
        ${row("Traffic count", trafficCount(loc))}
      </table>
    </div>
    <div>
      ${rule}<h3>About This Location</h3>
      <div class="stack" style="margin-top:20px;color:var(--slate)">
        ${loc.description || "<p></p>"}
      </div>
      ${loc.nearby_landmarks ? `<p class="cap" style="margin-top:24px"><strong>Nearby:</strong> ${pendingCell(loc.nearby_landmarks)}</p>` : ""}
    </div>
  </div>
</section>

<section class="bg-gray">
  <div class="wrap">
    ${rule}<h3>Location</h3>
    <div style="margin-top:28px">${mapEmbed(bbox, hasCoords ? `${lat},${lng}` : null, `Map showing the ${loc.name} billboard location`, 380)}</div>
    ${hasCoords ? `<p class="cap" style="margin-top:12px">${lat}, ${lng}</p>` : ""}
  </div>
</section>

<section class="bg-navy">
  <div class="wrap" style="text-align:center">
    <h2>${esc(tp("location.cta.heading"))}</h2>
    <p class="lede" style="margin-top:18px">${esc(tp("location.cta.body"))}</p>
    <div class="btnrow" style="justify-content:center">
      <a class="btn btn-green" href="/contact/">Check Availability</a>
      <a class="btn btn-outline" href="/locations/">Other Locations</a>
    </div>
  </div>
</section>

${otherCards}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: loc.name,
    address: {
      "@type": "PostalAddress",
      addressLocality: loc.city, addressRegion: CONFIG.stateCode, addressCountry: "US",
    },
    ...(hasCoords ? { geo: { "@type": "GeoCoordinates", latitude: lat, longitude: lng } } : {}),
  };

  return page({
    title: `${loc.name} Billboard — ${loc.city}, ${loc.county} County, MO | BUFFEL Properties`,
    description: `${loc.structure_type || "Billboard structure"} on ${loc.highway} in ${loc.city}, Missouri. Contact BUFFEL Properties for current availability.`,
    path: `/locations/${loc.slug}/`, active: "locations", body, schema,
  });
}

/* ================= WHY BILLBOARDS ================= */
export function whyBillboards() {
  const sect = (n) => `<div>${rule}<h3>${esc(tp(`why.s${n}.title`))}</h3>
      <div class="stack" style="margin-top:16px;color:var(--slate)">${th(`why.s${n}.body`)}</div></div>`;

  const body = `
<section class="bg-navy" style="padding-top:88px;padding-bottom:72px">
  <div class="wrap">${rule}<h1 style="font-size:52px">${esc(tp("why.heading"))}</h1>
    <p class="lede" style="margin-top:20px;max-width:70ch">${esc(tp("why.intro"))}</p>
  </div>
</section>

<section class="bg-white"><div class="wrap grid2">${sect(1)}${sect(2)}</div></section>
<section class="bg-gray"><div class="wrap grid2">${sect(3)}${sect(4)}</div></section>
<section class="bg-white"><div class="wrap grid2">${sect(5)}${sect(6)}</div></section>

<section class="bg-navy mark-band">
  <img class="mark" src="${CONFIG.logos.bison}" alt="" aria-hidden="true">
  <div class="wrap">
    <h2>${esc(tp("why.fit.heading"))}</h2>
    <p class="lede" style="margin-top:18px">${esc(tp("why.fit.intro"))}</p>
    <div class="grid2" style="margin-top:48px">
      <div>
        <h3 style="color:var(--green);font-size:20px">${esc(tp("why.fit.good.title"))}</h3>
        <ul class="checks" style="margin-top:20px;color:rgba(255,255,255,.85)">
          ${items("why.fit.good.list")}
        </ul>
      </div>
      <div>
        <h3 style="color:var(--green);font-size:20px">${esc(tp("why.fit.bad.title"))}</h3>
        <ul class="checks" style="margin-top:20px;color:rgba(255,255,255,.85)">
          ${items("why.fit.bad.list")}
        </ul>
      </div>
    </div>
    <p class="lede" style="margin-top:44px;max-width:70ch">${esc(tp("why.fit.close"))}</p>
  </div>
</section>

${ctaAdvertiser()}`;
  return page({
    title: "Why Billboard Advertising Works | BUFFEL Properties",
    description:
      "The honest case for outdoor advertising for a local business, including when it is not the right fit.",
    path: "/why-billboards/", active: "why", body,
  });
}

/* ================= LANDOWNERS ================= */
export function landowners() {
  const step = (n) => `<li><h3 style="font-size:20px;text-transform:none;letter-spacing:0">${esc(tp(`land.step${n}.title`))}</h3>
      <p style="color:var(--slate);margin-top:8px">${esc(tp(`land.step${n}.body`))}</p></li>`;

  const body = `
<div class="hero" style="min-height:auto;padding:96px 0">
  <div class="photo"></div><div class="veil"></div>
  <div class="wrap">
    <h1>${esc(tp("land.hero.headline"))}</h1>
    <p class="lede" style="margin-top:24px">${esc(tp("land.hero.body"))}</p>
    <p class="lede" style="margin-top:16px;color:var(--green);font-family:var(--head);font-weight:700">${esc(tp("land.hero.kicker"))}</p>
    <div class="btnrow"><a class="btn btn-green" href="/contact/#land">${esc(tp("land.hero.button"))}</a></div>
  </div>
</div>

<section class="bg-white">
  <div class="wrap" style="max-width:820px">
    ${rule}<h2>${esc(tp("land.money.heading"))}</h2>
    <div class="stack" style="margin-top:24px;color:var(--slate)">${th("land.money.body")}</div>
  </div>
</section>

<section class="bg-gray">
  <div class="wrap" style="max-width:820px">
    ${rule}<h2>${esc(tp("land.how.heading"))}</h2>
    <ol class="steps" style="margin-top:32px">
      ${step(1)}${step(2)}${step(3)}${step(4)}
    </ol>
  </div>
</section>

<section class="bg-white">
  <div class="wrap grid2">
    <div>
      ${rule}<h3>${esc(tp("land.good.heading"))}</h3>
      <p style="margin-top:16px;color:var(--slate)">${esc(tp("land.good.intro"))}</p>
      <ul class="checks" style="margin-top:24px;color:var(--slate)">
          ${items("land.good.list")}
      </ul>
    </div>
    <div>
      ${rule}<h3>${esc(tp("land.nothing.heading"))}</h3>
      <div class="stack" style="margin-top:16px;color:var(--slate)">${th("land.nothing.body")}</div>
      <div class="rule" style="margin-top:44px"></div>
      <h3>${esc(tp("land.straight.heading"))}</h3>
      <div class="stack" style="margin-top:16px;color:var(--slate)">${th("land.straight.body")}</div>
      <p class="cap" style="margin-top:32px">${esc(tp("land.disclaimer"))}</p>
    </div>
  </div>
</section>

${ctaLandowner()}`;
  return page({
    title: "Lease Your Land for a Billboard in Missouri | BUFFEL Properties",
    description:
      "We pay rent for highway frontage anywhere in Missouri. Free site evaluation, no obligation, and we handle permitting, construction, and maintenance.",
    path: "/landowners/", active: "landowners", body,
  });
}

/* ================= ABOUT ================= */
export function about() {
  const body = `
<section class="bg-navy mark-band" style="padding-top:88px">
  <img class="mark" src="${CONFIG.logos.bison}" alt="" aria-hidden="true">
  <div class="wrap" style="max-width:820px">
    ${rule}<h1 style="font-size:52px">${esc(tp("about.heading"))}</h1>
    <div class="stack" style="margin-top:28px">
      ${th("about.body")}
      <p class="cap" style="color:rgba(255,255,255,.6)">${esc(tp("about.founded"))}</p>
    </div>
  </div>
</section>

<section class="bg-white">
  <div class="wrap grid2">
    <div>
      ${rule}<h2>${esc(tp("about.why.heading"))}</h2>
      <div class="stack" style="margin-top:24px;color:var(--slate)">${th("about.why.body")}</div>
    </div>
    <div style="background:var(--gray);aspect-ratio:4/5;display:flex;align-items:center;
      justify-content:center;text-align:center;padding:24px">
      <span class="cap">[PLACEHOLDER &mdash; owner photo, Joe Hackmann]</span>
    </div>
  </div>
</section>

${ctaLandowner()}`;
  return page({
    title: "About BUFFEL Properties | Marthasville, Missouri",
    description: "Owner-operated outdoor advertising company building billboard structures across Missouri.",
    path: "/about/", active: "about", body,
  });
}

/* ================= CONTACT ================= */
export function contact(locations) {
  const locOptions = locations
    .map((l) => `<label class="consent" style="margin-bottom:10px"><input type="checkbox" name="location" value="${esc(l.name)}"> <span style="font-weight:400">${esc(l.name)}</span></label>`)
    .join("\n            ");

  const body = `
<section class="bg-navy" style="padding-top:88px;padding-bottom:64px">
  <div class="wrap">${rule}<h1 style="font-size:52px">${esc(tp("contact.heading"))}</h1>
    <p class="lede" style="margin-top:20px;max-width:64ch">${esc(tp("contact.intro"))}</p>
  </div>
</section>

<section class="bg-white" style="padding-bottom:56px">
  <div class="wrap grid3">
    <div>${rule}<h3>Phone</h3>
      <p style="margin-top:10px"><a href="${CONFIG.phoneHref}" style="text-decoration:none;font-weight:600">${esc(CONFIG.phone)}</a></p></div>
    <div>${rule}<h3>Email</h3>
      <p style="margin-top:10px;word-break:break-all"><a href="mailto:${esc(CONFIG.email)}" style="text-decoration:none;font-weight:600">${esc(CONFIG.email)}</a></p></div>
    <div>${rule}<h3>Response time</h3>
      <p class="pending" style="margin-top:10px">${esc(CONFIG.responseTime)}</p></div>
  </div>
  <div class="wrap" style="margin-top:48px">
    <p style="color:var(--slate);max-width:74ch"><strong style="color:var(--navy)">Service area:</strong> ${esc(tp("contact.service_area"))}</p>
  </div>
</section>

<section class="bg-gray" style="padding-top:56px;padding-bottom:56px">
  <div class="wrap">
    ${rule}<h3>${esc(tp("contact.rep.heading"))}</h3>
    <p style="margin-top:16px"><strong>${esc(CONFIG.rep.name)}</strong> &mdash; ${esc(CONFIG.rep.title)}<br>
    <a href="${CONFIG.rep.phoneHref}" style="text-decoration:none">${esc(CONFIG.rep.phone)}</a><br>
    <a href="mailto:${esc(CONFIG.rep.email)}" style="text-decoration:none">${esc(CONFIG.rep.email)}</a></p>
  </div>
</section>

<section class="bg-white" id="advertising">
  <div class="wrap" style="max-width:820px">
    ${rule}<h2>${esc(tp("contact.adv.heading"))}</h2>
    <p class="lede" style="color:var(--slate);margin:20px 0 28px">${esc(tp("contact.adv.intro"))}</p>
    <form class="form" novalidate data-form-id="${CONFIG.wix.forms.advertising}"
          data-success="Thanks — we've got it. We'll be in touch within one business day.">
      <div class="field"><label for="a-biz">Business name</label><input id="a-biz" data-target="business_name" required></div>
      <div class="field"><label for="a-name">Contact name</label><input id="a-name" data-target="contact_name" required></div>
      <div class="field"><label for="a-phone">Phone</label><input id="a-phone" data-target="phone" type="tel" required></div>
      <div class="field"><label for="a-email">Email</label><input id="a-email" data-target="email" type="email" required></div>
      <div class="field"><label for="a-when">Desired start timeframe</label>
        <select id="a-when" data-target="timeframe" required><option value="">Select&hellip;</option>
          <option>Immediately</option><option>1-3 months</option>
          <option>3-6 months</option><option>Just exploring</option></select></div>
      <div class="field"><label for="a-msg">Message <span class="req">(optional)</span>${locations.length ? " — tell us which locations you're interested in" : ""}</label><textarea id="a-msg" data-target="message"></textarea></div>
      <div style="position:absolute;left:-9999px" aria-hidden="true"><label for="a-hp">Leave blank</label><input id="a-hp" data-hp tabindex="-1" autocomplete="off"></div>
      <div class="field consent"><input type="checkbox" id="a-ok" data-consent required>
        <label for="a-ok" style="font-weight:400">I agree to be contacted about this inquiry and have read the
        <a href="/privacy/" style="color:var(--navy)">Privacy Policy</a>.</label></div>
      <button class="btn btn-green" type="submit" style="width:100%">Send Inquiry</button>
      <p class="form-status" aria-live="polite"></p>
    </form>
  </div>
</section>

<section class="bg-gray" id="land">
  <div class="wrap" style="max-width:820px">
    ${rule}<h2>${esc(tp("contact.land.heading"))}</h2>
    <p class="lede" style="color:var(--slate);margin:20px 0 28px">${esc(tp("contact.land.intro"))}</p>
    <form class="form" novalidate data-form-id="${CONFIG.wix.forms.land}"
          data-success="Thanks — we've got your property details. We'll review the location, traffic, spacing, and permitting feasibility and get back to you either way.">
      <div class="field"><label for="l-name">Name</label><input id="l-name" data-target="contact_name" required></div>
      <div class="field"><label for="l-phone">Phone</label><input id="l-phone" data-target="phone" type="tel" required></div>
      <div class="field"><label for="l-email">Email</label><input id="l-email" data-target="email" type="email" required></div>
      <div class="field"><label for="l-addr">Property address or nearest cross streets</label><input id="l-addr" data-target="property_address" required></div>
      <div class="field"><label for="l-county">County</label><input id="l-county" data-target="county" placeholder="e.g. Franklin" required></div>
      <div class="field"><label for="l-hwy">Highway frontage</label>
        <select id="l-hwy" data-target="highway_frontage" required><option value="">Select&hellip;</option>
          <option>Hwy 47</option><option>Hwy 100</option><option>I-44</option>
          <option>Hwy 54</option><option>Hwy 61</option><option>Other</option></select></div>
      <div class="field"><label for="l-feet">Approximate highway frontage in feet <span class="req">(optional)</span></label><input id="l-feet" data-target="frontage_feet" type="number" min="0"></div>
      <div class="field"><label for="l-own">Do you own the property?</label>
        <select id="l-own" data-target="ownership" required><option value="">Select&hellip;</option>
          <option>Yes</option><option>No</option><option>Partial interest</option></select></div>
      <div class="field"><label for="l-msg">Anything else we should know <span class="req">(optional)</span></label><textarea id="l-msg" data-target="message"></textarea></div>
      <div style="position:absolute;left:-9999px" aria-hidden="true"><label for="l-hp">Leave blank</label><input id="l-hp" data-hp tabindex="-1" autocomplete="off"></div>
      <div class="field consent"><input type="checkbox" id="l-ok" data-consent required>
        <label for="l-ok" style="font-weight:400">I agree to be contacted about this request and have read the
        <a href="/privacy/" style="color:var(--navy)">Privacy Policy</a>.</label></div>
      <button class="btn btn-green" type="submit" style="width:100%">Request Free Evaluation</button>
      <p class="form-status" aria-live="polite"></p>
    </form>
    <p class="cap" style="margin-top:24px">${esc(tp("land.disclaimer"))}</p>
  </div>
</section>`;
  return page({
    title: "Contact BUFFEL Properties | Billboard Advertising Missouri",
    description: `Advertising inquiries and land evaluation requests. Call ${CONFIG.phone}.`,
    path: "/contact/", active: "contact", body, scripts: ["forms.js"],
  });
}

/* ================= PRIVACY ================= */
export function privacy() {
  const h = (t) => `<h3 style="color:var(--navy)">${t}</h3>`;
  const body = `
<section class="bg-navy" style="padding-top:88px;padding-bottom:56px">
  <div class="wrap">${rule}<h1 style="font-size:44px">Privacy Policy</h1>
    <p class="lede" style="margin-top:18px;max-width:64ch">The short version: we collect what
    you type into our forms so we can reply to you. We don't track you, we don't advertise to
    you, and we don't sell your information to anyone.</p>
  </div>
</section>
<section class="bg-white">
  <div class="wrap" style="max-width:760px">
    <p class="cap">Last updated: ${CONFIG.privacyUpdated}</p>
    <div class="stack" style="margin-top:32px;color:var(--slate)">

      ${h("Who we are")}
      <p>${esc(CONFIG.legalName)} is an outdoor advertising company based in ${esc(CONFIG.city)},
      ${esc(CONFIG.state)}. This policy covers ${esc(CONFIG.baseUrl.replace(/^https?:\/\//, ""))}.</p>

      ${h("What we collect")}
      <p><strong style="color:var(--navy)">Information you give us.</strong> When you submit the
      Advertising Inquiry form we collect your business name, contact name, phone number, email
      address, desired start timeframe, and any message you write. When you submit the Land
      Evaluation Request form we collect your name, phone number, email address, the property
      address or nearest cross streets, county, highway frontage, approximate frontage in feet,
      whether you own the property, and any message you write. Both forms record that you ticked
      the consent box, and when.</p>
      <p><strong style="color:var(--navy)">Basic technical information.</strong> Like any website,
      ours is served by a hosting provider that records standard request logs, including IP
      addresses. We do not have access to those logs and do not use them.</p>
      <p><strong style="color:var(--navy)">What we do not collect.</strong> This site runs no
      analytics, no advertising pixels, no tracking scripts, and no third-party cookies. We are
      not building a profile of you, and we cannot see which pages you looked at.</p>

      ${h("How we use it")}
      <p>We use what you send us for one purpose: to respond to your enquiry and to communicate
      with you about billboard advertising or land leasing with ${esc(CONFIG.legalName)}. If you
      ask about a property, we may use the address you give us to research public records such as
      zoning, permitting, and traffic data for that location.</p>
      <p>We do not send marketing emails or newsletters.</p>

      ${h("What we never do")}
      <p><strong style="color:var(--navy)">We do not sell your information.</strong> We do not
      rent it, trade it, or share it with data brokers, advertisers, or any third-party
      marketer. Not now, and not as a change of policy later without telling you.</p>

      ${h("Who else touches your information")}
      <p>Three companies handle data on our behalf, and only to run this website:</p>
      <ul class="checks" style="margin-top:16px">
        <li><strong style="color:var(--navy)">Wix</strong> stores your form submission and our
        contact records.</li>
        <li><strong style="color:var(--navy)">GitHub</strong> hosts and serves the website
        itself.</li>
        <li><strong style="color:var(--navy)">Google Fonts</strong> and
        <strong style="color:var(--navy)">OpenStreetMap</strong> supply typefaces and the location
        maps. Loading them means your browser makes a request to those services, which they may
        log.</li>
      </ul>
      <p>Beyond that, we may disclose information if we are legally required to.</p>

      ${h("Cookies")}
      <p>We do not set any cookies. Our contact forms briefly store a temporary session token in
      your browser so the form can submit; it is not an identifier, it contains nothing about
      you, and it is discarded when you close the tab.</p>

      ${h("How long we keep it")}
      <p>We keep enquiry information for as long as we may reasonably need it to respond to you
      and to maintain our business records. Land evaluation records are often worth keeping for
      years, because a site that cannot be permitted today may qualify later.</p>

      ${h("Seeing or deleting your information")}
      <p>You can ask us at any time what we hold about you, ask us to correct it, or ask us to
      delete it. Email <a href="mailto:${esc(CONFIG.email)}" style="color:var(--navy)">${esc(CONFIG.email)}</a>
      or call ${esc(CONFIG.phone)}. We will action it, and we will not ask you why.</p>

      ${h("Children")}
      <p>This site is intended for business use and is not directed at children. We do not
      knowingly collect information from anyone under 18.</p>

      ${h("Changes to this policy")}
      <p>If we change this policy we will update the date at the top of this page.</p>

      ${h("Contact")}
      <p>${esc(CONFIG.legalName)}<br>${esc(CONFIG.city)}, ${esc(CONFIG.state)}<br>
      <a href="mailto:${esc(CONFIG.email)}" style="color:var(--navy)">${esc(CONFIG.email)}</a><br>
      ${esc(CONFIG.phone)}</p>
    </div>
  </div>
</section>`;
  return page({
    title: "Privacy Policy | BUFFEL Properties",
    description: "What BUFFEL Properties collects through this site, how it is used, and how to have it deleted. No tracking, no analytics, no selling of data.",
    path: "/privacy/", active: null, body,
  });
}
