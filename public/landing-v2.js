/* Reference-inspired Overview renderer. Uses existing public data only. */
(function () {
  "use strict";

  function esc(value) {
    return typeof escapeHtml === "function" ? escapeHtml(value) : String(value ?? "");
  }

  function coverage() {
    if (typeof computeCoverageSummary === "function") return computeCoverageSummary();
    return { catalogMetrics: 0, realRecords: 0, demoRecords: 0, countries: 0, sectors: 0 };
  }

  function renderLanding() {
    if (typeof STATE === "undefined" || !STATE.loaded || typeof recordsFor !== "function") return;
    const c = coverage();
    const meterCards = METERS.map((m) => {
      const records = recordsFor({ meter: m.id });
      const real = records.filter((r) => !r.isDemo).length;
      return `<article class="meter"><h3>${esc(m.name)}</h3><div class="value">${real ? real.toLocaleString("en-US") : "—"}</div><div class="delta">${real ? "Verified records" : "Awaiting verified data"}</div><p>${esc(m.description)}</p><div class="spark"><span style="width:${Math.min(100, Math.max(12, real * 20))}%"></span></div></article>`;
    }).join("");

    const rankings = METERS.map((m, i) => `<li><span><b>${i + 1}</b>${esc(m.name)}</span><span>${recordsFor({ meter: m.id }).filter(r => !r.isDemo).length || "—"}</span></li>`).join("");
    const bars = METERS.map((m, i) => `<div class="barline"><span>${esc(m.name.replace(" Meter", ""))}</span><div class="bar"><span style="width:${Math.min(100, (recordsFor({ meter: m.id }).filter(r => !r.isDemo).length || 0) * 20)}%"></span></div><span>${recordsFor({ meter: m.id }).filter(r => !r.isDemo).length || "—"}</span></div>`).join("");
    const feed = (STATE.metrics || []).filter(r => !r.isDemo && r.sourceUrl).slice(0, 6).map(r => `<a href="${esc(r.sourceUrl)}" target="_blank" rel="noopener">${esc(r.metricName || "Verified public metric")} ↗</a>`).join("") || `<p class="sub">Verified source-linked developments will appear here as the registry grows.</p>`;

    document.getElementById("app").innerHTML = `<div class="landing-v2">
      <section class="hero"><div class="hero-copy"><div class="eyebrow">Tracking today. A more informed tomorrow.</div><h1>Global <span>AI</span> Meter</h1><div class="hero-lede">One planet. Real insights. Measurable progress.</div><p>Explore the world's AI activity, adoption, infrastructure, investment and impact — all in one place.</p><div class="actions"><a class="btn btn-primary" href="#/countries">Explore the data →</a><a class="btn btn-secondary" href="#/methodology">Learn more</a></div></div><div class="hero-visual" aria-hidden="true"><div class="ufo"></div><div class="planet"></div></div></section>
      <div class="notice"><strong>Data transparency notice:</strong> this dashboard uses public sources and connected feeds. Not all metrics are real-time. Every value is labelled Reported, Calculated, Estimated, or Unavailable.</div>
      <section class="meter-grid">${meterCards}</section>
      <h2 class="section-title">Global snapshot</h2><section class="meter-grid"><article class="meter"><h3>Metrics catalogued</h3><div class="value">${c.catalogMetrics}</div><p>Registry coverage</p></article><article class="meter"><h3>Verified records</h3><div class="value">${c.realRecords}</div><p>Real source-backed records</p></article><article class="meter"><h3>Demo records</h3><div class="value">${c.demoRecords}</div><p>Excluded from real totals</p></article><article class="meter"><h3>Countries</h3><div class="value">${c.countries}</div><p>Directory coverage</p></article><article class="meter"><h3>Sectors</h3><div class="value">${c.sectors}</div><p>Tracked sectors</p></article></section>
      <section class="dashboard-grid"><article class="panel"><div class="section-head"><div><h3>AI adoption meter</h3><div class="sub">Verified record coverage by meter</div></div><a href="#/methodology">View all →</a></div><div class="bars">${bars}</div></article><article class="panel"><h3>Global AI activity</h3><div class="sub">Source-backed public signals</div><div class="value">${c.realRecords.toLocaleString("en-US")}</div><p class="sub">Verified records currently loaded</p><div class="feed">${feed}</div></article><article class="panel"><h3>AI systems ranking</h3><div class="sub">Registry coverage, not market share</div><ol class="ranking">${rankings}</ol><a class="section-head" href="#/sources">View source registry →</a></article></section>
      <section class="signal-grid"><article class="panel"><h3>Regional AI signals</h3><div class="sub">Directory coverage by region</div><div class="signals">${(STATE.countries.continents || []).map(name => `<div class="signal"><strong>${esc(name)}</strong><span>${STATE.countries.countries.filter(x => x.continent === name).length} countries</span></div>`).join("")}</div></article><article class="panel"><h3>Latest AI research and developments</h3><div class="sub">Live public feed area</div><div class="feed">${feed}</div></article></section>
      <h2 class="section-title">Quick explore</h2><section class="explore"><a href="#/continents"><span>◎</span>Continents</a><a href="#/countries"><span>⌖</span>Countries</a><a href="#/sectors"><span>▦</span>Sectors</a><a href="#/usecases"><span>◈</span>AI use cases</a><a href="#/sources"><span>▤</span>Sources</a><a href="#/methodology"><span>◌</span>Methodology</a></section>
      <section class="panel monitor"><div><h3>Global monitoring console</h3><div class="sub">Public-data pipeline status</div></div><div class="status">Dashboard services operational</div></section><p class="footer-note">Independent public-information project. No company, government, or organization endorsement is implied.</p>
    </div>`;
  }

  function refresh() {
    if (typeof STATE !== "undefined" && STATE.loaded && (!location.hash || location.hash === "#/overview" || location.hash === "#overview")) renderLanding();
  }

  window.addEventListener("hashchange", function () { setTimeout(refresh, 0); });
  setTimeout(refresh, 0);
  setTimeout(refresh, 250);
  setTimeout(refresh, 1000);
})();
