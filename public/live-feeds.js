(function () {
  "use strict";

  const DATA_URL = "data/live/live-feeds.json";

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>\"']/g, function (char) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char];
    });
  }

  function render(feeds) {
    const app = document.getElementById("app");
    if (!app || document.getElementById("live-feeds-panel")) return;

    const items = Array.isArray(feeds.items) ? feeds.items.slice(0, 8) : [];
    const panel = document.createElement("section");
    panel.id = "live-feeds-panel";
    panel.className = "section live-feeds-panel";
    panel.setAttribute("aria-labelledby", "live-feeds-title");

    const cards = items.length
      ? items.map(function (item) {
          return '<article class="live-feed-card">' +
            '<p class="eyebrow">' + escapeHtml(item.source || "Public feed") + '</p>' +
            '<h3><a href="' + escapeHtml(item.url || "#") + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(item.title || "Untitled item") + '</a></h3>' +
            (item.published ? '<p class="muted">' + escapeHtml(item.published) + '</p>' : '') +
            '</article>';
        }).join("")
      : '<p class="muted">No feed items are available yet. The scheduled refresh will populate this section.</p>';

    panel.innerHTML = '<div class="section-heading"><div><p class="eyebrow">Live public signals</p><h2 id="live-feeds-title">Latest AI research and developments</h2></div>' +
      '<p class="muted">Updated: ' + escapeHtml(feeds.generatedAt || "not yet") + '</p></div>' +
      '<div class="live-feeds-grid">' + cards + '</div>' +
      '<p class="muted live-feeds-note">These are links to public feeds, not verified statistics. They do not change the Global AI Meter score.</p>';

    app.appendChild(panel);
  }

  function waitForAppAndRender(feeds) {
    let attempts = 0;
    function tryRender() {
      const app = document.getElementById("app");
      if (app && app.querySelector("section, h1, h2, .app")) {
        render(feeds);
        return;
      }
      attempts += 1;
      if (attempts < 60) window.setTimeout(tryRender, 100);
    }
    tryRender();
  }

  fetch(DATA_URL, { cache: "no-store" })
    .then(function (response) { return response.ok ? response.json() : Promise.reject(new Error("Feed unavailable")); })
    .then(waitForAppAndRender)
    .catch(function () { waitForAppAndRender({ items: [], generatedAt: "unavailable" }); });
})();
