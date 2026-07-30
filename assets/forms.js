/* BUFFEL Properties — form submission to Wix Forms.
   Posts directly to the Wix API using an anonymous visitor token.
   The client ID is public by design; no secret is involved. */
(function () {
  "use strict";

  var TOKEN_URL = "https://www.wixapis.com/oauth2/token";
  var SUBMIT_URL = "https://www.wixapis.com/forms/v4/submissions";
  var CLIENT_ID = document.body.getAttribute("data-wix-client");
  var TOKEN_KEY = "buffel_visitor_token";

  function getToken() {
    try {
      var cached = JSON.parse(sessionStorage.getItem(TOKEN_KEY) || "null");
      if (cached && cached.exp > Date.now() + 60000) return Promise.resolve(cached.tok);
    } catch (e) {}
    return fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: CLIENT_ID, grantType: "anonymous" })
    })
      .then(function (r) {
        if (!r.ok) throw new Error("auth");
        return r.json();
      })
      .then(function (j) {
        if (!j.access_token) throw new Error("auth");
        try {
          sessionStorage.setItem(TOKEN_KEY, JSON.stringify({
            tok: j.access_token,
            exp: Date.now() + (j.expires_in || 14400) * 1000
          }));
        } catch (e) {}
        return j.access_token;
      });
  }

  function setStatus(form, kind, msg) {
    var el = form.querySelector(".form-status");
    if (!el) return;
    el.className = "form-status " + kind;
    el.textContent = msg;
    el.style.display = "block";
    if (kind === "error") el.setAttribute("role", "alert");
  }

  function fieldError(form, input, msg) {
    clearError(input);
    input.setAttribute("aria-invalid", "true");
    var e = document.createElement("p");
    e.className = "field-error";
    e.textContent = msg;
    input.parentNode.appendChild(e);
  }

  function clearError(input) {
    input.removeAttribute("aria-invalid");
    var sib = input.parentNode.querySelector(".field-error");
    if (sib) sib.parentNode.removeChild(sib);
  }

  function validate(form) {
    var ok = true, firstBad = null;
    var inputs = form.querySelectorAll("[data-target], [data-consent]");
    for (var i = 0; i < inputs.length; i++) {
      var el = inputs[i];
      clearError(el);
      var val = el.type === "checkbox" ? el.checked : (el.value || "").trim();

      if (el.required && !val) {
        fieldError(form, el, el.type === "checkbox" ? "Please agree before submitting." : "This field is required.");
        ok = false; firstBad = firstBad || el; continue;
      }
      if (el.type === "email" && val && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) {
        fieldError(form, el, "Enter a valid email address.");
        ok = false; firstBad = firstBad || el; continue;
      }
      if (el.type === "tel" && val && (val.replace(/\D/g, "").length < 10)) {
        fieldError(form, el, "Enter a phone number with at least 10 digits.");
        ok = false; firstBad = firstBad || el;
      }
    }
    if (firstBad) firstBad.focus();
    return ok;
  }

  /* Wix requires E.164 (+1XXXXXXXXXX). Visitors type "636-266-8099" or
     "(636) 266-8099", so normalise before sending. US/Canada assumed. */
  function toE164(raw) {
    var d = (raw || "").replace(/[^\d+]/g, "");
    if (d.charAt(0) === "+") return d;
    d = d.replace(/\D/g, "");
    if (d.length === 10) return "+1" + d;
    if (d.length === 11 && d.charAt(0) === "1") return "+" + d;
    return d ? "+" + d : "";
  }

  function collect(form) {
    var data = {};
    var inputs = form.querySelectorAll("[data-target]");
    for (var i = 0; i < inputs.length; i++) {
      var el = inputs[i];
      var v = (el.value || "").trim();
      if (!v) continue;
      if (el.type === "tel") v = toE164(v);
      data[el.getAttribute("data-target")] = v;
    }
    var consent = form.querySelector("[data-consent]");
    if (consent && consent.checked) {
      data.consent = "Agreed to privacy policy on " + new Date().toISOString();
    }
    return data;
  }

  function wire(form) {
    var formId = form.getAttribute("data-form-id");
    var btn = form.querySelector("button[type=submit]");
    var original = btn ? btn.textContent : "Submit";

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();

      // Honeypot — a bot fills this, a person never sees it.
      var hp = form.querySelector("[data-hp]");
      if (hp && hp.value) { setStatus(form, "ok", "Thanks, we've got it."); return; }

      if (!validate(form)) {
        setStatus(form, "error", "Please fix the highlighted fields.");
        return;
      }

      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      setStatus(form, "pending", "Sending…");

      getToken()
        .then(function (tok) {
          return fetch(SUBMIT_URL, {
            method: "POST",
            headers: { Authorization: tok, "Content-Type": "application/json" },
            body: JSON.stringify({ submission: { formId: formId, submissions: collect(form) } })
          });
        })
        .then(function (r) {
          if (!r.ok) return r.text().then(function (t) { throw new Error(t); });
          return r.json();
        })
        .then(function () {
          form.reset();
          setStatus(form, "ok", form.getAttribute("data-success") ||
            "Thanks — we've got it. We'll be in touch within one business day.");
          if (btn) { btn.textContent = "Sent"; }
        })
        .catch(function (err) {
          if (btn) { btn.disabled = false; btn.textContent = original; }
          setStatus(form, "error",
            "Something went wrong sending that. Please call or text 636-266-8099, or email joehackmann30@icloud.com.");
          if (window.console) console.error("BUFFEL form error:", err && err.message);
        });
    });
  }

  var forms = document.querySelectorAll("form[data-form-id]");
  for (var i = 0; i < forms.length; i++) wire(forms[i]);
})();
