/* BUFFEL Properties — locations map.
   Multi-pin, driven by the Wix CMS data injected at build time.
   Degrades to the static OpenStreetMap iframe if Leaflet fails to load. */
(function () {
  "use strict";

  var el = document.getElementById("buffel-map");
  if (!el || typeof L === "undefined") return; // iframe fallback stays in place

  var data;
  try {
    data = JSON.parse(document.getElementById("buffel-map-data").textContent);
  } catch (e) { return; }
  if (!data.length) return;

  var fallback = el.querySelector(".map-fallback");
  if (fallback) fallback.parentNode.removeChild(fallback);
  el.classList.add("is-live");

  var map = L.map(el, { scrollWheelZoom: false, attributionControl: true });
  window.__buffelMap = map;

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  var FILL = { "Available": "#75CD2B", "Fully Booked": "#081631", "In Development": "#5A6478" };

  function icon(status) {
    var fill = FILL[status] || "#5A6478";
    var ring = status === "Available" ? "#081631" : "#FFFFFF";
    return L.divIcon({
      className: "buffel-pin",
      html: '<span style="display:block;width:20px;height:20px;background:' + fill +
            ';border:3px solid ' + ring + ';box-shadow:0 0 0 1px rgba(8,22,49,.35)"></span>',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -12]
    });
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function popup(l) {
    var cls = l.status === "Available" ? "b-avail"
            : l.status === "Fully Booked" ? "b-booked" : "b-dev";
    return '<div class="map-card">' +
      (l.image ? '<img src="' + esc(l.image) + '" alt="" loading="lazy">' : "") +
      '<span class="badge ' + cls + '">' + esc(l.status) + "</span>" +
      "<h4>" + esc(l.name) + "</h4>" +
      '<div class="cap">' + esc(l.highway) + " &middot; " + esc(l.city) + ", " + esc(l.county) + " County</div>" +
      '<a class="more" href="' + esc(l.href) + '">View Details &rarr;</a>' +
      "</div>";
  }

  var pts = [];
  data.forEach(function (l) {
    if (typeof l.lat !== "number" || typeof l.lng !== "number") return;
    L.marker([l.lat, l.lng], { icon: icon(l.status), title: l.name, alt: l.name + " billboard location" })
      .addTo(map)
      .bindPopup(popup(l), { closeButton: true, maxWidth: 260 });
    pts.push([l.lat, l.lng]);
  });

  if (!pts.length) return;

  function frame() {
    map.invalidateSize(false);
    if (pts.length === 1) map.setView(pts[0], 13);
    else map.fitBounds(L.latLngBounds(pts).pad(0.35));
  }

  // Leaflet measures the container on init; if layout or webfonts settle after
  // that, tiles render into a stale box. Re-measure once things are stable.
  frame();
  requestAnimationFrame(frame);
  setTimeout(frame, 250);
  setTimeout(frame, 1000);
  window.addEventListener("load", frame);
  window.addEventListener("resize", function () { map.invalidateSize(false); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(frame);

  // Wheel zoom only after a click, so the page still scrolls normally over the map.
  map.on("click", function () { map.scrollWheelZoom.enable(); });
  map.on("mouseout", function () { map.scrollWheelZoom.disable(); });
})();
