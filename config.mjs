// BUFFEL Properties — site configuration
// Edit this file to change contact details, site URL, or the Wix connection.

export const CONFIG = {
  siteName: "BUFFEL Properties",
  legalName: "BUFFEL Properties, LLC",

  // ---- DOMAIN ----------------------------------------------------------
  // Leave customDomain as null until buffelproperties.com actually points at
  // GitHub Pages. While it's null the site publishes to the github.io URL below
  // and no CNAME file is written.
  //
  // When the domain is ready: set customDomain to "www.buffelproperties.com",
  // commit, push. The build writes the CNAME and switches all canonical URLs.
  customDomain: "www.buffelproperties.com",
  fallbackUrl: "https://joehackmann30.github.io/buffel-properties",

  phone: "636-266-8099",
  phoneHref: "tel:6362668099",
  email: "joehackmann30@icloud.com",
  city: "Marthasville",
  state: "Missouri",
  stateCode: "MO",

  responseTime: "We respond to every inquiry within one business day.",

  // Shown at the top of /privacy/. Update whenever the policy changes.
  privacyUpdated: "30 July 2026",

  rep: {
    name: "Drew Voss",
    title: "Regional Representative, Central Missouri",
    phone: "573-418-4536",
    phoneHref: "tel:5734184536",
    email: "drew.voss123@gmail.com",
  },

  logos: {
    wordmark: "https://static.wixstatic.com/media/e659e5_648a5fb7be3b4a65a219ca888984bd1b~mv2.png",
    bison: "https://static.wixstatic.com/media/e659e5_5ceaa99bf8564ec1bfd16f82a8f3dd73~mv2.png",
  },

  wix: {
    siteId: "676ab4a4-21b1-4ccc-bd06-43e4d9327ca7",
    collection: "BillboardLocations",
    // Client ID is safe to expose. The SECRET is not — it lives in the
    // WIX_CLIENT_SECRET environment variable and is never written to disk here.
    clientId: "db9159b9-6418-4c51-9fa2-c2b4434cfeca",
    // Wix Forms — submissions land in Wix dashboard → Forms & Submissions
    forms: {
      advertising: "4995d310-3731-40ca-8e4e-c6e8b92422c9",
      land: "72a2c518-bb88-4097-8071-ab634b1e1f23",
    },
  },

  // Map framing for the locations index.
  map: { centerLat: 38.55, centerLng: -91.05, bbox: "-91.60,38.25,-90.55,38.90" },
};

// Resolved site URL — custom domain if set, otherwise the GitHub Pages URL.
CONFIG.baseUrl = CONFIG.customDomain
  ? `https://${CONFIG.customDomain.replace(/^https?:\/\//, "").replace(/\/$/, "")}`
  : CONFIG.fallbackUrl.replace(/\/$/, "");

export const NAV = [
  { href: "/", label: "Home", key: "home" },
  { href: "/locations/", label: "Locations", key: "locations" },
  { href: "/why-billboards/", label: "Why Billboards", key: "why" },
  { href: "/landowners/", label: "For Landowners", key: "landowners" },
  { href: "/about/", label: "About", key: "about" },
  { href: "/contact/", label: "Contact", key: "contact" },
];
